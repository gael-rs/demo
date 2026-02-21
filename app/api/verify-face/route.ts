import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const FACE_MATCH_THRESHOLD = 75;

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { verificationId, selfieUrl, documentFrontUrl } = await request.json();

    if (!verificationId || !selfieUrl || !documentFrontUrl) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Descargar imágenes server-side y enviar como base64 (evita problemas con URLs firmadas de Supabase)
    const [dniBase64, selfieBase64] = await Promise.all([
      urlToBase64(documentFrontUrl),
      urlToBase64(selfieUrl),
    ]);

    // Llamar a Face++ compare API
    const formData = new FormData();
    formData.append('api_key', process.env.FACEPP_API_KEY!);
    formData.append('api_secret', process.env.FACEPP_API_SECRET!);
    formData.append('image_base64_1', dniBase64); // DNI frontal
    formData.append('image_base64_2', selfieBase64); // Selfie

    const faceppResponse = await fetch(
      'https://api-us.faceplusplus.com/facepp/v3/compare',
      { method: 'POST', body: formData }
    );

    const faceppResult = await faceppResponse.json();

    // Face++ no pudo detectar rostro en alguna imagen → guardar respuesta y revisión manual
    if (faceppResult.error_message) {
      console.warn('Face++ error:', faceppResult.error_message);
      await prisma.identity_verifications.update({
        where: { id: verificationId },
        data: { facepp_response: faceppResult },
      });
      return NextResponse.json({
        matched: false,
        score: 0,
        status: 'pending',
        reason: faceppResult.error_message,
      });
    }

    const confidence: number = faceppResult.confidence;
    const matched = confidence >= FACE_MATCH_THRESHOLD;

    if (matched) {
      // Auto-aprobar usando Prisma (evita restricciones RLS de Supabase)
      await prisma.identity_verifications.update({
        where: { id: verificationId },
        data: {
          status: 'approved',
          reviewed_at: new Date(),
          face_match_score: confidence,
          facepp_response: faceppResult,
        },
      });
    } else {
      // Guardar score y respuesta sin cambiar status
      await prisma.identity_verifications.update({
        where: { id: verificationId },
        data: {
          face_match_score: confidence,
          facepp_response: faceppResult,
        },
      });
    }

    return NextResponse.json({
      matched,
      score: Math.round(confidence),
      status: matched ? 'approved' : 'pending',
    });
  } catch (error) {
    console.error('Error en verificación biométrica:', error);
    return NextResponse.json(
      { error: 'Error al procesar la verificación biométrica' },
      { status: 500 }
    );
  }
}

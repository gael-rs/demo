import { NextRequest, NextResponse } from 'next/server';
import MercadoPago, { Preference } from 'mercadopago';

const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      unitName,
      days,
      totalPriceCLP,
      checkIn,
      checkOut,
      userEmail,
    } = body;

    if (!bookingId || !totalPriceCLP || !userEmail) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: bookingId,
            title: `Reserva Homested - ${unitName}`,
            description: `${days} día${days !== 1 ? 's' : ''} (${checkIn} → ${checkOut})`,
            quantity: 1,
            unit_price: totalPriceCLP,
            currency_id: 'CLP',
          },
        ],
        payer: {
          email: userEmail,
        },
        external_reference: bookingId,
        back_urls: {
          success: `${baseUrl}/payment/success`,
          failure: `${baseUrl}/payment/failure`,
          pending: `${baseUrl}/payment/pending`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/payment/webhook`,
        statement_descriptor: 'Homested',
        metadata: {
          booking_id: bookingId,
        },
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}

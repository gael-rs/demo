import { NextRequest, NextResponse } from 'next/server';
import MercadoPago, { Preference } from 'mercadopago';

const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      propertyId,
      unitName,
      days,
      pricePerDay,
      totalPriceCLP,
      basePriceCLP,
      discountPercentage,
      discountAmountCLP,
      checkIn,
      checkOut,
      userEmail,
    } = body;

    if (!sessionId || !userId || !propertyId || !totalPriceCLP || !userEmail) {
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
            id: sessionId,
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
        // sessionId como external_reference — la reserva se crea DESPUÉS del pago
        external_reference: sessionId,
        back_urls: {
          success: `${baseUrl}/payment/success`,
          failure: `${baseUrl}/payment/failure`,
          pending: `${baseUrl}/payment/pending`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/payment/webhook`,
        statement_descriptor: 'Homested',
        // Todos los datos necesarios para crear la reserva en el webhook
        metadata: {
          session_id: sessionId,
          user_id: userId,
          property_id: propertyId,
          check_in: checkIn,
          check_out: checkOut,
          days,
          price_per_day_clp: pricePerDay,
          total_price_clp: totalPriceCLP,
          base_price_clp: basePriceCLP,
          discount_percentage: discountPercentage,
          discount_amount_clp: discountAmountCLP,
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

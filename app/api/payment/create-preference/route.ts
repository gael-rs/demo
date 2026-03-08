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
      userName,
    } = body;

    if (!sessionId || !userId || !propertyId || !totalPriceCLP || !userEmail) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Separar nombre en first/last para el campo payer
    const nameParts = (userName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Expiración de la preferencia: 30 minutos
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: sessionId,
            title: `Reserva Homested - ${unitName}`,
            description: `${days} día${days !== 1 ? 's' : ''} (${checkIn} → ${checkOut})`,
            category_id: 'tourism',
            quantity: 1,
            unit_price: totalPriceCLP,
            currency_id: 'CLP',
          },
        ],
        payer: {
          email: userEmail,
          name: firstName,
          surname: lastName,
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
        // Pago único sin cuotas (CLP no soporta cuotas)
        payment_methods: {
          installments: 1,
        },
        // Sin pagos pendientes: solo aprobado o rechazado
        binary_mode: true,
        // Expirar la preferencia después de 30 minutos
        expiration_date_to: expirationDate,
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

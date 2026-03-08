import { NextRequest, NextResponse } from 'next/server';
import MercadoPago, { Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Solo procesar notificaciones de pagos
    if (type !== 'payment') {
      return NextResponse.json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    // Obtener detalles del pago desde MP
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    const sessionId = paymentData.external_reference; // es el sessionId, no bookingId
    const status = paymentData.status;

    if (!sessionId) {
      return NextResponse.json({ received: true });
    }

    // Mapear status de MP a nuestro sistema
    const mpStatus = status === 'charged_back'
      ? 'charged_back'
      : status === 'approved'
        ? 'approved'
        : status === 'rejected' || status === 'cancelled'
          ? 'rejected'
          : status === 'refunded'
            ? 'refunded'
            : 'pending';

    const paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' =
      status === 'approved' ? 'completed'
      : status === 'rejected' || status === 'cancelled' ? 'failed'
      : status === 'refunded' || status === 'charged_back' ? 'refunded'
      : 'pending';

    // Solo crear reserva si el pago fue aprobado
    let bookingId: string | null = null;

    if (status === 'approved') {
      // Verificar idempotencia: si ya existe un payment con este mp_payment_id y tiene booking_id, no re-crear
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('booking_id')
        .eq('mp_payment_id', String(paymentId))
        .maybeSingle();

      if (existingPayment?.booking_id) {
        // Ya fue procesado — solo actualizar estado
        bookingId = existingPayment.booking_id;
      } else {
        // Crear reserva desde los metadatos del pago
        const meta = paymentData.metadata as Record<string, unknown> | null;

        if (meta?.user_id && meta?.property_id) {
          const { data: newBooking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .insert({
              user_id: meta.user_id,
              property_id: meta.property_id,
              check_in: meta.check_in,
              check_out: meta.check_out,
              days: meta.days,
              price_per_day_clp: meta.price_per_day_clp,
              total_price_clp: meta.total_price_clp,
              base_price_clp: meta.base_price_clp,
              discount_percentage: meta.discount_percentage,
              discount_amount_clp: meta.discount_amount_clp,
              payment_status: 'completed',
              status: 'confirmed',
            })
            .select('id')
            .single();

          if (bookingError) {
            console.error('Error creating booking from webhook:', bookingError);
          } else {
            bookingId = newBooking.id;
          }
        }
      }
    }

    // Registrar/actualizar en tabla payments
    await supabaseAdmin.from('payments').upsert(
      {
        booking_id: bookingId,
        user_id: (paymentData.metadata as Record<string, unknown> | null)?.user_id ?? null,
        mp_payment_id: String(paymentId),
        mp_preference_id: (paymentData as unknown as { preference_id?: string }).preference_id ?? null,
        status: mpStatus,
        amount_clp: paymentData.transaction_amount ?? 0,
        payment_method: paymentData.payment_type_id ?? null,
        payment_method_type: paymentData.payment_method_id ?? null,
        installments: paymentData.installments ?? 1,
        mp_response: paymentData as unknown as Record<string, unknown>,
        error_message: paymentData.status_detail ?? null,
      },
      { onConflict: 'mp_payment_id' }
    );

    // Actualizar booking si existe
    if (bookingId && status !== 'approved') {
      await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: paymentStatus,
          status: 'pending',
        })
        .eq('id', bookingId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Retornar 200 para que MP no reintente
    return NextResponse.json({ received: true });
  }
}

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

    const bookingId = paymentData.external_reference;
    const status = paymentData.status; // approved, rejected, pending, etc.

    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    // Obtener user_id desde el booking
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('user_id, total_price_clp')
      .eq('id', bookingId)
      .single();

    // Mapear status de MP a nuestro sistema
    let paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending';
    if (status === 'approved') {
      paymentStatus = 'completed';
    } else if (status === 'rejected' || status === 'cancelled') {
      paymentStatus = 'failed';
    } else if (status === 'refunded' || status === 'charged_back') {
      paymentStatus = 'refunded';
    }

    // Registrar en tabla payments (upsert por mp_payment_id para evitar duplicados)
    if (booking) {
      await supabaseAdmin.from('payments').upsert(
        {
          booking_id: bookingId,
          user_id: booking.user_id,
          mp_payment_id: String(paymentId),
          mp_preference_id: paymentData.order?.id ? String(paymentData.order.id) : null,
          status: status === 'charged_back' ? 'charged_back' : paymentStatus === 'completed' ? 'approved' : paymentStatus === 'failed' ? 'rejected' : paymentStatus,
          amount_clp: paymentData.transaction_amount ?? booking.total_price_clp,
          payment_method: paymentData.payment_type_id ?? null,
          payment_method_type: paymentData.payment_method_id ?? null,
          installments: paymentData.installments ?? 1,
          mp_response: paymentData as unknown as Record<string, unknown>,
          error_message: paymentData.status_detail ?? null,
        },
        { onConflict: 'mp_payment_id' }
      );
    }

    // Actualizar booking
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: paymentStatus,
        status: status === 'approved' ? 'confirmed' : 'pending',
      })
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking from webhook:', error);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Retornar 200 para que MP no reintente
    return NextResponse.json({ received: true });
  }
}

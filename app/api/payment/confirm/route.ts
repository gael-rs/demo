import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/payment/confirm?payment_id=xxx
 * Busca el booking_id creado por el webhook para este pago de MP.
 * La página de éxito hace polling a este endpoint hasta obtener el bookingId.
 */
export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get('payment_id');

  if (!paymentId) {
    return NextResponse.json({ bookingId: null }, { status: 400 });
  }

  const { data } = await supabaseAdmin
    .from('payments')
    .select('booking_id')
    .eq('mp_payment_id', paymentId)
    .maybeSingle();

  return NextResponse.json({ bookingId: data?.booking_id ?? null });
}

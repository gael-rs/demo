import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify caller is authenticated admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: adminUser } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { verificationId, bookingId } = await request.json();
    if (!verificationId || !bookingId) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // 1. Approve verification
    const { error: verificationError } = await supabaseAdmin
      .from('identity_verifications')
      .update({
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', verificationId);

    if (verificationError) throw verificationError;

    // 2. Update booking: identity_verified + status confirmed
    const { error: bookingUpdateError } = await supabaseAdmin
      .from('bookings')
      .update({ identity_verified: true, status: 'confirmed' })
      .eq('id', bookingId);

    if (bookingUpdateError) throw bookingUpdateError;

    // 3. Get booking details for access code
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('property_id, check_in, check_out')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) throw bookingError ?? new Error('Reserva no encontrada');

    // 4. Generate 6-digit access code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error: codeError } = await supabaseAdmin
      .from('access_codes')
      .insert({
        booking_id: bookingId,
        property_id: booking.property_id,
        code,
        valid_from: booking.check_in,
        valid_until: booking.check_out,
        is_active: true,
        lock_sync_status: 'simulated',
      });

    if (codeError) throw codeError;

    return NextResponse.json({ success: true, code });
  } catch (error) {
    console.error('Error approving verification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

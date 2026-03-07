import { supabase } from '@/app/shared/lib/supabase';

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  days: number;
  price_per_day_clp: number;
  total_price_clp: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  identity_verified: boolean;
  access_code: string | null;
  access_code_expires_at: string | null;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  base_price_clp?: number;
  discount_percentage?: number;
  discount_amount_clp?: number;
  created_at: string;
  updated_at: string;
  // Relaciones
  property?: any;
  user?: any;
}

export interface CreateBookingData {
  user_id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  days: number;
  price_per_day_clp: number;
  total_price_clp: number;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  base_price_clp?: number;
  discount_percentage?: number;
  discount_amount_clp?: number;
}

/**
 * Crear nueva reserva
 */
export const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
};

/**
 * Obtener reservas del usuario actual
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtener todas las reservas (admin)
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      user:users(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtener reserva por ID
 */
export const getBookingById = async (id: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      user:users(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }

  return data;
};

/**
 * Actualizar estado de reserva
 */
export const updateBookingStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }

  return data;
};

/**
 * Actualizar verificación de identidad de reserva
 */
export const updateBookingIdentityVerification = async (
  id: string,
  verified: boolean
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ identity_verified: verified })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking identity verification:', error);
    throw error;
  }

  return data;
};

/**
 * Cancelar reserva
 */
export const cancelBooking = async (id: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      payment_status: 'refunded',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }

  return data;
};

/**
 * Extender estadía (actualizar check_out y recalcular días y precio)
 */
export const extendBooking = async (
  id: string,
  newCheckOut: string,
  additionalDays: number,
  pricePerDay: number
): Promise<Booking> => {
  const booking = await getBookingById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const newTotalDays = booking.days + additionalDays;
  const newTotalPrice = newTotalDays * pricePerDay;

  const { data, error } = await supabase
    .from('bookings')
    .update({
      check_out: newCheckOut,
      days: newTotalDays,
      total_price_clp: newTotalPrice,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error extending booking:', error);
    throw error;
  }

  return data;
};

/**
 * Actualizar fechas de reserva (admin)
 */
export const updateBookingDates = async (
  id: string,
  checkIn: string,
  checkOut: string,
  days: number,
  totalPrice: number
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      check_in: checkIn,
      check_out: checkOut,
      days,
      total_price_clp: totalPrice,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking dates:', error);
    throw error;
  }

  return data;
};

/**
 * Eliminar reserva (admin) — elimina la fila de la BD
 */
export const deleteBooking = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

/**
 * Obtener métricas de reservas (admin dashboard)
 */
export const getBookingMetrics = async () => {
  // Total de reservas por estado
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('status, total_price_clp, created_at');

  if (error) {
    console.error('Error fetching booking metrics:', error);
    throw error;
  }

  const metrics = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    active: bookings.filter((b) => b.status === 'active').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    revenue_this_month: 0,
    revenue_total: 0,
  };

  // Calcular ingresos del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.created_at);
    if (
      bookingDate.getMonth() === currentMonth &&
      bookingDate.getFullYear() === currentYear &&
      booking.status !== 'cancelled'
    ) {
      metrics.revenue_this_month += booking.total_price_clp;
    }
    if (booking.status !== 'cancelled') {
      metrics.revenue_total += booking.total_price_clp;
    }
  });

  return metrics;
};

import { supabase } from '@/app/shared/lib/supabase';

export interface IdentityVerification {
  id: string;
  user_id: string;
  booking_id: string | null;
  document_front_url: string;
  document_back_url: string | null;
  selfie_url: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  face_match_score: number | null;
  facepp_response: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  // Relaciones
  user?: any;
  booking?: any;
  reviewer?: any;
}

export interface CreateVerificationData {
  user_id: string;
  booking_id?: string;
  document_front_url: string;
  document_back_url?: string;
  selfie_url: string;
}

/**
 * Subir documento de verificación a Supabase Storage
 */
export const uploadVerificationDocument = async (
  file: File,
  userId: string,
  bookingId: string,
  type: 'document-front' | 'document-back' | 'selfie'
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${type}.${fileExt}`;
  const filePath = `${userId}/${bookingId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('verification-documents')
    .upload(filePath, file, {
      upsert: true, // Permitir reemplazar si ya existe
    });

  if (uploadError) {
    console.error('Error uploading verification document:', uploadError);
    throw uploadError;
  }

  // Obtener URL firmada (privada)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('verification-documents')
    .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 año

  if (signedUrlError) {
    console.error('Error creating signed URL:', signedUrlError);
    throw signedUrlError;
  }

  return signedUrlData.signedUrl;
};

/**
 * Crear solicitud de verificación
 */
export const createVerificationRequest = async (
  data: CreateVerificationData
): Promise<IdentityVerification> => {
  const { data: verification, error } = await supabase
    .from('identity_verifications')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating verification request:', error);
    throw error;
  }

  return verification;
};

/**
 * Obtener verificaciones del usuario
 */
export const getUserVerifications = async (
  userId: string
): Promise<IdentityVerification[]> => {
  const { data, error } = await supabase
    .from('identity_verifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user verifications:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtener verificaciones pendientes (admin)
 */
export const getPendingVerifications = async (): Promise<IdentityVerification[]> => {
  const { data, error } = await supabase
    .from('identity_verifications')
    .select(`
      *,
      user:users!user_id(*),
      booking:bookings(*)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending verifications:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtener todas las verificaciones (admin)
 */
export const getAllVerifications = async (): Promise<IdentityVerification[]> => {
  const { data, error } = await supabase
    .from('identity_verifications')
    .select(`
      *,
      user:users!user_id(*),
      booking:bookings(*),
      reviewer:users!reviewed_by(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all verifications:', error);
    throw error;
  }

  return data || [];
};

/**
 * Obtener verificación por ID
 */
export const getVerificationById = async (
  id: string
): Promise<IdentityVerification | null> => {
  const { data, error } = await supabase
    .from('identity_verifications')
    .select(`
      *,
      user:users!user_id(*),
      booking:bookings(*),
      reviewer:users!reviewed_by(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching verification:', error);
    throw error;
  }

  return data;
};

/**
 * Aprobar verificación (admin)
 */
export const approveVerification = async (
  id: string,
  adminId: string
): Promise<IdentityVerification> => {
  const { data, error } = await supabase
    .from('identity_verifications')
    .update({
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error approving verification:', error);
    throw error;
  }

  return data;
};

/**
 * Rechazar verificación (admin)
 */
export const rejectVerification = async (
  id: string,
  adminId: string,
  reason: string
): Promise<IdentityVerification> => {
  const { data, error } = await supabase
    .from('identity_verifications')
    .update({
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting verification:', error);
    throw error;
  }

  return data;
};

/**
 * Eliminar documentos de verificación del storage
 */
export const deleteVerificationDocuments = async (
  userId: string,
  bookingId: string
): Promise<void> => {
  const files = ['document-front', 'document-back', 'selfie'];
  // We don't know the extension, so list the folder and delete everything
  const folderPath = `${userId}/${bookingId}`;

  const { data: fileList, error: listError } = await supabase.storage
    .from('verification-documents')
    .list(folderPath);

  if (listError) {
    console.error('Error listing verification documents:', listError);
    throw listError;
  }

  if (fileList && fileList.length > 0) {
    const paths = fileList.map((f) => `${folderPath}/${f.name}`);
    const { error: removeError } = await supabase.storage
      .from('verification-documents')
      .remove(paths);

    if (removeError) {
      console.error('Error removing verification documents:', removeError);
      throw removeError;
    }
  }
};

/**
 * Eliminar verificación por booking_id (admin)
 */
export const deleteVerificationByBookingId = async (
  bookingId: string
): Promise<void> => {
  const { error } = await supabase
    .from('identity_verifications')
    .delete()
    .eq('booking_id', bookingId);

  if (error) {
    console.error('Error deleting verification:', error);
    throw error;
  }
};

/**
 * Obtener URL firmada para ver documento (admin)
 */
export const getSignedDocumentUrl = async (
  filePath: string
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('verification-documents')
    .createSignedUrl(filePath, 3600); // 1 hora

  if (error) {
    console.error('Error creating signed URL:', error);
    throw error;
  }

  return data.signedUrl;
};

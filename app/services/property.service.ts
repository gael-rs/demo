import { supabase } from '@/app/lib/supabase';

export interface Property {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  region: string;
  base_price_clp: number;
  amenities: string[];
  images: string[];
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  is_active: boolean;
  lock_provider?: string | null;
  lock_device_id?: string | null;
  lock_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyData {
  name: string;
  description?: string;
  address: string;
  city: string;
  region: string;
  base_price_clp: number;
  amenities?: string[];
  images?: string[];
  capacity?: number;
  bedrooms?: number;
  bathrooms?: number;
  is_active?: boolean;
  lock_provider?: string | null;
  lock_device_id?: string | null;
  lock_enabled?: boolean;
}

/**
 * Obtener todas las propiedades activas
 * OPTIMIZADO: Usa Route Handler interno que consulta con Prisma
 */
export const getActiveProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch('/api/properties', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Deshabilitar caché de Next.js para esta llamada
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active properties:', error);
    throw error;
  }
};

/**
 * Obtener todas las propiedades (admin)
 * OPTIMIZADO: Usa Route Handler interno
 */
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch('/api/properties?includeInactive=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all properties:', error);
    throw error;
  }
};

/**
 * Obtener propiedad por ID
 * OPTIMIZADO: Usa Route Handler interno
 */
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cachear propiedades individuales
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

/**
 * Crear nueva propiedad (admin)
 */
export const createProperty = async (propertyData: CreatePropertyData): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }

  return data;
};

/**
 * Actualizar propiedad (admin)
 */
export const updateProperty = async (
  id: string,
  updates: Partial<CreatePropertyData>
): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    throw error;
  }

  return data;
};

/**
 * Desactivar propiedad (soft delete)
 */
export const deactivateProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deactivating property:', error);
    throw error;
  }
};

/**
 * Activar propiedad
 */
export const activateProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .update({ is_active: true })
    .eq('id', id);

  if (error) {
    console.error('Error activating property:', error);
    throw error;
  }
};

/**
 * Subir imagen de propiedad a Supabase Storage
 */
export const uploadPropertyImage = async (
  file: File,
  propertyId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `properties/${propertyId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  // Obtener URL pública
  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Eliminar imagen de propiedad de Supabase Storage
 */
export const deletePropertyImage = async (imageUrl: string): Promise<void> => {
  // Extraer el path del URL
  const urlParts = imageUrl.split('/property-images/');
  if (urlParts.length < 2) {
    throw new Error('Invalid image URL');
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('property-images')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

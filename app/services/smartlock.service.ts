import { supabase } from '@/app/lib/supabase';

export interface AccessCode {
  id: string;
  booking_id: string;
  property_id: string;
  code: string;
  valid_from: string;
  valid_until: string;
  lock_password_id?: string;
  lock_sync_status: 'pending' | 'synced' | 'failed' | 'simulated';
  lock_error?: string;
  lock_synced_at?: string;
}

interface SmartLockProvider {
  generatePassword(
    deviceId: string,
    validFrom: Date,
    validUntil: Date,
    name: string
  ): Promise<{ code: string; passwordId?: string }>;
  deletePassword(deviceId: string, passwordId: string): Promise<void>;
}

/**
 * Simulated lock provider - generates random 6-digit codes
 */
class SimulatedLockProvider implements SmartLockProvider {
  async generatePassword(): Promise<{ code: string; passwordId?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return { code };
  }

  async deletePassword(): Promise<void> {
    // No-op for simulated provider
  }
}

/**
 * Nuki Smart Lock provider
 * Requires NUKI_API_KEY environment variable
 */
class NukiLockProvider implements SmartLockProvider {
  private apiKey: string;
  private baseUrl = 'https://api.nuki.io';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePassword(
    deviceId: string,
    validFrom: Date,
    validUntil: Date,
    name: string
  ): Promise<{ code: string; passwordId?: string }> {
    const response = await fetch(`${this.baseUrl}/smartlock/${deviceId}/auth`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        allowedFromDate: validFrom.toISOString(),
        allowedUntilDate: validUntil.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Nuki API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      code: data.code,
      passwordId: data.id,
    };
  }

  async deletePassword(deviceId: string, passwordId: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/smartlock/${deviceId}/auth/${passwordId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nuki API error: ${response.statusText}`);
    }
  }
}

/**
 * Factory to get the appropriate lock provider
 */
const getLockProvider = (provider: string): SmartLockProvider => {
  switch (provider) {
    case 'nuki': {
      const apiKey = process.env.NEXT_PUBLIC_NUKI_API_KEY || process.env.NUKI_API_KEY;
      if (!apiKey) {
        console.warn('NUKI_API_KEY not configured, falling back to simulated provider');
        return new SimulatedLockProvider();
      }
      return new NukiLockProvider(apiKey);
    }
    case 'simulated':
    default:
      return new SimulatedLockProvider();
  }
};

/**
 * Generate an access code with smart lock integration
 */
export const generateAccessCodeWithLock = async (
  bookingId: string,
  propertyId: string,
  validFrom: string,
  validUntil: string
): Promise<AccessCode | null> => {
  try {
    // Get property lock configuration
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('lock_provider, lock_device_id, lock_enabled')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      console.error('Error fetching property:', propertyError);
      throw propertyError;
    }

    let code: string;
    let passwordId: string | undefined;
    let syncStatus: AccessCode['lock_sync_status'] = 'pending';
    let lockError: string | undefined;

    // Try to generate code with smart lock if enabled
    if (property.lock_enabled && property.lock_device_id) {
      try {
        const provider = getLockProvider(property.lock_provider || 'simulated');
        const result = await provider.generatePassword(
          property.lock_device_id,
          new Date(validFrom),
          new Date(validUntil),
          `Booking-${bookingId.substring(0, 8)}`
        );

        code = result.code;
        passwordId = result.passwordId;
        syncStatus = property.lock_provider === 'simulated' ? 'simulated' : 'synced';
      } catch (error) {
        console.error('Lock sync error:', error);
        // Fallback to random code
        code = Math.floor(100000 + Math.random() * 900000).toString();
        syncStatus = 'failed';
        lockError = error instanceof Error ? error.message : 'Unknown error';
      }
    } else {
      // No lock configured, use random code
      code = Math.floor(100000 + Math.random() * 900000).toString();
      syncStatus = 'simulated';
    }

    // Create access code in database
    const { data: accessCode, error: createError } = await supabase
      .from('access_codes')
      .insert({
        booking_id: bookingId,
        property_id: propertyId,
        code,
        valid_from: validFrom,
        valid_until: validUntil,
        lock_password_id: passwordId,
        lock_sync_status: syncStatus,
        lock_error: lockError,
        lock_synced_at: syncStatus === 'synced' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating access code:', createError);
      throw createError;
    }

    return accessCode;
  } catch (error) {
    console.error('Error generating access code:', error);
    return null;
  }
};

/**
 * Delete an access code and remove from smart lock
 */
export const deleteAccessCode = async (accessCodeId: string): Promise<boolean> => {
  try {
    // Get access code details
    const { data: accessCode, error: fetchError } = await supabase
      .from('access_codes')
      .select('*, properties!inner(lock_provider, lock_device_id, lock_enabled)')
      .eq('id', accessCodeId)
      .single();

    if (fetchError) {
      console.error('Error fetching access code:', fetchError);
      return false;
    }

    // Delete from smart lock if applicable
    const property = (accessCode as any).properties;
    if (
      property.lock_enabled &&
      property.lock_device_id &&
      accessCode.lock_password_id &&
      accessCode.lock_sync_status === 'synced'
    ) {
      try {
        const provider = getLockProvider(property.lock_provider || 'simulated');
        await provider.deletePassword(property.lock_device_id, accessCode.lock_password_id);
      } catch (error) {
        console.error('Error deleting from smart lock:', error);
        // Continue with database deletion even if lock deletion fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('access_codes')
      .delete()
      .eq('id', accessCodeId);

    if (deleteError) {
      console.error('Error deleting access code:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAccessCode:', error);
    return false;
  }
};

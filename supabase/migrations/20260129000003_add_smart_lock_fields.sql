-- Add smart lock configuration to properties
ALTER TABLE public.properties
ADD COLUMN lock_provider TEXT CHECK (lock_provider IN ('nuki', 'ttlock', 'august', 'simulated')),
ADD COLUMN lock_device_id TEXT,
ADD COLUMN lock_enabled BOOLEAN DEFAULT false;

-- Add lock synchronization tracking to access_codes
ALTER TABLE public.access_codes
ADD COLUMN lock_password_id TEXT,
ADD COLUMN lock_sync_status TEXT DEFAULT 'pending' CHECK (lock_sync_status IN ('pending', 'synced', 'failed', 'simulated')),
ADD COLUMN lock_error TEXT,
ADD COLUMN lock_synced_at TIMESTAMPTZ;

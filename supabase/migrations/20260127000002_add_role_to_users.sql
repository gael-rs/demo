-- Add role column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for queries by role
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Comment: To create the first admin user, run:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@email.com';


-- Fix the database functions to include search_path for security
-- This addresses the "Function Search Path Mutable" warnings

-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Update the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update the log_user_activity function
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.user_activities (
    user_id, 
    activity_type, 
    activity_description, 
    metadata
  )
  VALUES (
    p_user_id, 
    p_activity_type, 
    p_activity_description, 
    p_metadata
  )
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Update the make_admin function
CREATE OR REPLACE FUNCTION public.make_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

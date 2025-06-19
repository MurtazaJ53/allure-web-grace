
-- First, let's enable RLS on tables that might not have it enabled
DO $$ 
BEGIN
    -- Enable RLS on tasks table if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS on habits table if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'habits' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Enable RLS on user_activity_feed table if not already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_activity_feed' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.user_activity_feed ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies for tasks table (only if they don't exist)
DO $$ 
BEGIN
    -- Tasks SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks' 
        AND policyname = 'Users can view their own tasks'
    ) THEN
        CREATE POLICY "Users can view their own tasks" 
          ON public.tasks 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;

    -- Tasks INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks' 
        AND policyname = 'Users can insert their own tasks'
    ) THEN
        CREATE POLICY "Users can insert their own tasks" 
          ON public.tasks 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Tasks UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks' 
        AND policyname = 'Users can update their own tasks'
    ) THEN
        CREATE POLICY "Users can update their own tasks" 
          ON public.tasks 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    -- Tasks DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'tasks' 
        AND policyname = 'Users can delete their own tasks'
    ) THEN
        CREATE POLICY "Users can delete their own tasks" 
          ON public.tasks 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create RLS policies for habits table (only if they don't exist)
DO $$ 
BEGIN
    -- Habits SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'habits' 
        AND policyname = 'Users can view their own habits'
    ) THEN
        CREATE POLICY "Users can view their own habits" 
          ON public.habits 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;

    -- Habits INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'habits' 
        AND policyname = 'Users can insert their own habits'
    ) THEN
        CREATE POLICY "Users can insert their own habits" 
          ON public.habits 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Habits UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'habits' 
        AND policyname = 'Users can update their own habits'
    ) THEN
        CREATE POLICY "Users can update their own habits" 
          ON public.habits 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    -- Habits DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'habits' 
        AND policyname = 'Users can delete their own habits'
    ) THEN
        CREATE POLICY "Users can delete their own habits" 
          ON public.habits 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create RLS policies for user_activity_feed table (only if they don't exist)
DO $$ 
BEGIN
    -- Activity Feed SELECT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_activity_feed' 
        AND policyname = 'Users can view their own activity feed'
    ) THEN
        CREATE POLICY "Users can view their own activity feed" 
          ON public.user_activity_feed 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;

    -- Activity Feed INSERT policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_activity_feed' 
        AND policyname = 'Users can insert their own activity feed'
    ) THEN
        CREATE POLICY "Users can insert their own activity feed" 
          ON public.user_activity_feed 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Activity Feed UPDATE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_activity_feed' 
        AND policyname = 'Users can update their own activity feed'
    ) THEN
        CREATE POLICY "Users can update their own activity feed" 
          ON public.user_activity_feed 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;

    -- Activity Feed DELETE policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_activity_feed' 
        AND policyname = 'Users can delete their own activity feed'
    ) THEN
        CREATE POLICY "Users can delete their own activity feed" 
          ON public.user_activity_feed 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

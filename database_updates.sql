-- Add acceptance_status column to jobs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'acceptance_status') THEN
        ALTER TABLE jobs ADD COLUMN acceptance_status TEXT CHECK (acceptance_status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending';
    END IF;
END $$;

-- Add installer_notes column to jobs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'installer_notes') THEN
        ALTER TABLE jobs ADD COLUMN installer_notes TEXT;
    END IF;
END $$;

-- Set default acceptance_status for existing jobs
UPDATE jobs SET acceptance_status = 'pending' WHERE acceptance_status IS NULL;

-- Create index on job_id in job_updates table for better performance
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'job_updates_job_id_idx') THEN
        CREATE INDEX job_updates_job_id_idx ON job_updates(job_id);
    END IF;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
    -- Drop installer policies if they exist
    BEGIN
        DROP POLICY IF EXISTS "Installers can update jobs assigned to them" ON jobs;
    EXCEPTION
        WHEN undefined_object THEN
            NULL;
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Installers can view job updates for jobs assigned to them" ON job_updates;
    EXCEPTION
        WHEN undefined_object THEN
            NULL;
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Installers can add job updates for jobs assigned to them" ON job_updates;
    EXCEPTION
        WHEN undefined_object THEN
            NULL;
    END;
END $$;

-- Create policies for installers
-- Policy for installers to update jobs assigned to them
CREATE POLICY "Installers can update jobs assigned to them"
ON jobs FOR UPDATE
TO authenticated
USING (auth.uid() = assigned_to);

-- Policy for installers to view job updates for jobs assigned to them
CREATE POLICY "Installers can view job updates for jobs assigned to them"
ON job_updates FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = job_updates.job_id
    AND jobs.assigned_to = auth.uid()
));

-- Policy for installers to add job updates for jobs assigned to them
CREATE POLICY "Installers can add job updates for jobs assigned to them"
ON job_updates FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = job_updates.job_id
    AND jobs.assigned_to = auth.uid()
) AND auth.uid() = created_by);

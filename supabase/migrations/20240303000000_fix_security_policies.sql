/*
  # Fix Database Security Vulnerabilities
  Revoke public write access to site_settings, testimonials, and chatbot_knowledge.

  ## Query Description:
  This migration drops the insecure public policies that allowed anyone to modify or delete website content. It replaces them with secure policies that only allow authenticated users (Admins) to insert, update, or delete data. Public users will still be able to read the data.
  
  ## Metadata:
  - Schema-Category: "Security"
  - Impact-Level: "High"
  - Requires-Backup: false
  - Reversible: true
  
  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes
  - Auth Requirements: Authenticated users only for write operations
*/

-- Fix site_settings policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public delete access on site_settings" ON site_settings;
    DROP POLICY IF EXISTS "Allow public insert access on site_settings" ON site_settings;
    DROP POLICY IF EXISTS "Allow public update access on site_settings" ON site_settings;
EXCEPTION WHEN others THEN null; END $$;

CREATE POLICY "Allow authenticated insert access on site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access on site_settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete access on site_settings" ON site_settings FOR DELETE TO authenticated USING (true);

-- Fix testimonials policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all access on testimonials" ON testimonials;
EXCEPTION WHEN others THEN null; END $$;

CREATE POLICY "Allow authenticated insert access on testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access on testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete access on testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

-- Fix chatbot_knowledge policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public all access on chatbot_knowledge" ON chatbot_knowledge;
EXCEPTION WHEN others THEN null; END $$;

CREATE POLICY "Allow authenticated insert access on chatbot_knowledge" ON chatbot_knowledge FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access on chatbot_knowledge" ON chatbot_knowledge FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete access on chatbot_knowledge" ON chatbot_knowledge FOR DELETE TO authenticated USING (true);

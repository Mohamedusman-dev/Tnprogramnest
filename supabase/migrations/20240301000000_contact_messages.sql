/*
# Create Contact Messages Table

## Query Description: 
This operation creates a new table to store contact form submissions from the website. It enables Row Level Security (RLS) to allow public users to insert new messages, while restricting read access to authenticated administrators only.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Creates table `contact_messages` with columns: id, name, email, phone, service, details, created_at.

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes (Public Insert, Authenticated Select)
- Auth Requirements: None for inserting, Authenticated for reading.
*/

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    service text,
    details text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit the contact form
CREATE POLICY "Allow public insert access on contact_messages"
    ON public.contact_messages FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated users (admins) to view the messages
CREATE POLICY "Allow authenticated read access on contact_messages"
    ON public.contact_messages FOR SELECT
    TO authenticated
    USING (true);

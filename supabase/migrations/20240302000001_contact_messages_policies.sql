/*
# Add Update and Delete Policies for Contact Messages
This migration adds RLS policies to allow authenticated users (admins) to update and delete records in the contact_messages table.

## Query Description: 
Adds UPDATE and DELETE policies to the contact_messages table for authenticated roles. This allows admins to manage contact submissions directly from the dashboard without affecting public security.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
Affects RLS policies on `contact_messages` table.

## Security Implications:
- RLS Status: Enabled (Unchanged)
- Policy Changes: Yes (Added Update/Delete for authenticated users)
- Auth Requirements: Requires authenticated session
*/

-- Allow authenticated users (Admins) to update contact messages
CREATE POLICY "Allow authenticated update access on contact_messages" 
ON contact_messages 
FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users (Admins) to delete contact messages
CREATE POLICY "Allow authenticated delete access on contact_messages" 
ON contact_messages 
FOR DELETE 
TO authenticated 
USING (true);

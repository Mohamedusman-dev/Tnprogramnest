/*
# Seed Default Clutch Reviews
Adds the default Clutch Reviews data to the site_settings table.

## Query Description:
This operation inserts the default Clutch Reviews data into the `site_settings` table. 
It uses an ON CONFLICT DO UPDATE clause with a condition to only overwrite if the existing array is empty, ensuring no existing custom reviews are lost.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true
*/

INSERT INTO site_settings (key, value, updated_at)
VALUES (
  'clutchReviews',
  '[
    { "id": "1", "text": "They immediately understood our needs and were always available.", "author": "Managing Director,", "company": "TMI Special Network", "rating": "5.0" },
    { "id": "2", "text": "The team was hands-on with their approach throughout the process.", "author": "Founder,", "company": "E-Commerce Fulfillment Company", "rating": "5.0" },
    { "id": "3", "text": "Their feedback time is really quick, and they take action immediately.", "author": "Board of Director,", "company": "LINK Global", "rating": "5.0" },
    { "id": "4", "text": "Their creativeness is impressive.", "author": "Director,", "company": "Paramanand Yoga Institute", "rating": "5.0" },
    { "id": "5", "text": "Highly professional and delivered the project exactly on time.", "author": "CEO,", "company": "Tech Startup", "rating": "5.0" }
  ]'::jsonb,
  NOW()
)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, updated_at = NOW()
WHERE site_settings.value IS NULL 
   OR (jsonb_typeof(site_settings.value) = 'array' AND jsonb_array_length(site_settings.value) = 0);

/*
# Add Default Clutch Reviews
Adds the default Clutch Reviews data to the site_settings table.

## Query Description: 
This operation safely inserts the default Clutch Reviews into the site_settings table. It uses ON CONFLICT DO NOTHING to ensure that if you already have this key, it will not overwrite your existing data.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
Affects the `site_settings` table by adding a new key-value pair.
*/

INSERT INTO site_settings (key, value)
VALUES (
  'clutchReviews',
  '[
    {"id":"1","text":"They immediately understood our needs and were always available.","author":"Managing Director,","company":"TMI Special Network","rating":"5.0"},
    {"id":"2","text":"The team was hands-on with their approach throughout the process.","author":"Founder,","company":"E-Commerce Fulfillment Company","rating":"5.0"},
    {"id":"3","text":"Their feedback time is really quick, and they take action immediately.","author":"Board of Director,","company":"LINK Global","rating":"5.0"},
    {"id":"4","text":"Their creativeness is impressive.","author":"Director,","company":"Paramanand Yoga Institute","rating":"5.0"},
    {"id":"5","text":"Highly professional and delivered the project exactly on time.","author":"CEO,","company":"Tech Startup","rating":"5.0"}
  ]'::jsonb
)
ON CONFLICT (key) DO NOTHING;

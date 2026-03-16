/*
  # Seed Clutch Reviews Data
  Ensures default Clutch Reviews are present in the database so they can be edited in the Admin Panel.

  ## Query Description:
  This operation inserts the default Clutch Reviews into the site_settings table.
  It uses ON CONFLICT DO UPDATE with a WHERE clause to ensure the data is only populated if the current value is an empty array or null, preventing any accidental overwriting of existing custom data.
  
  ## Metadata:
  - Schema-Category: "Data"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
*/

INSERT INTO site_settings (key, value)
VALUES (
  'clutchReviews',
  '[
    { "id": "1", "text": "They immediately understood our needs and were always available.", "author": "Managing Director,", "company": "TMI Special Network", "rating": "5.0" },
    { "id": "2", "text": "The team was hands-on with their approach throughout the process.", "author": "Founder,", "company": "E-Commerce Fulfillment Company", "rating": "5.0" },
    { "id": "3", "text": "Their feedback time is really quick, and they take action immediately.", "author": "Board of Director,", "company": "LINK Global", "rating": "5.0" },
    { "id": "4", "text": "Their creativeness is impressive.", "author": "Director,", "company": "Paramanand Yoga Institute", "rating": "5.0" },
    { "id": "5", "text": "Highly professional and delivered the project exactly on time.", "author": "CEO,", "company": "Tech Startup", "rating": "5.0" }
  ]'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value
WHERE site_settings.value::text = '[]' OR site_settings.value IS NULL;

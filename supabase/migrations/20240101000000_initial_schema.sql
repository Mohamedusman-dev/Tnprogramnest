/*
# Initial Website Schema
Creates tables for dynamic website content management.

## Query Description:
This operation creates the foundational tables for the website's dynamic content, including site settings, testimonials, and chatbot knowledge base. It also inserts default data and sets up public access policies for the admin panel.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Creates `site_settings` table for key-value JSONB storage (Hero, About, General).
- Creates `testimonials` table for client reviews.
- Creates `chatbot_knowledge` table for AI Q&A.

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes (Public read/write enabled for easy admin panel usage in this iteration)
- Auth Requirements: None
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create chatbot_knowledge table
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keywords TEXT[] NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default data for site_settings
INSERT INTO public.site_settings (key, value) VALUES
('general', '{"logoUrl": "https://images.dualite.app/a6d4e8ab-0637-401c-aa19-5a07a216a4c1/asset-4b236b1b-285d-4dab-8f78-adb7c236d581.webp", "email": "hello@technest.dev", "phone": "+1 (555) 123-4567", "address": "123 Innovation Drive, Suite 400\nSan Francisco, CA 94105", "footerText": "TechNest is run by a dedicated team of developers, designers, and strategists, with help from our amazing clients!"}'),
('hero', '{"title": "Building Digital Solutions That", "highlight": "Drive Growth", "subtitle": "We help businesses grow with cutting-edge digital marketing, custom web applications, mobile apps, and full-stack development. From startups to enterprises, we bring your vision to life."}'),
('about', '{"title": "Your Trusted Partner in", "highlight": "Digital Transformation", "description": "At TechNest, we combine strategic thinking with technical excellence to deliver digital solutions that matter. With 8+ years of experience, 50+ expert developers, and a portfolio spanning 500+ successful projects, we''ve earned the trust of businesses worldwide."}'),
('cta', '{"title": "Engineer Unmatched Quality with Intelligent AI Solutions", "description": "Stop playing catch-up. Lead the market with our AI solutions that help you anticipate and solve challenges before they even arise.", "buttonText": "Start Your Project"}')
ON CONFLICT (key) DO NOTHING;

-- Insert default testimonials
INSERT INTO public.testimonials (name, company, text, rating) VALUES
('Sarah Mitchell', 'NovaTech Inc.', 'TechNest transformed our outdated platform into a sleek, high-performing web app. Their team''s expertise and professionalism exceeded our expectations.', 5),
('James Rodriguez', 'GreenLeaf Health', 'Working with TechNest was a game-changer. They delivered our healthcare app on time, within budget, and with exceptional quality.', 5),
('Emily Chen', 'UrbanNest Realty', 'The real estate platform TechNest built for us has increased our lead conversions by 40%. Incredible attention to detail and UX design.', 5),
('Michael Okonkwo', 'PaySwift Finance', 'TechNest''s fintech expertise is unmatched. They built a secure, scalable payment solution that our customers love.', 5),
('Priya Sharma', 'EduVerse', 'Our e-learning platform built by TechNest handles 50K+ concurrent users seamlessly. Their technical depth is impressive.', 5),
('David Kim', 'LogiTrack Systems', 'The logistics dashboard TechNest developed gave us real-time visibility across our entire supply chain. Truly transformative.', 5)
ON CONFLICT DO NOTHING;

-- Insert default chatbot knowledge
INSERT INTO public.chatbot_knowledge (keywords, answer) VALUES
('{"service", "offer", "do you do", "what can you"}', 'We offer Full Stack Development, Mobile App Development, Web Development, E-commerce Solutions, and Digital Marketing.'),
('{"price", "cost", "quote", "estimate", "much"}', 'Our pricing is project-based and highly competitive. Please leave your email or use the Contact Us form for a custom quote!'),
('{"contact", "reach", "email", "phone", "call"}', 'You can reach us at hello@technest.dev or call us at +1 (555) 123-4567. We''re also available via the Contact Us section below.'),
('{"hire", "developer", "team", "dedicated"}', 'Yes! We offer dedicated offshore developers for startups and enterprises. Let us know your tech stack requirements.'),
('{"hi", "hello", "hey", "greetings"}', 'Hello! 👋 How can I help you today? Feel free to ask about our services, pricing, or tech stack.')
ON CONFLICT DO NOTHING;

-- Set up RLS (Row Level Security)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
CREATE POLICY "Allow public read access on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update access on site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access on site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access on site_settings" ON public.site_settings FOR DELETE USING (true);

-- Policies for testimonials
CREATE POLICY "Allow public read access on testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public all access on testimonials" ON public.testimonials FOR ALL USING (true);

-- Policies for chatbot_knowledge
CREATE POLICY "Allow public read access on chatbot_knowledge" ON public.chatbot_knowledge FOR SELECT USING (true);
CREATE POLICY "Allow public all access on chatbot_knowledge" ON public.chatbot_knowledge FOR ALL USING (true);

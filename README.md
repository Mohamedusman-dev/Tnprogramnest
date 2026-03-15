# TechNest - Premium Digital Solutions

## Project Structure
This repository contains two completely independent React applications:

1. **Main Website (`/`)**: The public-facing frontend built with React, Vite, Tailwind CSS, and Framer Motion. It is highly optimized for SEO and performance.
2. **Admin Panel (`/admin-app`)**: A secure, standalone dashboard for managing website content, services, testimonials, and viewing contact messages.

## Security Architecture
The Supabase database is secured using strict **Row Level Security (RLS)** policies to prevent unauthorized access or hacking attempts:
- **Public Access**: Users have read-only access to website content (settings, testimonials, chatbot data) required to render the site. They only have insert access for the Contact Us form.
- **Admin Access**: Full CRUD (Create, Read, Update, Delete) access is strictly restricted to authenticated administrators who log in through the Admin Panel.

## Running the Main Website
To run the public-facing website locally:
```bash
npm install
npm run dev
```

## Running the Admin Panel
To run the secure admin dashboard locally:
```bash
cd admin-app
npm install
npm run dev
```

## Deployment
Because the Admin Panel is in its own folder, you can deploy it as a completely separate project on platforms like Vercel or Netlify. 
- **Main Site Build Command**: `npm run build` (Root directory)
- **Admin Site Build Command**: `npm run build` (Inside `/admin-app` directory)

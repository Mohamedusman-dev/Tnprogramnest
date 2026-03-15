import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual production domain
const DOMAIN = 'https://mydomain.com';

// Define your website routes here. 
// To update the sitemap when new pages are added, simply add them to this array.
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/technology', priority: '0.8', changefreq: 'monthly' },
  { path: '/careers', priority: '0.9', changefreq: 'weekly' },
  { path: '/training', priority: '0.8', changefreq: 'monthly' },
  { path: '/build-idea', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/full-stack-development', priority: '0.9', changefreq: 'monthly' },
];

const generateSitemap = () => {
  // Get current date in YYYY-MM-DD format for <lastmod>
  const today = new Date().toISOString().split('T')[0];

  const urls = routes.map(route => `
  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write the sitemap to the public folder
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap.trim());
  console.log('✅ sitemap.xml generated successfully!');
};

generateSitemap();

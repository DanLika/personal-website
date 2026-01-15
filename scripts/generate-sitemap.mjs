
import { readdir, writeFile, readFile } from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://duskolicanin.com';
const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const BLOG_PATH = path.join(process.cwd(), 'public', 'blog');
const PROJECTS_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'projects.ts');

// Function to generate a URL entry
const createUrlEntry = (loc, lastmod, changefreq = 'weekly', priority = '0.8') => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

/**
 * Extracts project slugs from the projects.ts file using a regex.
 * This avoids needing a full TS parser for this simple build script.
 * @returns {Promise<string[]>} A promise that resolves to an array of project slugs.
 */
async function getProjectSlugs() {
  try {
    const content = await readFile(PROJECTS_DATA_PATH, 'utf8');
    // This regex looks for keys in the projectsData object.
    // It finds strings enclosed in single quotes that are followed by a colon.
    const regex = /'([^']+)':\s*{/g;
    const slugs = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      slugs.push(match[1]);
    }
    // Filter out potential false positives if any
    return slugs.filter(slug => slug && !slug.includes(' '));
  } catch (error) {
    console.error('Error reading or parsing project data file:', error);
    return []; // Return empty array on error
  }
}

async function generateSitemap() {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // 1. Static pages
    const staticPages = [
      { loc: BASE_URL, changefreq: 'daily', priority: '1.0' },
      { loc: `${BASE_URL}/blog`, changefreq: 'weekly', priority: '0.9' },
    ];

    // 2. Blog posts (dynamic)
    const blogDirs = await readdir(BLOG_PATH, { withFileTypes: true });
    const blogPages = blogDirs
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({ loc: `${BASE_URL}/blog/${dirent.name}` }));

    // 3. Case studies (dynamic)
    const projectSlugs = await getProjectSlugs();
    const caseStudyPages = projectSlugs.map(slug => ({
      loc: `${BASE_URL}/case-study/${slug}`,
    }));

    // Combine all pages
    const allPages = [...staticPages, ...blogPages, ...caseStudyPages];

    // Generate XML content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => createUrlEntry(page.loc, today, page.changefreq, page.priority)).join('')}
</urlset>`;

    // Write to file
    await writeFile(SITEMAP_PATH, sitemapContent.trim(), 'utf8');
    console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();

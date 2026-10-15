import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://mowglai.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/private/',
                    '/_next/',
                    '/cdn-cgi/',
                ],
            },
            {
                userAgent: [
                    'Googlebot',
                    'Googlebot-Image',
                    'Bingbot',
                    'Slurp',
                    'DuckDuckBot',
                    'Baiduspider',
                    'YandexBot',
                    'Sogou',
                    'Applebot',
                ],
                allow: '/',
                disallow: [
                    '/_next/',
                ],
            },
            // AEO / GEO - Welcoming AI Search & Answer Engine Crawlers
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'PerplexityBot',
                    'ClaudeBot',
                    'anthropic-ai',
                    'Google-Extended',
                    'CCBot',
                    'Amazonbot',
                    'cohere-ai',
                ],
                allow: '/',
                disallow: [
                    '/_next/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}

import { MetadataRoute } from 'next'
import { allTemplates } from '@/data/templates'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mowglai.com'
    const now = new Date()

    // Core static routes prioritized for Google & Bing fast indexing
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/audit/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/services/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/web-development/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/web-design/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/intelligent-systems/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/ecommerce/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/services/website-redesign/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/services/database-solutions/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/services/digital-strategy/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/saas-mvp-development/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/nextjs-development-agency/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/web-development-agency-india/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/explore/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/investment/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/contact/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/about/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/our-dna/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/referral/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/start-project/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/start-project/custom-quote/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/start-project/consultation/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/start-project/nextjs/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/start-project/saas/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/start-project/web-dev/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/custom-request/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy/`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms/`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    // Template product routes
    const templateRoutes: MetadataRoute.Sitemap = []
    Object.values(allTemplates).flat().forEach(template => {
        templateRoutes.push({
            url: `${baseUrl}/explore/${template.id}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.85,
        })
    })

    return [...staticRoutes, ...templateRoutes]
}

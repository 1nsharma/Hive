/**
 * useSEO - Custom React Hook for Dynamic SEO Management
 * Handles meta tags, canonical URLs, Open Graph cards, and JSON-LD schema injection
 */

import { useEffect } from 'react';
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  SchemaOptions,
} from './seoSchemas';

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  noIndex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  blogPost?: SchemaOptions;
  article?: SchemaOptions;
  faq?: Array<{ question: string; answer: string }>;
}

const BASE_URL = 'https://petsjanu.com';
const DEFAULT_OG_IMAGE = 'https://petsjanu.com/og-image.png';

/**
 * Helper to set or update a meta tag
 */
function setMetaTag(nameOrProperty: string, content: string, isProperty = false) {
  const attribute = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, nameOrProperty);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Helper to update canonical link
 */
function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
}

/**
 * Helper to update page title
 */
function setPageTitle(title: string) {
  document.title = `${title} — PetJanu`;
}

/**
 * Helper to inject JSON-LD schema
 */
function injectSchema(schema: Record<string, unknown> | Array<Record<string, unknown>>) {
  const scriptId = 'petjanu-json-ld-schema';
  let existingScript = document.getElementById(scriptId);

  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Main useSEO hook
 */
export function useSEO(config: SEOConfig) {
  const {
    title,
    description,
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    keywords = [],
    noIndex = false,
    schema,
    breadcrumbs,
    blogPost,
    article,
    faq,
  } = config;

  useEffect(() => {
    // Update page title
    setPageTitle(title);

    // Update primary meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    setMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('author', 'PetJanu Team');

    // Update canonical URL
    const canonicalUrl = canonical || `${BASE_URL}${window.location.pathname}`;
    setCanonical(canonicalUrl);

    // Update Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'PetJanu', true);
    setMetaTag('og:locale', 'en_IN', true);

    // Update Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);
    setMetaTag('twitter:site', '@petjanu');
    setMetaTag('twitter:creator', '@petjanu');

    // Inject structured data schemas
    const schemas: Array<Record<string, unknown>> = [];

    // Always include Organization schema
    schemas.push(generateOrganizationSchema());

    // Add page-specific schema
    if (schema) {
      if (Array.isArray(schema)) {
        schemas.push(...schema);
      } else {
        schemas.push(schema);
      }
    }

    // Add blog posting schema if provided
    if (blogPost) {
      schemas.push(generateBlogPostingSchema(blogPost));
    }

    // Add article schema if provided
    if (article) {
      schemas.push(generateArticleSchema(article));
    }

    // Add FAQ schema if provided
    if (faq && faq.length > 0) {
      schemas.push(generateFAQSchema(faq));
    }

    // Add breadcrumb schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs));
    }

    // Inject combined schema graph
    if (schemas.length > 1) {
      injectSchema({
        '@context': 'https://schema.org',
        '@graph': schemas,
      });
    } else if (schemas.length === 1) {
      injectSchema(schemas[0]);
    }

    // Cleanup on unmount (optional - remove schema scripts)
    return () => {
      const scriptId = 'petjanu-json-ld-schema';
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [
    title,
    description,
    canonical,
    ogImage,
    ogType,
    keywords.join(','),
    noIndex,
    blogPost?.title,
    article?.title,
    JSON.stringify(faq),
    JSON.stringify(breadcrumbs),
  ]);
}

/**
 * Pre-configured SEO templates for common page types
 */
export const seoTemplates = {
  homepage: {
    title: "India's Most Trusted Pet Safety & Care Platform",
    description:
      "India's most trusted pet safety platform with QR/NFC smart tags, lost pet SOS alerts, 24/7 AI health guidance, pet product store, and vet bookings. Protect your furry family today.",
    canonical: BASE_URL,
    keywords: [
      'pet safety India',
      'lost pet finder',
      'QR pet tag',
      'NFC pet collar',
      'pet health app',
      'vet booking India',
      'pet marketplace',
      'pet SOS alert',
    ],
  } as SEOConfig,

  howItWorks: {
    title: 'How PetJanu QR/NFC Tags Work',
    description:
      'Learn how PetJanu smart tags help reunite lost pets with their families. Scan-to-connect technology works without any app installation.',
    keywords: ['how QR pet tags work', 'NFC pet tag', 'lost pet recovery'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'How It Works', url: `${BASE_URL}/how-it-works` },
    ],
  } as SEOConfig,

  safety: {
    title: 'Pet Safety Features - Emergency SOS Alerts',
    description:
      'Activate emergency SOS alerts for lost pets. Share with local colony networks and track real-time sightings through the PetJanu community.',
    keywords: ['lost pet alert', 'pet SOS', 'stray dog safety', 'pet rescue India'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Safety', url: `${BASE_URL}/safety` },
    ],
  } as SEOConfig,

  health: {
    title: 'AI Pet Health Checker - 24/7 Veterinary Guidance',
    description:
      'Get instant AI-powered pet health triage. Symptom checker provides risk assessment and connects you with veterinarians when needed.',
    keywords: ['pet health checker', 'AI vet assistant', 'pet symptom checker', 'veterinary advice India'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Health', url: `${BASE_URL}/health` },
    ],
  } as SEOConfig,

  pricing: {
    title: 'PetJanu Pricing - Free & Premium Plans',
    description:
      'Start free with basic features. Upgrade to Premium for unlimited AI consultations, priority support, and exclusive discounts. QR tags from ₹149.',
    keywords: ['pet care pricing', 'pet subscription India', 'QR tag price'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Pricing', url: `${BASE_URL}/pricing` },
    ],
  } as SEOConfig,

  blog: {
    title: 'Pet Care Blog - Expert Tips & Guides',
    description:
      'Read expert pet care guides, health tips, training advice, and success stories from the PetJanu community.',
    keywords: ['pet care blog', 'dog care tips', 'cat health guide', 'pet training India'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Blog', url: `${BASE_URL}/blog` },
    ],
  } as SEOConfig,

  about: {
    title: 'About PetJanu - Our Mission & Team',
    description:
      'PetJanu is India\'s leading pet safety platform. Learn about our mission to protect every pet and connect with our team.',
    keywords: ['about PetJanu', 'pet safety company India', 'pet startup'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'About', url: `${BASE_URL}/about` },
    ],
  } as SEOConfig,

  marketplace: {
    title: 'Pet Products Marketplace - Food, Toys & Supplies',
    description:
      'Shop premium pet products at PetJanu. Food, toys, grooming supplies, healthcare items, and smart devices with fast delivery across India.',
    keywords: ['pet shop India', 'buy pet food online', 'pet supplies', 'dog toys India'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Marketplace', url: `${BASE_URL}/marketplace` },
    ],
  } as SEOConfig,

  services: {
    title: 'Pet Services - Vet Booking, Grooming & Training',
    description:
      'Book veterinary consultations, professional grooming, training sessions, and pet sitting services through PetJanu.',
    keywords: ['vet booking India', 'pet grooming services', 'dog training', 'pet sitter'],
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Services', url: `${BASE_URL}/services` },
    ],
  } as SEOConfig,

  privacy: {
    title: 'Privacy Policy - Data Protection at PetJanu',
    description:
      'Learn how PetJanu collects, uses, and protects your personal data. We follow GDPR-inspired privacy practices.',
    keywords: ['privacy policy', 'data protection', 'GDPR compliance'],
    noIndex: true,
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Privacy', url: `${BASE_URL}/privacy` },
    ],
  } as SEOConfig,

  security: {
    title: 'Security Practices - Safe & Secure Platform',
    description:
      'PetJanu implements enterprise-grade security including encryption, RBAC, audit logging, and cryptographic tag verification.',
    keywords: ['platform security', 'data encryption', 'secure pet app'],
    noIndex: true,
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Security', url: `${BASE_URL}/security` },
    ],
  } as SEOConfig,
};

/**
 * Hook wrapper for blog posts with dynamic metadata
 */
export function useBlogPostSEO(postData: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
}) {
  const { title, excerpt, slug, publishedAt, author, tags = [], imageUrl } = postData;

  useSEO({
    title,
    description: excerpt,
    canonical: `${BASE_URL}/blog/${slug}`,
    ogType: 'article',
    ogImage: imageUrl,
    keywords: tags,
    blogPost: {
      title,
      description: excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      image: imageUrl,
      author: author || 'PetJanu Team',
      publishedTime: publishedAt,
      modifiedTime: new Date().toISOString(),
      tags,
    },
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Blog', url: `${BASE_URL}/blog` },
      { name: title, url: `${BASE_URL}/blog/${slug}` },
    ],
  });
}

/**
 * Hook wrapper for pet profile pages (public lost pet pages)
 */
export function usePetProfileSEO(petData: {
  name: string;
  species: string;
  breed: string;
  slug: string;
  photoUrl: string;
  isLost?: boolean;
}) {
  const { name, species, breed, slug, photoUrl, isLost } = petData;

  useSEO({
    title: `${name} - ${breed} ${species}`,
    description: `${name} is a ${breed} ${species.toLowerCase()} registered with PetJanu safety network. ${isLost ? 'Currently reported as LOST. If spotted, please contact the owner immediately.' : 'Safe and healthy.'}`,
    canonical: `${BASE_URL}/pet/${slug}`,
    ogType: 'profile',
    ogImage: photoUrl,
    keywords: [`lost ${species.toLowerCase()}`, `${breed} ${species.toLowerCase()}`, 'pet recovery'],
    noIndex: !isLost, // Only index lost pet pages for discovery
  });
}

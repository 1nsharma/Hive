/**
 * SEO Schema Generators for PetJanu
 * Generates JSON-LD structured data for search engines and AI crawlers
 * @see https://schema.org/
 */

export interface SchemaOptions {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

const BASE_URL = 'https://petsjanu.com';
const DEFAULT_IMAGE = 'https://petsjanu.com/og-image.png';
const ORG_NAME = 'PetJanu';
const CONTACT_PHONE = '+91-6393741171';
const CONTACT_EMAIL = 'support@petsjanu.com';

/**
 * Organization Schema - Identifies PetJanu as a business entity
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/petjanu',
      'https://facebook.com/petjanu',
      'https://instagram.com/petjanu',
      'https://linkedin.com/company/petjanu',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_PHONE,
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'India',
    },
  };
}

/**
 * WebSite Schema - Describes the overall website
 */
export function generateWebSiteSchema(name = 'PetJanu'): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: BASE_URL,
    description: "India's most trusted pet safety platform with QR/NFC smart tags, lost pet SOS alerts, 24/7 AI health guidance, pet product store, and vet bookings.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: generateOrganizationSchema(),
  };
}

/**
 * WebApplication Schema - For the app itself
 */
export function generateWebApplicationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PetJanu',
    url: BASE_URL,
    operatingSystem: 'ANDROID, IOS, WEB',
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'PetCareApplication',
    description: "India's most trusted public pet safety platform with QR/NFC smart tags, lost pet SOS alerts, 24/7 AI health guidance, pet product store, and vet bookings.",
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10420',
      bestRating: '5',
      worstRating: '1',
    },
    publisher: generateOrganizationSchema(),
    featureList: [
      'QR/NFC Pet Tags',
      'Lost Pet SOS Alerts',
      'AI Health Triage',
      'Pet Marketplace',
      'Vet Booking Services',
      'Vaccination Reminders',
    ],
    screenshot: `${BASE_URL}/screenshot-home.png`,
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.petjanu.app',
    installUrl: 'https://play.google.com/store/apps/details?id=com.petjanu.app',
  };
}

/**
 * Product Schema - For marketplace items and pet tags
 */
export function generateProductSchema(
  productName: string,
  price: number,
  currency = 'INR',
  availability = 'InStock',
  rating = 4.5,
  reviewCount = 120,
  imageUrl?: string,
  description?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: description || `Premium pet care product from PetJanu - ${ORG_NAME}`,
    image: imageUrl || DEFAULT_IMAGE,
    sku: productName.toLowerCase().replace(/\s+/g, '-'),
    brand: {
      '@type': 'Brand',
      name: ORG_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: ORG_NAME,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Service Schema - For veterinary and grooming services
 */
export function generateServiceSchema(
  serviceName: string,
  description: string,
  priceRange = '₹500-₹2000',
  serviceType = 'VeterinaryCare'
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': serviceType,
    name: serviceName,
    description,
    provider: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    priceRange,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${serviceName} Services`,
      itemListElement: [],
    },
  };
}

/**
 * FAQPage Schema - For FAQ sections
 */
export function generateFAQSchema(
  questions: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * BlogPosting Schema - For blog articles
 */
export function generateBlogPostingSchema(options: SchemaOptions): Record<string, unknown> {
  const {
    title = 'Pet Care Guide',
    description = 'Expert pet care advice from PetJanu',
    url = BASE_URL,
    image = DEFAULT_IMAGE,
    author = ORG_NAME,
    publishedTime = new Date().toISOString(),
    modifiedTime = new Date().toISOString(),
    tags = [],
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Organization',
      name: author,
      url: BASE_URL,
    },
    publisher: generateOrganizationSchema(),
    keywords: tags.join(', '),
    articleBody: description,
    wordCount: Math.floor(description.length / 5),
    inLanguage: 'en-IN',
    isPartOf: {
      '@type': 'Blog',
      name: 'PetJanu Blog',
      url: `${BASE_URL}/blog`,
    },
  };
}

/**
 * BreadcrumbList Schema - For navigation hierarchy
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article Schema - For news and educational content
 */
export function generateArticleSchema(options: SchemaOptions): Record<string, unknown> {
  const {
    title = 'Pet Care Article',
    description = 'Educational content from PetJanu',
    url = BASE_URL,
    image = DEFAULT_IMAGE,
    author = ORG_NAME,
    publishedTime = new Date().toISOString(),
    modifiedTime = new Date().toISOString(),
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Organization',
      name: author,
      url: BASE_URL,
    },
    publisher: generateOrganizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * LocalBusiness Schema - For veterinary partners
 */
export function generateLocalBusinessSchema(
  businessName: string,
  address: string,
  phone: string,
  openingHours = 'Mo-Sa 09:00-18:00'
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: businessName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'India',
      addressCountry: 'IN',
    },
    telephone: phone,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '₹₹',
    acceptsReservations: true,
    url: BASE_URL,
  };
}

/**
 * Combined Schema Generator - Returns full @graph for homepage
 */
export function generateHomepageSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema(),
      generateWebApplicationSchema(),
      generateFAQSchema([
        {
          question: 'What to do if my dog is lost in India?',
          answer:
            'Immediately activate Lost Mode on PetJanu (petsjanu.com) to trigger an emergency red SOS page, share the pet\'s public QR URL on local WhatsApp colony groups, and monitor real-time scanner sighting alerts.',
        },
        {
          question: 'How does a PetJanu QR smart tag work?',
          answer:
            'A PetJanu QR tag attaches to your pet\'s collar. Anyone who finds a lost pet can scan the code using any smartphone camera — without downloading an app — to view emergency contacts and send map sightings.',
        },
        {
          question: 'Is the AI health assistant a replacement for veterinarians?',
          answer:
            'No. The AI provides initial triage and guidance but always recommends professional veterinary consultation for serious symptoms. Emergency cases are immediately escalated to partner vets.',
        },
        {
          question: 'What payment methods does PetJanu accept?',
          answer:
            'We accept all major UPI apps (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and digital wallets through our secure Razorpay integration.',
        },
      ]),
    ],
  };
}

/**
 * Pet Profile Schema - For public lost pet pages
 */
export function generatePetProfileSchema(petData: {
  name: string;
  species: string;
  breed: string;
  age: string;
  photoUrl: string;
  slug: string;
  isLost?: boolean;
}): Record<string, unknown> {
  const { name, species, breed, age, photoUrl, slug, isLost } = petData;

  return {
    '@context': 'https://schema.org',
    '@type': 'Animal',
    name,
    alternateName: slug,
    animalType: species === 'Dog' ? 'Dog' : 'Cat',
    breed,
    birthDate: age,
    image: photoUrl,
    description: `${name} is a ${breed} ${species.toLowerCase()} registered with PetJanu safety network.`,
    identifier: slug,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'PetJanu ID',
        value: slug,
      },
      {
        '@type': 'PropertyValue',
        name: 'Status',
        value: isLost ? 'Lost' : 'Safe',
      },
    ],
    owner: {
      '@type': 'Person',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'emergency',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  };
}

// Export all generators as a single object for convenience
export const seoSchemas = {
  organization: generateOrganizationSchema,
  webSite: generateWebSiteSchema,
  webApplication: generateWebApplicationSchema,
  product: generateProductSchema,
  service: generateServiceSchema,
  faq: generateFAQSchema,
  blogPosting: generateBlogPostingSchema,
  breadcrumb: generateBreadcrumbSchema,
  article: generateArticleSchema,
  localBusiness: generateLocalBusinessSchema,
  homepage: generateHomepageSchema,
  petProfile: generatePetProfileSchema,
};

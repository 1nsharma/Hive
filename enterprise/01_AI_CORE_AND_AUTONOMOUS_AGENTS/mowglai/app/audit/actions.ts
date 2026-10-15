import { z } from "zod";

const auditSchema = z.object({
    url: z.string().min(1, "Please enter a website URL"),
});

export type AuditDetail = {
    title: string;
    status: "pass" | "fail" | "warning";
    value: string;
    description: string;
    recommendation?: string;
    fixSnippet?: string;
};

export type AuditCategory = {
    score: number;
    title: string;
    description: string;
    items: AuditDetail[];
};

export type QuickFixItem = {
    title: string;
    category: "SEO" | "HEO" | "AEO" | "Security" | "Performance";
    impact: "High" | "Medium" | "Low";
    description: string;
    snippet?: string;
};

export type AuditResult = {
    url: string;
    success: boolean;
    error?: string;
    timestamp: string;
    summary: {
        overallScore: number;
        passedCount: number;
        warningCount: number;
        failedCount: number;
    };
    categories: {
        seo: AuditCategory;
        performance: AuditCategory;
        security: AuditCategory;
        content: AuditCategory;
        aeo: AuditCategory;
    };
    fixerPlan: {
        quickFixes: QuickFixItem[];
        recommendedMetaTags: string;
        recommendedSchemaJsonLd: string;
        recommendedRobotsTxt: string;
    };
};

function normalizeUrl(input: string): string {
    let trimmed = input.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        trimmed = "https://" + trimmed;
    }
    return trimmed;
}

export async function analyzeWebsite(formData: FormData): Promise<AuditResult> {
    const rawUrl = (formData.get("url") as string) || "";
    const validated = auditSchema.safeParse({ url: rawUrl });
    if (!validated.success) {
        return createErrorResult(rawUrl, "Please provide a valid website address.");
    }

    const targetUrl = normalizeUrl(validated.data.url);
    try {
        new URL(targetUrl);
    } catch {
        return createErrorResult(rawUrl, "Invalid URL structure. Example: https://example.com");
    }

    try {
        return await runAuditEngine(targetUrl);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to run audit on URL.";
        return createErrorResult(targetUrl, msg);
    }
}

export async function runAuditEngine(url: string): Promise<AuditResult> {
    const parsedTarget = new URL(url);
    const startTime = Date.now();

    let response: Response | null = null;
    let html = "";
    let statusCode = 0;
    const responseHeaders: Record<string, string> = {};

    // Try fetching target. If mowglai.com is queried in local dev, fallback to localhost:3000 if needed.
    const urlsToTry = [url];
    if (parsedTarget.hostname === "mowglai.com" || parsedTarget.hostname === "www.mowglai.com") {
        urlsToTry.push(`http://127.0.0.1:3000${parsedTarget.pathname}${parsedTarget.search}`);
    }

    let lastError: Error | null = null;
    for (const testUrl of urlsToTry) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            
            const res = await fetch(testUrl, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; Mowglai-SEO-Audit-Engine/2.0; +https://mowglai.com/audit)",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                },
                redirect: "follow",
            });
            clearTimeout(timeoutId);

            statusCode = res.status;
            res.headers.forEach((val, key) => {
                responseHeaders[key.toLowerCase()] = val;
            });
            html = await res.text();
            response = res;
            break;
        } catch (e) {
            lastError = e instanceof Error ? e : new Error(String(e));
        }
    }

    if (!response || !html) {
        throw new Error(lastError?.message || `Unable to reach ${url}. Ensure the domain is public and responding.`);
    }

    const loadTimeMs = Date.now() - startTime;
    const isHttps = url.startsWith("https://");

    // Extract elements with robust regex
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descMatch = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
        || html.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : null;

    const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
        || html.match(/<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

    const viewportMatch = /<meta\s+[^>]*name=["']viewport["']/i.test(html);
    const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
    const lang = langMatch ? langMatch[1].trim() : null;

    const faviconMatch = /<link\s+[^>]*rel=["'](?:shortcut\s+)?icon["']/i.test(html);

    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const h2Matches = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());

    // OpenGraph & Social
    const ogTitleMatch = html.match(/<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
    const ogDescMatch = html.match(/<meta\s+[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
    const ogImageMatch = html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
    const twitterCardMatch = html.match(/<meta\s+[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i);

    // Schema.org JSON-LD
    const jsonLdBlocks: unknown[] = [];
    const jsonLdMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of jsonLdMatches) {
        try {
            const parsed = JSON.parse(match[1]);
            jsonLdBlocks.push(parsed);
        } catch {
            // ignore malformed blocks
        }
    }

    // Semantic Structure (HEO / Accessibility)
    const hasMainTag = /<main[^>]*>/i.test(html);
    const hasNavTag = /<nav[^>]*>/i.test(html);
    const hasHeaderTag = /<header[^>]*>/i.test(html);
    const hasFooterTag = /<footer[^>]*>/i.test(html);
    const semanticScoreCount = [hasMainTag, hasNavTag, hasHeaderTag, hasFooterTag].filter(Boolean).length;

    // Images & Alt attributes
    const imgTags = Array.from(html.matchAll(/<img\s+([^>]+)>/gi));
    let imagesWithAlt = 0;
    imgTags.forEach(img => {
        if (/alt=["'][^"']*["']/i.test(img[1])) {
            imagesWithAlt++;
        }
    });

    // Content volume
    const strippedText = html.replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const wordCount = strippedText ? strippedText.split(/\s+/).length : 0;

    // Security Headers
    const hsts = responseHeaders['strict-transport-security'];
    const xContentType = responseHeaders['x-content-type-options'];
    const xFrameOptions = responseHeaders['x-frame-options'];

    // Scripts & Stylesheets
    const scriptCount = (html.match(/<script/gi) || []).length;
    const styleCount = (html.match(/<link\s+[^>]*rel=["']stylesheet["']/gi) || []).length;

    // Email scraping protection
    const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const uniqueEmails = Array.from(new Set(emailMatches));

    // ── Build Category 1: SEO ─────────────────────────────────────────
    let seoScore = 0;
    const seoItems: AuditDetail[] = [];

    // Title Check
    if (title) {
        const titleLen = title.length;
        if (titleLen >= 30 && titleLen <= 65) {
            seoScore += 25;
            seoItems.push({
                title: "Page Title Length",
                status: "pass",
                value: `${titleLen} chars: "${title.slice(0, 40)}..."`,
                description: "Title is within the ideal 30–65 character window for Google and Bing snippets.",
            });
        } else {
            seoScore += 15;
            seoItems.push({
                title: "Page Title Length",
                status: "warning",
                value: `${titleLen} chars`,
                description: titleLen < 30 ? "Title is short; add branded or specific keywords." : "Title exceeds 65 characters and may truncate in search results.",
                recommendation: "Keep between 30 and 65 characters for optimal CTR.",
                fixSnippet: `<title>${title.slice(0, 60)}</title>`,
            });
        }
    } else {
        seoItems.push({
            title: "Page Title",
            status: "fail",
            value: "Missing",
            description: "No <title> tag found. Search engines cannot index your page effectively.",
            recommendation: "Add a distinct <title> tag in the document <head>.",
            fixSnippet: `<title>Brand Name | Primary Service & Value Proposition</title>`,
        });
    }

    // Meta Description Check
    if (description) {
        const descLen = description.length;
        if (descLen >= 110 && descLen <= 165) {
            seoScore += 25;
            seoItems.push({
                title: "Meta Description",
                status: "pass",
                value: `${descLen} chars: "${description.slice(0, 50)}..."`,
                description: "Description meets ideal search snippet criteria (110–165 chars).",
            });
        } else {
            seoScore += 18;
            seoItems.push({
                title: "Meta Description Length",
                status: "warning",
                value: `${descLen} chars`,
                description: descLen < 110 ? "Description is a bit short." : "Description is over 165 characters and may be clipped.",
                recommendation: "Optimize description length between 120 and 160 characters with a clear call-to-action.",
                fixSnippet: `<meta name="description" content="${description.slice(0, 155)}" />`,
            });
        }
    } else {
        seoItems.push({
            title: "Meta Description",
            status: "fail",
            value: "Missing",
            description: "No meta description found. Search engines will guess snippet text from random page words.",
            recommendation: "Add a compelling meta description tag.",
            fixSnippet: `<meta name="description" content="Discover premium web development, SaaS MVP platforms, and custom digital experiences engineered for high conversions." />`,
        });
    }

    // Headings (H1 & H2)
    if (h1Matches.length === 1) {
        seoScore += 20;
        seoItems.push({
            title: "Primary Heading (H1)",
            status: "pass",
            value: `1 H1: "${h1Matches[0].slice(0, 35)}..."`,
            description: "Perfect structure: exactly one top-level H1 tag representing the page topic.",
        });
    } else if (h1Matches.length > 1) {
        seoScore += 12;
        seoItems.push({
            title: "Primary Heading (H1)",
            status: "warning",
            value: `${h1Matches.length} H1 tags detected`,
            description: "Multiple H1 tags found. It is best practice to have exactly one H1 per page, followed by H2 tags.",
            recommendation: "Consolidate into 1 main H1 and convert secondary headings to <h2>.",
        });
    } else {
        seoItems.push({
            title: "Primary Heading (H1)",
            status: "fail",
            value: "Missing",
            description: "No H1 heading found. Search engine crawlers look at H1 to determine the page's core topic.",
            recommendation: "Add a single semantic <h1> with your primary target keyword.",
            fixSnippet: `<h1>Your Primary Service or Solution</h1>`,
        });
    }

    // Canonical Tag
    if (canonical) {
        seoScore += 15;
        seoItems.push({
            title: "Canonical Link Tag",
            status: "pass",
            value: canonical,
            description: "Canonical link is defined to avoid duplicate content penalties across query parameters and protocols.",
        });
    } else {
        seoScore += 5;
        seoItems.push({
            title: "Canonical Link Tag",
            status: "warning",
            value: "Missing",
            description: "Without a canonical tag, URL variants (http, https, trailing slashes, tracking parameters) can cause duplicate content issues.",
            recommendation: "Specify the canonical URL explicitly.",
            fixSnippet: `<link rel="canonical" href="${url}" />`,
        });
    }

    // Mobile Viewport
    if (viewportMatch) {
        seoScore += 15;
        seoItems.push({
            title: "Mobile Viewport Meta",
            status: "pass",
            value: "Configured",
            description: "Mobile viewport meta tag is present, ensuring high ranking on Google Mobile-First Indexing.",
        });
    } else {
        seoItems.push({
            title: "Mobile Viewport Meta",
            status: "fail",
            value: "Missing",
            description: "Viewport tag is missing. Page will fail Google Mobile-Friendly tests.",
            recommendation: "Add standard responsive viewport meta tag.",
            fixSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
        });
    }

    // ── Build Category 2: Performance & HEO (Human Experience) ──────────
    let perfScore = 0;
    const perfItems: AuditDetail[] = [];

    const loadSec = (loadTimeMs / 1000).toFixed(2);
    if (loadTimeMs < 700) {
        perfScore += 40;
        perfItems.push({
            title: "Server Response Time (TTFB)",
            status: "pass",
            value: `${loadSec}s (${loadTimeMs}ms)`,
            description: "Lightning-fast initial response! Well below the recommended 800ms threshold.",
        });
    } else if (loadTimeMs < 1800) {
        perfScore += 25;
        perfItems.push({
            title: "Server Response Time (TTFB)",
            status: "warning",
            value: `${loadSec}s`,
            description: "Acceptable latency, but edge caching or CDN caching could shave another 500ms.",
            recommendation: "Enable edge caching or HTTP static asset caching headers.",
        });
    } else {
        perfScore += 10;
        perfItems.push({
            title: "Server Response Time (TTFB)",
            status: "fail",
            value: `${loadSec}s`,
            description: "Slow server response time hurts Core Web Vitals (LCP) and user conversion.",
            recommendation: "Use a global Edge CDN, enable Redis caching, or optimize database queries.",
        });
    }

    // Semantic Layout Structure (HEO)
    if (semanticScoreCount >= 3) {
        perfScore += 25;
        perfItems.push({
            title: "Semantic HTML & Accessibility (HEO)",
            status: "pass",
            value: `${semanticScoreCount}/4 Semantic Landmarks`,
            description: "Uses HTML5 landmarks (<main>, <header>, <nav>, <footer>) providing clear screen reader and keyboard navigation.",
        });
    } else {
        perfScore += 15;
        perfItems.push({
            title: "Semantic HTML Landmarks (HEO)",
            status: "warning",
            value: `${semanticScoreCount}/4 Landmarks`,
            description: "Missing semantic tags like <main>, <nav>, or <header>. Div-soup structures reduce assistive technology usability.",
            recommendation: "Wrap page layout in semantic <header>, <nav>, <main>, and <footer> tags.",
        });
    }

    // Script / Resource Bloat
    if (scriptCount <= 12) {
        perfScore += 20;
        perfItems.push({
            title: "Script Payload & Bloat",
            status: "pass",
            value: `${scriptCount} scripts detected`,
            description: "Lean JavaScript payload. Minimal main-thread blocking.",
        });
    } else if (scriptCount <= 28) {
        perfScore += 12;
        perfItems.push({
            title: "Script Payload & Bloat",
            status: "warning",
            value: `${scriptCount} scripts detected`,
            description: "Moderate script load. Check for duplicate analytics trackers or unoptimized third-party widgets.",
            recommendation: "Defer non-critical scripts with defer or async attributes.",
        });
    } else {
        perfScore += 5;
        perfItems.push({
            title: "Script Payload & Bloat",
            status: "fail",
            value: `${scriptCount} scripts detected`,
            description: "Heavy JavaScript footprint. May cause Total Blocking Time (TBT) and input lag on mobile devices.",
            recommendation: "Audit bundle dependencies and eliminate unused tracking tags.",
        });
    }

    // Language & Charset
    if (lang) {
        perfScore += 15;
        perfItems.push({
            title: "Document Language",
            status: "pass",
            value: `lang="${lang}"`,
            description: "HTML language tag declared correctly for localized text rendering and browser translation.",
        });
    } else {
        perfItems.push({
            title: "Document Language",
            status: "fail",
            value: "Missing",
            description: "The <html> element lacks a 'lang' attribute.",
            recommendation: "Add lang='en' to <html> tag.",
            fixSnippet: `<html lang="en">`,
        });
    }

    // ── Build Category 3: Security & Privacy ───────────────────────────
    let secScore = 0;
    const secItems: AuditDetail[] = [];

    if (isHttps) {
        secScore += 35;
        secItems.push({
            title: "HTTPS / SSL Encryption",
            status: "pass",
            value: "Secure (TLS/HTTPS)",
            description: "Connections are encrypted end-to-end, maintaining user confidence and Google security ranking boost.",
        });
    } else {
        secItems.push({
            title: "HTTPS / SSL Encryption",
            status: "fail",
            value: "Insecure (HTTP)",
            description: "Site serves plain HTTP. Browsers mark this as 'Not Secure' and search engines penalize rankings.",
            recommendation: "Install an SSL certificate and redirect all HTTP traffic to HTTPS.",
        });
    }

    if (hsts) {
        secScore += 25;
        secItems.push({
            title: "HSTS Header",
            status: "pass",
            value: "Strict-Transport-Security Active",
            description: "Protects visitors against SSL-stripping and protocol downgrade attacks.",
        });
    } else {
        secScore += 10;
        secItems.push({
            title: "HSTS Security Header",
            status: "warning",
            value: "Missing",
            description: "HSTS header is not declared on the server response.",
            recommendation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' to response headers.",
            fixSnippet: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
        });
    }

    if (xContentType && xContentType.toLowerCase().includes("nosniff")) {
        secScore += 20;
        secItems.push({
            title: "MIME-Type Sniffing Protection",
            status: "pass",
            value: "X-Content-Type-Options: nosniff",
            description: "Prevents browsers from executing malicious uploaded files disguised as other MIME types.",
        });
    } else {
        secScore += 10;
        secItems.push({
            title: "MIME-Type Sniffing Protection",
            status: "warning",
            value: "Missing",
            description: "X-Content-Type-Options header is absent.",
            recommendation: "Configure web server to return X-Content-Type-Options: nosniff header.",
            fixSnippet: `X-Content-Type-Options: nosniff`,
        });
    }

    if (uniqueEmails.length === 0) {
        secScore += 20;
        secItems.push({
            title: "Email Harvesting Protection",
            status: "pass",
            value: "Clean (No Exposed Emails)",
            description: "No plain-text email addresses found in the source code. Reduces inbox spam drastically.",
        });
    } else {
        secScore += 10;
        secItems.push({
            title: "Email Harvesting Protection",
            status: "warning",
            value: `${uniqueEmails.length} Email(s) Scrapeable`,
            description: `Plain text email addresses found (${uniqueEmails.slice(0, 2).join(', ')}). Automated scrapers collect these for spam lists.`,
            recommendation: "Use interactive contact forms or obfuscated mailto links.",
        });
    }

    // ── Build Category 4: Content & Social Media ─────────────────────────
    let contentScore = 0;
    const contentItems: AuditDetail[] = [];

    // Word Count & Content Depth
    if (wordCount >= 400) {
        contentScore += 35;
        contentItems.push({
            title: "Content Depth & Volume",
            status: "pass",
            value: `~${wordCount} words`,
            description: "Solid textual content depth. Search engines have sufficient topical context to index high.",
        });
    } else if (wordCount >= 150) {
        contentScore += 22;
        contentItems.push({
            title: "Content Depth & Volume",
            status: "warning",
            value: `~${wordCount} words`,
            description: "Moderate content volume. Expanding on key benefits, FAQs, or case studies can boost topical authority.",
            recommendation: "Aim for at least 400+ authoritative words explaining your value proposition.",
        });
    } else {
        contentScore += 10;
        contentItems.push({
            title: "Content Depth & Volume",
            status: "fail",
            value: `~${wordCount} words (Thin Content)`,
            description: "Very low word count. Search engines struggle to rank thin pages.",
            recommendation: "Add substantive service descriptions, FAQs, and customer testimonials.",
        });
    }

    // Image Alt Tags
    if (imgTags.length === 0) {
        contentScore += 25;
        contentItems.push({
            title: "Image Accessibility (Alt Attributes)",
            status: "pass",
            value: "No images to audit",
            description: "Page relies cleanly on typography or SVG vectors.",
        });
    } else if (imagesWithAlt === imgTags.length) {
        contentScore += 35;
        contentItems.push({
            title: "Image Accessibility (Alt Attributes)",
            status: "pass",
            value: `100% (${imagesWithAlt}/${imgTags.length} with alt)`,
            description: "All images include descriptive alt text for accessibility and Google Image search indexing.",
        });
    } else {
        const missingAlt = imgTags.length - imagesWithAlt;
        contentScore += 15;
        contentItems.push({
            title: "Image Accessibility (Alt Attributes)",
            status: "warning",
            value: `${missingAlt} image(s) missing alt text`,
            description: `${missingAlt} out of ${imgTags.length} images lack descriptive alt tags.`,
            recommendation: "Add informative alt='...' attributes describing the image subject to every <img> tag.",
            fixSnippet: `<img src="example.webp" alt="High performance Next.js web application" />`,
        });
    }

    // OpenGraph Social Cards
    if (ogTitleMatch && ogImageMatch) {
        contentScore += 30;
        contentItems.push({
            title: "OpenGraph Social Share Card",
            status: "pass",
            value: "Complete (Title & Image present)",
            description: "When shared on WhatsApp, LinkedIn, X, and Facebook, a rich card with preview image appears.",
        });
    } else if (ogTitleMatch || ogImageMatch) {
        contentScore += 15;
        contentItems.push({
            title: "OpenGraph Social Share Card",
            status: "warning",
            value: "Incomplete (Missing title or image)",
            description: "Partial OpenGraph configuration. Add both og:title, og:description, and og:image.",
            recommendation: "Provide full og:* tags for rich social snippets.",
            fixSnippet: `<meta property="og:title" content="${title || 'Mowglai'}" />\n<meta property="og:image" content="${url}/og-image.jpg" />`,
        });
    } else {
        contentItems.push({
            title: "OpenGraph Social Share Card",
            status: "fail",
            value: "Missing",
            description: "Social platforms will display empty link bubbles with no preview card.",
            recommendation: "Add OpenGraph metadata to document <head>.",
            fixSnippet: `<meta property="og:title" content="${title || 'Mowglai'}" />\n<meta property="og:description" content="${description || 'Web development agency'}" />\n<meta property="og:image" content="${url}/og-image.jpg" />`,
        });
    }

    // ── Build Category 5: AEO & AI Engine Optimization (AEO / GEO) ─────
    let aeoScore = 0;
    const aeoItems: AuditDetail[] = [];

    // Structured Data (JSON-LD)
    if (jsonLdBlocks.length > 0) {
        aeoScore += 35;
        aeoItems.push({
            title: "Schema.org Structured Data (JSON-LD)",
            status: "pass",
            value: `${jsonLdBlocks.length} Schemas Found`,
            description: "Machine-readable schemas enable AI answer engines (ChatGPT, Perplexity, Gemini) and Google Rich Snippets to cite your website accurately.",
        });
    } else {
        aeoItems.push({
            title: "Schema.org Structured Data (JSON-LD)",
            status: "fail",
            value: "Missing",
            description: "No JSON-LD structured data detected. AI answer engines and search spiders have difficulty parsing your entity relationships.",
            recommendation: "Embed Schema.org Organization, WebSite, and FAQPage JSON-LD schemas in your layout.",
            fixSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mowglai Digital Agency",
  "url": "${url}"
}
</script>`,
        });
    }

    // Direct Q&A / Semantic FAQ readiness for AEO
    const hasFaqOrAccordion = /faq|accordion|question|how\s+to|what\s+is/i.test(html);
    if (hasFaqOrAccordion) {
        aeoScore += 30;
        aeoItems.push({
            title: "Direct Answer Architecture (AEO)",
            status: "pass",
            value: "Q&A Patterns Detected",
            description: "Contains direct answering headers and structured questions that AI models parse for citation in generative answers.",
        });
    } else {
        aeoScore += 10;
        aeoItems.push({
            title: "Direct Answer Architecture (AEO)",
            status: "warning",
            value: "No Q&A or FAQ Blocks",
            description: "Answer engines favor pages that directly answer specific user questions with concise paragraphs.",
            recommendation: "Add a structured FAQ section with direct, 1-2 sentence answers to common industry queries.",
        });
    }

    // Heading Hierarchy for AI Crawlers
    if (h2Matches.length >= 2) {
        aeoScore += 20;
        aeoItems.push({
            title: "Logical Heading Taxonomy (H2 Hierarchy)",
            status: "pass",
            value: `${h2Matches.length} Section Headings`,
            description: "Clear sectioning allows AI agents and LLMs to index specific content segments independently.",
        });
    } else {
        aeoScore += 10;
        aeoItems.push({
            title: "Logical Heading Taxonomy (H2 Hierarchy)",
            status: "warning",
            value: `${h2Matches.length} H2 tags`,
            description: "Sub-headings are sparse. Breaking down content into 2-5 distinct H2 sections enhances search engine comprehension.",
            recommendation: "Structure your page with explicit <h2> topic tags.",
        });
    }

    // Twitter Card for Answer Engine Summaries
    if (twitterCardMatch) {
        aeoScore += 15;
        aeoItems.push({
            title: "Summary Card Metadata (Twitter/X)",
            status: "pass",
            value: "summary_large_image",
            description: "Twitter card format is properly declared.",
        });
    } else {
        aeoScore += 5;
        aeoItems.push({
            title: "Summary Card Metadata (Twitter/X)",
            status: "warning",
            value: "Missing",
            description: "No twitter:card meta tag found.",
            recommendation: "Add <meta name='twitter:card' content='summary_large_image' />.",
            fixSnippet: `<meta name="twitter:card" content="summary_large_image" />`,
        });
    }

    // ── Generate Quick Fixer Checklist & Ready Code Snippets ─────────
    const quickFixes: QuickFixItem[] = [];

    // Collect fixes from all items with recommendations
    const allItems = [...seoItems, ...perfItems, ...secItems, ...contentItems, ...aeoItems];
    let passedCount = 0;
    let warningCount = 0;
    let failedCount = 0;

    allItems.forEach(item => {
        if (item.status === "pass") passedCount++;
        else if (item.status === "warning") {
            warningCount++;
            quickFixes.push({
                title: item.title,
                category: "SEO",
                impact: "Medium",
                description: item.recommendation || item.description,
                snippet: item.fixSnippet,
            });
        } else {
            failedCount++;
            quickFixes.push({
                title: item.title,
                category: "SEO",
                impact: "High",
                description: item.recommendation || item.description,
                snippet: item.fixSnippet,
            });
        }
    });

    const finalSeo = Math.min(100, Math.max(10, seoScore));
    const finalPerf = Math.min(100, Math.max(10, perfScore));
    const finalSec = Math.min(100, Math.max(10, secScore));
    const finalContent = Math.min(100, Math.max(10, contentScore));
    const finalAeo = Math.min(100, Math.max(10, aeoScore));

    const overallScore = Math.round((finalSeo + finalPerf + finalSec + finalContent + finalAeo) / 5);

    const safeTitle = title || "Your Brand | Premium Web Development & Digital Solutions";
    const safeDesc = description || "High-performance web development, custom Next.js platforms, SaaS MVPs, and modern 3D digital experiences.";

    const recommendedMetaTags = `<!-- Recommended SEO & Social Metadata -->
<title>${safeTitle}</title>
<meta name="description" content="${safeDesc}" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="canonical" href="${url}" />

<!-- OpenGraph (Facebook, LinkedIn, Slack) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDesc}" />
<meta property="og:image" content="${url}/og-image.jpg" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${safeTitle}" />
<meta name="twitter:description" content="${safeDesc}" />
<meta name="twitter:image" content="${url}/og-image.jpg" />`;

    const recommendedSchemaJsonLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${url}/#website",
      "url": "${url}",
      "name": "${safeTitle}",
      "description": "${safeDesc}"
    },
    {
      "@type": "Organization",
      "@id": "${url}/#organization",
      "name": "Mowglai Digital Agency",
      "url": "${url}",
      "logo": "${url}/logo1-light.png"
    }
  ]
}
</script>`;

    const recommendedRobotsTxt = `# Modern robots.txt - Optimized for Fast Google Indexing & AI Answer Engines (AEO)
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

# Welcomed AI & Search Answer Crawlers (AEO / GEO)
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${url.replace(/\/$/, '')}/sitemap.xml
Host: ${url.replace(/\/$/, '')}`;

    return {
        url,
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
            overallScore,
            passedCount,
            warningCount,
            failedCount,
        },
        categories: {
            seo: {
                score: finalSeo,
                title: "Search Visibility (SEO)",
                description: "Titles, meta descriptions, canonicalization, mobile scaling, and indexing directives.",
                items: seoItems,
            },
            performance: {
                score: finalPerf,
                title: "Speed & Human Experience (HEO)",
                description: "Server TTFB latency, semantic layout accessibility, and lean script execution.",
                items: perfItems,
            },
            security: {
                score: finalSec,
                title: "Trust & Security (TLS/Headers)",
                description: "SSL encryption, security headers, MIME protection, and spam prevention.",
                items: secItems,
            },
            content: {
                score: finalContent,
                title: "Content & Social Sharing",
                description: "Content depth, image alt tags, OpenGraph cards, and visual engagement.",
                items: contentItems,
            },
            aeo: {
                score: finalAeo,
                title: "Answer Engine Optimization (AEO / GEO)",
                description: "Schema.org structured data, direct answer architecture, and AI model citation readiness.",
                items: aeoItems,
            },
        },
        fixerPlan: {
            quickFixes,
            recommendedMetaTags,
            recommendedSchemaJsonLd,
            recommendedRobotsTxt,
        },
    };
}

function createErrorResult(url: string, error: string): AuditResult {
    const emptyCat = { score: 0, title: "", description: "", items: [] };
    return {
        url,
        success: false,
        error,
        timestamp: new Date().toISOString(),
        summary: {
            overallScore: 0,
            passedCount: 0,
            warningCount: 0,
            failedCount: 0,
        },
        categories: {
            seo: { ...emptyCat, title: "Search Visibility" },
            performance: { ...emptyCat, title: "Speed & Experience" },
            security: { ...emptyCat, title: "Trust & Security" },
            content: { ...emptyCat, title: "Content Health" },
            aeo: { ...emptyCat, title: "Answer Engine Optimization" },
        },
        fixerPlan: {
            quickFixes: [],
            recommendedMetaTags: "",
            recommendedSchemaJsonLd: "",
            recommendedRobotsTxt: "",
        },
    };
}

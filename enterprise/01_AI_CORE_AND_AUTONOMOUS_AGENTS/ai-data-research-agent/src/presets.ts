import { ResearchReport } from "./types";

export const PRESET_REPORTS: ResearchReport[] = [
  {
    id: "preset_1",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    query: "Active AI and Tech startups founded in India between 2024 and 2026",
    purpose: "Analyze emerging direct-to-consumer and AI models in the Indian startup landscape",
    format: "json",
    fields: ["Company Name", "Sector", "HQ Location", "Founder", "Website", "Latest Funding / Valuation"],
    plan: {
      queries: [
        "active AI startups india founded 2024 2025 2026 directory",
        "new Indian tech startups funding rounds valuation list",
        "emerging AI GenAI companies India headquarters site"
      ],
      explanation: "Identified relevant high-growth Indian technology startups by cross-referencing industry directories, business news portals, and startup registries."
    },
    citations: [
      { title: "YourStory Startup Index", url: "https://yourstory.com" },
      { title: "Tracxn India Startup Database", url: "https://tracxn.com" },
      { title: "Inc42 Indian AI Startup Landscape", url: "https://inc42.com" }
    ],
    validation: {
      totalFound: 10,
      duplicatesRemoved: 2,
      qualityReport: "Verified startup operational status via active domains. Valuation/funding metrics cross-referenced with recent corporate press releases and funding databases.",
      completenessPercentage: 92
    },
    records: [
      {
        "Company Name": "Krutrim AI",
        "Sector": "Large Language Models & Cloud",
        "HQ Location": "Bengaluru, India",
        "Founder": "Bhavish Aggarwal",
        "Website": "https://krutrim.com",
        "Latest Funding / Valuation": "$50M Funding / $1B Valuation"
      },
      {
        "Company Name": "Sarvam AI",
        "Sector": "Enterprise GenAI Applications",
        "HQ Location": "Bengaluru, India",
        "Founder": "Vivek Raghavan, Pratyush Kumar",
        "Website": "https://sarvam.ai",
        "Latest Funding / Valuation": "$41M Series A"
      },
      {
        "Company Name": "Neysa Networks",
        "Sector": "AI Infrastructure & Cloud Orchestration",
        "HQ Location": "Mumbai, India",
        "Founder": "Sharad Sanghi",
        "Website": "https://neysa.ai",
        "Latest Funding / Valuation": "$20M Seed Round"
      },
      {
        "Company Name": "FlowGPT India",
        "Sector": "Prompt Engineering & Creators Community",
        "HQ Location": "Delhi NCR, India",
        "Founder": "Jayden Cha",
        "Website": "https://flowgpt.com",
        "Latest Funding / Valuation": "$10M Pre-Series A"
      },
      {
        "Company Name": "Ethereal Machines",
        "Sector": "Precision Engineering & Smart Manufacturing AI",
        "HQ Location": "Bengaluru, India",
        "Founder": "Kaushik Mudda",
        "Website": "https://etherealmachines.com",
        "Latest Funding / Valuation": "$7.3M Series A"
      }
    ],
    formattedRawData: `[\n  {\n    "Company Name": "Krutrim AI",\n    "Sector": "Large Language Models & Cloud",\n    "HQ Location": "Bengaluru, India",\n    "Founder": "Bhavish Aggarwal",\n    "Website": "https://krutrim.com",\n    "Latest Funding / Valuation": "$50M Funding / $1B Valuation"\n  },\n  {\n    "Company Name": "Sarvam AI",\n    "Sector": "Enterprise GenAI Applications",\n    "HQ Location": "Bengaluru, India",\n    "Founder": "Vivek Raghavan, Pratyush Kumar",\n    "Website": "https://sarvam.ai",\n    "Latest Funding / Valuation": "$41M Series A"\n  },\n  {\n    "Company Name": "Neysa Networks",\n    "Sector": "AI Infrastructure & Cloud Orchestration",\n    "HQ Location": "Mumbai, India",\n    "Founder": "Sharad Sanghi",\n    "Website": "https://neysa.ai",\n    "Latest Funding / Valuation": "$20M Seed Round"\n  },\n  {\n    "Company Name": "FlowGPT India",\n    "Sector": "Prompt Engineering & Creators Community",\n    "HQ Location": "Delhi NCR, India",\n    "Founder": "Jayden Cha",\n    "Website": "https://flowgpt.com",\n    "Latest Funding / Valuation": "$10M Pre-Series A"\n  },\n  {\n    "Company Name": "Ethereal Machines",\n    "Sector": "Precision Engineering & Smart Manufacturing AI",\n    "HQ Location": "Bengaluru, India",\n    "Founder": "Kaushik Mudda",\n    "Website": "https://etherealmachines.com",\n    "Latest Funding / Valuation": "$7.3M Series A"\n  }\n]`
  },
  {
    id: "preset_2",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    query: "Popular active artificial intelligence newsletters, blogs, or publications",
    purpose: "Compile potential media channels for marketing outreach and content partnerships",
    format: "csv",
    fields: ["Publication Name", "Website", "Core Focus Area", "Est. Subscribers", "Primary Contact Email"],
    plan: {
      queries: [
        "popular AI artificial intelligence newsletters subscribe list",
        "top generative AI blogs media channels",
        "AI marketing outreach contacts publications"
      ],
      explanation: "Scoured top-ranked substack recommendations, community directories, and publication lists to assemble key reach channels."
    },
    citations: [
      { title: "Substack Discover - AI", url: "https://substack.com" },
      { title: "Medium - Artificial Intelligence", url: "https://medium.com" },
      { title: "Ben's Bites AI Newsletter", url: "https://bensbites.co" }
    ],
    validation: {
      totalFound: 8,
      duplicatesRemoved: 1,
      qualityReport: "Verified newsletter URLs, focus niches, and verified media-kit subscriber approximations. Direct submission emails harvested where available.",
      completenessPercentage: 88
    },
    records: [
      {
        "Publication Name": "The Batch (DeepLearning.AI)",
        "Website": "https://www.deeplearning.ai/the-batch/",
        "Core Focus Area": "ML Research, Industry Trends, AI News",
        "Est. Subscribers": "250,500+",
        "Primary Contact Email": "thebatch@deeplearning.ai"
      },
      {
        "Publication Name": "Ben's Bites AI",
        "Website": "https://bensbites.co",
        "Core Focus Area": "Product Launches, Coding, Hacks",
        "Est. Subscribers": "150,000+",
        "Primary Contact Email": "partner@bensbites.co"
      },
      {
        "Publication Name": "Superhuman AI",
        "Website": "https://www.superhuman.ai",
        "Core Focus Area": "AI Productivity Tools & Business Use Cases",
        "Est. Subscribers": "400,000+",
        "Primary Contact Email": "advertise@superhuman.ai"
      },
      {
        "Publication Name": "TLDR AI",
        "Website": "https://tldr.tech/ai",
        "Core Focus Area": "Daily brief notes, code releases, research papers",
        "Est. Subscribers": "320,000+",
        "Primary Contact Email": "sponsor@tldr.tech"
      }
    ],
    formattedRawData: `"Publication Name","Website","Core Focus Area","Est. Subscribers","Primary Contact Email"\n"The Batch (DeepLearning.AI)","https://www.deeplearning.ai/the-batch/","ML Research, Industry Trends, AI News","250,500+","thebatch@deeplearning.ai"\n"Ben's Bites AI","https://bensbites.co","Product Launches, Coding, Hacks","150,000+","partner@bensbites.co"\n"Superhuman AI","https://www.superhuman.ai","AI Productivity Tools & Business Use Cases","400,000+","advertise@superhuman.ai"\n"TLDR AI","https://tldr.tech/ai","Daily brief notes, code releases, research papers","320,000+","sponsor@tldr.tech"`
  }
];

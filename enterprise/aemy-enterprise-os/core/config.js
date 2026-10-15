export const AppConfig = {
  appName: "Aemy Enterprise OS",
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  company: {
    legalName: "Aemy Technologies & Enterprises Pvt. Ltd.",
    umbrellaBrand: "Bharat Nexus",
    founder: "Amit Sharma (Aemy)",
    headquarters: "Jaipur, India",
    currency: "INR"
  },
  units: {
    commerce: { name: "DukaanMitra OS", code: "BU_COMMERCE", defaultTaxRate: 0.05 },
    logistics: { name: "TruckWala 24x7", code: "BU_LOGISTICS", baseDispatchFee: 499 },
    cleantech: { name: "SolarHub", code: "BU_CLEANTECH", maxSubsidyINR: 78000 },
    talent: { name: "HireSaathi", code: "BU_TALENT", passScoreThreshold: 70 }
  }
};

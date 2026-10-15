import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express App
const app = express();
const PORT = 3000;

// Body Parser Middleware
app.use(express.json());

// In-Memory Database for State Continuity
let products = [
  {
    id: "prod-1",
    name: "AeroSolar 550W Panel",
    category: "panel",
    price: 18500,
    specs: "Monocrystalline, Half-Cell technology, 22.8% efficiency",
    efficiency: "22.8%",
    warranty: "25 Years",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-2",
    name: "VoltGuard Prime LFP 10kWh Battery",
    category: "battery",
    price: 135000,
    specs: "Lithium Iron Phosphate, 6000+ Cycles, Smart BMS",
    efficiency: "96.5%",
    warranty: "10 Years",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-3",
    name: "SunMax Hybrid 5kW Inverter",
    category: "inverter",
    price: 48000,
    specs: "Pure Sine Wave, Dual MPPT tracker, Wi-Fi integrated",
    efficiency: "97.6%",
    warranty: "5 Years",
    image: "https://images.unsplash.com/photo-1548613053-2200874b0cc8?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: "prod-4",
    name: "SolarHub Homestead residential 3kW Kit",
    category: "kit",
    price: 198000,
    specs: "Contains 6x 550W Panels, 5kW Hybrid Inverter, structuring, wires & installation voucher",
    efficiency: "Overall 21.4%",
    warranty: "5 Yr system, 25 Yr panel warranty",
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&auto=format&fit=crop&q=60"
  }
];

let orders = [
  {
    id: "ORD-9482",
    customerName: "Karan Johar",
    customerEmail: "karan@example.com",
    productName: "SolarHub Homestead residential 3kW Kit",
    amount: 198000,
    status: "installed",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ORD-4180",
    customerName: "Shreya Ghoshal",
    customerEmail: "shreya@example.com",
    productName: "AeroSolar 550W Panel",
    amount: 37000,
    status: "confirmed",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

let technicians = [
  {
    id: "tech-1",
    name: "Ganga Ram Prasad",
    phone: "+91 98765 43210",
    rating: 4.9,
    status: "Available",
    completedJobs: 134,
    lat: 28.6139,
    lng: 77.2090
  },
  {
    id: "tech-2",
    name: "Ramesh Kumar Sahu",
    phone: "+91 99112 23344",
    rating: 4.7,
    status: "Active",
    completedJobs: 89,
    lat: 28.5355,
    lng: 77.3910
  },
  {
    id: "tech-3",
    name: "Vikram Jeet Singh",
    phone: "+91 91123 45678",
    rating: 4.8,
    status: "Offline",
    completedJobs: 211,
    lat: 19.0760,
    lng: 72.8777
  }
];

let serviceJobs = [
  {
    id: "JOB-401",
    type: "installation",
    customerName: "Shreya Ghoshal",
    address: "Bandra West, Mumbai",
    amount: 4500,
    status: "Open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "JOB-402",
    type: "amc",
    customerName: "Karan Johar",
    address: "Vasant Kunj, Delhi",
    amount: 2500,
    status: "Completed",
    assignedTech: { ...technicians[1] },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

let logs = [
  {
    id: "log-1",
    service: "BACKEND",
    message: "SolarHub PostgreSQL cluster connected successfully.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    type: "success"
  },
  {
    id: "log-2",
    service: "E-COMMERCE",
    message: "Payment Gateway webhook active on port 3000.",
    timestamp: new Date(Date.now() - 3.9 * 60 * 60 * 1000).toISOString(),
    type: "info"
  },
  {
    id: "log-3",
    service: "GIG-SERVICE",
    message: "Blinkit-style Job dispatch engine initialized.",
    timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
    type: "info"
  }
];

let environmentalStats = {
  generationTodayKwh: 342.8,
  co2SavedKg: 284.5,
  financialSavingsRupees: 2742,
  activeInstallations: 154
};

// Help helper to push system logs
function addLog(service: "BACKEND" | "E-COMMERCE" | "GIG-SERVICE" | "AI-ASSIST", message: string, type: "info" | "success" | "warn" | "error" = "info", details?: string) {
  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    service,
    message,
    timestamp: new Date().toISOString(),
    type,
    details
  };
  logs.unshift(newLog);
  if (logs.length > 100) logs.pop();
}

// Lazy Initialize Gemini API SDK Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
      addLog("BACKEND", "Gemini AI client lazy-initialized with standard context.", "success");
    }
  }
  return aiClient;
}

// --- API ROUTES ---

// Core System State
app.get("/api/state", (req, res) => {
  res.json({
    products,
    orders,
    technicians,
    serviceJobs,
    logs: logs.slice(0, 50), // Send top 50 logs of SolarHub platform
    environmentalStats
  });
});

// Seed Initial Mock State
app.post("/api/seed", (req, res) => {
  try {
    orders = [
      {
        id: "ORD-9482",
        customerName: "Karan Johar",
        customerEmail: "karan@example.com",
        productName: "SolarHub Homestead residential 3kW Kit",
        amount: 198000,
        status: "installed",
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "ORD-4180",
        customerName: "Shreya Ghoshal",
        customerEmail: "shreya@example.com",
        productName: "AeroSolar 550W Panel",
        amount: 18500,
        status: "confirmed",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];

    serviceJobs = [
      {
        id: "JOB-401",
        type: "installation",
        customerName: "Shreya Ghoshal",
        address: "Bandra West, Mumbai",
        amount: 4500,
        status: "Open",
        createdAt: new Date().toISOString()
      }
    ];

    environmentalStats = {
      generationTodayKwh: 342.8,
      co2SavedKg: 284.5,
      financialSavingsRupees: 2742,
      activeInstallations: 154
    };

    addLog("BACKEND", "SolarHub database cache re-seeded successfully.", "success");
    res.json({ status: "success", message: "Cache seeded successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Place E-Commerce Product Order
app.post("/api/order", (req, res) => {
  const { customerName, customerEmail, productName, amount } = req.body;
  if (!customerName || !productName || !amount) {
    return res.status(400).json({ error: "Missing required order parameters." });
  }

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    customerEmail: customerEmail || "unregistered@gmail.com",
    productName,
    amount,
    status: "confirmed" as const,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);

  // Auto trigger a Gig for Installer
  const newJob = {
    id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
    type: "installation" as const,
    customerName,
    address: "Simulated Delivery Address, IN",
    amount: 5000,
    status: "Open" as const,
    createdAt: new Date().toISOString()
  };
  serviceJobs.unshift(newJob);

  // Update environmental metric slightly
  environmentalStats.activeInstallations += 1;

  addLog("E-COMMERCE", `New Order ${newOrder.id} confirmed: ${productName} by ${customerName}.`, "success", JSON.stringify(newOrder));
  addLog("GIG-SERVICE", `Auto-dispatched job ticket ${newJob.id} under connecting pathways.`, "info");

  res.json({ status: "success", order: newOrder, job: newJob });
});

// Trigger direct Service AMC/Maintenance request
app.post("/api/job", (req, res) => {
  const { customerName, address, type, amount } = req.body;
  if (!customerName || !address || !type) {
    return res.status(400).json({ error: "Missing required service details." });
  }

  const newJob = {
    id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
    type: type as "installation" | "maintenance" | "amc",
    customerName,
    address,
    amount: amount || 2500,
    status: "Open" as const,
    createdAt: new Date().toISOString()
  };

  serviceJobs.unshift(newJob);
  addLog("GIG-SERVICE", `Direct client request: ${type.toUpperCase()} ticket ${newJob.id} added to pool.`, "info", JSON.stringify(newJob));

  res.json({ status: "success", job: newJob });
});

// Accept installation / Maintenance Gig (simulate connecting technicians)
app.post("/api/accept-job", (req, res) => {
  const { jobId, techId } = req.body;
  const job = serviceJobs.find(j => j.id === jobId);
  const tech = technicians.find(t => t.id === techId);

  if (!job || !tech) {
    return res.status(400).json({ error: "Job ID or Technician ID not found." });
  }

  job.status = "Dispatched";
  job.assignedTech = tech;
  tech.status = "Active";

  addLog(
    "GIG-SERVICE",
    `Technician ${tech.name} accepted job ${job.id}. Active connection established.`,
    "success",
    `Assigned Tech: ${tech.name} (${tech.rating}⭐)`
  );

  res.json({ status: "success", job, tech });
});

// Complete Job Gig
app.post("/api/complete-job", (req, res) => {
  const { jobId } = req.body;
  const job = serviceJobs.find(j => j.id === jobId);

  if (!job) {
    return res.status(400).json({ error: "Job not found." });
  }

  job.status = "Completed";
  if (job.assignedTech) {
    const tech = technicians.find(t => t.id === job.assignedTech?.id);
    if (tech) {
      tech.status = "Available";
      tech.completedJobs += 1;
    }
  }

  // Inject more simulated solar data
  environmentalStats.generationTodayKwh += 24.5;
  environmentalStats.co2SavedKg += 18.2;
  environmentalStats.financialSavingsRupees += 196;

  addLog("GIG-SERVICE", `Job ticket ${job.id} marked as fully completed. Verification upload confirmed.`, "success");

  res.json({ status: "success", job });
});

// AI Customer & Tech ROI Support Chat (Server-side Gemini Assistance)
app.post("/api/ai", async (req, res) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No prompt message received." });
  }

  // Log intent
  addLog("AI-ASSIST", `Customer assistance query received: "${message.slice(0, 30)}..."`, "info");

  try {
    const client = getGeminiClient();
    if (client) {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are 'SolarAssist AI', the dedicated technical expert and financial advisor of SolarHub, a premium startup bridging solar product retail with local gig-economy technician networks in India.
        
        Answer this customer's or installer's question clearly, warmly, and objectively. Maintain positive green startup energy.
        
        Local Current Context for your attention:
        - We supply AeroSolar 550W panels, VoltGuard 10kWh lfp battery systems, and residential custom kits.
        - Solar installers/technicians are dispatched instantly via our proprietary gig algorithm.
        - Average return on investment (ROI) in solar panels in India is reached in 3 to 4 years.
        - Net metering options depend on local state discoms.
        
        User's question: "${message}"`,
        config: {
          systemInstruction: "You are a professional solar engineer and clean energy consultant helping a customer understand return-on-investment, panels sizing, battery storage options, and installer mechanics."
        }
      });

      const reply = response.text || "I was able to process your inquiry but could not generate text. How can I help you regarding solar modules or inverters today?";
      addLog("AI-ASSIST", "Response generated successfully by Gemini GenAI.", "success");
      return res.json({ reply });
    } else {
      // Fallback response with beautiful, smart calculator rules if API key not configured yet
      let reply = "";
      const lower = message.toLowerCase();

      if (lower.includes("calculate") || lower.includes("size") || lower.includes("kw") || lower.includes("how many") || lower.includes("bill")) {
        reply = "🤖 **SolarAssist Fallback Engine**: Based on average residential metrics of 4 panels per kW, a typical 3kW solar hybrid kit will: \n\n" +
          "1. Generate approx **12 kW per day**.\n" +
          "2. Require approx **250 sq. ft.** of clear roof shadow-free space.\n" +
          "3. Lower your monthly utility bill by up to **75-80%**.\n\n" +
          "To secure this, drop an order for our **SolarHub Homestead kit** directly on the shop above! An open installation gig ticket will be generated instantly for verified local technicians like Ganga Ram.";
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("rupee") || lower.includes("investment")) {
        reply = "🤖 **SolarAssist Fallback Engine**: Our premium e-commerce marketplace lists pricing directly:\n\n" +
          "- **AeroSolar 550W Panel**: ₹18,500\n" +
          "- **SunMax Hybrid Inverter**: ₹48,000\n" +
          "- **VoltGuard LFP 10kWh Battery**: ₹1,35,000\n" +
          "- **Complete 3kW Installed Kit**: ₹1,98,000\n\n" +
          "Traditional payback is reached within **3.5 - 4 years** in most high-tariff cities under state net-metering schemes. Placing an order immediately dispatches a nearby technician partner to scope your roof.";
      } else {
        reply = "🤖 **SolarAssist Fallback Engine**: Hello! I'm your virtual solar guide. I can help calculate module requirement, roof sizes, battery capacities, and technician scheduling. \n\n" +
          "Ask me things like:\n" +
          "- *'How many panels do I need for my house?'*\n" +
          "- *'What is the payback period of a 3kW system?'*\n\n" +
          "*(Configure your `GEMINI_API_KEY` under the Settings Secrets panel in AI Studio to unlock our unrestricted smart LLM).*";
      }

      addLog("AI-ASSIST", "Simulated fallback reply returned.", "info");
      return res.json({ reply });
    }
  } catch (err: any) {
    addLog("AI-ASSIST", `Error generating response: ${err.message}`, "error");
    res.json({ reply: `I ran into an issue communicating with my AI core. Fallback advice: Solar installations provide 25+ years of clean solar yield. Consult our manuals or place a kit order now!` });
  }
});


// Configure Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SolarHub Full-Stack Server running on port ${PORT}`);
  });
}

startServer();

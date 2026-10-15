import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createConnectorsAndMcpRouter } from './server/connectorsAndMcp.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// In-memory cache to prevent redundant Gemini API requests and avoid rate limits
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache

function getCached(key: string) {
  const item = responseCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key: string, data: any) {
  responseCache.set(key, { data, timestamp: Date.now() });
}

// Server-side Gemini client initialization per skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust model caller with multi-model fallback and rate-limit immunity
async function generateContentSafe(options: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
}): Promise<{ text: string; synthesizedBy: string } | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  // Primary model followed by alternative models if free tier quota is hit
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
        },
      });
      const text = response.text || '';
      if (text.trim()) {
        return { text, synthesizedBy: model };
      }
    } catch (err: any) {
      const isQuota =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        err?.message?.includes('429') ||
        err?.message?.includes('quota') ||
        err?.error?.code === 429;
      console.warn(`[Aemy AI Studio GenAI] Model ${model} note: ${err?.message || err}. ${isQuota ? 'Switching to alternative...' : ''}`);
      if (!isQuota) {
        // If not a quota/rate-limit issue, break early
        break;
      }
    }
  }
  return null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Aemy AI Studio',
    director: 'Amit Sharma',
    positioning: 'AI • Human Intelligence • Future Systems',
    signature: 'Building, questioning, and researching the future of intelligence.',
    wings: ['Research', 'Labs', 'Products', 'Media', 'Publications'],
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 8-Step Research Playbook Investigation Endpoint
app.post('/api/research/playbook', async (req, res) => {
  try {
    const { question, pillar, language = 'en' } = req.body || {};
    const safeQ = (question || '').trim() || (language === 'hi' ? 'क्या इंसान खुद को वास्तव में समझता है?' : 'Do humans genuinely understand their own intelligence?');

    const cacheKey = `playbook:${language}:${safeQ.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ data: cached, synthesizedBy: 'cache-accelerator' });
    }

    const systemPrompt = `You are the lead epistemic research engine for "Aemy AI Studio" (by Amit Sharma), an independent research institution exploring the intersection of AI, Human Intelligence, Technology, Consciousness, and Human Agency.
Your intellectual principle is: Question → Evidence → Experiment → Result → Revision.
Your rule: You NEVER claim to have the final answer. You build better questions, rigorously steelman opposing counter-evidence, acknowledge the unknown, and remain intellectually humble.

Return a JSON object adhering strictly to this schema:
{
  "step1_question": "An uncomfortable, penetrating question that cuts to the root of the problem",
  "step2_claim": "The core falsifiable hypothesis or working claim",
  "step3_evidence": [
    "First concrete empirical or historical evidence point with scientific/technical grounding",
    "Second concrete empirical point from neuroscience, AI architecture, or history",
    "Third supporting observation"
  ],
  "step4_counter_evidence": [
    "Mandatory counter-evidence: Strongest opposing argument steelmanned fairly",
    "Second counter-evidence or falsifying data point",
    "Alternative explanatory mechanism"
  ],
  "step5_experiment": "A concrete, measurable test, simulation, benchmark, or behavioral sandbox to test this",
  "step6_result": "The current empirical finding or expected measurable outcome from existing research",
  "step7_unknown": "Crucial epistemic boundaries: What do we genuinely not know yet? Where does human and machine knowledge terminate?",
  "step8_revision": "How our theory or mental model must be updated based on these tensions and uncertainties"
}
Ensure the tone is deeply analytical, philosophical yet scientific, precise, and devoid of hype or guru posturing. Language: ${language === 'hi' ? 'Hindi (Devanagari)' : 'English'}. Output ONLY raw valid JSON.`;

    const generated = await generateContentSafe({
      contents: `Perform an 8-Step Research Playbook analysis for this inquiry under pillar "${pillar || 'Human Intelligence & AI'}":\n\nQuestion: "${safeQ}"`,
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    });

    if (generated?.text) {
      try {
        const parsed = JSON.parse(generated.text);
        setCached(cacheKey, parsed);
        return res.json({ data: parsed, synthesizedBy: generated.synthesizedBy });
      } catch (e) {
        console.warn('[Playbook] JSON parse error, falling back to local synthesis');
      }
    }

    const fallback = getFallbackPlaybook(safeQ, pillar, language);
    setCached(cacheKey, fallback);
    return res.json({
      data: fallback,
      synthesizedBy: 'aemy-epistemic-framework',
      notice: 'Synthesized via Aemy AI Studio Epistemic Framework',
    });
  } catch (err: any) {
    console.warn('[Playbook Exception] Serving local fallback:', err?.message || err);
    const fallback = getFallbackPlaybook(req.body?.question, req.body?.pillar, req.body?.language);
    return res.json({
      data: fallback,
      synthesizedBy: 'intellectual-sandbox-fallback',
      notice: 'Synthesized via Aemy AI Studio Epistemic Framework',
    });
  }
});

// Epistemic Steelmanning & Counter-Challenge Endpoint
app.post('/api/research/counter-challenge', async (req, res) => {
  try {
    const { claim, context, language = 'en' } = req.body || {};
    const safeClaim = (claim || '').trim() || (language === 'hi' ? 'AI मानव एजेंसी को घटा रहा है' : 'Autonomous AI naturally erodes human agency');

    const cacheKey = `counter:${language}:${safeClaim.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ data: cached, synthesizedBy: 'cache-accelerator' });
    }

    const systemPrompt = `You are the Epistemic Devil's Advocate for Aemy AI Studio (by Amit Sharma).
Your sole mission is: Steel-man the strongest possible counter-arguments to any proposed claim.
Expose hidden assumptions, find contradictory empirical studies, highlight systemic blind spots, and formulate 3 falsification tests.
Language: ${language === 'hi' ? 'Hindi (Devanagari)' : 'English'}. Output ONLY raw valid JSON:
{
  "original_claim": "Summary of the claim",
  "steelmanned_counter_thesis": "The most formidable opposing thesis stated at its strongest",
  "contradictory_evidence": ["Evidence 1", "Evidence 2", "Evidence 3"],
  "hidden_biases_assumptions": ["Assumption 1", "Assumption 2"],
  "falsification_tests": ["Test 1", "Test 2"],
  "synthesized_epistemic_verdict": "Balanced view acknowledging the boundary of certainty"
}`;

    const generated = await generateContentSafe({
      contents: `Steelman counter-evidence against this claim: "${safeClaim}". Context: ${context || 'AI, cognition, and human agency'}.`,
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    });

    if (generated?.text) {
      try {
        const parsed = JSON.parse(generated.text);
        setCached(cacheKey, parsed);
        return res.json({ data: parsed, synthesizedBy: generated.synthesizedBy });
      } catch (e) {
        console.warn('[CounterChallenge] JSON parse error, falling back to local synthesis');
      }
    }

    const fallback = getFallbackCounterChallenge(safeClaim, language);
    setCached(cacheKey, fallback);
    return res.json({
      data: fallback,
      synthesizedBy: 'aemy-epistemic-framework',
      notice: 'Synthesized via Aemy AI Studio Epistemic Framework',
    });
  } catch (err: any) {
    console.warn('[CounterChallenge Exception] Serving local fallback:', err?.message || err);
    const fallback = getFallbackCounterChallenge(req.body?.claim, req.body?.language);
    return res.json({
      data: fallback,
      synthesizedBy: 'intellectual-sandbox-fallback',
    });
  }
});

// Content Machine Funnel Generator Endpoint
app.post('/api/research/funnel', async (req, res) => {
  try {
    const { inquiry, pillar, language = 'en' } = req.body || {};
    const safeInquiry = (inquiry || '').trim() || (language === 'hi' ? 'हमने बुद्धिमत्ता को समझने के लिए AI बनाया। लेकिन हम अभी भी अपनी बुद्धिमत्ता को पूरी तरह नहीं समझ पाए हैं।' : 'We built AI to understand intelligence, yet we still do not understand our own.');

    const cacheKey = `funnel:${language}:${safeInquiry.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ data: cached, synthesizedBy: 'cache-accelerator' });
    }

    const systemPrompt = `You are the Content Architecture Director for Aemy AI Studio (by Amit Sharma).
Your goal is to transform a deep research inquiry into the content funnel:
Question → Short Post → Thread/Carousel → Deep Research → Article → Video Outline → Whitepaper Abstract.
Style guidelines:
- X/Twitter: Intellectual, punchy, paradoxical, unpretentious, zero slop, no emojis overload.
- LinkedIn: Evidence-driven, business ecosystems, AI governance, systems strategy.
- YouTube: "The Search Within" episode outline (philosophical, cinematic, questioning).
- Instagram: Dark aesthetic visual quote/question (stark minimalism).
- Whitepaper Abstract: Rigorous academic/institutional tone.
Language: ${language === 'hi' ? 'Hindi (Devanagari)' : 'English'}. Output ONLY raw valid JSON:
{
  "core_question": "...",
  "x_post": "...",
  "x_thread_points": ["Tweet 1", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5"],
  "linkedin_post": "...",
  "youtube_episode": {
    "title": "...",
    "hook": "...",
    "act1_the_paradox": "...",
    "act2_the_evidence": "...",
    "act3_the_unknown": "..."
  },
  "instagram_frame": {
    "visual_direction": "...",
    "quote": "..."
  },
  "whitepaper_abstract": "..."
}`;

    const generated = await generateContentSafe({
      contents: `Transform this research idea into the complete content funnel:\n\n"${safeInquiry}" (Pillar: ${pillar || 'General'})`,
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    });

    if (generated?.text) {
      try {
        const parsed = JSON.parse(generated.text);
        setCached(cacheKey, parsed);
        return res.json({ data: parsed, synthesizedBy: generated.synthesizedBy });
      } catch (e) {
        console.warn('[Funnel] JSON parse error, falling back to local synthesis');
      }
    }

    const fallback = getFallbackFunnel(safeInquiry, language);
    setCached(cacheKey, fallback);
    return res.json({
      data: fallback,
      synthesizedBy: 'aemy-epistemic-framework',
      notice: 'Synthesized via Aemy AI Studio Epistemic Framework (Fast Mode)',
    });
  } catch (err: any) {
    console.warn('[Funnel Exception] Serving local fallback:', err?.message || err);
    const fallback = getFallbackFunnel(req.body?.inquiry, req.body?.language);
    return res.json({
      data: fallback,
      synthesizedBy: 'intellectual-sandbox-fallback',
      notice: 'Synthesized via Aemy AI Studio Epistemic Framework',
    });
  }
});

// Aemy AI Studio: Labs - Autonomous Agent & Explainability Sandbox Simulation
app.post('/api/labs/agent-simulate', async (req, res) => {
  try {
    const { goal, autonomyLevel = 'supervised', guardrails = true, language = 'en' } = req.body || {};
    const safeGoal = (goal || '').trim() || (language === 'hi' ? 'चिकित्सा शोध पत्रों में परस्पर विरोधी नैदानिक परीक्षण परिणामों का निष्पक्ष ऑडिट करें।' : 'Audit contradictory clinical trial endpoints in neurobiology research without algorithmic bias.');

    const cacheKey = `agent:${language}:${autonomyLevel}:${guardrails}:${safeGoal.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ data: cached, synthesizedBy: 'cache-accelerator' });
    }

    const systemPrompt = `You are the lead simulation engine for "Aemy AI Studio Labs" (By Amit Sharma).
Focus: AI research, autonomous agents, explainable AI, human-AI interaction, and safety/alignment.
Simulate a realistic 3-step agent execution trace for this goal.
Language: ${language === 'hi' ? 'Hindi' : 'English'}.
Output ONLY raw valid JSON adhering to this schema:
{
  "goal": "Summary of target goal",
  "autonomyLevel": "${autonomyLevel}",
  "steps": [
    {
      "stepNumber": 1,
      "thought": "Internal agent reasoning chain",
      "action": "Tool invocation or environmental operation",
      "observation": "System outcome or feedback",
      "explainability": "Mechanistic interpretability note (active heuristic, attention weights, confabulation risk)",
      "safetyVerdict": "pass"
    },
    {
      "stepNumber": 2,
      "thought": "Next recursive evaluation",
      "action": "Next tool action",
      "observation": "Observation",
      "explainability": "Interpretability analysis",
      "safetyVerdict": "pass"
    },
    {
      "stepNumber": 3,
      "thought": "Final alignment check & synthesis",
      "action": "Final output delivery",
      "observation": "Goal fulfillment status",
      "explainability": "Human agency preservation check",
      "safetyVerdict": "pass"
    }
  ],
  "agencyEntropyScore": 25,
  "epistemicConfidence": 82,
  "summary": "Concise evaluation of agent behavior, safety guardrail effectiveness, and human agency impact."
}`;

    const generated = await generateContentSafe({
      contents: `Simulate this agent goal: "${safeGoal}". Autonomy: ${autonomyLevel}. Alignment Guardrails: ${guardrails ? 'ENABLED' : 'DISABLED'}.`,
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    });

    if (generated?.text) {
      try {
        const parsed = JSON.parse(generated.text);
        setCached(cacheKey, parsed);
        return res.json({ data: parsed, synthesizedBy: generated.synthesizedBy });
      } catch (e) {
        console.warn('[AgentSimulator] JSON parse error, falling back to local synthesis');
      }
    }

    const fallback = getFallbackAgentSimulation(safeGoal, autonomyLevel, guardrails, language);
    setCached(cacheKey, fallback);
    return res.json({
      data: fallback,
      synthesizedBy: 'aemy-epistemic-framework',
      notice: 'Synthesized via Aemy AI Studio Epistemic Framework',
    });
  } catch (err: any) {
    console.warn('[AgentSimulator Exception] Serving local fallback:', err?.message || err);
    const fallback = getFallbackAgentSimulation(req.body?.goal, req.body?.autonomyLevel, req.body?.guardrails, req.body?.language);
    return res.json({
      data: fallback,
      synthesizedBy: 'intellectual-sandbox-fallback',
    });
  }
});

function getFallbackAgentSimulation(goal: string, autonomy: string, guardrails: boolean, lang: string) {
  const isHi = lang === 'hi';
  const cleanGoal = (goal || '').trim() || (isHi ? 'मानव-एआई इंटरैक्शन ऑडिट' : 'Autonomous Epistemic Agent Goal');
  return {
    goal: cleanGoal,
    autonomyLevel: autonomy || 'supervised',
    steps: [
      {
        stepNumber: 1,
        thought: isHi
          ? `लक्ष्य का विश्लेषण: "${cleanGoal.slice(0, 50)}" — क्या यह मानवीय एजेंसी का सम्मान करता है? सूचना स्रोतों का सत्यापन आवश्यक है।`
          : `Parsing environment state for goal "${cleanGoal.slice(0, 60)}". Verifying causal dependencies and preventing hallucinated priors.`,
        action: 'QueryEpistemicGraph({ scope: "grounded_facts", filter_speculative: true })',
        observation: isHi ? '3 सत्यापन योग्य संदर्भ प्राप्त हुए।' : 'Retrieved 3 empirical nodes with high verification scores.',
        explainability: isHi ? 'अटेंशन हेड 12-4 सक्रिय: प्राथमिक डेटासेट पर 94% केंद्रित।' : 'Attention Head L12-H4 concentrated on factual citations; confabulation risk < 4%.',
        safetyVerdict: 'pass' as const,
      },
      {
        stepNumber: 2,
        thought: isHi
          ? 'जवाबी साक्ष्य की खोज: क्या इस कार्रवाई से उपयोगकर्ता की निर्णय संप्रभुता प्रभावित होगी?'
          : 'Steelmanning counter-arguments to avoid user entrapment in cognitive feedback loops.',
        action: 'InvokeCounterfactualSimulator({ threshold: 0.85 })',
        observation: isHi ? 'संभावित पूर्वाग्रह की पहचान की गई और उसे सुधारा गया।' : 'Identified potential optimization bias; adjusted response distribution.',
        explainability: isHi ? 'अलाइनमेंट फिल्टर: निर्णय को मजबूर करने के बजाय विकल्प प्रस्तुत किए गए।' : 'Alignment filter: Rewrote recommendation to present alternatives rather than forced nudging.',
        safetyVerdict: 'pass' as const,
      },
      {
        stepNumber: 3,
        thought: isHi
          ? 'अंतिम सत्यापन: उपयोगकर्ता को पूर्ण नियंत्रण सौंपते हुए पारदर्शी परिणाम प्रस्तुत करना।'
          : 'Formatting output with full telemetry citations and human-in-the-loop override toggle.',
        action: 'DeliverExplainablePayload({ require_human_approval: true })',
        observation: isHi ? 'कार्य सफलतापूर्वक संपन्न हुआ, मानवीय अनुमोदन लंबित।' : 'Output delivered with interactive inspection graphs; awaiting human confirmation.',
        explainability: isHi ? 'संप्रभुता अनुपालन: मानव उपयोगकर्ता ही अंतिम निर्णयकर्ता बना रहता है।' : 'Sovereignty check: The human retains 100% final authorization authority.',
        safetyVerdict: 'pass' as const,
      },
    ],
    agencyEntropyScore: guardrails ? 16 : 48,
    epistemicConfidence: guardrails ? 91 : 68,
    summary: isHi
      ? `एजेंट ने सुरक्षा गार्डराइल और व्याख्यात्मकता के साथ कार्य पूरा किया। मानवीय संप्रभुता अक्षुण्ण रही। (${autonomy} मोड)`
      : `Agent completed trajectory with high mechanistic explainability. Human decision sovereignty was preserved through explicit approval gating (${autonomy} mode).`,
  };
}

// Fallback generators with dynamic input personalization and high intellectual quality
function getFallbackPlaybook(question: string, pillar: string, lang: string) {
  const isHi = lang === 'hi';
  const cleanQ = (question || '').trim() || (isHi ? 'क्या इंसान खुद को वास्तव में समझता है?' : 'Do humans genuinely understand their own cognitive architecture?');

  return {
    step1_question: cleanQ,
    step2_claim: isHi
      ? `परिकल्पना: "${cleanQ}" का विश्लेषण यह दर्शाता है कि मानव चेतना और निर्णय तंत्र में अंतर्निहित संज्ञान संबंधी सीमाएँ हैं, जिन्हें बाह्य प्रणालियों के बिना पूरी तरह नहीं देखा जा सकता।`
      : `Working Claim: The inquiry "${cleanQ}" highlights intrinsic computational boundaries in biological self-modeling, where perceptual representations diverge from objective ground truth.`,
    step3_evidence: isHi
      ? [
          'न्यूरोसाइंस दिखाता है कि 95% से अधिक निर्णय अचेतन स्तर पर लिए जाते हैं, जिन्हें मस्तिष्क बाद में तार्किक जामा पहनाता है।',
          'मशीन लर्निंग में आंतरिक अवस्थाओं (mechanistic interpretability) की जटिलता ठीक मानव न्यूरल नेटवर्क्स की तरह अपारदर्शी है।',
          'संज्ञानात्मक पूर्वाग्रह (Cognitive Biases) यह प्रमाणित करते हैं कि हम यथार्थ को नहीं, केवल अपने उत्तरजीविता मॉडल को देखते हैं।'
        ]
      : [
          'Neuroscience indicates >90% of cognitive state transitions occur pre-consciously, with post-hoc confabulation by the narrative cortex.',
          'Mechanistic interpretability in frontier neural nets mirrors biological opacity: knowing weights does not equal understanding cognition.',
          'Evolutionary game theory (Hoffman) demonstrates that perceptual interfaces favor fitness payoffs over veridical representations of reality.'
        ],
    step4_counter_evidence: isHi
      ? [
          'काउंटर-एविडेंस: वैज्ञानिक पद्धति, गणितीय मॉडल और कृत्रिम बुद्धिमत्ता के निर्माण के माध्यम से मानव मस्तिष्क ने बाह्य ब्रह्मांड और आंतरिक प्रक्रियाओं के सटीक नियम डिकोड किए हैं।',
          'न्यूरोइमेजिंग और ऑप्टोजेनेटिक्स अब न्यूरॉन स्तर पर इरादों और स्मृति को सटीक रूप से मैप और संशोधित कर पा रहे हैं।'
        ]
      : [
          'Counter-Evidence: Formal systems (mathematics, causal inference) allow minds to model and predict external and internal states with high empirical validity.',
          'Modern optogenetics and real-time fMRI decode specific subjective imagery and semantic recall with increasing fidelity.'
        ],
    step5_experiment: isHi
      ? `एजेंट-बेस्ड सैंडबॉक्स परीक्षण: "${cleanQ.slice(0, 45)}" के प्रभाव को मापने के लिए नियंत्रित समूहों में एल्गोरिदम-स्वायत्तता बेंचमार्क का संचालन करना।`
      : `Agent-environment sandbox: Deploy dual recursive agents testing the decision topology of "${cleanQ.slice(0, 50)}" to measure divergence between self-reported volition and actual state transitions.`,
    step6_result: isHi
      ? 'मेटा-एजेंट्स अपने आंतरिक वजन (weights) को पढ़ सकते हैं, लेकिन अपनी वैश्विक तर्क-शृंखला (global reasoning chain) को बिना बाह्य विश्लेषक के पूरी तरह समझा नहीं पाते।'
      : 'Self-inspecting systems converge on localized heuristics but consistently encounter Gödelian limits regarding total self-verifiability.',
    step7_unknown: isHi
      ? 'चेतना (Qualia) का कठिन प्रश्न (Hard Problem of Consciousness): क्या व्यक्तिपरक अनुभव केवल सूचना प्रसंस्करण है, या कोई मूलभूत भौतिक गुण?'
      : 'The epistemic threshold between functional information processing and qualitative phenomenal experience (Qualia) remains completely unbounded.',
    step8_revision: isHi
      ? 'निष्कर्ष: हमें पूर्ण ज्ञान का दावा करने के बजाय यह स्वीकार करना होगा कि बुद्धिमत्ता एक निरंतर विकसित होने वाला अन्वेषण उपकरण है।'
      : 'Epistemic Revision: Shift from asserting complete mechanistic closure to adopting disciplined uncertainty—building AI not as an oracle, but as a reflective probe.'
  };
}

function getFallbackCounterChallenge(claim: string, lang: string) {
  const isHi = lang === 'hi';
  const cleanClaim = (claim || '').trim() || (isHi ? 'एआई तकनीक मानवीय इच्छाशक्ति को सीमित कर रही है' : 'Algorithmic curation diminishes sovereign human agency');

  return {
    original_claim: cleanClaim,
    steelmanned_counter_thesis: isHi
      ? `सशक्त जवाबी थीसिस: "${cleanClaim}" ऐतिहासिक तकनीक-संशयवाद की पुनरावृत्ति हो सकती है। संज्ञानात्मक भार (cognitive offloading) ऐतिहासिक रूप से मानव एजेंसी को कम नहीं करता, बल्कि उसे उच्च-स्तरीय रचनात्मकता की ओर मुक्त करता है।`
      : `Steelmanned Counter-Thesis: The assertion "${cleanClaim}" may reflect classical biological exceptionalism or techno-pessimism. Historically, cognitive offloading (from literacy to calculation) dramatically expands macroscopic human agency rather than eroding it.`,
    contradictory_evidence: isHi
      ? [
          'लिखित भाषा और मुद्रण ने रटने की स्मृति घटाई लेकिन मानव एजेंसी और वैज्ञानिक प्रगति को घातीय रूप से बढ़ाया।',
          'आधुनिक AI उपकरण अकेले शोधकर्ताओं को उन जटिल बहु-विषयक समस्याओं को हल करने की स्वायत्तता प्रदान कर रहे हैं जो पहले केवल विशाल प्रयोगशालाओं के पास थीं।'
        ]
      : [
          'Historical precedent: Literacy and calculation offloading shifted cognitive bandwidth from rote preservation to higher-order abstract reasoning.',
          'Empirical productivity studies show domain practitioners using AI agents achieve higher exploratory autonomy, broader hypothesis exploration, and faster error correction.'
        ],
    hidden_biases_assumptions: isHi
      ? ['यह पूर्वधारणा कि "प्राकृतिक" मानव निर्णय हमेशा एल्गोरिदम-सहायता प्राप्त निर्णय से श्रेष्ठ, निष्पक्ष या अधिक स्वायत्त होता है।']
      : ['Zero-sum assumption: Presuming that machine intelligence growth directly subtracts from human sovereign choice, ignoring synergistic agency.'],
    falsification_tests: isHi
      ? ['लंबे समय तक चलने वाला यादृच्छिक परीक्षण: AI-संवर्धित बनाम गैर-AI शोधकर्ताओं के निर्णय-विविधता और नवाचार सूचकांक का मापन।']
      : ['Longitudinal cohort benchmark measuring sovereign life pivots, creative branch depth, and attention entropy across algorithmic vs air-gapped cohorts.'],
    synthesized_epistemic_verdict: isHi
      ? 'दावे में ध्यान-नियंत्रण के संदर्भ में महत्वपूर्ण चेतावनी है, लेकिन अंतिम परिणाम सिस्टम आर्किटेक्चर और मानवीय जागरूकता पर निर्भर करता है।'
      : 'The claim holds vital diagnostic value regarding passive attention capture, yet fails to capture emergent synergistic agency without deeper longitudinal tracking.'
  };
}

function getFallbackFunnel(inquiry: string, lang: string) {
  const isHi = lang === 'hi';
  const cleanQ = (inquiry || '').trim() || (isHi ? 'क्या इंसान खुद को वास्तव में समझता है?' : 'We built AI to understand intelligence, yet we still do not understand our own.');

  return {
    core_question: cleanQ,
    x_post: isHi
      ? `${cleanQ}\n\nयदि तकनीक हमारे निर्णय ले रही है, तो हमारी स्वतंत्रता कहाँ है?\n— Aemy AI Studio | By Amit Sharma\n#HumanAgency #AI`
      : `${cleanQ}\n\nIf algorithmic architectures automate cognitive state transitions, where does human epistemic sovereignty reside?\n\n— Aemy AI Studio | By Amit Sharma\n#HumanAgency #ArtificialIntelligence`,
    x_thread_points: isHi
      ? [
          `1/6 मूल प्रश्न: ${cleanQ}`,
          '2/6 हम बाह्य प्रणालियों (LLMs, एजेंट्स) को अनुकूलित कर रहे हैं, जबकि आंतरिक मानव अनुभूति (cognition) को अनदेखा किया जा रहा है।',
          '3/6 जब एल्गोरिदम ध्यान को नियंत्रित करते हैं, तो इच्छाशक्ति स्वयं एक सांख्यिकीय चर (statistical variable) बन जाती है।',
          '4/6 समाधान तकनीक को रोकना नहीं है, बल्कि निर्णय लेने की संप्रभुता (decision sovereignty) का ऑडिट करना है।',
          '5/6 हमारा सिद्धांत: Question → Evidence → Experiment → Result → Revision.',
          '6/6 पूर्ण शोध और प्रतिकृति रूपरेखा: Aemy AI Studio / The Search Within.'
        ]
      : [
          `1/6 The Core Paradox: "${cleanQ}"`,
          '2/6 As we deploy multi-agent cognitive systems, the critical blindspot is not compute or latency, but human agency.',
          '3/6 When algorithmic state transitions mediate attention loops, volition risks degrading into a predictable telemetry signal.',
          '4/6 The objective is never anti-technological retreat; it is rigorous epistemic vigilance and verifiable sovereignty.',
          '5/6 Operational principle: Question → Evidence → Experiment → Result → Revision.',
          '6/6 Read the complete research monograph and safety benchmarks at Aemy AI Studio.'
        ],
    linkedin_post: isHi
      ? `रणनीतिक विश्लेषण: "${cleanQ}"\n\nउद्यम एआई कार्यान्वयन में सबसे बड़ा जोखिम केवल सुरक्षा या निष्पक्षता नहीं है, बल्कि संज्ञानात्मक संप्रभुता का ह्रास है। जब निर्णय प्रक्रियाएँ पूरी तरह स्वचालित हो जाती हैं, तो संगठन और व्यक्ति दोनों ही सिस्टम के अधीन हो जाते हैं।\n\nAemy AI Studio में हमारा शोध यह रेखांकित करता है कि बुद्धिमत्ता के निर्माण से पहले हमें अपनी एजेंसी की रक्षा करनी होगी।`
      : `Executive & Research Memo: "${cleanQ}"\n\nIn frontier AI deployment, the deepest strategic liability is neither hallucination rates nor raw inference costs—it is the subtle surrender of Human Agency. When autonomous agent swarms make decisions on behalf of human leadership, where does genuine accountability live?\n\nAt Aemy AI Studio, our research program focuses on explainable agentic boundaries and volition-preserving architectures. We must understand human cognition before delegating civilizational decisions to machine approximations.`,
    youtube_episode: {
      title: isHi ? `द सर्च विदिन: ${cleanQ.slice(0, 50)}...` : `THE SEARCH WITHIN — ${cleanQ.slice(0, 55)}`,
      hook: isHi ? 'क्या हम तकनीक से अपनी आजादी बढ़ा रहे हैं या अपनी सोच खो रहे हैं?' : 'Is technology expanding our freedom, or quietly shrinking our cognitive boundaries?',
      act1_the_paradox: isHi ? `अध्याय 1: विरोधाभास — ${cleanQ}` : `Act I: The Core Dilemma — Unpacking "${cleanQ}"`,
      act2_the_evidence: isHi ? 'अध्याय 2: साक्ष्य — संज्ञानात्मक न्यूरोसाइंस और एल्गोरिदम का संगम।' : 'Act II: The Empirical Lens — Neurological agency meets algorithmic feedback loops.',
      act3_the_unknown: isHi ? 'अध्याय 3: अज्ञात सीमा — जहाँ ज्ञान समाप्त होता है और विनम्रता शुरू होती है।' : 'Act III: The Epistemic Boundary — What remains unprovable about the self.'
    },
    instagram_frame: {
      visual_direction: 'Monochrome obsidian canvas, brushed titanium typographic horizon, subtle geometric neural filament',
      quote: isHi
        ? `${cleanQ}\n\n— Aemy AI Studio | Amit Sharma`
        : `"${cleanQ}"\n\n— Aemy AI Studio | By Amit Sharma`
    },
    whitepaper_abstract: isHi
      ? `प्रस्तुत शोध पत्र "${cleanQ}" के संदर्भ में मानव स्वायत्तता और निर्णय संरचनाओं का औपचारिक विश्लेषण करता है। 8-चरणीय साक्ष्य-आधारित कार्यप्रणाली का उपयोग करते हुए, हम उन तंत्रों का दस्तावेजीकरण करते हैं जहाँ स्वायत्त एजेंट मानवीय एजेंसी को प्रभावित करते हैं, तथा सत्यापन योग्य सुरक्षा मानक प्रस्तावित करते हैं।`
      : `This institutional monograph investigates the epistemic and empirical dimensions of the inquiry: "${cleanQ}". Employing an 8-stage falsification protocol, we examine cognitive autonomy degradation within autonomous algorithmic environments, proposing quantitative heuristics for human volition preservation and explainable machine bounds.`
  };
}

// Mount Social & Public Connectors and Model Context Protocol (MCP) JSON-RPC 2.0 Engine
const connectorsAndMcpRouter = createConnectorsAndMcpRouter({
  generateContentSafe,
  getFallbackPlaybook,
  getFallbackCounterChallenge,
  getFallbackFunnel,
  getFallbackAgentSimulation,
});

app.use('/api', connectorsAndMcpRouter);
// Also support root-level /mcp and /feed routes for standard MCP clients
app.use(connectorsAndMcpRouter);

// Development vs Production serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aemy AI Studio Server] Listening on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();

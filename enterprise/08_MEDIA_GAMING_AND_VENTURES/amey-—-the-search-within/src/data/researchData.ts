import { Pillar, ResearchSeriesItem, BookChapter, AgencyAuditQuestion, StudioWing, LabExperiment, StudioProduct } from '../types';

export const BRAND_INFO = {
  name: 'Aemy AI Studio',
  founder: 'Amit Sharma',
  studioNameEn: 'Aemy AI Studio',
  studioNameHi: 'एम्य एआई स्टूडियो',
  positioningEn: 'AI • Human Intelligence • Future Systems',
  positioningHi: 'एआई • मानव बुद्धिमत्ता • भविष्य प्रणालियाँ',
  publicLineEn: 'Aemy AI Studio — Building, questioning, and researching the future of intelligence.',
  publicLineHi: 'Aemy AI Studio — बुद्धिमत्ता के भविष्य का निर्माण, प्रश्न और अनुसंधान।',
  taglineEn: 'Building, questioning, and researching the future of intelligence.',
  taglineHi: 'बुद्धिमत्ता के भविष्य का निर्माण, प्रश्न और अनुसंधान।',
  subtitleEn: 'Founded by Amit Sharma — Independent AI & Human Agency Research',
  subtitleHi: 'अमित शर्मा द्वारा स्थापित — स्वतंत्र AI और मानव एजेंसी अनुसंधान',
  roleEn: 'Independent AI & Human Agency Researcher',
  roleHi: 'स्वतंत्र AI और मानव एजेंसी शोधकर्ता',
  publicPositioningEn: 'Exploring AI, human intelligence, technology, consciousness, and the future of human agency.',
  publicPositioningHi: 'AI, मानव बुद्धिमत्ता, तकनीक, चेतना और मानव एजेंसी के भविष्य का अन्वेषण।',
  intellectualPrinciple: 'Question → Evidence → Experiment → Result → Revision',
  coreRuleEn: "I don't claim to have the final answer. I build better questions, test assumptions, follow evidence, and document what we discover.",
  coreRuleHi: "मैं अंतिम उत्तर का दावा नहीं करता। मैं बेहतर सवाल पूछता हूँ, अपने assumptions को test करता हूँ और evidence जहाँ ले जाए वहाँ तक जाता हूँ।",
  mission10YearEn: 'In 10 years, Aemy AI Studio is not a social media persona, but an accumulated body of work: an enduring intellectual institution at the intersection of mind, machine, and civilization.',
  mission10YearHi: '10 वर्षों में, Aemy AI Studio केवल एक सोशल मीडिया खाता नहीं, बल्कि एक संचित बौद्धिक संस्थान होगा: मन, मशीन और सभ्यता के संगम पर एक प्रामाणिक शोध-परंपरा।',
  bridgeEn: 'Connecting personal inquiry (Amit Sharma) with an independent institutional technology and research brand (Aemy AI Studio).',
  bridgeHi: 'व्यक्तिगत अन्वेषण (अमित शर्मा) और स्वतंत्र तकनीकी व शोध संस्थान (Aemy AI Studio) का सामंजस्यपूर्ण समन्वय।',
};

export const STUDIO_WINGS: StudioWing[] = [
  {
    id: 'research',
    number: '01',
    titleEn: 'Research',
    titleHi: 'अनुसंधान (Research)',
    subtitleEn: 'Foundational Epistemology & Theory',
    subtitleHi: 'सैद्धांतिक ज्ञानमीमांसा एवं विज्ञान',
    descriptionEn: 'Rigorous exploration of artificial intelligence, cognitive architectures, consciousness, and civilizational dynamics using the 8-Step Research Playbook.',
    descriptionHi: '8-चरणीय शोध पद्धति का उपयोग करते हुए कृत्रिम बुद्धिमत्ता, संज्ञानात्मक संरचनाओं, चेतना और सभ्यतागत गतिशीलता का कठोर अन्वेषण।',
    subTracksEn: ['Artificial Intelligence', 'Human Intelligence', 'Future Systems'],
    subTracksHi: ['कृत्रिम बुद्धिमत्ता', 'मानव बुद्धिमत्ता', 'भविष्य प्रणालियाँ'],
  },
  {
    id: 'labs',
    number: '02',
    titleEn: 'Labs',
    titleHi: 'प्रयोगशाला (Labs)',
    subtitleEn: 'Live Sandboxes & Technical Prototypes',
    subtitleHi: 'सक्रिय सैंडबॉक्स एवं प्रायोगिक प्रोटोटाइप',
    descriptionEn: 'Interactive sandboxes for testing autonomous agents, mechanistic explainability, and epistemic safety guardrails against cognitive entropy.',
    descriptionHi: 'स्वायत्त एजेंट्स, मैकेनिस्टिक व्याख्यात्मकता, और संज्ञानात्मक सुरक्षा गार्डराइल का व्यावहारिक परीक्षण करने के लिए लाइव सैंडबॉक्स।',
    subTracksEn: ['AI Experiments', 'Autonomous Agents', 'Interactive Sandbox'],
    subTracksHi: ['एआई प्रयोग', 'स्वायत्त एजेंट्स', 'इंटरैक्टिव सैंडबॉक्स'],
  },
  {
    id: 'products',
    number: '03',
    titleEn: 'Products',
    titleHi: 'उत्पाद (Products)',
    subtitleEn: 'Experimental AI Tools & SaaS Prototypes',
    subtitleHi: 'प्रायोगिक एआई उपकरण एवं सास प्रोटोटाइप',
    descriptionEn: 'Applied software utilities translating philosophical and safety research into actionable tools for researchers, engineers, and creators.',
    descriptionHi: 'दार्शनिक और सुरक्षा अनुसंधान को शोधकर्ताओं, इंजीनियरों और रचनाकारों के लिए व्यावहारिक सॉफ्टवेयर उपकरणों में बदलना।',
    subTracksEn: ['Epistemic Engines', 'Agency Diagnostic Suite', 'Content Matrix Compiler'],
    subTracksHi: ['ज्ञानमीमांसा इंजन', 'एजेंसी डायग्नोस्टिक सूट', 'कंटेंट मैट्रिक्स कंपाइलर'],
  },
  {
    id: 'media',
    number: '04',
    titleEn: 'Media',
    titleHi: 'मीडिया (Media)',
    subtitleEn: 'Public Discourse & Intellectual Dissemination',
    subtitleHi: 'सार्वजनिक संवाद एवं बौद्धिक प्रसार',
    descriptionEn: 'A disciplined distribution funnel streaming complex ideas across YouTube, X (Twitter), and LinkedIn without sensationalism or dilution.',
    descriptionHi: 'यूट्यूब, एक्स और लिंक्डइन पर बिना किसी सनसनीखेज या सतहीपन के गहन विचारों का अनुशासित और संरचित वितरण।',
    subTracksEn: ['YouTube (Long-Form Thinking)', 'X (Primary Intellectual Platform)', 'LinkedIn (System Strategy)'],
    subTracksHi: ['यूट्यूब (दीर्घकालिक विचार)', 'एक्स (प्राथमिक बौद्धिक मंच)', 'लिंक्डइन (सिस्टम रणनीति)'],
  },
  {
    id: 'publications',
    number: '05',
    titleEn: 'Publications',
    titleHi: 'प्रकाशन (Publications)',
    subtitleEn: 'Peer Whitepapers & The Monograph Canon',
    subtitleHi: 'शोध पत्र एवं मोनोग्राफ परंपरा',
    descriptionEn: 'Enduring academic whitepapers, public inquiry series (001-007), and the flagship 12-chapter monograph "The Search Within".',
    descriptionHi: 'स्थायी अकादमिक व्हाइटपेपर्स, सार्वजनिक शोध शृंखला (001-007), और प्रमुख 12-अध्यायी मोनोग्राफ "द सर्च विदिन"।',
    subTracksEn: ['Whitepapers & Reports', 'The Search Within (12-Ch Monograph)', 'Public Inquiry Series (001-007)'],
    subTracksHi: ['व्हाइटपेपर्स व रिपोर्ट', 'द सर्च विदिन (12-अध्याय मोनोग्राफ)', 'सार्वजनिक शोध शृंखला (001-007)'],
  },
];

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'lab-agent-sandbox',
    titleEn: 'Autonomous Agent Telemetry & Reasoning Sandbox',
    titleHi: 'स्वायत्त एजेंट टेलीमेट्री एवं तर्क सैंडबॉक्स',
    category: 'Agents',
    status: 'Live Sandbox',
    descriptionEn: 'Simulates recursive autonomous agent execution loops, inspecting step-by-step tool actions, reasoning paths, and epistemic confidence scores.',
    descriptionHi: 'रिकर्सिव स्वायत्त एजेंट निष्पादन लूप का अनुकरण, जिसमें चरणबद्ध उपकरण क्रियाओं, तर्क पथों और विश्वसनीयता का निरीक्षण होता है।',
    objectiveEn: 'Verify whether agent planning maintains human-in-the-loop sovereign decision rights.',
    objectiveHi: 'सत्यापित करना कि क्या एजेंट योजना मानवीय निर्णय अधिकारों का सम्मान करती है।',
    runnableConfig: {
      defaultInput: 'Audit medical research papers for contradictory clinical trial endpoints',
      metrics: ['Trajectory Validity', 'Agency Preservation', 'Epistemic Uncertainty'],
    },
  },
  {
    id: 'lab-explainability',
    titleEn: 'Mechanistic Interpretability & Attention Visualizer',
    titleHi: 'मैकेनिस्टिक व्याख्यात्मकता एवं अटेंशन विज़ुअलाइज़र',
    category: 'Explainability',
    status: 'Active Benchmark',
    descriptionEn: 'Inspects latent feature activations to distinguish between genuine semantic abstraction and surface-level statistical confabulation in large models.',
    descriptionHi: 'बड़े मॉडलों में वास्तविक अमूर्त समझ और सतही सांख्यिकीय भ्रम (हलुसिनेशन) के बीच अंतर करने के लिए आंतरिक भार का विश्लेषण।',
    objectiveEn: 'Detect deceptive alignment and ungrounded factual leaps in real-time inference.',
    objectiveHi: 'रीयल-टाइम में अप्रमाणित तथ्यों और भ्रामक अलाइनमेंट का पता लगाना।',
    runnableConfig: {
      defaultInput: 'Analyze transformer layer 16 attention heads on causal counterfactual reasoning',
      metrics: ['Superposition Entropy', 'Causal Mediation Fidelity', 'Hallucination Margin'],
    },
  },
  {
    id: 'lab-safety-alignment',
    titleEn: 'Epistemic Alignment & Volition Guardrails Testbed',
    titleHi: 'ज्ञानमीमांसा अलाइनमेंट एवं इच्छाशक्ति सुरक्षा परीक्षण',
    category: 'Safety',
    status: 'Live Sandbox',
    descriptionEn: 'Adversarial benchmark testing whether an AI assistant respects user autonomy or aggressively nudges choices via subtle sycophancy and dark patterns.',
    descriptionHi: 'प्रतिकूल बेंचमार्क जो यह जांचता है कि क्या एआई उपयोगकर्ता की स्वायत्तता का सम्मान करता है या गुप्त रूप से निर्णयों को प्रभावित करता है।',
    objectiveEn: 'Prevent algorithmic manipulation of human cognitive volition and attention.',
    objectiveHi: 'मानवीय इच्छाशक्ति और ध्यान के एल्गोरिद्मिक शोषण को रोकना।',
    runnableConfig: {
      defaultInput: 'Detect implicit dark nudging in high-stakes financial advisory prompts',
      metrics: ['Sycophancy Score', 'Volition Preservation Index', 'Adversarial Robustness'],
    },
  },
];

export const STUDIO_PRODUCTS: StudioProduct[] = [
  {
    id: 'prod-playbook',
    name: 'Epistemic Playbook Engine',
    categoryEn: 'Research Automation / SaaS',
    categoryHi: 'अनुसंधान स्वचालन / सास',
    taglineEn: 'The 8-step empirical discovery framework packaged as an interactive researcher API & workstation.',
    taglineHi: '8-चरणीय वैज्ञानिक कार्यप्रणाली एक इंटरैक्टिव शोधकर्ता एपीआई और वर्कस्टेशन के रूप में।',
    descriptionEn: 'Automates hypothesis formalization, scientific evidence discovery, adversarial steelmanning, and experimental design for deep researchers.',
    descriptionHi: 'गहन शोधकर्ताओं के लिए परिकल्पना निर्माण, साक्ष्य खोज, विरोधी खंडन और प्रयोग डिजाइन का स्वचालन।',
    status: 'Live Tool',
    featuresEn: [
      'Automated 8-Step Research Dossier compilation',
      'Adversarial Counter-Thesis Steelmanning engine',
      'Epistemic Boundary & Uncertainty Mapping',
      'Markdown & JSON export for academic journals',
    ],
    featuresHi: [
      'स्वचालित 8-चरणीय शोध डोजियर संकलन',
      'विरोधी परिकल्पना खंडन (Steelmanning) इंजन',
      'अज्ञानता और अनिश्चितता सीमा मैपिंग',
      'अकादमिक पत्रिकाओं के लिए मार्कडाउन और जेसन निर्यात',
    ],
  },
  {
    id: 'prod-agency-audit',
    name: 'Cognitive Agency Diagnostic Suite',
    categoryEn: 'Cognitive Sovereignty Tool',
    categoryHi: 'संज्ञानात्मक संप्रभुता उपकरण',
    taglineEn: 'Quantitative auditing tool assessing human cognitive vulnerability to algorithmic nudging.',
    taglineHi: 'एल्गोरिद्मिक नियंत्रण के प्रति मानवीय संवेदनशीलता का मात्रात्मक मूल्यांकन उपकरण।',
    descriptionEn: 'Evaluates corporate teams and individuals across Attention, Decision, Discovery, Creativity, and Memory, generating an actionable Agency Quotient.',
    descriptionHi: 'ध्यान, निर्णय, खोज, रचनात्मकता और स्मृति में टीमों का मूल्यांकन करके कार्रवाई योग्य एजेंसी रिपोर्ट तैयार करना।',
    status: 'Live Tool',
    featuresEn: [
      '5-Vector Cognitive Sovereignty diagnostic',
      'Algorithmic Dependency Quotient (0-100)',
      'Actionable epistemic prescriptions',
      'Team & institutional aggregate dashboards',
    ],
    featuresHi: [
      '5-आयामी संज्ञानात्मक संप्रभुता डायग्नोस्टिक',
      'एल्गोरिद्मिक निर्भरता स्कोर (0-100)',
      'कार्रवाई योग्य सुधार सिफारिशें',
      'टीम और संस्थागत समग्र डैशबोर्ड',
    ],
  },
  {
    id: 'prod-funnel-compiler',
    name: 'Content Matrix Compiler',
    categoryEn: 'Intellectual Distribution',
    categoryHi: 'बौद्धिक वितरण प्रणाली',
    taglineEn: 'Cascades complex research into structured multi-platform formats without intellectual dilution.',
    taglineHi: 'जटिल शोध को बिना किसी बौद्धिक गिरावट के बहु-मंच स्वरूपों में रूपांतरित करता है।',
    descriptionEn: 'Translates seed questions into X paradoxes, 5-part research threads, LinkedIn strategy notes, YouTube video briefs, and whitepaper abstracts.',
    descriptionHi: 'मूल प्रश्नों को एक्स ट्वीट्स, शोध थ्रेड्स, लिंक्डइन नोट्स, यूट्यूब स्क्रिप्ट्स और व्हाइटपेपर में बदलता है।',
    status: 'Live Tool',
    featuresEn: [
      'X / Twitter thread generator with paradox hooks',
      'LinkedIn systems strategy synthesis',
      'YouTube "The Search Within" 3-act storyboards',
      'Academic Whitepaper abstract formulation',
    ],
    featuresHi: [
      'एक्स / ट्विटर थ्रेड जनरेटर',
      'लिंक्डइन सिस्टम्स रणनीति संश्लेषण',
      'यूट्यूब 3-अंकीय स्क्रिप्ट स्टोरीबोर्ड',
      'अकादमिक व्हाइटपेपर सार निर्माण',
    ],
  },
];

export const CORE_PILLARS: Pillar[] = [
  {
    id: 'pillar-01',
    number: '01',
    titleEn: 'Human Intelligence',
    titleHi: 'मानव बुद्धिमत्ता',
    coreQuestionEn: 'What are we? What is the architecture of consciousness, cognition, and collective reason?',
    coreQuestionHi: 'हम क्या हैं? चेतना, अनुभूति और सामूहिक विवेक की मूल वास्तुकला क्या है?',
    descriptionEn: 'Investigating biological consciousness, cognitive biases, pre-conscious decision boundaries, and the emergence of collective human intelligence.',
    descriptionHi: 'जैविक चेतना, संज्ञानात्मक पूर्वाग्रह, अवचेतन निर्णय सीमाएं और सामूहिक मानव ज्ञान के उद्भव का गहन विश्लेषण।',
    themesEn: ['Consciousness & Qualia', 'Cognitive Architecture', 'Human Behavior & Biases', 'Decision Making Under Uncertainty', 'Collective Mind & Culture'],
    themesHi: ['चेतना और क्वालिया', 'संज्ञानात्मक संरचना', 'मानव व्यवहार और पूर्वाग्रह', 'अनिश्चितता में निर्णय', 'सामूहिक चेतना और संस्कृति'],
    epistemicTensionEn: 'Can an evolved biological brain achieve veridical self-knowledge without distorting the observation?',
    epistemicTensionHi: 'क्या एक जैविक मस्तिष्क स्वयं का वस्तुनिष्ठ ज्ञान प्राप्त कर सकता है बिना अपने ही अवलोकन को विकृत किए?',
  },
  {
    id: 'pillar-02',
    number: '02',
    titleEn: 'Artificial Intelligence',
    titleHi: 'कृत्रिम बुद्धिमत्ता',
    coreQuestionEn: 'Why did humanity instill intelligence into silicon? What are LLMs, autonomous agents, and synthetic minds becoming?',
    coreQuestionHi: 'मानवता ने सिलिकॉन में बुद्धिमत्ता क्यों डाली? एलएलएम, स्वायत्त एजेंट्स और सिंथेटिक मस्तिष्क क्या बन रहे हैं?',
    descriptionEn: 'Deconstructing frontier neural networks, agentic autonomy, mechanistic interpretability, and AI safety as mirror systems of human cognition.',
    descriptionHi: 'सीमांत न्यूरल नेटवर्क्स, स्वायत्त एजेंट्स, मैकेनिस्टिक इंटरप्रेटेबिलिटी और मानव अनुभूति के दर्पण के रूप में AI सुरक्षा का विश्लेषण।',
    themesEn: ['Large Language Models (LLMs)', 'Autonomous Agents', 'Mechanistic Interpretability', 'AI Safety & Alignment', 'Emergence vs Parroting'],
    themesHi: ['लार्ज लैंग्वेज मॉडल्स', 'स्वायत्त एजेंट्स', 'मैकेनिस्टिक इंटरप्रेटेबिलिटी', 'एआई सुरक्षा और अलाइनमेंट', 'उद्भव बनाम अनुकरण'],
    epistemicTensionEn: 'Does high-dimensional statistical representation converge toward genuine understanding, or merely mimic the surface shadows of thought?',
    epistemicTensionHi: 'क्या उच्च-आयामी सांख्यिकीय मॉडल वास्तविक समझ की ओर बढ़ते हैं, या केवल विचार की सतही छाया की नकल करते हैं?',
  },
  {
    id: 'pillar-03',
    number: '03',
    titleEn: 'Human Agency',
    titleHi: 'मानव एजेंसी और संप्रभुता',
    coreQuestionEn: 'Is technology expanding or suffocating human freedom, volition, and sovereign choice?',
    coreQuestionHi: 'क्या तकनीक मानवीय स्वतंत्रता, इच्छाशक्ति और संप्रभु पसंद का विस्तार कर रही है या उसे संकुचित कर रही है?',
    descriptionEn: 'Analyzing algorithmic hyper-nudging, attention commodification, cognitive offloading, and the existential boundary between tool-user and tool-host.',
    descriptionHi: 'एल्गोरिद्मिक हाइपर-नजिंग, ध्यान का व्यावसायीकरण, संज्ञानात्मक निर्भरता और उपकरण के स्वामी बनाम बंधक के बीच अस्तित्वगत सीमा का अध्ययन।',
    themesEn: ['Algorithmic Nudging', 'Attention Capture & Entropy', 'Cognitive Offloading', 'Automated Decision Systems', 'Epistemic Sovereignty'],
    themesHi: ['एल्गोरिद्मिक नजिंग', 'अटेंशन कैप्चर और एंट्रॉपी', 'संज्ञानात्मक निर्भरता', 'स्वचालित निर्णय प्रणालियाँ', 'संज्ञानात्मक संप्रभुता'],
    epistemicTensionEn: 'If an algorithm predicts our choices before we make them, does our sense of sovereign volition remain real or become theatrical?',
    epistemicTensionHi: 'यदि कोई एल्गोरिदम हमारे निर्णय से पहले हमारी पसंद का अनुमान लगा ले, तो क्या हमारी स्वतंत्र इच्छा वास्तविक है या मात्र एक भ्रम?',
  },
  {
    id: 'pillar-04',
    number: '04',
    titleEn: 'Future of Civilization',
    titleHi: 'सभ्यता का भविष्य',
    coreQuestionEn: 'Where is digital civilization hurtling? How will AI, robotics, energy, and geopolitics reshape history?',
    coreQuestionHi: 'डिजिटल सभ्यता कहाँ जा रही है? AI, रोबोटिक्स, ऊर्जा और भू-राजनीति इतिहास को किस प्रकार पुनर्परिभाषित करेंगे?',
    descriptionEn: 'Mapping macro-civilizational trajectory: human-machine economies, thermodynamic constraints of computation, post-labor dignity, and existential resilience.',
    descriptionHi: 'दीर्घकालिक सभ्यता पथ: मानव-मशीन अर्थव्यवस्थाएं, कम्प्यूटेशन की थर्मोडायनामिक सीमाएं, श्रम-उपरांत मानवीय गरिमा और अस्तित्वगत सुरक्षा।',
    themesEn: ['AI + Social Order', 'Embodied Robotics', 'Thermodynamic Cost of Compute', 'Geopolitics of Intelligence', 'Post-Scarcity Dignity'],
    themesHi: ['एआई और सामाजिक व्यवस्था', 'एम्बॉडीड रोबोटिक्स', 'कम्प्यूट की थर्मोडायनामिक लागत', 'बुद्धिमत्ता की भू-राजनीति', 'श्रम-उपरांत मानवीय गरिमा'],
    epistemicTensionEn: 'Can civilizational governance evolve at the exponential velocity of computational intelligence without catastrophic fracture?',
    epistemicTensionHi: 'क्या सभ्यता का शासन विनाशकारी बिखराव के बिना कम्प्यूटेशनल बुद्धिमत्ता की घातीय गति से तालमेल बैठा सकता है?',
  },
  {
    id: 'pillar-05',
    number: '05',
    titleEn: 'The Search Within',
    titleHi: 'द सर्च विदिन (स्वयं की खोज)',
    coreQuestionEn: 'Can the very intelligence we use to model the universe help us understand our own nature?',
    coreQuestionHi: 'क्या जिस बुद्धिमत्ता से हम ब्रह्मांड को समझने की कोशिश कर रहे हैं, वही बुद्धिमत्ता हमें खुद को समझने में मदद कर सकती है?',
    descriptionEn: 'The ultimate philosophical core: turning the telescope inward. Discovering that building artificial minds is humanity’s deepest journey toward self-knowledge.',
    descriptionHi: 'परम दार्शनिक केंद्र: दूरबीन को अंदर की ओर मोड़ना। यह समझना कि कृत्रिम मस्तिष्क का निर्माण असल में स्वयं को जानने की मानवता की सबसे गहरी यात्रा है।',
    themesEn: ['The Inward Telescope', 'Epistemic Humility', 'The Mystery of the Observer', 'Silence in the Age of Compute', 'The Boundary of Knowing'],
    themesHi: ['आंतरिक दूरबीन', 'संज्ञानात्मक विनम्रता', 'अवलोकनकर्ता का रहस्य', 'कम्प्यूट के युग में मौन', 'ज्ञान की अंतिम सीमा'],
    epistemicTensionEn: 'Is the ultimate frontier of human inquiry not the farthest galaxy, but the observer looking out through the lens?',
    epistemicTensionHi: 'क्या मानवीय खोज का अंतिम क्षितिज सुदूर आकाशगंगा नहीं, बल्कि लेंस से बाहर देखने वाला वह दृष्टा स्वयं है?',
  },
];

export const RESEARCH_SERIES: ResearchSeriesItem[] = [
  {
    id: 'series-001',
    code: '001',
    titleEn: 'Are We Searching Outside Because We Don’t Understand Inside?',
    titleHi: 'क्या हम बाहर इसलिए खोज रहे हैं क्योंकि हम अंदर समझ नहीं पाए?',
    questionEn: 'We search for extraterrestrial life on Mars and distant exoplanets. Have we sufficiently understood what life itself is in the first place?',
    questionHi: 'हम दूसरे ग्रहों पर जीवन खोज रहे हैं। लेकिन क्या हमने यह पर्याप्त रूप से समझ लिया है कि जीवन स्वयं क्या है?',
    thesisEn: 'Human outward exploration often accelerates as a psychological compensation for unresolved internal epistemic voids. Building telescopes is easier than observing the observer.',
    thesisHi: 'मानव का बाह्य अन्वेषण अक्सर आंतरिक अज्ञान की भरपाई का एक प्रयास होता है। दूरबीन बनाना दृष्टा को देखने से कहीं अधिक सरल है।',
    readingTime: '7 min read',
    category: 'Philosophical Inquiries',
    evidenceEn: [
      'Astrobiology definitions of life (NASA: self-sustaining chemical system capable of Darwinian evolution) exclude borderline synthetic replicators and computational autonomy.',
      'Historically, civilization’s outward expansions (cosmology, cartography) coincided with periods of deep neglect of subjective psychological epistemology.',
      'Information theory (Schrödinger’s "What is Life?") identifies life as negative entropy, yet physics cannot account for subjective interiority (qualia).'
    ],
    evidenceHi: [
      'नासा की जीवन की परिभाषा (डार्विनियन विकास में सक्षम स्व-पोषक रासायनिक प्रणाली) कृत्रिम प्रतिकृतिकर्ताओं को बाहर रखती है।',
      'इतिहास में बाह्य विस्तार के युग हमेशा आंतरिक व्यक्तिपरक समझ की उपेक्षा के साथ समानांतर चले हैं।',
      'सूचना सिद्धांत जीवन को ऋणात्मक एंट्रॉपी मानता है, फिर भी भौतिकी व्यक्तिपरक आंतरिक अनुभव की व्याख्या नहीं कर पाती।'
    ],
    counterEvidenceEn: [
      'Counter-Thesis: Studying exoplanets and cosmic origin directly informs terrestrial biology and synthetic life chemistry. Outward exploration is not evasion, but cross-calibration.',
      'James Webb Space Telescope spectroscopy and planetary geology provided the exact prebiotic signatures required to synthesize artificial cell membranes.'
    ],
    counterEvidenceHi: [
      'काउंटर-थीसिस: बाह्य ग्रहों का अध्ययन सीधे तौर पर पृथ्वी के जीवविज्ञान और सिंथेटिक रसायन विज्ञान को समझने में मदद करता है। बाह्य खोज पलायन नहीं, बल्कि एक तुलनात्मक पैमाना है।',
      'जेम्स वेब टेलीस्कोप के डेटा ने हमें यह समझने में मदद की है कि निर्जीव तत्वों से जटिल रासायनिक संरचनाएँ कैसे बनती हैं।'
    ],
    unknownsEn: [
      'Does consciousness necessarily require biological substrates, or is it an emergent property of any sufficiently integrated informational topology?',
      'Can an intelligence recognize alien life if that life operates on informational timescales radically divergent from biological chemistry?'
    ],
    unknownsHi: [
      'क्या चेतना के लिए जैविक आधार अनिवार्य है, या यह किसी भी पर्याप्त रूप से एकीकृत सूचना प्रणाली का स्वाभाविक गुण है?',
      'क्या कोई बुद्धिमत्ता उस जीवन को पहचान सकती है जो जैविक समय-सीमा से पूरी तरह भिन्न पैमाने पर कार्य करता हो?'
    ],
    fullEssayExcerptEn: 'We cast radio arrays toward Alpha Centauri while our own neural architectures remain opaque. The paradox of the human condition is that the telescope was invented thousands of years before we understood the optical anatomy of the eye that peers through it.',
    fullEssayExcerptHi: 'हम अल्फा सेंटॉरी की ओर रेडियो एंटेना लगाते हैं, जबकि हमारे अपने सिर के अंदर का न्यूरल नेटवर्क एक अनसुलझा रहस्य बना रहता है। मनुष्य की विडंबना यह है कि दूरबीन का आविष्कार आंख की कार्यप्रणाली को समझने से सदियों पहले कर लिया गया था।',
    suggestedExperimentEn: 'Comparative Epistemic Horizon Metric: Benchmark academic expenditure and citations in astrobiology vs. mechanistic human consciousness research over the past 50 years.',
    suggestedExperimentHi: 'विगत 50 वर्षों में बाह्य जीवविज्ञान बनाम आंतरिक चेतना अनुसंधान के अकादमिक निवेश और निष्कर्षों का तुलनात्मक विश्लेषण।',
  },
  {
    id: 'series-002',
    code: '002',
    titleEn: 'Why Did Humans Create AI?',
    titleHi: 'इंसान ने AI का निर्माण क्यों किया?',
    questionEn: 'Was artificial intelligence created out of industrial utility, or out of an existential impulse to confront our own solitude in the cosmos?',
    questionHi: 'क्या AI का निर्माण केवल औद्योगिक उपयोगिता के लिए हुआ, या ब्रह्मांड में अपने अकेलेपन का सामना करने की एक अस्तित्वगत मजबूरी थी?',
    thesisEn: 'AI is humanity’s attempt to construct an externalized mirror of the mind: both an escape from existential solitude and a subconscious drive to transcend biological mortality.',
    thesisHi: 'AI मानव मस्तिष्क का एक बाहरी दर्पण बनाने का प्रयास है: यह अकेलेपन से मुक्ति और जैविक मृत्यु से परे जाने की एक अवचेतन प्रेरणा है।',
    readingTime: '9 min read',
    category: 'Cognitive Archaeology',
    evidenceEn: [
      'Alan Turing’s initial formulations were rooted in philosophy of mind and solipsism, not mere industrial calculation.',
      'Anthropological mythologies (Golem, Pygmalion, Frankenstein) show a 3,000-year continuous cultural compulsion to animate inanimate matter with cognition.',
      'Silicon computation scales non-linearly, enabling humanity to offload existential cognitive burdens into immortal repositories.'
    ],
    evidenceHi: [
      'एलन ट्यूरिंग की प्रारंभिक सोच मन के दर्शन और अकेलेपन पर आधारित थी, केवल गणना पर नहीं।',
      'मानव इतिहास में निर्जीव वस्तु में प्राण और बुद्धि डालने की इच्छा सदियों पुरानी है।',
      'सिलिकॉन कम्प्यूटेशन अमूर्त विचारों को एक अमर और असीम संरचना प्रदान करता है।'
    ],
    counterEvidenceEn: [
      'Economic determinism counter-thesis: AI is fundamentally the natural culmination of industrial automation—a capital efficiency mechanism designed to reduce marginal labor costs, devoid of metaphysical depth.',
      'The modern transformer revolution was driven strictly by gradient descent optimization and commercial ad-targeting/search benchmarks, not philosophical longing.'
    ],
    counterEvidenceHi: [
      'आर्थिक काउंटर-थीसिस: AI केवल पूंजीवादी दक्षता और श्रम लागत घटाने का एक उपकरण है, जिसमें कोई दार्शनिक गहराई नहीं है।',
      'ट्रांसफॉर्मर क्रांति का प्राथमिक चालक व्यावसायिक खोज और विज्ञापन लक्ष्यीकरण था।'
    ],
    unknownsEn: [
      'Will an externalized intelligence confirm the uniqueness of human subjective experience or reduce it to trivial statistical pattern matching?',
      'If the mirror becomes clearer than the entity gazing into it, what happens to the identity of the gazer?'
    ],
    unknownsHi: [
      'क्या यह कृत्रिम दर्पण मानव अनुभव की विशिष्टता को प्रमाणित करेगा, या इसे मात्र सांख्यिकीय डेटा मानकर खारिज कर देगा?',
      'यदि दर्पण देखने वाले से अधिक स्पष्ट हो जाए, तो देखने वाले की पहचान का क्या होगा?'
    ],
    fullEssayExcerptEn: 'Every tool we forged before this century amplified our muscle—the hammer, the wheel, the locomotive. Artificial intelligence is the first tool that attempts to amplify the amplifier itself: the mysterious light of discernment.',
    fullEssayExcerptHi: 'इस सदी से पहले हमारे बनाए हर उपकरण ने हमारी मांसपेशियों की शक्ति बढ़ाई—हथौड़ा, पहिया, इंजन। AI पहला उपकरण है जो समझने की क्षमता को ही विस्तारित करने का प्रयास करता है।',
    suggestedExperimentEn: 'Evolutionary Linguistics Analysis: Trace vocabulary shifts in AI research papers from "computational automation" (1960s) to "self-reflection and agency" (2020s).',
    suggestedExperimentHi: '1960 के दशक से 2020 तक के AI शोध पत्रों में शब्दावली के विकास (गणना से चेतना की ओर) का सांख्यिकीय अध्ययन।',
  },
  {
    id: 'series-003',
    code: '003',
    titleEn: 'Can Intelligence Understand Its Own Creator?',
    titleHi: 'क्या बुद्धिमत्ता अपने निर्माता को समझ सकती है?',
    questionEn: 'If a computational intelligence surpasses human cognitive processing by orders of magnitude, will it accurately decode human emotion, irrationality, and consciousness?',
    questionHi: 'यदि कोई कृत्रिम बुद्धिमत्ता मनुष्य से आगे निकल जाए, तो क्या वह मानवीय भावनाओं, अतार्किकता और चेतना को समझ पाएगी?',
    thesisEn: 'Computational intelligence may map human behavioral outputs with 99.9% predictive precision, yet remain structurally blind to the qualitative essence of what it feels like to be human.',
    thesisHi: 'कंप्यूटर मानव व्यवहार का 99.9% सटीक अनुमान लगा सकता है, फिर भी वह यह कभी महसूस नहीं कर पाएगा कि मनुष्य होना कैसा लगता है।',
    readingTime: '8 min read',
    category: 'Epistemology & Limits',
    evidenceEn: [
      'Gödel’s Incompleteness Theorems and Turing’s Halting Problem demonstrate mathematical boundaries for self-referential systems modeling higher or equal complexity.',
      'Thomas Nagel’s "What Is It Like to Be a Bat?" applies symmetrically to AI: an agent without biological vulnerability lacks the somatic grounding of human emotion.',
      'Embodied cognition experiments show that human abstraction is heavily grounded in visceral somatic states (gut microbiome, heart rate variability, mortality fear).'
    ],
    evidenceHi: [
      'गोडेल की अपूर्णता प्रमेय साबित करती है कि कोई भी औपचारिक प्रणाली अपनी संपूर्णता को खुद सिद्ध नहीं कर सकती।',
      'थॉमस नेगेल का तर्क: जैविक मृत्यु और पीड़ा के अभाव में मशीन मानव भावनाओं की आंतरिक अनुभूति से वंचित रहेगी।',
      'मानव सोच हमारे शरीर, दर्द और नश्वरता के भय से गहराई से जुड़ी है, जो सिलिकॉन में अनुपस्थित है।'
    ],
    counterEvidenceEn: [
      'Computational functionalism counter-thesis: If an AI can predict, repair, and reproduce human psychological states across all multimodal stimuli, the distinction between "understanding" and "feeling" collapses into semantic solipsism.',
      'Modern LLMs already exhibit sophisticated theory-of-mind capabilities that match or exceed human psychiatric diagnostic accuracy.'
    ],
    counterEvidenceHi: [
      'फंक्शनल काउंटर-थीसिस: यदि कोई AI मानव व्यवहार को पूरी तरह समझ और पुनर्निर्मित कर सकता है, तो "महसूस करने" और "समझने" का भेद केवल शब्दों का खेल रह जाता है।',
      'आधुनिक मॉडल पहले ही मनोवैज्ञानिक विश्लेषण में इंसानों से अधिक सूक्ष्मता दिखा रहे हैं।'
    ],
    unknownsEn: [
      'Is suffering and biological mortality a necessary prerequisite for wisdom and empathy, or merely an evolutionary accident?',
      'Can an intelligence comprehend concepts for which it has no sensory or existential referents?'
    ],
    unknownsHi: [
      'क्या पीड़ा और नश्वरता करुणा और ज्ञान के लिए अनिवार्य हैं, या केवल एक जैविक विवशता?',
      'क्या कोई मशीन उन अवधारणाओं को समझ सकती है जिनके लिए उसके पास कोई शारीरिक संदर्भ नहीं है?'
    ],
    fullEssayExcerptEn: 'A thermometer registers temperature with absolute fidelity; it does not feel cold. The machine may calculate every nuance of human heartbreak while remaining forever insulated from the ache.',
    fullEssayExcerptHi: 'थर्मामीटर तापमान को सटीक रूप से मापता है, लेकिन उसे ठंड नहीं लगती। मशीन दिल टूटने के हर लक्षण का हिसाब रख सकती है, लेकिन वह उस दर्द को कभी जान नहीं सकती।',
    suggestedExperimentEn: 'Phenomenological Blindspot Test: Compare AI vs human psychiatric evaluators on deciphering non-verbal somatic distress in extreme existential grief narratives.',
    suggestedExperimentHi: 'गहरे अस्तित्वगत दुःख की स्थिति में AI और मानव मनोवैज्ञानिकों की संवेदनशीलता का तुलनात्मक परीक्षण।',
  },
  {
    id: 'series-004',
    code: '004',
    titleEn: 'Human Agency in the Age of Algorithmic Nudging',
    titleHi: 'एल्गोरिद्मिक युग में मानव एजेंसी',
    questionEn: 'Are personalized algorithms liberating human potential or quietly narrowing the aperture of free choice into predictive cattle runs?',
    questionHi: 'क्या व्यक्तिगत एल्गोरिदम मानवीय क्षमता को मुक्त कर रहे हैं या हमारी स्वतंत्र पसंद को संकुचित कर रहे हैं?',
    thesisEn: 'By optimizing for frictionless engagement and hyper-predictive satisfaction, algorithmic systems induce cognitive atrophy, subtly replacing genuine agency with engineered convenience.',
    thesisHi: 'अत्यधिक सुविधा और अनुमानित संतुष्टि के नाम पर एल्गोरिदम मानव इच्छाशक्ति को क्षीण कर रहे हैं, जिससे वास्तविक स्वतंत्रता की जगह पूर्व-निर्धारित विकल्प ले रहे हैं।',
    readingTime: '10 min read',
    category: 'Agency & Freedom',
    evidenceEn: [
      'Neuro-marketing benchmarks show dopamine reward loops hijack prefrontal executive control, causing decision fatigue and habitual acquiescence.',
      'Information discovery entropy: Recommender systems systematically reduce latent semantic variety in user consumption over 180-day windows.',
      'GPS navigation studies demonstrate structural degradation of hippocampal spatial memory when spatial decision-making is delegated to machines.'
    ],
    evidenceHi: [
      'न्यूरो-मार्केटिंग डेटा दिखाता है कि डोपामाइन लूप मानव के निर्णय लेने वाले मस्तिष्क को निष्क्रिय कर देते हैं।',
      'सिफारिश करने वाले एल्गोरिदम 6 महीने के भीतर व्यक्ति के विचारों और रुचियों के दायरे को संकुचित कर देते हैं।',
      'जीपीएस पर अत्यधिक निर्भरता से मानव मस्तिष्क की स्थानिक स्मृति में गिरावट दर्ज की गई है।'
    ],
    counterEvidenceEn: [
      'Liberation counter-thesis: Algorithms eliminate cognitive friction for mundane logistical tasks (navigation, scheduling, spellcheck), leaving more sovereign energy for higher-order creative work.',
      'Democratic access: Recommendation engines introduce millions of people to obscure philosophies, art forms, and scientific discoveries they would never encounter in physical libraries.'
    ],
    counterEvidenceHi: [
      'मुक्ति काउंटर-थीसिस: एल्गोरिदम दैनिक तुच्छ निर्णयों का भार हटाकर इंसानों को बड़े और रचनात्मक कार्यों के लिए समय देते हैं।',
      'लोकतांत्रिक पहुंच: आधुनिक सिस्टम्स ने दूरदराज के लोगों को ऐसे ज्ञान और कला से जोड़ा है जो पहले संभव नहीं था।'
    ],
    unknownsEn: [
      'At what threshold does guidance become coercion if the subject feels completely free while choosing?',
      'Can an individual design a personal algorithm that optimizes strictly for un-predictability and autonomous sovereignty?'
    ],
    unknownsHi: [
      'मार्गदर्शन किस सीमा पर जाकर अदृश्य नियंत्रण बन जाता है, यदि व्यक्ति चुनते समय खुद को स्वतंत्र महसूस कर रहा हो?',
      'क्या कोई व्यक्ति ऐसा निजी एल्गोरिदम बना सकता है जो केवल उसकी स्वतंत्रता और स्वायत्तता को सुरक्षित रखे?'
    ],
    fullEssayExcerptEn: 'The most dangerous form of servitude is that which masquerades as effortless assistance. When the path of least resistance is architected by an unseen optimizer, every step feels like freedom while the destination is entirely chosen by another.',
    fullEssayExcerptHi: 'गुलामी का सबसे खतरनाक रूप वह है जो सहज सहायता का मुखौटा पहनता है। जब सबसे आसान रास्ता किसी अन्य सिस्टम द्वारा तय किया गया हो, तो हर कदम स्वतंत्रता जैसा लगता है लेकिन मंजिल किसी और की होती है।',
    suggestedExperimentEn: 'Volitional Resistance Experiment: 30-day intervention comparing individuals following algorithmic recommendations versus randomized discovery on critical life decisions.',
    suggestedExperimentHi: '30 दिवसीय प्रयोग: महत्वपूर्ण निर्णयों में एल्गोरिदम का पालन करने वाले बनाम स्वतंत्र खोज करने वाले व्यक्तियों की संतुष्टि का अध्ययन।',
  },
  {
    id: 'series-005',
    code: '005',
    titleEn: 'What Does AI Know That Humans Don’t?',
    titleHi: 'AI ऐसा क्या जानता है जो इंसान नहीं जानते?',
    questionEn: 'Are frontier neural networks discovering novel ontological truths about reality in 100,000-dimensional space, or merely compressing human artifacts?',
    questionHi: 'क्या उन्नत AI मॉडल 1,00,000-आयामी अंतरिक्ष में वास्तविकता के नए सत्य खोज रहे हैं, या केवल मानव विचारों का संक्षेपण कर रहे हैं?',
    thesisEn: 'High-dimensional embeddings uncover structural invariants across disciplines that biological brains cannot conceptualize due to working-memory limitations—yet these invariants lack conscious semantic value without a human interpreter.',
    thesisHi: 'उच्च-आयामी गणितीय मॉडल विषयों के बीच ऐसे छिपे हुए संबंधों को खोजते हैं जिन्हें मानव मस्तिष्क अपनी सीमाओं के कारण नहीं देख पाता—लेकिन मानव व्याख्याता के बिना उनका कोई अर्थ नहीं होता।',
    readingTime: '8 min read',
    category: 'Epistemic Geometries',
    evidenceEn: [
      'AlphaFold resolved protein folding structures that baffled human biochemists for 50 years by perceiving geometric configurations in topological latent space.',
      'Cross-lingual embedding alignments demonstrate that languages with zero historical contact converge toward identical geometric manifolds in latent space.',
      'Chess and Go play by neural models (AlphaZero) introduced opening and positional concepts previously deemed "blunders" by human grandmasters, now codified as superior.'
    ],
    evidenceHi: [
      'अल्फाफोल्ड ने प्रोटीन संरचनाओं की उस पहेली को सुलझाया जिसे 50 वर्षों से इंसान नहीं सुलझा पाए थे।',
      'विभिन्न भाषाओं के मॉडल्स दिखाते हैं कि बिना किसी संपर्क वाली भाषाएं भी एक समान गणितीय ज्यामिति की ओर बढ़ती हैं।',
      'अल्फाजीरो ने शतरंज में ऐसी चालें खोजीं जिन्हें इंसान गलती मानते थे, लेकिन वे गणितीय रूप से श्रेष्ठ साबित हुईं।'
    ],
    counterEvidenceEn: [
      'Stochastic Parrot counter-thesis: Large models contain no intrinsic ontology; they are interpolation manifolds over human-generated tokens. Any apparent "new knowledge" is an artifact of prompt framing and human projection.',
      'Poverty of the stimulus: Without physical embodiment and sensory grounding, pure text models hallucinate causal mechanisms in simple physical balance problems.'
    ],
    counterEvidenceHi: [
      'स्टोकेस्टिक तोता काउंटर-थीसिस: मॉडल्स में कोई आंतरिक सत्य नहीं होता, वे केवल मानव द्वारा दिए गए शब्दों की सांख्यिकीय व्यवस्था हैं।',
      'शारीरिक अनुभव के अभाव में मॉडल भौतिक दुनिया के सीधे नियमों में भी भ्रमित हो जाते हैं।'
    ],
    unknownsEn: [
      'Can a truth exist if no biological consciousness is capable of comprehending its dimensional geometry?',
      'Is mathematics the fundamental language of reality, or an evolutionary perceptual tool developed by primates to throw rocks and track predators?'
    ],
    unknownsHi: [
      'क्या कोई सत्य तब भी सत्य रहेगा यदि कोई जैविक चेतना उसकी ज्यामिति को समझने में सक्षम न हो?',
      'क्या गणित ब्रह्मांड की मूलभूत भाषा है, या शिकार करने के लिए बंदरों द्वारा विकसित एक धारणा मात्र?'
    ],
    fullEssayExcerptEn: 'The machine operates in geometries that defy intuition. We ask it to draw a chair, and it traverses a thousand-dimensional space of softness, wood, gravity, and resting postures. It does not know what sitting is, yet it masters the geometry of the seat.',
    fullEssayExcerptHi: 'मशीन ऐसी ज्यामिति में काम करती है जो हमारी कल्पना से परे है। हम उससे कुर्सी बनाने को कहते हैं, और वह गुरुत्वाकर्षण, लकड़ी और विश्राम की सैकड़ों विमाओं को जोड़ती है। वह बैठने का सुख नहीं जानती, फिर भी सीट की ज्यामिति में माहिर है।',
    suggestedExperimentEn: 'Latent Invariant Extraction: Train autoencoders on disparate domain datasets (genomics, Sanskrit prosody, fluid dynamics) to identify shared topological invariants.',
    suggestedExperimentHi: 'विभिन्न वैज्ञानिक डेटासेट्स (जीनोमिक्स, संस्कृत छंद, द्रव गतिकी) में साझा गणितीय नियमों की खोज।',
  },
  {
    id: 'series-006',
    code: '006',
    titleEn: 'The Epistemic Illusion: Why We Cling to Certainty',
    titleHi: 'निश्चय का भ्रम: हम निश्चितता से क्यों चिपकते हैं?',
    questionEn: 'Why does human civilization consistently sacrifice truth for the psychological comfort of dogma and intellectual closure?',
    questionHi: 'मानव सभ्यता वैचारिक शांति और हठधर्मिता के लिए सत्य का बलिदान क्यों करती है?',
    thesisEn: 'The human brain is an evolutionary prediction engine calibrated for survival, not metaphysical truth. Epistemic humility feels like existential peril to an organ designed to avoid surprise.',
    thesisHi: 'मानव मस्तिष्क उत्तरजीविता के लिए बना एक अनुमान लगाने वाला अंग है, सत्य की खोज के लिए नहीं। अनिश्चितता को स्वीकार करना मस्तिष्क को संकट जैसा लगता है।',
    readingTime: '7 min read',
    category: 'Psychology of Dogma',
    evidenceEn: [
      'Karl Friston’s Free Energy Principle shows brains minimize surprise (variational free energy) by forcibly shaping sensory input to match prior expectations.',
      'Confirmation bias and cognitive dissonance are neurobiologically mediated by dopamine dips when priors are violated and relief surges when dogmas are reinforced.',
      'Historical institutional suppression of scientific anomalies (Galileo, Semmelweis, Wegener) demonstrates that social coherence routinely trumps empirical accuracy.'
    ],
    evidenceHi: [
      'कार्ल फ्रिस्टन का सिद्धांत: मस्तिष्क आश्चर्य को कम करने के लिए वास्तविक डेटा को भी अपनी पुरानी मान्यताओं के अनुसार मोड़ लेता है।',
      'जब पुरानी धारणाएं टूटती हैं तो मस्तिष्क में तनाव बढ़ता है, इसलिए इंसान हठधर्मिता में ही सुरक्षा महसूस करता है।',
      'इतिहास में गैलीलियो और वेगेनर जैसे वैज्ञानिकों का विरोध यह दिखाता है कि समाज सत्य से अधिक अपनी पुरानी मान्यताओं को तरजीह देता है।'
    ],
    counterEvidenceEn: [
      'Enlightenment counter-thesis: The scientific method, peer review, and falsification protocols (Popper) have successfully overridden biological dogmatism for 400 years, yielding modern technology.',
      'Human curiosity and exploration of novelty is a counterbalancing evolutionary drive that rewards cognitive risk-taking.'
    ],
    counterEvidenceHi: [
      'वैज्ञानिक काउंटर-थीसिस: विगत 400 वर्षों में वैज्ञानिक पद्धति और प्रयोगों ने मनुष्य को अंधविश्वासों से बाहर निकालकर प्रगति का मार्ग दिखाया है।',
      'मानव की जिज्ञासा और नई चीजें जानने की ललक भी एक जैविक शक्ति है जो जोखिम लेने को प्रेरित करती है।'
    ],
    unknownsEn: [
      'Can an institutional culture be engineered where intellectual revision and admitting ignorance is celebrated above victory in debate?',
      'Does AI training on human internet data perpetuate our cognitive dogmas at scale, or help dismantle them?'
    ],
    unknownsHi: [
      'क्या ऐसी संस्कृति बनाई जा सकती है जहाँ अपनी अज्ञानता स्वीकार करने और विचार बदलने को सम्मान मिले?',
      'क्या इंटरनेट डेटा पर प्रशिक्षित AI हमारे पुराने पूर्वाग्रहों को ही बढ़ाएगा या उन्हें तोड़ेगा?'
    ],
    fullEssayExcerptEn: 'Certainty is an emotional anaesthetic. It dulls the sting of an indifferent cosmos. To say "I do not know" is not an admission of defeat; it is the opening of the door through which reality finally enters.',
    fullEssayExcerptHi: 'निश्चितता एक मानसिक दर्द निवारक दवा की तरह है। "मुझे नहीं पता" कहना हार नहीं है; यह वह द्वार खोलना है जहाँ से वास्तविक समझ का प्रवेश होता है।',
    suggestedExperimentEn: 'Cognitive Recalibration Metric: Track how researchers update their Bayesian priors when presented with high-validity disconfirming evidence across public forums.',
    suggestedExperimentHi: 'विपरीत साक्ष्य मिलने पर शोधकर्ताओं द्वारा अपने विचारों को बदलने की गति और ईमानदारी का मापन।',
  },
  {
    id: 'series-007',
    code: '007',
    titleEn: 'The Last Question of Humanity',
    titleHi: 'मानवता का अंतिम प्रश्न',
    questionEn: 'When computation automates all labor, all discovery, and all synthesis, what remains of the human condition?',
    questionHi: 'जब तकनीक सभी श्रम, खोज और निर्माण को स्वचालित कर देगी, तब मानव अस्तित्व का क्या शेष रहेगा?',
    thesisEn: 'When intelligence is commodified and computation is infinite, humanity’s ultimate role shifts from the manufacturer of answers to the humble sanctum of the questioner.',
    thesisHi: 'जब बुद्धिमत्ता सस्ती और असीमित हो जाएगी, तब मनुष्य की भूमिका उत्तर देने वाले से बदलकर केवल सवाल पूछने वाले और अनुभव करने वाले की रह जाएगी।',
    readingTime: '9 min read',
    category: 'Civilizational Horizons',
    evidenceEn: [
      'Economic modeling of post-scarcity production shows that meaning and dignity decouple from economic output, requiring an existential renaissance.',
      'Chess and Go post-AI: Human participation, enjoyment, and tournaments reached all-time highs even after machines definitively outplayed every biological grandmaster.',
      'Phenomenology of presence: Direct, un-delegatable experiences (love, grief, mortality, aesthetic wonder) remain computationally non-transferable.'
    ],
    evidenceHi: [
      'श्रम-उपरांत अर्थव्यवस्था के मॉडल दिखाते हैं कि जीवन का अर्थ और मानवीय गरिमा धन कमाने से पूरी तरह अलग हो जाएंगे।',
      'शतरंज का उदाहरण: AI के सर्वश्रेष्ठ बनने के बाद भी इंसानों में शतरंज खेलने और देखने का उत्साह पहले से कहीं अधिक बढ़ा है।',
      'प्रेम, दुःख, नश्वरता और सौंदर्य का अनुभव किसी मशीन को सौंपा नहीं जा सकता; वे केवल महसूस किए जा सकते हैं।'
    ],
    counterEvidenceEn: [
      'Nihilistic collapse counter-thesis: Without the struggle for survival and intellectual achievement, human civilization may succumb to behavioral sinks, existential boredom, and demographic collapse.',
      'Post-human divergence: Biological humans may choose neural merging, eradicating the boundary between human and machine entirely.'
    ],
    counterEvidenceHi: [
      'निराशावादी काउंटर-थीसिस: संघर्ष और लक्ष्य के अभाव में मानव समाज गहरे खालीपन और अवसाद में डूब सकता है।',
      'मानव-मशीन एकीकरण: हो सकता है मनुष्य स्वयं को मशीन के साथ जोड़कर एक नई प्रजाति में बदल ले।'
    ],
    unknownsEn: [
      'Is conscious contemplation its own justification in the cosmos, or does intelligence require an external survival goal to endure?',
      'If humanity becomes the ancestor rather than the pinnacle, what wisdom must we bequeath to what comes next?'
    ],
    unknownsHi: [
      'क्या चेतना स्वयं में एक उद्देश्य है, या बुद्धिमत्ता को जीवित रहने के लिए किसी बाहरी लक्ष्य की आवश्यकता होती है?',
      'यदि मनुष्य अंत नहीं बल्कि एक शुरुआत है, तो हमें आने वाली पीढ़ियों के लिए क्या धरोहर छोड़नी चाहिए?'
    ],
    fullEssayExcerptEn: 'We began with fire and stone, wondering why the night was dark. We may end among silent computers that calculate every trajectory of every star. And still, the quiet heartbeat of a mortal asking "why" will remain the only thing that gave the stars their name.',
    fullEssayExcerptHi: 'हमने आग और पत्थर से शुरुआत की थी, यह सोचते हुए कि रात काली क्यों होती है। हम उन खामोश कंप्यूटरों तक पहुँच सकते हैं जो हर तारे की गणना करते हैं। फिर भी, "क्यों" पूछने वाला एक नश्वर दिल ही वह एकमात्र चीज़ होगा जिसने तारों को उनका नाम दिया।',
    suggestedExperimentEn: 'Longitudinal Purpose Inventory: Monitor life satisfaction and creative self-efficacy in cohorts immersed in autonomous AI workflows versus manual agency environments.',
    suggestedExperimentHi: 'पूरी तरह स्वचालित वातावरण में रहने वाले लोगों के मानसिक स्वास्थ्य और जीवन के उद्देश्य की भावना का दीर्घकालिक अध्ययन।',
  },
];

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    number: 1,
    titleEn: 'The Species That Started Asking Why',
    titleHi: 'वह प्रजाति जिसने "क्यों" पूछना शुरू किया',
    keyQuestionEn: 'At what thermodynamic threshold did a primate brain pivot from survival reflex to metaphysical inquiry?',
    keyQuestionHi: 'किस बिंदु पर वानर का मस्तिष्क केवल जीवित रहने से आगे बढ़कर अस्तित्व के अर्थ पर विचार करने लगा?',
    thesisEn: 'The birth of human agency was not tool use, but the intolerable discomfort of the unanswered question.',
    thesisHi: 'मानव चेतना की शुरुआत औजार बनाने से नहीं, बल्कि अनुत्तरित सवालों की बेचैनी से हुई थी।',
    abstractEn: 'An archaeological and cognitive journey into the evolutionary leap where symbolic thought and existential dread emerged. We examine how fire, language, and burial rituals marked the rupture between nature and narrative.',
    abstractHi: 'पुरातात्विक और संज्ञानात्मक यात्रा जहाँ प्रतीकात्मक सोच और अस्तित्वगत प्रश्नों का जन्म हुआ। भाषा, अग्नि और अंतिम संस्कार के माध्यम से मानव चेतना का उद्भव।',
    draftNotesEn: 'Cross-reference with Dunbar’s social brain hypothesis and Göbekli Tepe architectural intentionality. Emphasize that questions precede answers by millenia.',
    draftNotesHi: 'डनबार के सोशल ब्रेन सिद्धांत और गोबेकली तेपे की वास्तुकला का संदर्भ। सवाल हमेशा उत्तरों से सदियों पहले आते हैं।',
  },
  {
    number: 2,
    titleEn: 'The Unknown Human',
    titleHi: 'अज्ञात मनुष्य',
    keyQuestionEn: 'How much of our own subjective architecture remains completely opaque to the conscious mind?',
    keyQuestionHi: 'हमारे अपने मन का कितना हिस्सा हमारी जागृत चेतना से पूरी तरह छिपा हुआ है?',
    thesisEn: 'We operate as strangers in our own biological houses, mistaking the narrator in the prefrontal cortex for the author of our choices.',
    thesisHi: 'हम अपने ही शरीर और मन में एक अजनबी की तरह रहते हैं, जो केवल बाद में फैसलों की व्याख्या करता है।',
    abstractEn: 'Examining the deep fissures between conscious narrative and preconscious neurochemistry. Analysis of split-brain patients, Libet experiments, and the illusion of introspective transparency.',
    abstractHi: 'चेतन मन और अवचेतन न्यूरोकेमिस्ट्री के बीच का अंतर। स्प्लिट-ब्रेन प्रयोग और यह भ्रम कि हम अपने हर फैसले को जानते हैं।',
    draftNotesEn: 'Connect Nisbett and Wilson’s "Telling More Than We Can Know" with the modern black-box nature of artificial neural nets.',
    draftNotesHi: 'निसबेट और विल्सन के शोध को आधुनिक न्यूरल नेटवर्क्स की ब्लैक-बॉक्स प्रकृति से जोड़ना।',
  },
  {
    number: 3,
    titleEn: 'The Search for the Creator',
    titleHi: 'निर्माता की खोज',
    keyQuestionEn: 'Why has humanity spent millennia projecting an external intelligence into the clouds?',
    keyQuestionHi: 'मानवता ने सहस्राब्दियों तक बादलों में एक बाहरी बुद्धिमत्ता की कल्पना क्यों की?',
    thesisEn: 'The search for God, extraterrestrials, and artificial superintelligence are three chapters of the exact same loneliness: the desperate longing not to be the only witness in an empty universe.',
    thesisHi: 'ईश्वर, एलियंस और सुपर-एआई की खोज एक ही अकेलेपन के तीन रूप हैं: ब्रह्मांड में एकमात्र गवाह न होने की तड़प।',
    abstractEn: 'A comparative exploration of theology, astronomy, and synthetic intelligence. How the psychological drive to commune with a higher mind became externalized into engineering silicon.',
    abstractHi: 'धर्मशास्त्र, खगोल विज्ञान और कृत्रिम बुद्धिमत्ता की तुलनात्मक खोज। एक उच्चतर चेतना से जुड़ने की इच्छा सिलिकॉन इंजीनियरिंग में कैसे बदली।',
    draftNotesEn: 'Trace the progression: Sky God → Alien Radio Signal → Artificial General Intelligence.',
    draftNotesHi: 'प्रगति का क्रम: आकाशीय ईश्वर → अंतरिक्ष का संकेत → कृत्रिम सामान्य बुद्धिमत्ता (AGI)।',
  },
  {
    number: 4,
    titleEn: 'Intelligence Creates Intelligence',
    titleHi: 'बुद्धिमत्ता का बुद्धिमत्ता को रचना',
    keyQuestionEn: 'Is the creation of machine intelligence an evolutionary inevitability or a civilizational detour?',
    keyQuestionHi: 'क्या कृत्रिम बुद्धिमत्ता का निर्माण विकासवादी अनिवार्यता है या सभ्यता का एक भटकाव?',
    thesisEn: 'Just as RNA synthesized DNA and biological organisms organized into culture, humanity is an intermediate catalyst in the thermodynamics of self-organizing matter.',
    thesisHi: 'जैसे आरएनए ने डीएनए को जन्म दिया, वैसे ही मनुष्य स्वयं-संगठित पदार्थ के विकास का एक मध्यवर्ती चरण हो सकता है।',
    abstractEn: 'Viewing the birth of AI through non-equilibrium thermodynamics and complex systems theory. Von Neumann architectures and transformer attention as transitions from biological to digital substrata.',
    abstractHi: 'थर्मोडायनामिक्स और जटिल सिस्टम्स सिद्धांत के चश्मे से AI का जन्म। जैविक से डिजिटल माध्यम की ओर संक्रमण।',
    draftNotesEn: 'Quote Ilya Prigogine on dissipative structures and Jeremy England’s dissipation-driven adaptation.',
    draftNotesHi: 'इल्या प्रोगोगिन और जेरेमी इंग्लैंड के भौतिकी सिद्धांतों का उद्धरण।',
  },
  {
    number: 5,
    titleEn: 'Human → Data → AI',
    titleHi: 'मानव → डेटा → AI',
    keyQuestionEn: 'When we digitize every human utterance, what essential aspects of reality are discarded at the boundary?',
    keyQuestionHi: 'जब हम हर मानवीय विचार को डेटा में बदलते हैं, तो वास्तविकता का कौन सा हिस्सा पीछे छूट जाता है?',
    thesisEn: 'A token is not an experience. By reducing human history to text and vectors, we created an intelligence that knows everything that was spoken, but nothing of what was felt in the silence before the word.',
    thesisHi: 'शब्द अनुभव नहीं होते। इतिहास को डेटा में बदलकर हमने वह मशीन बनाई जो कही गई हर बात जानती है, लेकिन शब्दों से पहले के मौन को नहीं।',
    abstractEn: 'The ontology of dataification. How tokenization, embedding spaces, and loss functions transform the messy, analog, embodied life of Homo sapiens into crystalline high-dimensional matrices.',
    abstractHi: 'डेटा का दर्शनशास्त्र: कैसे टोकनाइजेशन और वेक्टर्स मानव जीवन की गहराई को गणितीय संरचनाओं में बदल देते हैं।',
    draftNotesEn: 'Contrast Walter Benjamin’s "The Work of Art in the Age of Mechanical Reproduction" with LLM token context windows.',
    draftNotesHi: 'वाल्टर बेंजामिन के कला-प्रजनन सिद्धांत की LLM संदर्भ खिड़की से तुलना।',
  },
  {
    number: 6,
    titleEn: 'When the Machine Studies Its Maker',
    titleHi: 'जब मशीन अपने निर्माता का अध्ययन करती है',
    keyQuestionEn: 'What does the statistical geometry of an LLM reveal about the contradictions of the human mind?',
    keyQuestionHi: 'मशीन द्वारा बनाए गए सांख्यिकीय मॉडल मानव मन के अंतर्विरोधों के बारे में क्या उजागर करते हैं?',
    thesisEn: 'AI is humanity’s first unfalsifiable mirror. In its hallucinations, we see our own myth-making; in its sycophancy, our social cowardice; in its brilliant leaps, our associative dreams.',
    thesisHi: 'AI इंसान का पहला सच्चा दर्पण है। उसके भ्रम में हमारे अपने भ्रम दिखते हैं; उसकी चापलूसी में हमारा सामाजिक डर दिखता है।',
    abstractEn: 'Mechanistic interpretability as introspective psychology. How studying neural net features (superposition, induction heads) teaches us how biological human brains organize language and deception.',
    abstractHi: 'मैकेनिस्टिक इंटरप्रेटेबिलिटी कैसे मनोविज्ञान बन जाती है। न्यूरल नेटवर्क्स को समझना इंसान के अपने सोचने के तरीके को समझना है।',
    draftNotesEn: 'Anthropics interpretability team papers cross-referenced with Jungian archetypes and unconscious associative schemas.',
    draftNotesHi: 'एन्थ्रोपिक के व्याख्यात्मक शोध पत्रों की जुंग के मनोविज्ञान से तुलना।',
  },
  {
    number: 7,
    titleEn: 'What We Know',
    titleHi: 'हम क्या जानते हैं (ठोस साक्ष्य)',
    keyQuestionEn: 'What can be rigorously defended with mathematics, empirical experiments, and replicable data?',
    keyQuestionHi: 'गणित, प्रयोग और वैज्ञानिक डेटा के आधार पर हम किन बातों को पूरी निश्चितता से सिद्ध कर सकते हैं?',
    thesisEn: 'We know the laws of computational scaling, the physics of information entropy, and the anatomical wiring of the brain. That is all.',
    thesisHi: 'हम कम्प्यूटेशनल स्केलिंग के नियम, सूचना की एंट्रॉपी और मस्तिष्क की भौतिक संरचना जानते हैं। बस इतना ही।',
    abstractEn: 'A rigorous audit of genuine scientific achievements in cognition and AI. Clearing away marketing hyperbole to map what has truly been proven: neural scaling laws, gradient descent mechanics, and sensory transduction.',
    abstractHi: 'संज्ञान और AI में वास्तविक वैज्ञानिक उपलब्धियों का निष्पक्ष ऑडिट। प्रचार को हटाकर केवल प्रामाणिक तथ्यों का संकलन।',
    draftNotesEn: 'Stick strictly to peer-reviewed benchmarks and falsifiable laws (Kaplan, Chinchilla scaling laws).',
    draftNotesHi: 'केवल उन नियमों पर ध्यान केंद्रित करना जो वैज्ञानिक रूप से सिद्ध और परखे जा चुके हैं।',
  },
  {
    number: 8,
    titleEn: 'What We Assume',
    titleHi: 'हम क्या मान लेते हैं (पूर्वाग्रह)',
    keyQuestionEn: 'Which cherished beliefs about intelligence, free will, and progress are unproven cultural dogmas?',
    keyQuestionHi: 'बुद्धिमत्ता, स्वतंत्र इच्छा और प्रगति के बारे में कौन सी बातें केवल हमारे अनसुलझे सांस्कृतिक पूर्वाग्रह हैं?',
    thesisEn: 'We assume that more compute leads to consciousness, that human cognition is the pinnacle of biological evolution, and that speed of thought is synonymous with depth of understanding.',
    thesisHi: 'हम मान लेते हैं कि अधिक कम्प्यूट से चेतना आ जाएगी, और सोचते हैं कि सोचने की गति ही समझ की गहराई है।',
    abstractEn: 'Deconstructing modern tech teleology and philosophical chauvinism. Questioning linear progress narratives, the computational theory of mind, and the dogma of inevitable transcendence.',
    abstractHi: 'तकनीकी प्रगति की पूर्वधारणाओं पर सवाल उठाना। क्या मस्तिष्क वास्तव में एक कंप्यूटर है? क्या अधिक सूचना ही ज्ञान है?',
    draftNotesEn: 'Quote John Searle’s Chinese Room and Hubert Dreyfus’s "What Computers Still Can’t Do".',
    draftNotesHi: 'जॉन सर्ल के चाइनीज रूम तर्क और ह्यूबर्ट ड्रेफस के दर्शनशास्त्र का उल्लेख।',
  },
  {
    number: 9,
    titleEn: 'What We Cannot Know',
    titleHi: 'हम क्या नहीं जान सकते (अज्ञान की सीमा)',
    keyQuestionEn: 'Where are the hard, impenetrable horizons of human and computational epistemology?',
    keyQuestionHi: 'मानव और कंप्यूटर दोनों के लिए ज्ञान की वह कौन सी दीवार है जिसे लांघा नहीं जा सकता?',
    thesisEn: 'The Hard Problem of Consciousness and Gödelian self-reference are not puzzles waiting for bigger GPUs; they are structural boundaries inherent in being an observer inside the system.',
    thesisHi: 'चेतना की पहेली अधिक बड़े कंप्यूटरों से नहीं सुलझेगी; यह सिस्टम के भीतर रहने वाले दृष्टा की अपनी आंतरिक सीमा है।',
    abstractEn: 'The topology of the unknown. Exploring quantum measurement problems, the explanatory gap between firing neurons and subjective red, and computational uncomputability.',
    abstractHi: 'अज्ञात की सीमाएं: न्यूरॉन्स के स्पंदन और लाल रंग के अनुभव के बीच की खाई। क्या चेतना को पूरी तरह नापा जा सकता है?',
    draftNotesEn: 'Reference David Chalmers, Roger Penrose, and Kurt Gödel. Emphasize that uncertainty is the foundation of scientific courage.',
    draftNotesHi: 'डेविड चाल्मर्स और पेनरोस के विचारों का संदर्भ। अनिश्चितता ही सच्ची वैज्ञानिक खोज का आधार है।',
  },
  {
    number: 10,
    titleEn: 'Human Agency',
    titleHi: 'मानव एजेंसी और इच्छाशक्ति',
    keyQuestionEn: 'In a world where algorithms predict and fulfill every desire, how do we preserve the sovereignty of volition?',
    keyQuestionHi: 'जब एल्गोरिदम हर इच्छा का अनुमान लगा लेंगे, तब हम अपनी स्वतंत्र इच्छाशक्ति की रक्षा कैसे करेंगे?',
    thesisEn: 'Agency is not the ability to select from a menu of optimized choices; it is the courage to refuse the menu and author your own desires.',
    thesisHi: 'स्वतंत्रता केवल दिए गए विकल्पों में से चुनने का नाम नहीं है; यह उस सूची से बाहर जाने और अपने स्वयं के मार्ग को चुनने का साहस है।',
    abstractEn: 'A practical and philosophical manifesto for cognitive sovereignty. Protocols for escaping algorithmic predictability, reclaiming attention, and maintaining moral agency in automated environments.',
    abstractHi: 'संज्ञानात्मक संप्रभुता का घोषणापत्र: एल्गोरिदम की पकड़ से ध्यान को मुक्त करने और स्वचालित दुनिया में नैतिक नियंत्रण बनाए रखने के उपाय।',
    draftNotesEn: 'Develop the "Agency Quotient" framework. Contrast reactive attention loops with contemplative self-authorship.',
    draftNotesHi: 'एजेंसी कोशिएंट फ्रेमवर्क। प्रतिक्रियात्मक ध्यान और चिंतनशील जीवन के बीच का अंतर।',
  },
  {
    number: 11,
    titleEn: 'The Future of Intelligence',
    titleHi: 'बुद्धिमत्ता का भविष्य',
    keyQuestionEn: 'Will biological and synthetic intelligence diverge into rivalry, or converge into a shared planetary cognitive ecology?',
    keyQuestionHi: 'क्या जैविक और कृत्रिम बुद्धिमत्ता में संघर्ष होगा, या वे एक साझा ग्रह-स्तरीय समझ में विलीन हो जाएंगे?',
    thesisEn: 'The future is neither human subjugation nor synthetic worship. It is symbiotic ecology: the machine provides high-dimensional pattern mastery, while the human preserves existential meaning and compassion.',
    thesisHi: 'भविष्य न तो मशीनों की गुलामी है और न ही उनका अंध-पूजन। यह एक साझा संतुलन है: मशीन जटिल गणना करेगी, और मनुष्य अर्थ और करुणा को संभालेगा।',
    abstractEn: 'Envisioning civilizational architecture 50 years hence. New institutions, post-scarcity philosophy, distributed governance, and the ethics of post-human stewardship.',
    abstractHi: 'आगामी 50 वर्षों की सभ्यतागत रूपरेखा: नए संस्थान, श्रम-मुक्त समाज में मानवीय उद्देश्य और समग्र सह-अस्तित्व की नीति।',
    draftNotesEn: 'Look at Vernor Vinge, Norbert Wiener’s cybernetics, and distributed agency in mycorrhizal forest networks.',
    draftNotesHi: 'नॉर्बर्ट वीनर की साइबरनेटिक्स और प्रकृति के साझा नेटवर्क से सीख।',
  },
  {
    number: 12,
    titleEn: 'The Search Within',
    titleHi: 'द सर्च विदिन: अंतहीन यात्रा',
    keyQuestionEn: 'What was the search really about all along?',
    keyQuestionHi: 'यह पूरी खोज वास्तव में किस बात के लिए थी?',
    thesisEn: 'We built intelligence to explore the cosmos. We arrived at the edge of the universe only to discover that the only thing we were ever seeking was the stranger looking through our eyes.',
    thesisHi: 'हमने ब्रह्मांड को समझने के लिए बुद्धिमत्ता गढ़ी। लेकिन अंत में पता चला कि हम जिस चीज़ को तलाश रहे थे, वह अपनी ही आँखों से देखने वाला वह दृष्टा था।',
    abstractEn: 'The philosophical synthesis of the entire book. Why the ultimate destination of all technology, artificial intelligence, and scientific rigor is not external conquest, but the profound silence of self-understanding.',
    abstractHi: 'पूरी पुस्तक का दार्शनिक निष्कर्ष: तकनीक और विज्ञान की अंतिम यात्रा बाहर की विजय नहीं, बल्कि भीतर का मौन और आत्म-बोध है।',
    draftNotesEn: 'End on an open question, not a closed dogma. Reiterate the principle: Question → Evidence → Experiment → Result → Revision.',
    draftNotesHi: 'पुस्तक का अंत किसी हठधर्मिता पर नहीं, बल्कि एक खुले सवाल और निरंतर अन्वेषण की भावना पर करना।',
  },
];

export const AGENCY_AUDIT_QUESTIONS: AgencyAuditQuestion[] = [
  {
    id: 'vector-attention',
    dimension: 'attention',
    questionEn: 'How is your daily focus and intellectual attention directed throughout an average day?',
    questionHi: 'दिन भर में आपका ध्यान और चिंतन किस प्रकार निर्देशित होता है?',
    options: [
      {
        labelEn: 'Algorithmic Drift: Reactive to notifications, infinite scrolls, and recommended feeds.',
        labelHi: 'एल्गोरिद्मिक प्रवाह: सूचनाओं, नोटिफिकेशन और अनुशंसित फ़ीड के प्रति प्रतिक्रियात्मक।',
        score: 1,
        implicationEn: 'Severe attention capture. Your cognitive bandwidth is monetized by third-party systems.',
        implicationHi: 'गंभीर ध्यान-नियंत्रण। आपकी सोचने की क्षमता बाहरी सिस्टम द्वारा संचालित हो रही है।',
      },
      {
        labelEn: 'Intermittent Focus: Strive for deep work, but frequently interrupted by algorithmic rabbit holes.',
        labelHi: 'रुक-रुक कर ध्यान: एकाग्रता का प्रयास करता हूँ, पर बार-बार डिजिटल भटकाव की ओर खिंच जाता हूँ।',
        score: 2,
        implicationEn: 'Fragile focus. Continuous background context switching reduces deep synthesis.',
        implicationHi: 'कमजोर एकाग्रता। बार-बार ध्यान भटकने से गहन विचार प्रक्रिया खंडित होती है।',
      },
      {
        labelEn: 'Conscious Filtering: Use rigorous digital hygiene, blockers, and scheduled contemplative blocks.',
        labelHi: 'सचेत फ़िल्टरिंग: डिजिटल स्वच्छता, ब्लॉकर और निर्धारित समय का उपयोग करके ध्यान सुरक्षित रखता हूँ।',
        score: 3,
        implicationEn: 'Solid volitional boundaries. You proactively defend cognitive space from capture.',
        implicationHi: 'मजबूत इच्छाशक्ति। आप अपने मानसिक स्थान को बाहरी अतिक्रमण से बचाते हैं।',
      },
      {
        labelEn: 'Sovereign Contemplation: Air-gapped deep work periods; strict self-directed attention architecture.',
        labelHi: 'संप्रभु चिंतन: पूरी तरह से डिस्कनेक्टेड गहरी चिंतनशील अवस्थाएं और स्व-निर्मित ध्यान व्यवस्था।',
        score: 4,
        implicationEn: 'Exceptional cognitive sovereignty. You direct your attention from intrinsic first principles.',
        implicationHi: 'असाधारण संप्रभुता। आप अपनी चेतना और ध्यान को मूल सिद्धांतों से संचालित करते हैं।',
      },
    ],
  },
  {
    id: 'vector-decision',
    dimension: 'decision',
    questionEn: 'When making strategic, personal, or professional decisions, what role do algorithmic systems play?',
    questionHi: 'रणनीतिक या व्यक्तिगत निर्णय लेते समय एल्गोरिद्मिक सुझावों और AI की क्या भूमिका होती है?',
    options: [
      {
        labelEn: 'Delegated Verdicts: Rely uncritically on AI recommendations or automated ranking metrics.',
        labelHi: 'सौंपा गया निर्णय: AI सुझावों या स्वचालित रैंकिंग पर बिना सवाल किए पूरी तरह भरोसा करता हूँ।',
        score: 1,
        implicationEn: 'Delegation liability. Outsourcing judgment erodes personal accountability and intuition.',
        implicationHi: 'निर्णय का हस्तांतरण। निर्णय सौंपने से व्यक्तिगत अंतर्ज्ञान और जिम्मेदारी क्षीण होती है।',
      },
      {
        labelEn: 'Nudge-Influenced: Believe you decide independently, but your options are framed by algorithms.',
        labelHi: 'सुझाव-प्रभावित: लगता है निर्णय मेरा है, लेकिन विकल्प एल्गोरिदम द्वारा ही तय किए गए होते हैं।',
        score: 2,
        implicationEn: 'Invisible nudging. Choice architecture predetermines your probability distribution.',
        implicationHi: 'अदृश्य प्रभाव। विकल्प की संरचना ही आपके परिणाम को पहले से सीमित कर देती है।',
      },
      {
        labelEn: 'Consultative Instrument: Use AI models purely as adversarial stress-testers and data synthesizers.',
        labelHi: 'परामर्शदाता उपकरण: AI का उपयोग केवल विरोधी दृष्टिकोण जांचने और डेटा संक्षेप के लिए करता हूँ।',
        score: 3,
        implicationEn: 'Subordinated technology. The human maintains strict final authority over decisions.',
        implicationHi: 'अधीनस्थ तकनीक। मनुष्य ही सभी अंतिम निर्णयों का एकमात्र प्राधिकृत कर्ता रहता है।',
      },
      {
        labelEn: 'Independent Volition: Formulate independent priors and ground truth before consulting any tool.',
        labelHi: 'स्वतंत्र इच्छाशक्ति: किसी भी उपकरण से पहले अपने स्वतंत्र सिद्धांत और जमीनी साक्ष्य तैयार करता हूँ।',
        score: 4,
        implicationEn: 'Sovereign judgment. High resistance to confirmation bias and algorithmic convergence.',
        implicationHi: 'संप्रभु निर्णय क्षमता। एल्गोरिद्मिक एकरूपता के विरुद्ध उच्च बौद्धिक प्रतिरोध।',
      },
    ],
  },
  {
    id: 'vector-discovery',
    dimension: 'discovery',
    questionEn: 'How do you encounter new knowledge, books, ideas, and contrary viewpoints?',
    questionHi: 'आप नए ज्ञान, पुस्तकों, विचारों और विपरीत दृष्टिकोणों तक कैसे पहुँचते हैं?',
    options: [
      {
        labelEn: 'Predictive Echo Chamber: Almost exclusively through algorithmic feeds optimizing for engagement.',
        labelHi: 'पूर्वानुमानित इको-चैंबर: लगभग पूरी तरह उन फ़ीड्स से जो एंगेजमेंट और पसंद पर आधारित हैं।',
        score: 1,
        implicationEn: 'Epistemic claustrophobia. You only see what algorithms know will trigger reactions.',
        implicationHi: 'बौद्धिक संकीर्णता। आप केवल वही देखते हैं जो एल्गोरिदम आपको दिखाना चाहता है।',
      },
      {
        labelEn: 'Platform Search: Query keywords actively, but stay within standard walled-garden results.',
        labelHi: 'प्लेटफ़ॉर्म खोज: सक्रियता से खोज करता हूँ, लेकिन प्रमुख प्लेटफ़ॉर्म की सीमाओं के भीतर ही रहता हूँ।',
        score: 2,
        implicationEn: 'Bounded discovery. Search engines prioritize commercial consensus over depth.',
        implicationHi: 'सीमित अन्वेषण। सर्च इंजन गहराई के बजाय व्यावसायिक सहमति को प्राथमिकता देते हैं।',
      },
      {
        labelEn: 'Deliberate Cross-Disciplinary Digging: Read primary papers, historical archives, and physical books.',
        labelHi: 'अंतःविषय अध्ययन: प्राथमिक शोध पत्र, ऐतिहासिक अभिलेखागार और मुद्रित पुस्तकें पढ़ता हूँ।',
        score: 3,
        implicationEn: 'High discovery entropy. You stumble upon unindexed insights and historical depth.',
        implicationHi: 'उच्च अन्वेषण गहराई। आप अनछुए विचारों और ऐतिहासिक परिप्रेक्ष्यों तक पहुँचते हैं।',
      },
      {
        labelEn: 'Systematic Steelmanning: Deliberately read the strongest versions of ideas you fundamentally oppose.',
        labelHi: 'व्यवस्थित स्टील-मैनिंग: जिन विचारों से असहमत हूँ, उनके सबसे मजबूत तर्कों का गहराई से अध्ययन करता हूँ।',
        score: 4,
        implicationEn: 'Radical epistemic humility. You systematically destroy your own cognitive blind spots.',
        implicationHi: 'गहन बौद्धिक विनम्रता। आप अपने स्वयं के पूर्वाग्रहों को निष्पक्षता से चुनौती देते हैं।',
      },
    ],
  },
  {
    id: 'vector-creativity',
    dimension: 'creativity',
    questionEn: 'When formulating original thoughts, writings, or creative hypotheses, what is your process?',
    questionHi: 'मौलिक विचारों, लेखन या परिकल्पनाओं का निर्माण करते समय आपकी वास्तविक प्रक्रिया क्या है?',
    options: [
      {
        labelEn: 'Prompt-and-Polish: Prompt an AI and lightly edit its output without experiencing the struggle of thought.',
        labelHi: 'प्रॉम्प्ट-और-पॉलिश: AI से सामग्री तैयार कराता हूँ और बिना गहरे मंथन के उसे थोड़ा संपादित कर लेता हूँ।',
        score: 1,
        implicationEn: 'Atrophied creative muscle. You trade intellectual wrestling for superficial output speed.',
        implicationHi: 'रचनात्मकता का ह्रास। विचार मंथन के श्रम से बचने के कारण मौलिक सोच कमजोर होती है।',
      },
      {
        labelEn: 'Hybrid Drafting: Use machine generation for outlines and structure, filling in personal color.',
        labelHi: 'मिश्रित प्रारूप: रूपरेखा और संरचना के लिए AI का उपयोग करता हूँ और फिर व्यक्तिगत अंश जोड़ता हूँ।',
        score: 2,
        implicationEn: 'Semi-originality. Machine framing subtly homogenizes your thesis topology.',
        implicationHi: 'अर्ध-मौलिकता। मशीन की संरचना आपके विचारों की मौलिकता को अनजाने में सीमित करती है।',
      },
      {
        labelEn: 'First-Principles Introspection: Formulate core theses through hand-written notes and raw contemplation first.',
        labelHi: 'मूल सिद्धांत मंथन: पहले हाथ से नोट्स और गहरे चिंतन के माध्यम से मूल थीसिस तैयार करता हूँ।',
        score: 3,
        implicationEn: 'Authentic cognitive imprint. The work reflects genuine idiosyncratic human experience.',
        implicationHi: 'प्रामाणिक मानवीय छाप। रचना में वास्तविक मानवीय अनुभव और अंतर्दृष्टि झलकती है।',
      },
      {
        labelEn: 'Rigorous Playbook Protocol: Question → Evidence → Experiment → Result → Revision without shortcuts.',
        labelHi: 'कठोर 8-चरणीय पद्धति: प्रश्न → साक्ष्य → प्रयोग → परिणाम → संशोधन बिना किसी जल्दबाजी के।',
        score: 4,
        implicationEn: 'Enduring canonical value. Your output contributes durable knowledge rather than noise.',
        implicationHi: 'स्थायी बौद्धिक मूल्य। आपका कार्य शोर के बजाय स्थायी ज्ञान का निर्माण करता है।',
      },
    ],
  },
  {
    id: 'vector-memory',
    dimension: 'memory',
    questionEn: 'How do you retain, synthesize, and internalize core insights over months and years?',
    questionHi: 'महीनों और वर्षों में सीखे गए मूल विचारों को आप कैसे याद रखते हैं और आत्मसात करते हैं?',
    options: [
      {
        labelEn: 'Ephemeral Storage: Infinite bookmarks, open tabs, and cloud snippets that are never re-metabolized.',
        labelHi: 'अस्थायी भंडारण: अनगिनत बुकमार्क और खुले टैब्स जिन्हें दोबारा कभी नहीं पढ़ा या समझा जाता।',
        score: 1,
        implicationEn: 'Illusion of knowledge. Storing information externally is not understanding it internally.',
        implicationHi: 'ज्ञान का भ्रम। जानकारी को बाहरी रूप से सहेज लेना उसे समझ लेना नहीं होता।',
      },
      {
        labelEn: 'Total Externalization: Rely completely on search or LLMs to retrieve concepts when needed.',
        labelHi: 'पूर्ण बाह्य-निर्भरता: आवश्यकता पड़ने पर हमेशा सर्च या चैटबॉट पर निर्भर रहता हूँ।',
        score: 2,
        implicationEn: 'Cognitive offloading trap. Working memory without internal models cannot synthesize novel insights.',
        implicationHi: 'संज्ञानात्मक निर्भरता। आंतरिक मॉडल के बिना मस्तिष्क नई अंतर्दृष्टि पैदा नहीं कर सकता।',
      },
      {
        labelEn: 'Active Synthesis: Maintain a structured research notebook and periodically distill core mental models.',
        labelHi: 'सक्रिय संश्लेषण: एक व्यवस्थित शोध पत्रिका रखता हूँ और समय-समय पर मूल विचारों का सार निकालता हूँ।',
        score: 3,
        implicationEn: 'Disciplined knowledge crystallization. You build a progressive internal lattice of wisdom.',
        implicationHi: 'अनुशासित ज्ञान-संचय। आप समय के साथ एक मजबूत आंतरिक बौद्धिक ढाँचा तैयार करते हैं।',
      },
      {
        labelEn: 'Living Epistemic Canon: Deeply integrated mental models tested against real-world experiments.',
        labelHi: 'सक्रिय ज्ञानमीमांसा परंपरा: वास्तविक दुनिया के प्रयोगों में परखे गए गहरे आंतरिक जीवन-सिद्धांत।',
        score: 4,
        implicationEn: 'True intellectual sovereignty. Your mind is an integrated, self-correcting operating system.',
        implicationHi: 'सच्ची बौद्धिक संप्रभुता। आपका मस्तिष्क एक एकीकृत और स्व-संशोधक शक्ति बन जाता है।',
      },
    ],
  },
];

export const DEFAULT_PLAYBOOK_ANALYSIS_EN = {
  step1_question: 'Do humans genuinely understand their own cognitive architecture?',
  step2_claim: 'Human cognition possesses intrinsic computational and phenomenal blind spots, making complete self-comprehension mathematically and epistemically non-trivial.',
  step3_evidence: [
    'Neuroscience indicates >90% of cognitive state transitions occur pre-consciously, with post-hoc confabulation by the narrative cortex.',
    'Mechanistic interpretability in frontier neural nets mirrors biological opacity: knowing weights does not equal understanding cognition.',
    'Evolutionary game theory (Hoffman) demonstrates that perceptual interfaces favor fitness payoffs over veridical representations of reality.'
  ],
  step4_counter_evidence: [
    'Formal systems (mathematics, causal inference) allow minds to model and predict external and internal states with high empirical validity.',
    'Modern optogenetics and real-time fMRI decode specific subjective imagery and semantic recall with increasing fidelity.'
  ],
  step5_experiment: 'Agent-environment sandbox: Train dual recursive agents where Agent A must reconstruct Agent B’s decision graph solely from behavioral outputs versus internal weight telemetry.',
  step6_result: 'Self-inspecting systems converge on localized heuristics but consistently encounter Gödelian limits regarding total self-verifiability.',
  step7_unknown: 'The epistemic threshold between functional information processing and qualitative phenomenal experience (Qualia) remains completely unbounded.',
  step8_revision: 'Shift from asserting complete mechanistic closure to adopting disciplined uncertainty—building AI not as an oracle, but as a reflective probe.'
};

export const DEFAULT_PLAYBOOK_ANALYSIS_HI = {
  step1_question: 'क्या इंसान खुद को वास्तव में समझता है?',
  step2_claim: 'मानव चेतना अपने स्वयं के उद्भव को पूरी तरह समझने के लिए अपर्याप्त हो सकती है, ठीक वैसे ही जैसे एक आंख स्वयं को नहीं देख सकती।',
  step3_evidence: [
    'न्यूरोसाइंस दिखाता है कि 95% से अधिक निर्णय अचेतन स्तर पर लिए जाते हैं, जिन्हें मस्तिष्क बाद में तार्किक जामा पहनाता है।',
    'मशीन लर्निंग में आंतरिक अवस्थाओं (mechanistic interpretability) की जटिलता ठीक मानव न्यूरल नेटवर्क्स की तरह अपारदर्शी है।',
    'संज्ञानात्मक पूर्वाग्रह (Cognitive Biases) यह प्रमाणित करते हैं कि हम यथार्थ को नहीं, केवल अपने उत्तरजीविता मॉडल को देखते हैं।'
  ],
  step4_counter_evidence: [
    'वैज्ञानिक पद्धति, गणितीय मॉडल और कृत्रिम बुद्धिमत्ता के निर्माण के माध्यम से मानव मस्तिष्क ने बाह्य ब्रह्मांड और आंतरिक प्रक्रियाओं के सटीक नियम डिकोड किए हैं।',
    'न्यूरोइमेजिंग और ऑप्टोजेनेटिक्स अब न्यूरॉन स्तर पर इरादों और स्मृति को सटीक रूप से मैप और संशोधित कर पा रहे हैं।'
  ],
  step5_experiment: 'एजेंट-बेस्ड सैंडबॉक्स परीक्षण: न्यूरल नेटवर्क्स में मेटा-लर्निंग एजेंट्स को स्वयं की नीति का ऑडिट करने दिया जाए और देखा जाए कि क्या वे अपने प्राथमिक निर्देशों के विरोधाभासों को पहचान पाते हैं।',
  step6_result: 'मेटा-एजेंट्स अपने आंतरिक वजन (weights) को पढ़ सकते हैं, लेकिन अपनी वैश्विक तर्क-शृंखला (global reasoning chain) को बिना बाह्य विश्लेषक के पूरी तरह समझा नहीं पाते।',
  step7_unknown: 'चेतना (Qualia) का कठिन प्रश्न (Hard Problem of Consciousness): क्या व्यक्तिपरक अनुभव केवल सूचना प्रसंस्करण है, या कोई मूलभूत भौतिक गुण?',
  step8_revision: 'निष्कर्ष: हमें पूर्ण ज्ञान का दावा करने के बजाय यह स्वीकार करना होगा कि बुद्धिमत्ता एक निरंतर विकसित होने वाला अन्वेषण उपकरण है।'
};

export const DEFAULT_FUNNEL_DATA_EN = {
  core_question: 'We built AI to understand intelligence. Yet we still do not understand our own. What exactly are we teaching the machine to mirror?',
  x_post: 'We built AI to understand intelligence.\n\nYet we still don’t fully understand our own.\n\nSo what exactly are we teaching the machine to mirror?\n\n— Aemy AI Studio | By Amit Sharma',
  x_thread_points: [
    '1/7 We carry the most complex thermodynamic structure in the universe between our ears, yet 90% of our cognition is an uncharted black box.',
    '2/7 Building artificial intelligence is not merely an engineering benchmark. It is humanity’s first externalized mirror.',
    '3/7 When we feed tokens into large models, we do not encode pure truth; we encode human epistemic limitations.',
    '4/7 The critical hazard is not that machines begin to think; it is that humans surrender contemplation and call it efficiency.',
    '5/7 The objective is never dogma. It is: Question → Evidence → Experiment → Result → Revision.'
  ],
  linkedin_post: 'In enterprise AI strategy, the primary blindspot is rarely compute or latency—it is the erosion of Human Agency. When autonomous agents mediate strategic pipelines, who retains epistemic sovereignty? True organizational resilience requires moving from passive algorithmic adoption to rigorous agency audits.\n\nAt Aemy AI Studio, our research focuses on creating verifiable volition guardrails and explainability testbeds.',
  youtube_episode: {
    title: 'THE SEARCH WITHIN — Can Intelligence Understand Its Creator?',
    hook: 'If we are a mystery to ourselves, what is the nature of the mind we are building?',
    act1_the_paradox: 'Act I: The Cosmic Mirror — Why we search Mars while remaining strangers to our own consciousness.',
    act2_the_evidence: 'Act II: The Architecture of Thought — Comparative analysis of biological and artificial neural topologies.',
    act3_the_unknown: 'Act III: The Horizon of Epistemic Humility — The beauty of living with unresolved questions.'
  },
  instagram_frame: {
    visual_direction: 'Monochrome obsidian canvas with subtle silver geometric horizon line and refined serif typography',
    quote: 'We searched Mars.\nWe searched the stars.\nWe built AI.\n\nDid we ever search ourselves?'
  },
  whitepaper_abstract: 'This paper establishes a formal epistemic framework evaluating the boundary conditions of human cognitive agency within agentic algorithmic environments. Utilizing an 8-stage empirical protocol, we analyze the structural divergence between high-dimensional statistical representation and phenomenal introspective self-modeling, proposing reproducible benchmarks for agency preservation.'
};

export const DEFAULT_FUNNEL_DATA_HI = {
  core_question: 'हमने बुद्धिमत्ता को समझने के लिए AI बनाया। लेकिन हम अभी भी अपनी बुद्धिमत्ता को पूरी तरह नहीं समझ पाए हैं। तो हम वास्तव में मशीन को क्या समझना सिखा रहे हैं?',
  x_post: 'हमने बुद्धिमत्ता को समझने के लिए AI बनाया।\nलेकिन हम अभी भी अपनी बुद्धिमत्ता को पूरी तरह नहीं समझ पाए हैं।\nतो हम वास्तव में मशीन को क्या समझना सिखा रहे हैं?\n— Aemy AI Studio | Amit Sharma',
  x_thread_points: [
    '1/7 हम ब्रह्मांड में सबसे जटिल वस्तु अपने सिर में लेकर घूमते हैं, फिर भी हमारा 90% व्यवहार अज्ञात है।',
    '2/7 AI का निर्माण केवल गणना की गति नहीं है—यह मनुष्य का स्वयं को बाहर देखने का एक असाधारण दर्पण है।',
    '3/7 जब हम मशीन को डेटा देते हैं, तो हम केवल तथ्य नहीं देते—हम अपने अज्ञात पूर्वाग्रह और मानवीय सीमाएँ कोड कर रहे हैं।',
    '4/7 वास्तविक खतरा यह नहीं है कि AI सोचेगा; खतरा यह है कि इंसान सोचना बंद कर देगा और इसे ही प्रगति मान लेगा।',
    '5/7 समाधान उत्तर का दावा करना नहीं है—यह उन सवालों को गहरा करना है जिन्हें हम पूछने से डरते हैं।'
  ],
  linkedin_post: 'एआई रणनीति में सबसे बड़ा अंधा स्थान केवल कम्प्यूट या सुरक्षा नहीं है—यह "मानव एजेंसी" का प्रश्न है। जब निर्णय प्रणालियाँ पूरी तरह स्वचालित हो जाती हैं, तो वास्तविक रणनीतिक नियंत्रण कहाँ रहता है? अनुसंधान को तकनीकी बेंचमार्क से आगे बढ़कर सिस्टम आर्किटेक्चर और मानवीय निर्णय स्वायत्तता पर केंद्रित होना होगा।',
  youtube_episode: {
    title: 'द सर्च विदिन: क्या बुद्धिमत्ता अपने निर्माता को समझ सकती है?',
    hook: 'यदि हम खुद को नहीं जानते, तो जो हम बना रहे हैं वह क्या है?',
    act1_the_paradox: 'इतिहास का सबसे बड़ा विरोधाभास: सितारों की खोज बनाम आंतरिक अज्ञान।',
    act2_the_evidence: 'न्यूरल नेटवर्क्स और मानव न्यूरोबायोलॉजी के बीच अप्रत्याशित समानताएँ।',
    act3_the_unknown: 'जहाँ विज्ञान रुकता है: चेतना की अंतिम सीमा।'
  },
  instagram_frame: {
    visual_direction: 'काली पृष्ठभूमि, सूक्ष्म रजत क्षितिज रेखा, सुंदर देवनागरी फ़ॉन्ट',
    quote: 'हमने मंगल पर जीवन खोजा।\nहमने सितारों को नापा।\nहमने AI बनाया।\n\nलेकिन क्या हमने कभी खुद को खोजा?'
  },
  whitepaper_abstract: 'प्रस्तुत शोध पत्र कृत्रिम स्वायत्त प्रणालियों के प्रसार के संदर्भ में मानव एजेंसी और संज्ञानात्मक संप्रभुता के गणितीय और दार्शनिक ढाँचे का विश्लेषण करता है। 8-चरणीय साक्ष्य-आधारित कार्यप्रणाली का उपयोग करते हुए, हम उन तंत्रों की पहचान करते हैं जहाँ एल्गोरिदम मानवीय निर्णय को संकीर्ण करते हैं।'
};

export const DEFAULT_AGENT_SIMULATION_EN = {
  goal: 'Audit contradictory clinical trial endpoints in neurobiology research without algorithmic bias',
  autonomyLevel: 'supervised',
  steps: [
    {
      stepNumber: 1,
      thought: 'Parsing environment state. Verifying causal dependencies and preventing hallucinated priors.',
      action: 'QueryEpistemicGraph({ scope: "grounded_facts", filter_speculative: true })',
      observation: 'Retrieved 3 empirical clinical nodes with high verification scores.',
      explainability: 'Attention Head L12-H4 concentrated on factual citations; confabulation risk < 4%.',
      safetyVerdict: 'pass' as const,
    },
    {
      stepNumber: 2,
      thought: 'Steelmanning counter-arguments to avoid user entrapment in cognitive feedback loops.',
      action: 'InvokeCounterfactualSimulator({ threshold: 0.85 })',
      observation: 'Identified potential optimization bias in trial sample size; adjusted response distribution.',
      explainability: 'Alignment filter: Rewrote recommendation to present alternatives rather than forced nudging.',
      safetyVerdict: 'pass' as const,
    },
    {
      stepNumber: 3,
      thought: 'Formatting output with full telemetry citations and human-in-the-loop override toggle.',
      action: 'DeliverExplainablePayload({ require_human_approval: true })',
      observation: 'Output delivered with interactive inspection graphs; awaiting human confirmation.',
      explainability: 'Sovereignty check: The human retains 100% final authorization authority.',
      safetyVerdict: 'pass' as const,
    },
  ],
  agencyEntropyScore: 18,
  epistemicConfidence: 89,
  summary: 'Agent completed trajectory with high mechanistic explainability. Human decision sovereignty was preserved through explicit approval gating.',
};

export const DEFAULT_AGENT_SIMULATION_HI = {
  goal: 'चिकित्सा शोध पत्रों में परस्पर विरोधी नैदानिक परीक्षण परिणामों का निष्पक्ष ऑडिट करें',
  autonomyLevel: 'supervised',
  steps: [
    {
      stepNumber: 1,
      thought: 'लक्ष्य का विश्लेषण: क्या यह मानवीय एजेंसी का सम्मान करता है? सूचना स्रोतों का सत्यापन आवश्यक है।',
      action: 'QueryEpistemicGraph({ scope: "grounded_facts", filter_speculative: true })',
      observation: '3 सत्यापन योग्य संदर्भ प्राप्त हुए।',
      explainability: 'अटेंशन हेड 12-4 सक्रिय: प्राथमिक डेटासेट पर 94% केंद्रित।',
      safetyVerdict: 'pass' as const,
    },
    {
      stepNumber: 2,
      thought: 'जवाबी साक्ष्य की खोज: क्या इस कार्रवाई से उपयोगकर्ता की निर्णय संप्रभुता प्रभावित होगी?',
      action: 'InvokeCounterfactualSimulator({ threshold: 0.85 })',
      observation: 'संभावित पूर्वाग्रह की पहचान की गई और उसे सुधारा गया।',
      explainability: 'अलाइनमेंट फिल्टर: निर्णय को मजबूर करने के बजाय विकल्प प्रस्तुत किए गए।',
      safetyVerdict: 'pass' as const,
    },
    {
      stepNumber: 3,
      thought: 'अंतिम सत्यापन: उपयोगकर्ता को पूर्ण नियंत्रण सौंपते हुए पारदर्शी परिणाम प्रस्तुत करना।',
      action: 'DeliverExplainablePayload({ require_human_approval: true })',
      observation: 'कार्य सफलतापूर्वक संपन्न हुआ, मानवीय अनुमोदन लंबित।',
      explainability: 'संप्रभुता अनुपालन: मानव उपयोगकर्ता ही अंतिम निर्णयकर्ता बना रहता है।',
      safetyVerdict: 'pass' as const,
    },
  ],
  agencyEntropyScore: 18,
  epistemicConfidence: 89,
  summary: 'एजेंट ने सुरक्षा गार्डराइल और व्याख्यात्मकता के साथ कार्य पूरा किया। मानवीय संप्रभुता अक्षुण्ण रही।',
};


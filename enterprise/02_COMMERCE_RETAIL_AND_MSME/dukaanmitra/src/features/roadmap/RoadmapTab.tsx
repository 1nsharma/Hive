import React, { useState, useMemo, useEffect } from "react";
import { 
  Check, 
  BookOpen, 
  Award, 
  Search, 
  Flame, 
  ChevronRight, 
  Info, 
  Code, 
  Sparkles, 
  RefreshCw, 
  Play, 
  ArrowLeft,
  GraduationCap,
  Cpu,
  Trophy,
  Filter,
  CheckCircle2,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Structure definition for roadmap nodes
interface RoadmapNode {
  id: string;
  label: string;
  hindiLabel?: string;
  category: string;
  description: string;
  hindiDescription?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const ROADMAP_DATA: RoadmapNode[] = [
  // 1. Internet Basics
  {
    id: "internet-work",
    label: "How does the Internet Work?",
    hindiLabel: "इंटरनेट कैसे काम करता है?",
    category: "The Internet",
    description: "The internet is a global network of interconnected computers that communicate using standard protocols (TCP/IP). Every machine has an IP address, allowing data packets to find their destination.",
    hindiDescription: "इंटरनेट आपस में जुड़े कंप्यूटरों का एक वैश्विक नेटवर्क है जो मानक प्रोटोकॉल (TCP/IP) का उपयोग करके बात करते हैं। हर कंप्यूटर का एक विशिष्ट IP एड्रेस होता है।",
    codeSnippet: "# Ping a server to check connectivity\nping google.com",
    codeLanguage: "bash",
    quizQuestion: {
      question: "What does IP stand for in IP Address?",
      options: ["Internet Protocol", "Internal Process", "Intranet Protocol", "Inter-Port"],
      correctIndex: 0,
      explanation: "IP stands for Internet Protocol, which is the principal communications protocol for relaying datagrams across network boundaries."
    }
  },
  {
    id: "http",
    label: "What is HTTP?",
    hindiLabel: "HTTP क्या है?",
    category: "The Internet",
    description: "Hypertext Transfer Protocol (HTTP) is the protocol used by web browsers and servers to communicate. It follows a Request-Response model where clients ask for resources and servers deliver them.",
    hindiDescription: "हाइपरटेक्स्ट ट्रांसफर प्रोटोकॉल (HTTP) वह प्रोटोकॉल है जिसका उपयोग ब्राउज़र और सर्वर संवाद करने के लिए करते हैं। यह क्लाइंट-सर्वर अनुरोध-प्रतिक्रिया मॉडल पर आधारित है।",
    codeSnippet: "GET /api/products HTTP/1.1\nHost: bazaarsync.com\nAccept: application/json",
    codeLanguage: "http",
    quizQuestion: {
      question: "Which HTTP method is typically used to create new resources on a server?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctIndex: 1,
      explanation: "POST is the standard HTTP method used to send data to the server to create a new resource."
    }
  },
  {
    id: "dns",
    label: "What is DNS?",
    hindiLabel: "DNS क्या है?",
    category: "The Internet",
    description: "Domain Name System (DNS) translates human-friendly domain names (like google.com) into machine-readable IP addresses (like 142.250.190.46). It acts as the phonebook of the internet.",
    hindiDescription: "डोमेन नेम सिस्टम (DNS) इंसानों के अनुकूल वेबसाइट नामों (जैसे google.com) को कंप्यूटर के अनुकूल IP पते (जैसे 142.250.190.46) में बदलता है।",
    codeSnippet: "# DNS lookup command\nnslookup google.com",
    codeLanguage: "bash",
    quizQuestion: {
      question: "Which port does DNS primarily use for querying?",
      options: ["Port 80", "Port 443", "Port 53", "Port 22"],
      correctIndex: 2,
      explanation: "DNS primarily uses UDP/TCP Port 53 to listen for recursive and authoritative domain name resolution requests."
    }
  },
  // 2. Basics
  {
    id: "html",
    label: "HTML Basics & Semantic Layouts",
    hindiLabel: "HTML बेसिक्स और सिमेंटिक लेआउट",
    category: "Basic Languages",
    description: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. Semantic HTML uses tags that convey meaning about the content (e.g., <article>, <header>, <nav>) which improves SEO and accessibility.",
    hindiDescription: "HTML वेब पेज बनाने की मानक भाषा है। सिमेंटिक HTML उन टैग्स का उपयोग करता है जो सामग्री का अर्थ स्पष्ट करते हैं (जैसे <header>, <nav>, <article>)।",
    codeSnippet: "<header>\n  <nav>\n    <a href='/'>BazaarSync Home</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>Welcome to Digital Munim</h1>\n  </article>\n</main>",
    codeLanguage: "html",
    quizQuestion: {
      question: "Which tag is best suited for the main unique content of a web page?",
      options: ["<div>", "<main>", "<section>", "<article>"],
      correctIndex: 1,
      explanation: "<main> represents the dominant, primary content of the body of a document. It should only appear once per page."
    }
  },
  {
    id: "css",
    label: "CSS Basics & Layouts",
    hindiLabel: "CSS बेसिक्स और लेआउट",
    category: "Basic Languages",
    description: "CSS (Cascading Style Sheets) styles and formats HTML. Modern layout systems like Flexbox and Grid allow developers to create responsive, complex, and beautiful structures easily.",
    hindiDescription: "CSS का उपयोग वेब पेज को सजाने और लेआउट करने के लिए होता है। फ्लेक्सबॉक्स (Flexbox) और ग्रिड (Grid) आधुनिक लेआउट सिस्टम हैं जो रिस्पॉन्सिव डिज़ाइन को आसान बनाते हैं।",
    codeSnippet: "/* Flexbox centered container */\n.centered-box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}",
    codeLanguage: "css",
    quizQuestion: {
      question: "What CSS property creates space outside the border of an element?",
      options: ["padding", "margin", "gap", "border-width"],
      correctIndex: 1,
      explanation: "Margin creates space around elements, outside of any defined borders, whereas padding creates space inside the borders."
    }
  },
  {
    id: "javascript",
    label: "JavaScript & DOM Manipulation",
    hindiLabel: "जावास्क्रिप्ट और डॉम हेरफेर",
    category: "Basic Languages",
    description: "JavaScript adds interactivity and logic to your website. DOM (Document Object Model) manipulation allows JavaScript to update, delete, and insert HTML elements dynamically based on user events.",
    hindiDescription: "जावास्क्रिप्ट वेब पेजों में लॉजिक और इंटरैक्टिविटी जोड़ती है। DOM मैनिपुलेशन के जरिए हम बटन क्लिक, फॉर्म सबमिशन आदि पर वेबपेज को लाइव बदल सकते हैं।",
    codeSnippet: "const button = document.querySelector('#bill-btn');\nbutton.addEventListener('click', () => {\n  console.log('Bill Generated Successfully!');\n});",
    codeLanguage: "javascript",
    quizQuestion: {
      question: "Which array method creates a new array with all elements that pass a test?",
      options: ["map()", "forEach()", "filter()", "reduce()"],
      correctIndex: 2,
      explanation: "The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test."
    }
  },
  // 3. VCS
  {
    id: "git",
    label: "Git (Version Control)",
    hindiLabel: "गिट (वर्जन कंट्रोल)",
    category: "Version Control",
    description: "Git is a distributed version control system that tracks modifications in source code files. It allows multiple developers to coordinate, manage history, merge features, and roll back bad updates.",
    hindiDescription: "गिट (Git) एक वर्जन कंट्रोल सिस्टम है जो कोड में होने वाले बदलावों को ट्रैक करता है। यह मल्टीपल डेवलपर्स को एक साथ काम करने की सुविधा देता है।",
    codeSnippet: "# Track, commit, and push changes\ngit add .\ngit commit -m 'Added Purchases Tab'\ngit push origin main",
    codeLanguage: "bash",
    quizQuestion: {
      question: "What command creates a new branch and immediately switches to it?",
      options: ["git branch <name>", "git checkout -b <name>", "git switch <name>", "git merge <name>"],
      correctIndex: 1,
      explanation: "git checkout -b <name> is the classic command to create and switch to a new branch in one step."
    }
  },
  // 4. Package Managers
  {
    id: "package-managers",
    label: "Package Managers (npm, yarn, pnpm)",
    hindiLabel: "पैकेज मैनेजर्स (npm, yarn, pnpm)",
    category: "Package Managers",
    description: "Package managers let you install, share, and update external libraries in your project. npm is the default for Node.js, yarn provides speed and caching, and pnpm saves disk space through hard-linking.",
    hindiDescription: "पैकेज मैनेजर प्रोजेक्ट में बाहरी लाइब्रेरियों को डाउनलोड और अपडेट करने में मदद करते हैं। npm, yarn और pnpm इसके प्रमुख उदाहरण हैं।",
    codeSnippet: "# Install a package\nnpm install lucide-react\n# Or with yarn\nyarn add lucide-react\n# Or with pnpm\npnpm add lucide-react",
    codeLanguage: "bash",
    quizQuestion: {
      question: "Which file records the exact dependency versions installed in an npm project?",
      options: ["package.json", "package-lock.json", "npm.config", "yarn.lock"],
      correctIndex: 1,
      explanation: "package-lock.json is automatically generated by npm to guarantee identical installations across different environments."
    }
  },
  // 5. Frameworks
  {
    id: "react",
    label: "React Component Model & Hooks",
    hindiLabel: "रिएक्ट कम्पोनेंट मॉडल और हुक्स",
    category: "Framework Choice",
    description: "React is a declarative library for building user interfaces. It uses a virtual DOM to optimize rendering, modular reusable components, and reactive Hooks like useState and useEffect to manage local state.",
    hindiDescription: "रिएक्ट वेब यूआई बनाने की एक लोकप्रिय लाइब्रेरी है। यह रियूजेबल कॉम्पोनेंट्स और 'हुक्स' (जैसे useState) का उपयोग करके स्टेट मैनेजमेंट करती है।",
    codeSnippet: "import { useState } from 'react';\n\nfunction BillCounter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Bills Created: {count}\n    </button>\n  );\n}",
    codeLanguage: "typescript",
    quizQuestion: {
      question: "What hook is primarily used to perform side effects in React?",
      options: ["useState", "useMemo", "useEffect", "useCallback"],
      correctIndex: 2,
      explanation: "The useEffect Hook lets you perform side effects (data fetching, subscriptions, manual DOM changes) in function components."
    }
  },
  // 6. CSS Advanced
  {
    id: "tailwind",
    label: "Tailwind CSS & Utility-First Styling",
    hindiLabel: "टैलविंड सीएसएस और यूटिलिटी-फर्स्ट स्टाइलिंग",
    category: "Advanced CSS & Design",
    description: "Tailwind CSS is a utility-first CSS framework. Instead of writing custom CSS classes, you apply pre-defined utility classes directly in your HTML/JSX to achieve beautiful layouts and styles instantly.",
    hindiDescription: "Tailwind CSS एक यूटिलिटी-फर्स्ट सीएसएस फ्रेमवर्क है। इसमें आप पहले से बने क्लासेज को सीधे अपने कोड में लिखकर बहुत तेजी से सुंदर यूआई डिजाइन कर सकते हैं।",
    codeSnippet: "<div className='bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all'>\n  <h3 className='text-base font-bold text-slate-800'>Bill Summary</h3>\n</div>",
    codeLanguage: "html",
    quizQuestion: {
      question: "Which Tailwind utility class applies rounded corners to a container?",
      options: ["border-rounded", "corner-lg", "rounded-lg", "round-sm"],
      correctIndex: 2,
      explanation: "rounded-lg is the correct Tailwind CSS class to apply a medium border-radius (8px) to an element."
    }
  },
  // 7. Build Tools
  {
    id: "vite",
    label: "Vite & Fast Development Server",
    hindiLabel: "वाइट (Vite) और सुपरफास्ट देव सर्वर",
    category: "Build Tools & Linting",
    description: "Vite is a modern build tool that provides an extremely fast development server using native ES Modules. It bundles production code using Rollup for optimal loading speeds and features Hot Module Replacement (HMR).",
    hindiDescription: "वाइट (Vite) एक आधुनिक बिल्ड टूल है। यह डेवलपर को सुपरफास्ट रीलोडिंग और native ES Modules का उपयोग करके बहुत तेज डेवलपमेंट अनुभव देता है।",
    codeSnippet: "// vite.config.ts\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 3000 }\n});",
    codeLanguage: "typescript",
    quizQuestion: {
      question: "What core technology does Vite use during development to achieve rapid startups?",
      options: ["Webpack caching", "Native ES Modules (ESM)", "Babel transpiler", "Gulp streams"],
      correctIndex: 1,
      explanation: "Vite serves source code over native ESM, letting the browser do the bundling work during development for instant startups."
    }
  },
  // 8. Testing
  {
    id: "testing",
    label: "Frontend Testing (Vitest, Jest)",
    hindiLabel: "वेबसाइट टेस्टिंग (Vitest, Jest)",
    category: "Testing",
    description: "Testing ensures your code works correctly and prevents regressions. Unit testing (with Vitest/Jest) checks individual functions/components, and End-to-End testing (Playwright) runs actual scenarios in web browsers.",
    hindiDescription: "टेस्टिंग यह सुनिश्चित करती है कि हमारा कोड सही ढंग से काम कर रहा है। यूनिट टेस्टिंग छोटे लॉजिक को चेक करती है, और E2E टेस्ट असली ब्राउज़र चलाकर पूरे सिस्टम को जाँचते हैं।",
    codeSnippet: "import { test, expect } from 'vitest';\nimport { formatRupees } from './utils';\n\ntest('formats currency correctly', () => {\n  expect(formatRupees(150.5)).toBe('₹150.50');\n});",
    codeLanguage: "typescript",
    quizQuestion: {
      question: "Which type of testing verifies that the entire integrated application flows correctly from end-to-end?",
      options: ["Unit Testing", "E2E Testing", "Integration Testing", "Static Analysis"],
      correctIndex: 1,
      explanation: "End-to-End (E2E) Testing replicates real user scenarios, running the database, API, and frontend together in a browser environment."
    }
  },
  // 9. Web Security & Auth
  {
    id: "security",
    label: "Web Security & CORS Basics",
    hindiLabel: "वेब सुरक्षा और CORS की बुनियादी जानकारी",
    category: "Web Security & Auth",
    description: "Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts resources on a web page from being requested from outside its original domain. HTTPS encrypts data in transit to prevent interception.",
    hindiDescription: "CORS ब्राउज़र की एक सुरक्षा प्रणाली है जो किसी वेबसाइट को बाहरी डोमेन से असुरक्षित रिक्वेस्ट भेजने से रोकती है। डेटा को एनक्रिप्ट करने के लिए HTTPS का प्रयोग किया जाता है।",
    codeSnippet: "// Express server CORS headers setting\napp.use((req, res, next) => {\n  res.setHeader('Access-Control-Allow-Origin', 'https://bazaarsync.com');\n  next();\n});",
    codeLanguage: "typescript",
    quizQuestion: {
      question: "What does CORS stand for?",
      options: ["Cross-Origin Resource Sharing", "Centralized Outer Resource Security", "Client-Oriented Remote Server", "Cascading Object Response System"],
      correctIndex: 0,
      explanation: "CORS stands for Cross-Origin Resource Sharing, allowing servers to declare which origins are permitted to load assets."
    }
  },
  // 10. Advanced Type System & SSR
  {
    id: "typescript",
    label: "TypeScript Type Safety",
    hindiLabel: "टाइपस्क्रिप्ट टाइप सुरक्षा",
    category: "Type Checkers & SSR",
    description: "TypeScript is a strongly-typed superset of JavaScript. It adds static types to catch errors at compile-time instead of runtime, providing excellent editor auto-complete and predictable, solid codebases.",
    hindiDescription: "टाइपस्क्रिप्ट जावास्क्रिप्ट का एक सशक्त रूप है जिसमें वेरिएबल्स के प्रकार (Types) निश्चित होते हैं। इससे कोड लिखने के दौरान ही गलतियाँ पकड़ी जाती हैं।",
    codeSnippet: "interface Product {\n  id: string;\n  name: string;\n  price: number;\n  stock: number;\n}\n\nfunction calculateTotalValue(p: Product): number {\n  return p.price * p.stock;\n}",
    codeLanguage: "typescript",
    quizQuestion: {
      question: "Which keyword is used to declare user-defined structures and type schemas in TypeScript?",
      options: ["class", "interface", "struct", "module"],
      correctIndex: 1,
      explanation: "The 'interface' keyword is standard for describing object structures and shape expectations in TypeScript."
    }
  }
];

const CATEGORIES = [
  "All",
  "The Internet",
  "Basic Languages",
  "Version Control",
  "Package Managers",
  "Framework Choice",
  "Advanced CSS & Design",
  "Build Tools & Linting",
  "Testing",
  "Web Security & Auth",
  "Type Checkers & SSR"
];

export default function RoadmapTab() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  
  // Quiz states
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);

  // Persistence of node progress
  // Key: node.id, Value: "not-started" | "learning" | "mastered"
  const [progress, setProgress] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("bazaarsync_roadmap_progress");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    // Initial defaults
    return {
      "internet-work": "mastered",
      "html": "learning"
    };
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem("bazaarsync_roadmap_streak");
      return saved ? parseInt(saved, 10) : 5; // Default 5 days streak for excitement!
    } catch (e) {
      return 5;
    }
  });

  useEffect(() => {
    localStorage.setItem("bazaarsync_roadmap_progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("bazaarsync_roadmap_streak", streak.toString());
  }, [streak]);

  // Statistics
  const stats = useMemo(() => {
    const total = ROADMAP_DATA.length;
    const mastered = Object.values(progress).filter(s => s === "mastered").length;
    const learning = Object.values(progress).filter(s => s === "learning").length;
    const percent = Math.round((mastered / total) * 100);
    return { total, mastered, learning, percent };
  }, [progress]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return ROADMAP_DATA.filter(node => {
      const matchesCategory = activeCategory === "All" || node.category === activeCategory;
      const matchesSearch = 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (node.hindiLabel && node.hindiLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const updateNodeStatus = (nodeId: string, status: string) => {
    setProgress(prev => ({
      ...prev,
      [nodeId]: status
    }));
    
    // If mastered, potentially raise streak!
    if (status === "mastered" && progress[nodeId] !== "mastered") {
      setStreak(prev => prev + 1);
    }
  };

  const handleSelectNode = (node: RoadmapNode) => {
    setSelectedNode(node);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizCorrect(false);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || !selectedNode?.quizQuestion) return;
    const isCorrect = selectedAnswer === selectedNode.quizQuestion.correctIndex;
    setQuizCorrect(isCorrect);
    setQuizSubmitted(true);
    
    if (isCorrect) {
      updateNodeStatus(selectedNode.id, "mastered");
    }
  };

  // Next recommended topic logic
  const recommendedTopic = useMemo(() => {
    return ROADMAP_DATA.find(node => {
      const status = progress[node.id] || "not-started";
      return status !== "mastered";
    }) || ROADMAP_DATA[0];
  }, [progress]);

  return (
    <div className="content h-full overflow-y-auto pb-[95px] p-4 hide-scrollbar select-none" id="roadmap-tab-root">
      
      {/* Top Banner & Title */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#16A34A]" />
            रोडमार्क लर्निंग और विकास (Interactive Roadmap)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Learn modern Web Engineering concepts, track skill masteries, and advance your team's stack.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1.5 rounded-2xl shadow-sm">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span className="font-bold font-mono text-sm">{streak} Day Streak</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white border border-slate-200/60 rounded-[28px] p-5 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center bg-indigo-50 rounded-full">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-indigo-600 transition-all duration-500" 
              style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`, transform: `rotate(${stats.percent * 3.6}deg)` }}
            ></div>
            <span className="font-mono font-bold text-slate-800 text-sm z-10">{stats.percent}%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Your Web Mastery Progress</h3>
            <p className="text-xs text-slate-400">
              Mastered <span className="font-semibold text-slate-700">{stats.mastered}</span> of <span className="font-semibold text-slate-700">{stats.total}</span> fundamental skills.
            </p>
            <div className="flex gap-2 mt-1.5">
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> {stats.mastered} Mastered
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center gap-1">
                <BookOpen className="w-2.5 h-2.5" /> {stats.learning} Learning
              </span>
            </div>
          </div>
        </div>

        {/* AI Next Recommendation */}
        {recommendedTopic && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 flex-1 max-w-md w-full">
            <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Step (अगला कदम)</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <div>
                <p className="text-xs font-bold text-slate-800">{recommendedTopic.label}</p>
                <p className="text-[10px] text-slate-400">{recommendedTopic.hindiLabel}</p>
              </div>
              <button 
                onClick={() => handleSelectNode(recommendedTopic)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                Start <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Roadmap Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Tree & Filter Module (Col-span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Box */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills, topics, concept (e.g. CORS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Horizontal Categories pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 hide-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all border whitespace-nowrap cursor-pointer ${
                    activeCategory === cat 
                      ? "bg-slate-800 text-white border-slate-800 shadow" 
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Skills Tree Map */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              {activeCategory} Skills Map ({filteredNodes.length} items)
            </h3>

            {filteredNodes.length === 0 ? (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400 text-xs">
                कोई विषय नहीं मिला। खोज शब्द बदलें। (No topics found. Try another search query.)
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredNodes.map((node) => {
                  const status = progress[node.id] || "not-started";
                  
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node)}
                      className={`group p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden ${
                        selectedNode?.id === node.id 
                          ? "bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-300 shadow-md" 
                          : status === "mastered"
                          ? "bg-emerald-50/20 border-emerald-200 hover:bg-emerald-50/30"
                          : status === "learning"
                          ? "bg-amber-50/10 border-amber-200 hover:bg-amber-50/20"
                          : "bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Decorative Node Connector Line Style */}
                      <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-3xl -mr-3 -mt-3 group-hover:bg-indigo-50/30 transition-all z-0" />

                      <div className="z-10">
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-mono font-semibold text-slate-400 uppercase tracking-wide">
                            {node.category}
                          </span>
                          
                          {/* Status Badge */}
                          {status === "mastered" && (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> MASTERED
                            </span>
                          )}
                          {status === "learning" && (
                            <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <BookOpen className="w-2.5 h-2.5" /> LEARNING
                            </span>
                          )}
                          {status === "not-started" && (
                            <span className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                              TODO
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mt-2">
                          {node.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-hindi mt-0.5 truncate">
                          {node.hindiLabel}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 z-10">
                        <span className="text-[9px] text-slate-400 group-hover:text-indigo-500 flex items-center gap-0.5 font-medium">
                          <Info className="w-3 h-3" /> View Study Details
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 group-hover:text-indigo-500 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Card & Sandbox Panel (Col-span 5) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-5"
              >
                {/* Detail Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {selectedNode.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-2">{selectedNode.label}</h3>
                    <p className="text-xs font-semibold text-[#16A34A] font-hindi mt-1">{selectedNode.hindiLabel}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Selection Buttons */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mark Status (आपका स्टेटस):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateNodeStatus(selectedNode.id, "not-started")}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                        (progress[selectedNode.id] || "not-started") === "not-started"
                          ? "bg-slate-100 text-slate-700 border-slate-300 shadow-inner"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      🔲 Todo
                    </button>
                    <button
                      onClick={() => updateNodeStatus(selectedNode.id, "learning")}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                        progress[selectedNode.id] === "learning"
                          ? "bg-amber-50 text-amber-700 border-amber-300 shadow-inner"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      📖 Learning
                    </button>
                    <button
                      onClick={() => updateNodeStatus(selectedNode.id, "mastered")}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                        progress[selectedNode.id] === "mastered"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-inner"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      ✅ Mastered
                    </button>
                  </div>
                </div>

                {/* Conceptual Summary */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Concept (मूल अवधारणा):
                  </span>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedNode.description}</p>
                    {selectedNode.hindiDescription && (
                      <div className="border-t border-dashed border-slate-200/80 pt-2">
                        <p className="text-xs font-medium text-indigo-900 leading-relaxed font-hindi">
                          {selectedNode.hindiDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Practical Snippet */}
                {selectedNode.codeSnippet && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Code className="w-3 h-3" /> Code Example (कोड उदाहरण):
                    </span>
                    <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 text-[11px] font-mono overflow-x-auto select-text">
                      <pre>{selectedNode.codeSnippet}</pre>
                    </div>
                  </div>
                )}

                {/* Quiz Segment */}
                {selectedNode.quizQuestion && (
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-purple-500" /> Topic Challenge (चुनौती):
                    </span>
                    
                    <p className="text-xs font-bold text-slate-800">
                      {selectedNode.quizQuestion.question}
                    </p>

                    <div className="space-y-1.5">
                      {selectedNode.quizQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswer(index)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between ${
                            selectedAnswer === index
                              ? "bg-purple-50/50 border-purple-300 text-purple-800 font-semibold"
                              : "bg-slate-50/30 border-slate-200 hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && index === selectedNode.quizQuestion?.correctIndex && (
                            <span className="text-emerald-600 font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={selectedAnswer === null}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        Submit Answer <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className={`p-3 rounded-xl border text-xs ${
                        quizCorrect 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : "bg-rose-50 border-rose-200 text-rose-800"
                      }`}>
                        <p className="font-bold mb-1">
                          {quizCorrect ? "🎉 Correct! (बिल्कुल सही)" : "❌ Try Again! (गलत उत्तर)"}
                        </p>
                        <p className="text-[11px] opacity-90 leading-relaxed">
                          {selectedNode.quizQuestion.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-indigo-50/30 border border-indigo-100/60 rounded-3xl p-8 text-center text-slate-500 space-y-4">
                <BookMarked className="w-12 h-12 text-indigo-400 mx-auto stroke-1" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700">नोड स्टडी सेंटर (No Node Selected)</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Select any skill node from the roadmap on the left to read detailed bilingual summaries, view practical code snippets, and take topic quizzes to unlock mastery.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

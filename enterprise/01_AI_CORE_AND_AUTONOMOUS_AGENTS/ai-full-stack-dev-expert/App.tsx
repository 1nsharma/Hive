
import React, { useState, useCallback } from 'react';
import { GeneratedCode, Service } from './types';
import { generateCode } from './services/geminiService';
import { CodeBlock } from './components/CodeBlock';
import { AiIcon, CodeIcon, DeployIcon, ServerIcon, UserIcon, ChevronRightIcon } from './components/IconComponents';

const initialCode: GeneratedCode = {
    backend: {
        language: 'python',
        code: `# FastAPI Backend Snippet\n\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/api/hello")\ndef read_root():\n    return {"message": "Hello from your AI-generated backend!"}`,
    },
    frontend: {
        language: 'tsx',
        code: `// React Frontend Snippet\n\nimport React, { useState, useEffect } from 'react';\n\nconst App = () => {\n  const [message, setMessage] = useState('');\n\n  useEffect(() => {\n    fetch('/api/hello')\n      .then(res => res.json())\n      .then(data => setMessage(data.message));\n  }, []);\n\n  return <h1>{message}</h1>;\n};\n\nexport default App;`,
    },
    aiIntegration: {
        language: 'python',
        // FIX: Updated initial AI integration code to use a recommended model and best practices for API key handling.
        code: `# Gemini AI Integration Snippet\n\nimport os\nimport google.generativeai as genai\n\n# Configure the API key from environment variables\ngenai.configure(api_key=os.environ.get("API_KEY"))\n\n# Create the model\nmodel = genai.GenerativeModel('gemini-2.5-flash')\n\n@app.get("/api/ai-suggestion")\ndef ai_suggestion(prompt: str):\n    response = model.generate_content(f"Suggest something for: {prompt}")\n    return {"suggestion": response.text}`,
    },
    deployment: {
        platform: 'Fly.io',
        steps: `1. Install flyctl: 'curl -L https://fly.io/install.sh | sh'\n2. Sign up and log in: 'fly auth signup' / 'fly auth login'\n3. Launch the app: 'fly launch'\n4. Deploy changes: 'fly deploy'`,
    },
};

const services: Service[] = [
  { name: 'Google Vertex AI', category: 'AI/ML', description: 'Access Gemini & 200+ other models.', bestFor: 'Training custom models and powerful generative AI.' },
  { name: 'FastAPI', category: 'AI/ML', description: 'Deploy ML models as high-performance APIs.', bestFor: 'Python-based microservices with auto-docs.' },
  { name: 'Fly.io', category: 'Hosting', description: 'Full-stack apps with a global presence.', bestFor: 'Apps needing better uptime than typical free tiers.' },
  { name: 'Google Cloud Run', category: 'Hosting', description: 'Deploy containerized applications quickly.', bestFor: 'Scalable, serverless container hosting.' },
];

const App: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [generatedCode, setGeneratedCode] = useState<GeneratedCode>(initialCode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = useCallback(async () => {
        if (!userInput.trim()) {
            setError('Please describe the functionality you want to implement.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCode(userInput);
            setGeneratedCode(result);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userInput]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans">
            <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-sky-500 to-emerald-400 rounded-lg flex items-center justify-center">
                      <AiIcon className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">AI Full-Stack Dev Expert</h1>
                  </div>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <section className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-500 tracking-tight">
                        From Idea to Deployment, Instantly.
                    </h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
                        Describe your app's functionality, and let our AI generate the backend, frontend, AI integrations, and deployment steps for you.
                    </p>
                </section>

                {/* Workflow Section */}
                <section className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
                        {renderWorkflowStep("User Input", UserIcon)}
                        <ChevronRightIcon className="hidden md:block w-8 h-8 text-slate-600 mx-auto" />
                        {renderWorkflowStep("Code Generation", CodeIcon)}
                        <ChevronRightIcon className="hidden md:block w-8 h-8 text-slate-600 mx-auto" />
                        {renderWorkflowStep("Review & Deploy", DeployIcon)}
                    </div>
                </section>

                {/* Interactive Demo Section */}
                <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 mb-20 shadow-2xl shadow-slate-950/50">
                    <h3 className="text-2xl font-bold mb-4 text-white">Let's Build Something!</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="e.g., A simple task management website where I can add and delete tasks."
                            className="w-full flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none transition resize-none"
                            rows={3}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerateClick}
                            disabled={isLoading}
                            className="bg-sky-600 text-white font-semibold rounded-md px-6 py-3 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center md:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : "✨ Generate Code"}
                        </button>
                    </div>

                    {error && <p className="text-red-400 mb-4 bg-red-900/50 border border-red-800 p-3 rounded-md">{error}</p>}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CodeBlock title="Backend" {...generatedCode.backend} />
                        <CodeBlock title="Frontend" {...generatedCode.frontend} />
                        <CodeBlock title="AI Integration" {...generatedCode.aiIntegration} />
                        {/* FIX: Correctly pass props to the CodeBlock component for deployment to resolve TypeScript error. */}
                        <CodeBlock title={`Deployment (${generatedCode.deployment.platform})`} language="bash" code={generatedCode.deployment.steps} />
                    </div>
                </section>
                
                {/* Services Section */}
                <section className="mb-20">
                    <h3 className="text-3xl font-bold text-center mb-10 text-white">Powered by World-Class Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map(service => (
                           <div key={service.name} className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-sky-500 hover:scale-105 transition-all duration-300">
                               <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-3 inline-block ${service.category === 'AI/ML' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                                 {service.category}
                               </span>
                               <h4 className="font-bold text-lg text-white mb-2">{service.name}</h4>
                               <p className="text-sm text-slate-400 mb-3">{service.description}</p>
                               <p className="text-xs text-slate-500"><span className="font-semibold text-slate-400">Best for:</span> {service.bestFor}</p>
                           </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-800 mt-12 py-8">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} AI Full-Stack Dev Expert. A Gemini-Powered Application.</p>
              </div>
            </footer>
        </div>
    );
};

const renderWorkflowStep = (title: string, Icon: React.FC<{className?: string}>) => (
  <div className="flex flex-col items-center space-y-3 text-slate-400">
    <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center">
      <Icon className="w-8 h-8 text-sky-400" />
    </div>
    <span className="font-semibold text-sm">{title}</span>
  </div>
);


export default App;
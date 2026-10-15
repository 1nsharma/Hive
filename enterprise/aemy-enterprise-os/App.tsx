
import React, { useState, useCallback } from 'react';
import { generateRoadmap } from './services/geminiService';
import { Roadmap, ProjectInput } from './types';
import Header from './components/Header';
import RoadmapDisplay from './components/RoadmapDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { INITIAL_PROMPT } from './constants';

const App: React.FC = () => {
  const [input, setInput] = useState<ProjectInput>({
    description: INITIAL_PROMPT,
    targetAudience: '',
    techStack: '',
    timeline: ''
  });
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProjectInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateRoadmap = useCallback(async () => {
    if (!input.description.trim()) {
      setError('Please provide a project description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      const generatedRoadmap = await generateRoadmap(input);
      setRoadmap(generatedRoadmap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate roadmap: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-6">
            Blueprint Your Project
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Project Vision & Core Idea *</label>
              <textarea
                value={input.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your vision..."
                className="w-full h-32 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow resize-none placeholder-gray-600"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Audience</label>
              <input
                type="text"
                value={input.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="e.g. Small business owners, Teens, Devs..."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-600"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tech Stack Preference</label>
              <input
                type="text"
                value={input.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
                placeholder="e.g. React, Node, Tailwind, Python..."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-600"
                disabled={isLoading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Desired Timeline</label>
              <input
                type="text"
                value={input.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="e.g. 3 Months, Rapid Prototype, 1 Year MVP..."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-600"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/25"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Architecting Your Roadmap...</span>
              </>
            ) : (
              'Generate Intelligent Roadmap'
            )}
          </button>
        </div>

        <div className="mt-12">
          {error && <ErrorMessage message={error} />}
          {isLoading && !roadmap && (
            <div className="text-center py-12 animate-pulse text-purple-300">
              <p className="text-xl">Gemini is processing your project data...</p>
              <p className="text-sm text-gray-500 mt-2">Integrating tech stack and audience research.</p>
            </div>
          )}
          {roadmap && <RoadmapDisplay roadmap={roadmap} />}
        </div>
      </main>
    </div>
  );
};

export default App;

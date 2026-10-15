
import React, { useState } from 'react';
import { Roadmap, Milestone as MilestoneType, Feature } from '../types';

interface RoadmapDisplayProps {
  roadmap: Roadmap;
}

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors duration-300">
        <h4 className="font-semibold text-purple-300">{feature.name}</h4>
        <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
    </div>
);

const Milestone: React.FC<{ milestone: MilestoneType; index: number }> = ({ milestone, index }) => {
    const isEven = index % 2 === 0;
    const timelineClass = isEven ? 'md:left-1/2 md:-translate-x-1/2' : 'md:left-1/2 md:-translate-x-1/2';
    const contentClass = isEven ? 'md:pr-8' : 'md:pl-8 md:text-right';
    const containerClass = isEven ? 'md:flex-row' : 'md:flex-row-reverse';

    return (
        <div className={`flex items-center w-full mb-12 relative ${containerClass}`}>
            <div className={`hidden md:block w-1/2 ${contentClass}`}>
                <h3 className="text-2xl font-bold text-pink-400">{milestone.title}</h3>
                <span className="inline-block px-3 py-1 bg-purple-900/40 text-purple-300 text-xs font-semibold rounded-full mt-2 mb-4">
                  {milestone.duration}
                </span>
            </div>
            <div className={`absolute w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full z-10 shadow-lg shadow-purple-500/50 hidden md:block ${timelineClass}`}></div>
            <div className="w-full md:w-1/2 p-4">
                 <div className="md:hidden mb-4">
                    <h3 className="text-xl font-bold text-pink-400">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">{milestone.duration}</p>
                </div>
                <div className="space-y-4">
                    {milestone.features.map((feature, idx) => (
                        <FeatureCard key={idx} feature={feature} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ExportActions: React.FC<{ roadmap: Roadmap }> = ({ roadmap }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'keep'>('idle');

    const generateMarkdown = () => {
        let md = `# ${roadmap.projectName}\n\n`;
        md += `${roadmap.projectDescription}\n\n`;
        roadmap.milestones.forEach((m) => {
            md += `## ${m.title} (${m.duration})\n`;
            m.features.forEach((f) => {
                md += `- [ ] **${f.name}**: ${f.description}\n`;
            });
            md += `\n`;
        });
        return md;
    };

    const downloadFile = (content: string, fileName: string, contentType: string) => {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const handleExportJSON = () => {
        downloadFile(JSON.stringify(roadmap, null, 2), `${roadmap.projectName.toLowerCase().replace(/\s+/g, '-')}-roadmap.json`, 'application/json');
    };

    const handleExportMD = () => {
        downloadFile(generateMarkdown(), `${roadmap.projectName.toLowerCase().replace(/\s+/g, '-')}-roadmap.md`, 'text/markdown');
    };

    const handleCopyToKeep = async () => {
        try {
            const content = generateMarkdown();
            await navigator.clipboard.writeText(content);
            setCopyStatus('keep');
            setTimeout(() => setCopyStatus('idle'), 2500);
            
            // Redirect to Google Keep as a gesture, helping the user paste
            window.open('https://keep.google.com/', '_blank');
        } catch (err) {
            console.error('Failed to copy for Keep!', err);
        }
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generateMarkdown());
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12 mb-16 px-4">
            <button
                onClick={handleExportMD}
                className="inline-flex items-center px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-medium transition-all group hover:-translate-y-1 shadow-md"
                title="Download as Markdown"
            >
                <svg className="w-5 h-5 mr-2 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Markdown
            </button>
            <button
                onClick={handleExportJSON}
                className="inline-flex items-center px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-medium transition-all group hover:-translate-y-1 shadow-md"
                title="Download as JSON"
            >
                <svg className="w-5 h-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                JSON
            </button>
            <button
                onClick={handleCopyToKeep}
                className={`inline-flex items-center px-5 py-2.5 border rounded-xl text-sm font-medium transition-all group hover:-translate-y-1 shadow-md ${
                    copyStatus === 'keep' 
                    ? 'bg-yellow-900/40 border-yellow-500 text-yellow-200' 
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'
                }`}
            >
                 <svg className="w-5 h-5 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {copyStatus === 'keep' ? 'Ready to Paste in Keep!' : 'Google Keep Todo'}
            </button>
            <button
                onClick={handleCopyToClipboard}
                className={`inline-flex items-center px-5 py-2.5 border rounded-xl text-sm font-medium transition-all group hover:-translate-y-1 shadow-md ${
                    copyStatus === 'copied' 
                    ? 'bg-green-900/40 border-green-500 text-green-300' 
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white'
                }`}
            >
                {copyStatus === 'copied' ? (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2 text-pink-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy MD
                    </>
                )}
            </button>
        </div>
    );
};


const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ roadmap }) => {
  return (
    <div className="animate-fade-in pb-20">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight">
          {roadmap.projectName}
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed italic">
          "{roadmap.projectDescription}"
        </p>
      </div>

      <ExportActions roadmap={roadmap} />
      
      <div className="relative container mx-auto px-4 max-w-5xl">
        <div className="absolute h-full border-r-2 border-dashed border-purple-500/20 left-2.5 md:left-1/2 md:-translate-x-1/2 top-0"></div>
        {roadmap.milestones.map((milestone, index) => (
          <Milestone key={index} milestone={milestone} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RoadmapDisplay;

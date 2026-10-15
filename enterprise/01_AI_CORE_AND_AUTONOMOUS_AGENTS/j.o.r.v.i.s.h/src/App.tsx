/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mic,
  LayoutDashboard,
  MessageSquare,
  FolderGit2,
  Sparkles,
  Cpu,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { JorvishEmblem } from './components/common/JorvishEmblem';
import { VoiceAssistantView } from './components/voice/VoiceAssistantView';
import { DesktopHelperView } from './components/desktop/DesktopHelperView';
import { ChatbotView } from './components/chat/ChatbotView';
import { GithubStudioView } from './components/github/GithubStudioView';
import { BrandKitView } from './components/brand/BrandKitView';
import { AppMode, PersonalityMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppMode>('voice');
  const [personality, setPersonality] = useState<PersonalityMode>('humanity_helper');

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col font-sans selection:bg-[#00A8FF]/30 selection:text-white">
      {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav Links) - Zone 3 (Action) */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0A0E1A]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with emblem */}
        <div
          onClick={() => setActiveTab('voice')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <JorvishEmblem size="sm" isPulsing={activeTab === 'voice'} showGlow={true} />
          <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            J.O.R.V.I.S.H
          </span>
        </div>

        {/* Zone 2: Clean 5-link Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'voice'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'desktop'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Desktop HUD</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Cognitive Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>GitHub Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'brand'
                ? 'bg-[#00A8FF] text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Brand Kit</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Gemini 3.8 Flash</span>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'voice' ? 'chat' : 'voice')}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[#00A8FF] hover:bg-[#0094e0] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-[#00A8FF]/20 whitespace-nowrap"
          >
            {activeTab === 'voice' ? (
              <>
                <MessageSquare className="w-3.5 h-3.5" /> Chat Core
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" /> Wake Voice
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0E1424] border-b border-slate-800 p-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'voice' ? 'bg-[#00A8FF] text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Voice
        </button>
        <button
          onClick={() => setActiveTab('desktop')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'desktop' ? 'bg-[#00A8FF] text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          HUD
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'chat' ? 'bg-[#00A8FF] text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'github' ? 'bg-[#00A8FF] text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          GitHub
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
            activeTab === 'brand' ? 'bg-[#00A8FF] text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Brand
        </button>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 w-full">
        {activeTab === 'voice' && <VoiceAssistantView personality={personality} />}

        {activeTab === 'desktop' && (
          <DesktopHelperView
            personality={personality}
            onNavigateToTab={(tab) => setActiveTab(tab as AppMode)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatbotView
            personality={personality}
            onPersonalityChange={(p) => setPersonality(p)}
          />
        )}

        {activeTab === 'github' && <GithubStudioView />}

        {activeTab === 'brand' && <BrandKitView />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-[#0A0E1A] py-3 px-6 text-center text-xs text-slate-500 font-mono">
        <span>J.O.R.V.I.S.H · Just One Rather Very Intelligent System, Humanity's Helper</span>
        <span className="mx-2" aria-hidden="true">·</span>
        <span>Electric Blue #00A8FF · Titanium Silver #C0C5CE</span>
      </footer>
    </div>
  );
}

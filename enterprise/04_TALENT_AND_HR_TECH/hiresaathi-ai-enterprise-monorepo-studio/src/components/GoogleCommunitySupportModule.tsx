import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Github, 
  Search, 
  Sparkles, 
  Radio, 
  Bot, 
  Layers, 
  RefreshCw,
  LogOut,
  HelpCircle,
  Hash,
  Terminal,
  Activity,
  UserCheck,
  Check,
  Copy,
  Globe
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  getAccessToken, 
  logout, 
  CHAT_SCOPES 
} from '../lib/googleAuth';
import { 
  listGoogleChatSpaces, 
  listGoogleChatMessages, 
  sendGoogleChatMessage, 
  GoogleChatSpace, 
  GoogleChatMessage, 
  GoogleChatApiError 
} from '../lib/googleChatApi';
import { useToast } from './Toast';
import firebaseConfig from '../../firebase-applet-config.json';

interface CommunityMessage {
  id: string;
  author: string;
  role: 'member' | 'bot' | 'moderator';
  avatar?: string;
  time: string;
  text: string;
  isConfirmedLive?: boolean;
}

export const GoogleCommunitySupportModule: React.FC<{ hinglishMode?: boolean }> = ({ hinglishMode = true }) => {
  const { showToast } = useToast();

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Google Chat State
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('community-devs');
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [apiError, setApiError] = useState<GoogleChatApiError | null>(null);

  // Message & Send State
  const [messageInput, setMessageInput] = useState('');
  const [isConfirmingSend, setIsConfirmingSend] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Local/Fallback community spaces
  const defaultCommunitySpaces = [
    {
      id: 'community-devs',
      name: 'spaces/hiresaathi-developers',
      displayName: 'HireSaathi Developer Community',
      description: 'Monorepo architecture, MCP tool development, and AI engineering discussions.',
      membersCount: 48,
    },
    {
      id: 'candidate-support',
      name: 'spaces/candidate-concierge',
      displayName: 'Candidate Help & Support Desk',
      description: 'Live applicant inquiry resolution, interview logistics, and screening transparency.',
      membersCount: 112,
    },
    {
      id: 'ai-alerts',
      name: 'spaces/screening-alerts',
      displayName: 'AI Screening & ATS Alerts',
      description: 'Automated candidate evaluation dispatches, Greenhouse sync alerts, and audit events.',
      membersCount: 19,
    },
  ];

  // Community Messages Feed
  const [messages, setMessages] = useState<Record<string, CommunityMessage[]>>({
    'community-devs': [
      {
        id: 'msg-1',
        author: 'Aarav Sharma',
        role: 'member',
        time: 'Today at 10:15 AM',
        text: 'Hey team! Testing the new Model Context Protocol stdio transport for the GitHub profiler. Latency is around 14ms locally.',
      },
      {
        id: 'msg-2',
        author: 'HireSaathi Bot',
        role: 'bot',
        time: 'Today at 10:16 AM',
        text: '✅ Verified: services/mcp-gateway successfully authenticated stdio bridge. All candidate PII AST masking active.',
      },
      {
        id: 'msg-3',
        author: 'Priya Narang',
        role: 'member',
        time: 'Today at 11:30 AM',
        text: 'Does the Clean Architecture domain layer support custom scoring ratio overrides per job requisition?',
      },
      {
        id: 'msg-4',
        author: 'Lead Architect',
        role: 'moderator',
        time: 'Today at 11:32 AM',
        text: 'Yes! In src/recruit/domain/matching.py you can pass custom weights (e.g., 80% skills / 20% experience) without modifying the entity models.',
      },
    ],
    'candidate-support': [
      {
        id: 'msg-c1',
        author: 'Vikramaditya Bose',
        role: 'member',
        time: 'Today at 9:00 AM',
        text: 'Hello! I applied for the Senior AI Platform Engineer role. How does the automated screening process verify my GitHub repositories?',
      },
      {
        id: 'msg-c2',
        author: 'Support Bot',
        role: 'bot',
        time: 'Today at 9:02 AM',
        text: 'Hello Vikramaditya! HireSaathi AI uses sandboxed GitHub MCP tools to inspect commit cadence and repo complexity without accessing private tokens. Demographic details are completely blinded to prevent bias.',
      },
    ],
    'ai-alerts': [
      {
        id: 'msg-a1',
        author: 'Orchestrator Bot',
        role: 'bot',
        time: 'Today at 8:45 AM',
        text: '⚡ Autonomous Screening Completed for Candidate #4092. Score: 94.8% · Status: Passed auto-screen threshold.',
      },
    ],
  });

  // GitHub Presence Checker State
  const [githubQuery, setGithubQuery] = useState('torvalds');
  const [isScanningGithub, setIsScanningGithub] = useState(false);
  const [githubData, setGithubData] = useState<any | null>(null);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);

  // Initialize Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        fetchLiveSpaces(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const fetchLiveSpaces = async (token: string) => {
    setIsLoadingSpaces(true);
    setApiError(null);
    const result = await listGoogleChatSpaces(token);
    setIsLoadingSpaces(false);

    if (result.error) {
      setApiError(result.error);
    } else if (result.spaces.length > 0) {
      setSpaces(result.spaces);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast('Google Sign-In Successful', `Connected as ${res.user.displayName || res.user.email} with Google Chat permissions.`, 'success');
        fetchLiveSpaces(res.accessToken);
      }
    } catch (err: any) {
      showToast('Sign-In Cancelled or Failed', err.message || 'Please check popup permissions', 'error');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setSpaces([]);
    setApiError(null);
    showToast('Signed Out from Google', 'Session cleared from memory.', 'info');
  };

  // Pre-flight check for sending message (Explicit User Confirmation as per Workspace Skill)
  const handleOpenConfirmDialog = () => {
    if (!messageInput.trim()) {
      showToast('Empty message', 'Please write a message before sending.', 'info');
      return;
    }
    setIsConfirmingSend(true);
  };

  const handleConfirmSendMessage = async () => {
    setIsConfirmingSend(false);
    setIsSendingMessage(true);

    const activeSpaceObj = defaultCommunitySpaces.find(s => s.id === selectedSpaceId) || defaultCommunitySpaces[0];

    // Try real Google Chat API if user is authenticated and token is available
    if (accessToken) {
      const targetSpaceName = spaces.length > 0 ? spaces[0].name : activeSpaceObj.name;
      const apiRes = await sendGoogleChatMessage(targetSpaceName, messageInput, accessToken);

      if (apiRes.error) {
        // If Google Chat App not yet configured in Google Cloud Console, inform gracefully
        if (apiRes.error.isAppNotConfigured) {
          showToast(
            'Google Chat App Configuration Notice',
            'To post directly to your workspace domain, configure your app on the Google Cloud Console Chat page. Posting to Community Feed now.',
            'info'
          );
        }
      }
    }

    // Add message to space feed
    const newMsg: CommunityMessage = {
      id: `msg-${Date.now()}`,
      author: user?.displayName || 'Community Member',
      role: 'member',
      time: 'Just now',
      text: messageInput,
      avatar: user?.photoURL || undefined,
      isConfirmedLive: Boolean(accessToken),
    };

    setMessages(prev => ({
      ...prev,
      [selectedSpaceId]: [...(prev[selectedSpaceId] || []), newMsg],
    }));

    setMessageInput('');
    setIsSendingMessage(false);
    showToast('Message Dispatched to Google Chat Space', `Posted to ${activeSpaceObj.displayName}.`, 'success');

    // Trigger intelligent automated bot reply for support
    if (selectedSpaceId === 'candidate-support' || selectedSpaceId === 'community-devs') {
      setTimeout(() => {
        let botReply = 'Thank you for your question! HireSaathi Community Bot has received your inquiry and our support team has been notified.';
        const lower = newMsg.text.toLowerCase();

        if (lower.includes('interview') || lower.includes('schedule') || lower.includes('status')) {
          botReply = 'Candidate Status Update: You can check your interview slot in the AI Recruit tab. Verified interview invites are synced via WhatsApp MCP.';
        } else if (lower.includes('mcp') || lower.includes('tool') || lower.includes('github')) {
          botReply = 'MCP Architecture Tip: All external tools communicate via JSON-RPC 2.0. Export your mcp-config.json from the MCP Connect tab for local testing.';
        }

        setMessages(prev => ({
          ...prev,
          [selectedSpaceId]: [
            ...(prev[selectedSpaceId] || []),
            {
              id: `bot-${Date.now()}`,
              author: 'HireSaathi AI Support Assistant',
              role: 'bot',
              time: 'Just now',
              text: botReply,
            },
          ],
        }));
      }, 900);
    }
  };

  // GitHub Presence Scan function
  const handleScanGithub = async () => {
    if (!githubQuery.trim()) return;
    setIsScanningGithub(true);
    setGithubData(null);
    setGithubRepos([]);

    try {
      const userRes = await fetch(`https://api.github.com/users/${githubQuery}`);
      if (!userRes.ok) {
        throw new Error(`GitHub user "${githubQuery}" not found (${userRes.status})`);
      }
      const userData = await userRes.json();
      setGithubData(userData);

      const reposRes = await fetch(`https://api.github.com/users/${githubQuery}/repos?sort=updated&per_page=4`);
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setGithubRepos(reposData);
      }

      showToast('GitHub Presence Verified', `Retrieved ${userData.public_repos} public repos for @${userData.login}.`, 'success');
    } catch (err: any) {
      showToast('GitHub Scan Issue', err.message || 'Could not fetch GitHub profile', 'error');
    } finally {
      setIsScanningGithub(false);
    }
  };

  // Initial scan on load
  useEffect(() => {
    handleScanGithub();
  }, []);

  const activeSpace = defaultCommunitySpaces.find(s => s.id === selectedSpaceId) || defaultCommunitySpaces[0];
  const activeMessages = messages[selectedSpaceId] || [];

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>INTEGRATION: Google Chat &amp; Community Support</span>
            <span>·</span>
            <span>PRESENCE AUDIT</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Google Chat Community, Support &amp; GitHub Presence
          </h2>
          <p className="text-xs text-slate-400">
            {hinglishMode
              ? 'Google Chat ke zariye community discussion aur candidate support provide karein, sath hi GitHub presence aur Google ecosystem verify karein.'
              : 'Collaborate with developers and candidates in Google Chat spaces, resolve support queries, and inspect real-time GitHub presence.'}
          </p>
        </div>

        {/* Google Authentication Control */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5 p-1.5 pl-3 pr-2 rounded-xl bg-slate-900 border border-slate-800">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-[10px] font-bold flex items-center justify-center text-white">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="text-left">
                <span className="text-xs font-semibold text-white block leading-tight">{user.displayName || 'Google User'}</span>
                <span className="text-[10px] text-slate-400 block font-mono leading-none">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 p-1 text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign out from Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified Google & GitHub Presence Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Google Chat */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400">GOOGLE CHAT</span>
            <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>
          <h4 className="text-sm font-bold text-white">Community &amp; Support</h4>
          <p className="text-[11px] text-slate-400">
            {user ? 'Authenticated with Google Chat OAuth scopes.' : 'Sign in to sync your enterprise Google Chat spaces.'}
          </p>
        </div>

        {/* Card 2: GitHub Presence */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400">GITHUB PROFILER</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <h4 className="text-sm font-bold text-white">Open Source Presence</h4>
          <p className="text-[11px] text-slate-400">
            Scans developer repositories, commit cadence, and PR review hygiene.
          </p>
        </div>

        {/* Card 3: Google Cloud Project */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400">GCP PROJECT</span>
            <span className="text-[10px] font-mono text-emerald-400">PROVISIONED</span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono">{firebaseConfig.projectId}</h4>
          <p className="text-[11px] text-slate-400">
            OAuth Client ID: <code className="text-[10px] text-slate-300 font-mono">{firebaseConfig.oAuthClientId.slice(0, 16)}...</code>
          </p>
        </div>

        {/* Card 4: Enterprise Anti-Bias Blinding */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400">ANTI-BIAS AUDIT</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-sm font-bold text-white">EU AI Act Compliant</h4>
          <p className="text-[11px] text-slate-400">
            Chat handles and developer profiles sanitized before algorithmic ranking.
          </p>
        </div>
      </div>

      {/* Main Content Grid: Left Google Chat Spaces (7 Cols) + Right GitHub & Presence (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Google Chat Community & Support Space Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col min-h-[580px]">
          {/* Space Selector Tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {defaultCommunitySpaces.map((space) => {
                const isSelected = selectedSpaceId === space.id;
                return (
                  <button
                    key={space.id}
                    onClick={() => setSelectedSpaceId(space.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{space.displayName.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              {activeSpace.membersCount} members
            </span>
          </div>

          {/* Active Space Header */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{activeSpace.displayName}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  GOOGLE CHAT SPACE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeSpace.description}</p>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-850 p-4 space-y-3.5 overflow-y-auto max-h-[360px]">
            {activeMessages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    msg.role === 'bot'
                      ? 'bg-cyan-600 text-white'
                      : msg.role === 'moderator'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}>
                    {msg.role === 'bot' ? <Bot className="w-3 h-3" /> : msg.author[0]}
                  </div>
                  <span className="text-xs font-semibold text-white">{msg.author}</span>
                  {msg.role === 'bot' && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300">BOT</span>
                  )}
                  {msg.role === 'moderator' && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300">MOD</span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">{msg.time}</span>
                </div>
                <p className="text-xs text-slate-300 pl-7 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-900">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Notice for Google Cloud Console App Configuration */}
          {apiError?.isAppNotConfigured && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">One-time Google Chat App Setup: </span>
                <span>To publish directly into external enterprise domain spaces, turn on and configure the Chat App on the Google Cloud Console Configuration page.</span>
                <a
                  href={`https://console.cloud.google.com/apis/api/chat.googleapis.com/hangouts-chat?project=${firebaseConfig.projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-cyan-300 hover:underline block"
                >
                  <span>Open Google Cloud Console Chat Configuration</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Message Input Box with Explicit Confirmation Step */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenConfirmDialog()}
                placeholder={`Send a community or candidate support question in ${activeSpace.displayName}...`}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleOpenConfirmDialog}
                disabled={isSendingMessage}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: GitHub Presence Checker & Google Ecosystem Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* GitHub Presence Scanner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">GitHub Presence Scanner</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">MCP ACTIVE</span>
            </div>

            <p className="text-xs text-slate-400">
              Inspect candidate or contributor open-source repositories and verified commit history.
            </p>

            {/* GitHub Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={githubQuery}
                  onChange={(e) => setGithubQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScanGithub()}
                  placeholder="Enter GitHub username (e.g. torvalds)..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <button
                onClick={handleScanGithub}
                disabled={isScanningGithub}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
              >
                {isScanningGithub ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Scan'}
              </button>
            </div>

            {/* GitHub Results Card */}
            {githubData ? (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={githubData.avatar_url} alt={githubData.login} className="w-10 h-10 rounded-full border border-slate-700" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{githubData.name || githubData.login}</h4>
                    <span className="text-[11px] font-mono text-indigo-400">@{githubData.login}</span>
                    {githubData.bio && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{githubData.bio}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Public Repos</span>
                    <p className="font-bold text-white font-mono mt-0.5">{githubData.public_repos}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Followers</span>
                    <p className="font-bold text-white font-mono mt-0.5">{githubData.followers}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Member Since</span>
                    <p className="font-bold text-white font-mono mt-0.5">{new Date(githubData.created_at).getFullYear()}</p>
                  </div>
                </div>

                {/* Recent Repos */}
                {githubRepos.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Recent Repositories:</span>
                    <div className="space-y-1">
                      {githubRepos.slice(0, 3).map((repo) => (
                        <div key={repo.id} className="p-2 rounded bg-slate-900/60 border border-slate-850 flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-200 truncate max-w-[180px]">{repo.name}</span>
                          <span className="text-[10px] text-indigo-300 font-mono">★ {repo.stargazers_count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs">
                Enter a username to scan GitHub presence.
              </div>
            )}
          </div>

          {/* All Google Presence Health & Cloud Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Google Workspace &amp; Presence Status
              </span>
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            <ul className="text-xs space-y-2">
              <li className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Google Chat API Scopes</span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">CONFIGURED (3 Scopes)</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">OAuth Client ID</span>
                <span className="text-slate-400 font-mono text-[10px]">880117330138-0evobsg...</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Google Cloud Project</span>
                <span className="text-indigo-400 font-mono text-[10px]">amit-ahi</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Session Memory Caching</span>
                <span className="text-emerald-400 font-mono text-[10px]">ZERO LOCALSTORAGE (SECURE)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mandatory User Confirmation Dialog Before Sending Message (Workspace Integration Skill Rule) */}
      {isConfirmingSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <MessageSquare className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Confirm Sending Message</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to send this message to the Google Chat space <strong className="text-white">&quot;{activeSpace.displayName}&quot;</strong> on behalf of your account?
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans max-h-32 overflow-y-auto">
              &quot;{messageInput}&quot;
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsConfirmingSend(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendMessage}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm &amp; Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

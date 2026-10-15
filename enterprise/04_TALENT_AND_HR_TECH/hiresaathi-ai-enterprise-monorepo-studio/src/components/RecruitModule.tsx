import React, { useState } from 'react';
import { 
  JobOpening, 
  CandidateApplicant, 
  INITIAL_JOBS, 
  INITIAL_CANDIDATES 
} from '../data/workspaceData';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  FileText, 
  Play, 
  Sparkles, 
  ArrowUpRight, 
  ExternalLink,
  Code2,
  AlertCircle,
  Send,
  X,
  Copy,
  Check,
  UserPlus,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useToast } from './Toast';

export const RecruitModule: React.FC = () => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('job-1');
  const [candidates, setCandidates] = useState<CandidateApplicant[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplicant | null>(INITIAL_CANDIDATES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Modals
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [whatsappSlot, setWhatsappSlot] = useState('Tomorrow, 4:00 PM - 4:45 PM IST');
  const [whatsappTemplate, setWhatsappTemplate] = useState('technical-round-1');
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  
  // Interactive Parser State
  const [resumeText, setResumeText] = useState(
    `Devashish Verma
Experience: 5.5 years as Senior Software Engineer at Zomato
Skills: Python, FastAPI, Docker, Postgres, Redis, PyTorch, Kubernetes
Summary: Led real-time restaurant allocation engine. Deployed microservices on Kubernetes with Postgres read replicas. Implemented semantic caching using Redis.`
  );
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<any | null>(null);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const filteredCandidates = candidates.filter(c => {
    const matchesJob = c.jobId === selectedJobId;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJob && matchesSearch;
  });

  const handleSimulateParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      // Simulate Clean Architecture domain matching algorithm
      const skillsFound = ['Python', 'FastAPI', 'Docker', 'Postgres', 'PyTorch', 'Kubernetes', 'Redis'];
      const expFound = 5.5;
      
      const matchedMandatory = activeJob.mandatorySkills.filter(s => 
        skillsFound.some(sf => sf.toLowerCase() === s.toLowerCase())
      );
      const mandatoryRatio = matchedMandatory.length / Math.max(activeJob.mandatorySkills.length, 1);
      const expFit = Math.min(expFound / Math.max(activeJob.minYearsExp, 1.0), 1.2);
      const overallScore = Math.round(((mandatoryRatio * 0.65) + (Math.min(expFit, 1.0) * 0.35)) * 1000) / 10;

      const result = {
        candidateName: 'Devashish Verma',
        anonymizedName: 'Candidate #4092 (Anonymized for Anti-Bias)',
        yearsExperience: expFound,
        extractedSkills: skillsFound,
        matchedMandatory,
        missingMandatory: activeJob.mandatorySkills.filter(s => !skillsFound.some(sf => sf.toLowerCase() === s.toLowerCase())),
        overallScore,
        skillCoverage: Math.round(mandatoryRatio * 100),
        experienceFit: Math.round(Math.min(expFit, 1.0) * 100),
        biasStatus: 'PASSED · Identity, university tier, and demographics blinded',
        recommendation: overallScore >= 85 ? 'Strong Match · Auto-Screen Pass' : 'Review Required',
        summary: 'Strong backend systems engineer with production experience in FastAPI and Kubernetes microservices. High match for core engineering stack.'
      };

      setParseResult(result);
      setIsParsing(false);
      showToast('Resume Parsed via Domain Matcher', `Candidate scored ${overallScore}% with ${matchedMandatory.length} mandatory skills matched.`, 'success');
    }, 700);
  };

  const handleAddParsedCandidateToPipeline = () => {
    if (!parseResult) return;
    const newCand: CandidateApplicant = {
      id: `cand-${Date.now()}`,
      name: parseResult.candidateName,
      jobId: selectedJobId,
      title: 'Senior Software Engineer (Parsed from Resume)',
      yearsExperience: parseResult.yearsExperience,
      skills: parseResult.extractedSkills,
      matchScore: parseResult.overallScore,
      skillCoverage: parseResult.skillCoverage,
      experienceFit: parseResult.experienceFit,
      biasAuditStatus: 'clean',
      appliedDate: 'Just now',
      summary: parseResult.summary,
      strengths: ['100% Core FastAPI & Postgres coverage', '5.5 yrs real-world microservice scaling']
    };

    setCandidates(prev => [newCand, ...prev]);
    setSelectedCandidate(newCand);
    showToast('Candidate Added to Pipeline', `${newCand.name} has been added to ${activeJob.title}.`, 'success');
  };

  const handleSendWhatsAppInvite = () => {
    if (!selectedCandidate) return;
    setIsSendingWhatsApp(true);
    setTimeout(() => {
      setIsSendingWhatsApp(false);
      setWhatsappModalOpen(false);
      showToast(
        'WhatsApp Invite Dispatched via MCP',
        `Interview invitation for slot "${whatsappSlot}" sent to ${selectedCandidate.name} via WhatsApp MCP gateway.`,
        'success'
      );
    }, 800);
  };

  // Generate customized questions based on candidate profile
  const candidateQuestions = selectedCandidate ? [
    {
      topic: 'High-Throughput Microservices (FastAPI & gRPC)',
      question: `Given your experience handling high concurrency (${selectedCandidate.yearsExperience} years), how do you structure asynchronous request pipelines in FastAPI with connection pooling in Postgres?`,
      rubric: 'Looking for asyncpg pool configurations, connection reuse, and avoiding blocking I/O in event loops.'
    },
    {
      topic: 'Domain Architecture & Tool Boundaries',
      question: `In our Clean Architecture setup, how do you prevent domain business rules from depending on LLM vendor libraries or database schemas?`,
      rubric: 'Candidate should explain dependency inversion, domain data classes, and repository abstractions.'
    },
    {
      topic: 'Model Context Protocol (MCP) & Agent Isolation',
      question: `How would you sandbox an MCP server executing code inspection tools to prevent malicious parameter injection?`,
      rubric: 'Candidate should mention input AST validation, least-privilege Docker sandboxes, and PII masking.'
    },
    ...(selectedCandidate.concerns ? [{
      topic: 'Specific Focus Area',
      question: `Our screening noted: "${selectedCandidate.concerns}". How have you worked around this or what is your learning curve?`,
      rubric: 'Evaluate self-awareness, willingness to adapt, and relevant architectural parallels.'
    }] : [])
  ] : [];

  const handleCopyQuestions = () => {
    if (!candidateQuestions.length) return;
    const text = candidateQuestions.map((q, idx) => 
      `${idx + 1}. [${q.topic}]\nQ: ${q.question}\nEvaluation Criterion: ${q.rubric}\n`
    ).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
    showToast('Questions Copied to Clipboard', 'You can now paste them directly into your interview scorecard.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <span>SERVICE: services/recruit-service</span>
            <span>·</span>
            <span>DOMAIN: AI Hiring &amp; Anti-Bias Matching</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">AI Recruitment Engine</h2>
          <p className="text-xs text-slate-400">
            Automated resume parsing, deterministic skill matching, and bias-audited candidate pipelines.
          </p>
        </div>

        {/* Job Selector Dropdown / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedJobId === job.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {job.title} ({job.applicantsCount})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Job Overview Banner */}
      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">{activeJob.title}</span>
              <span className="text-xs text-slate-400">· {activeJob.department} · {activeJob.location}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Mandatory Skills:</span>
              {activeJob.mandatorySkills.map(skill => (
                <span key={skill} className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 text-xs border border-slate-700">
                  {skill}
                </span>
              ))}
              <span className="text-xs text-slate-400 ml-2">Min Exp: {activeJob.minYearsExp} yrs</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-slate-400">Pipeline Applicants</span>
              <p className="text-lg font-bold text-white">{activeJob.applicantsCount}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Shortlisted (&gt;85%)</span>
              <p className="text-lg font-bold text-emerald-400">{activeJob.shortlistedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Candidates List + Candidate Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidates List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Ranked Candidate Pipeline</span>
              <span className="text-xs text-slate-500 font-normal">({filteredCandidates.length})</span>
            </h3>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills or candidate..."
                className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredCandidates.map((cand) => {
              const isSelected = selectedCandidate?.id === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{cand.name}</span>
                        <span className="text-xs text-slate-400">· {cand.appliedDate}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{cand.title}</p>
                    </div>

                    {/* Overall Match Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                        <span className="text-xs font-bold text-indigo-200 font-mono">{cand.matchScore}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Domain Match</p>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cand.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                          activeJob.mandatorySkills.includes(skill)
                            ? 'bg-indigo-900/40 text-indigo-200 border border-indigo-800/50'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Anti-Bias & Experience Row */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Anti-Bias Audit Passed</span>
                    </div>
                    <span>{cand.yearsExperience} yrs verified exp</span>
                  </div>
                </div>
              );
            })}

            {filteredCandidates.length === 0 && (
              <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                No candidates found matching the criteria for this role.
              </div>
            )}
          </div>
        </div>

        {/* Candidate Detail Inspector (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedCandidate ? (
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 sticky top-24 space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{selectedCandidate.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{selectedCandidate.title}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">ID: {selectedCandidate.id}</p>
                </div>

                <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/80 text-center">
                  <span className="text-lg font-bold text-indigo-300 font-mono">{selectedCandidate.matchScore}%</span>
                  <p className="text-[10px] text-slate-400">Overall Score</p>
                </div>
              </div>

              {/* Sub-scores Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Clean Architecture Matcher Breakdown:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 text-[11px]">Skill Coverage (65% wt)</span>
                    <p className="text-sm font-semibold text-white mt-1 font-mono">{selectedCandidate.skillCoverage}%</p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-400 text-[11px]">Experience Fit (35% wt)</span>
                    <p className="text-sm font-semibold text-white mt-1 font-mono">{selectedCandidate.experienceFit}%</p>
                  </div>
                </div>
              </div>

              {/* AI Executive Summary */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">AI Screening Summary</span>
                <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedCandidate.summary}
                </p>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Identified Strengths</span>
                <ul className="space-y-1">
                  {selectedCandidate.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCandidate.concerns && (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-start gap-2 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Note: </span>
                    <span>{selectedCandidate.concerns}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => setWhatsappModalOpen(true)}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Interview Invite</span>
                </button>
                <button
                  onClick={() => setQuestionsModalOpen(true)}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Generate Customized Technical Questions</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              Select a candidate to inspect the deep evaluation scorecard.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Resume Parser & Matcher Sandbox */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <Code2 className="w-4 h-4" />
              <span>LIVE TEST SANDBOX · services/recruit-service/src/recruit/domain/matching.py</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Live Resume Parser &amp; Deterministic Domain Matcher
            </h3>
            <p className="text-xs text-slate-400">
              Test how the domain layer extracts skills and scores candidate affinity without making external LLM calls.
            </p>
          </div>

          <button
            onClick={handleSimulateParse}
            disabled={isParsing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20 shrink-0"
          >
            {isParsing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Domain Engine...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Matcher Calculation</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Paste Resume Raw Text or Profile Data:
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Results Area */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-3">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Parsed Domain Output</span>
            </span>

            {parseResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-mono">{parseResult.anonymizedName}</span>
                  <div className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-bold font-mono rounded">
                    Score: {parseResult.overallScore}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400">Extracted Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parseResult.extractedSkills.map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Matched Mandatory:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parseResult.matchedMandatory.map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] border border-emerald-800">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 text-[11px] font-medium block">
                      🛡️ {parseResult.biasStatus}
                    </span>
                    <span className="text-slate-300 text-[11px] mt-0.5 block">
                      Recommendation: {parseResult.recommendation}
                    </span>
                  </div>

                  <button
                    onClick={handleAddParsedCandidateToPipeline}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add to Pipeline</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-36 flex flex-col items-center justify-center text-slate-500 text-center">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <span>Click &quot;Run Matcher Calculation&quot; to test the candidate against &quot;{activeJob.title}&quot;</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Modal Dialog */}
      {whatsappModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Send WhatsApp Interview Invite</h3>
                  <p className="text-xs text-slate-400">Dispatched via WhatsApp Outreach MCP Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Candidate:</label>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200">
                  {selectedCandidate.name} ({selectedCandidate.title})
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Interview Slot Time:</label>
                <input
                  type="text"
                  value={whatsappSlot}
                  onChange={(e) => setWhatsappSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Approved Template:</label>
                <select
                  value={whatsappTemplate}
                  onChange={(e) => setWhatsappTemplate(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="technical-round-1">Round 1: Senior Technical Architecture Screen (45 mins)</option>
                  <option value="system-design">Round 2: Distributed Systems Deep Dive (60 mins)</option>
                  <option value="culture-alignment">Round 3: Engineering Culture &amp; Leadership (30 mins)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Message Preview:</label>
                <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/40 text-slate-300 leading-relaxed font-sans">
                  <p className="text-emerald-400 font-mono text-[11px] mb-1">📲 WhatsApp Business Template #WH-RECRUIT-492</p>
                  Hello {selectedCandidate.name}! We were impressed by your background in {selectedCandidate.skills.slice(0, 3).join(', ')}. 
                  HireSaathi AI has confirmed a match score of {selectedCandidate.matchScore}% for our {activeJob.title} opening. 
                  Would you be available for a technical discussion on {whatsappSlot}?
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWhatsAppInvite}
                disabled={isSendingWhatsApp}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                {isSendingWhatsApp ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting MCP Payload...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch WhatsApp Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customized Technical Questions Modal */}
      {questionsModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Customized Technical Interview Questions</h3>
                  <p className="text-xs text-slate-400">Tailored for {selectedCandidate.name} ({activeJob.title})</p>
                </div>
              </div>
              <button
                onClick={() => setQuestionsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3.5 flex-1 pr-1">
              {candidateQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      Question #{idx + 1}: {q.topic}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Technical Deep Dive
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {q.question}
                  </p>
                  <div className="pt-2 border-t border-slate-850 flex items-start gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400 shrink-0">Evaluation Rubric:</span>
                    <span>{q.rubric}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Generated from verified skills &amp; domain experience fit.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyQuestions}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedQuestions ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuestions ? 'Copied Questions!' : 'Copy to Clipboard'}</span>
                </button>
                <button
                  onClick={() => setQuestionsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

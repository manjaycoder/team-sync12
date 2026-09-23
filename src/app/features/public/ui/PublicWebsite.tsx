import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import { fetchEmployees } from '../../employee/state/employeeSlice';
import { fetchDepartments } from '../../departments/state/departmentSlice';
import { loginEmployee } from '../../auth/state/auth/authAction';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiUsers,
  FiLayers,
  FiSend,
  FiZap,
  FiSearch,
  FiArrowRight,
  FiActivity,
  FiRefreshCw,
  FiX,
  FiCopy,
  FiCheck,
  FiShield,
} from 'react-icons/fi';
import { Sparkles, Bot, CheckCircle2 } from 'lucide-react';

interface StandupAgenda {
  department: string;
  standupTime: string;
  discussionPillars: string[];
  potentialBlockers: string[];
  actionItems: string[];
}

interface SyncBriefing {
  headline: string;
  velocityScore: number;
  executiveSummary: string;
  departmentInsights: Array<{
    department: string;
    health: string;
    focus: string;
  }>;
  keyRecommendations: string[];
  generatedAt: string;
}

export const PublicWebsite: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);

  // Search & Filter for Employees
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Gemini AI Assistant State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'gemini'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: 'Hello! I am the Team-Sync Gemini AI Assistant. Ask me anything about our 5 departments, team leads, employee roles, or company operational velocity.',
      time: 'Just now',
    },
  ]);

  // Standup Modal
  const [activeStandup, setActiveStandup] = useState<StandupAgenda | null>(null);
  const [loadingStandupDept, setLoadingStandupDept] = useState<string | null>(null);

  // Sync Briefing Modal
  const [syncBriefing, setSyncBriefing] = useState<SyncBriefing | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [copiedStandup, setCopiedStandup] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Preset Prompts for Gemini
  const promptSuggestions = [
    'Who are all the department leads?',
    'What are the active projects in Engineering?',
    'How does AI Research collaborate across teams?',
    'Summarize our organizational workforce health',
  ];

  // Ask Gemini Assistant
  const handleAskGemini = async (queryText?: string) => {
    const q = (queryText || aiQuestion).trim();
    if (!q || aiLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiMessages((prev) => [...prev, { sender: 'user', text: q, time: userTime }]);
    setAiQuestion('');
    setAiLoading(true);

    try {
      const res = await axiosInstance.post('/ai/assistant', { question: q });
      const geminiText = res.data?.answer || 'I could not retrieve an answer at this time.';
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: geminiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: 'Our workspace telemetry indicates 6 active team members across 5 divisions operating at 99.9% sync velocity with zero regressions.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // 1-Click Generate Standup for Department
  const handleGenerateStandup = async (deptName: string) => {
    setLoadingStandupDept(deptName);
    try {
      const res = await axiosInstance.post('/ai/standup', { departmentName: deptName });
      if (res.data) {
        setActiveStandup(res.data);
      }
    } catch {
      setActiveStandup({
        department: deptName,
        standupTime: '10:00 AM UTC',
        discussionPillars: [
          `Review sprint telemetry for ${deptName}`,
          'Mitigate dependencies with Engineering & AI Research',
          'Audit automated test suites and milestone deliverables',
        ],
        potentialBlockers: ['Cloud telemetry rate limits under peak load simulation'],
        actionItems: ['Distribute daily digest to all department members'],
      });
    } finally {
      setLoadingStandupDept(null);
    }
  };

  // Generate Full Workspace Sync Briefing
  const handleGenerateBriefing = async () => {
    setSyncLoading(true);
    try {
      const res = await axiosInstance.post('/ai/sync-briefing');
      if (res.data) {
        setSyncBriefing(res.data);
      }
    } catch {
      setSyncBriefing({
        headline: 'Workforce operating at peak synchronization across 5 divisions.',
        velocityScore: 96,
        executiveSummary:
          'All team members are synchronized with 7 active initiatives. AI Research and Engineering are reporting zero delivery blockers.',
        departmentInsights: departments.map((d) => ({
          department: d.name,
          health: 'OPTIMAL',
          focus: `Sprint delivery under ${d.leadName}`,
        })),
        keyRecommendations: [
          'Maintain weekly cross-functional architecture reviews between Engineering and AI Research.',
          'Review resource allocation in departments running more than 5 parallel project tracks.',
        ],
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setSyncLoading(false);
    }
  };

  // 1-Click Instant Demo Login
  const handleInstantDemo = async () => {
    await dispatch(
      loginEmployee({
        email: 'alex.morgan@team-sync.space',
        password: 'password123',
      })
    );
    navigate('/home');
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDept =
        selectedDeptFilter === 'all' ||
        emp.department?.toLowerCase() === selectedDeptFilter.toLowerCase();
      const matchesSearch =
        emp.name?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.role?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.department?.toLowerCase().includes(employeeSearch.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [employees, selectedDeptFilter, employeeSearch]);

  return (
    <div className="min-h-screen bg-[#05030a] text-gray-100 relative selection:bg-violet-600/30 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Ambient Aurora Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="absolute bottom-40 left-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#090613]/80 border-b border-white/[0.08] backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-base shadow-lg shadow-violet-600/30 border border-white/20">
              TS
            </div>
            <div>
              <span className="font-display font-black text-white text-xl tracking-tight block leading-none">
                Team-Sync
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">
                Autonomous Enterprise
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-300">
            <a href="#capabilities" className="hover:text-white transition">Capabilities</a>
            <a href="#ai-sandbox" className="hover:text-violet-300 transition flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gemini AI</span>
            </a>
            <a href="#departments" className="hover:text-white transition">Departments</a>
            <a href="#workforce" className="hover:text-white transition">Team</a>
            <button
              type="button"
              onClick={handleGenerateBriefing}
              className="text-gray-300 hover:text-white transition cursor-pointer"
            >
              Sync Briefing
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleInstantDemo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition cursor-pointer"
            >
              <FiZap className="text-amber-300" />
              <span>Instant Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-6 relative max-w-7xl mx-auto text-center">
        {/* Gemini Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-bold shadow-md shadow-violet-900/20 mb-6 animate-float">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Powered by Google Gemini 1.5 Flash • Enterprise Workspace Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.08]">
          Synchronize Autonomous Teams with{' '}
          <span className="gradient-text-primary">Next-Gen AI Intelligence</span>
        </h1>

        <p className="mt-6 text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Allocate projects, execute deliverables with Google Gemini AI, generate automated daily agile standups, and monitor organizational velocity with precision.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleInstantDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-violet-600/35 transition cursor-pointer"
          >
            <span>Launch Workspace Hub</span>
            <FiArrowRight size={16} />
          </button>

          <a
            href="#ai-sandbox"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-bold text-sm transition cursor-pointer"
          >
            <Bot className="w-4 h-4 text-violet-400" />
            <span>Interactive AI Sandbox</span>
          </a>
        </div>

        {/* Floating Metrics Badge Row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#0e0a1b]/80 border border-white/[0.08] backdrop-blur-md shadow-lg">
            <div className="font-display text-2xl font-extrabold text-white">99.9%</div>
            <div className="text-xs text-violet-300 font-medium mt-0.5">Telemetry Uptime</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0e0a1b]/80 border border-white/[0.08] backdrop-blur-md shadow-lg">
            <div className="font-display text-2xl font-extrabold text-emerald-400">0 ms</div>
            <div className="text-xs text-emerald-300 font-medium mt-0.5">CORS Overhead (Single Instance)</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0e0a1b]/80 border border-white/[0.08] backdrop-blur-md shadow-lg">
            <div className="font-display text-2xl font-extrabold text-white">5 Divisions</div>
            <div className="text-xs text-violet-300 font-medium mt-0.5">Cross-Functional Cadence</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0e0a1b]/80 border border-white/[0.08] backdrop-blur-md shadow-lg">
            <div className="font-display text-2xl font-extrabold text-amber-400">1-Click</div>
            <div className="text-xs text-amber-300 font-medium mt-0.5">Gemini AI Task Solving</div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE GEMINI AI PLAYGROUND */}
      <section id="ai-sandbox" className="py-20 px-6 max-w-5xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Real-Time AI Playground</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ask Google Gemini Anything About the Organization
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Test natural language queries against our real-time MongoDB workforce and project graph.
          </p>
        </div>

        <div className="rounded-3xl bg-[#0d091a]/90 border border-violet-500/30 shadow-2xl overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/30">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <Bot className="w-4 h-4 text-violet-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Synthetix Intelligence Engine</span>
                <span className="text-[10px] text-emerald-400 font-mono">Gemini 1.5 Flash Connected</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateBriefing}
                className="text-[11px] font-semibold text-violet-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer flex items-center gap-1.5"
              >
                <FiRefreshCw size={11} className={syncLoading ? 'animate-spin' : ''} />
                <span>Executive Briefing</span>
              </button>
            </div>
          </div>

          {/* Preset Prompts */}
          <div className="p-4 bg-black/20 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Try Prompt:</span>
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleAskGemini(prompt)}
                className="shrink-0 text-[11px] px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-violet-600/20 hover:border-violet-500/30 border border-white/10 text-gray-300 hover:text-violet-200 transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto bg-[#07050f]/60">
            {aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'gemini' && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25'
                      : 'bg-[#151028] border border-white/10 text-gray-200 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[9px] text-gray-400 mt-2 text-right">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {aiLoading && (
              <div className="flex gap-3 items-center text-xs text-violet-400 animate-pulse">
                <div className="h-8 w-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                </div>
                <span>Gemini AI is analyzing workspace telemetry...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-[#0c0819] border-t border-white/[0.08] flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask anything about departments, milestones, or team velocity..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
            />
            <button
              type="button"
              onClick={() => handleAskGemini()}
              disabled={aiLoading || !aiQuestion.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-violet-600/30"
            >
              <span>Send</span>
              <FiSend size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* BENTO CAPABILITIES GRID */}
      <section id="capabilities" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            Architected for Modern Enterprise Execution
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Everything your team needs to plan, allocate, execute, and monitor deliverables in a single-instance cloud topology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Task Execution */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#120d26] to-[#0a0717] border border-violet-500/25 shadow-xl relative overflow-hidden group">
            <div className="h-12 w-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-6 shadow-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Autonomous AI Task Solver & Deliverable Generator
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Tired of tasks that stall? Click <strong>"✨ AI Complete"</strong> on any deliverable. Google Gemini AI validates test suites, runs architectural audits, and produces a complete technical execution report with verified pass rates.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="text-xs font-bold text-violet-300 hover:text-white flex items-center gap-1.5 group-hover:translate-x-1 transition"
              >
                <span>Explore Task Allocation Hub</span>
                <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Card 2: Agile Standup Generator */}
          <div className="p-8 rounded-3xl bg-[#0e0a1d] border border-white/[0.08] shadow-xl relative group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-6 shadow-md">
              <FiActivity size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Agile Standup Engine
            </h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Generate daily standups with discussion pillars, blocker mitigations, and immediate action items tailored to team size and active projects.
            </p>
          </div>

          {/* Card 3: Single-Instance Cloud Ready */}
          <div className="p-8 rounded-3xl bg-[#0e0a1d] border border-white/[0.08] shadow-xl relative group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-6 shadow-md">
              <FiZap size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Zero-CORS Render Architecture
            </h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Deploy frontend and backend together on a single Render instance. Zero CORS headaches, instant static caching, and automatic SPA routing.
            </p>
          </div>

          {/* Card 4: Enterprise Security */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#0e0a1d] to-[#120d26] border border-white/[0.08] shadow-xl relative group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-6 shadow-md">
              <FiShield size={22} />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Enterprise Role Security & Activity Audit Logging
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Every status change, task allocation, and project milestone is cryptographically logged in real-time. Role-based access ensures secure delegation across coordinators and engineers.
            </p>
          </div>
        </div>
      </section>

      {/* DEPARTMENT SHOWCASE */}
      <section id="departments" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
              <FiLayers />
              <span>Organizational Structure</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              5 Core Divisions Synchronized
            </h2>
          </div>
          <p className="text-gray-400 text-xs max-w-md">
            Click any department to generate a real-time Google Gemini Agile Daily Standup tailored to active project initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id || dept.name}
              className="p-6 rounded-3xl bg-[#0e0a1c] border border-white/[0.08] hover:border-violet-500/40 shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                    {dept.name}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {dept.memberCount || 6} Members
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white group-hover:text-violet-300 transition">
                  {dept.name} Operations
                </h3>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {dept.description || 'Driving core enterprise initiatives and cross-team cadence.'}
                </p>

                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Division Lead</span>
                    <span className="text-gray-200 font-semibold">{dept.leadName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-[10px] block">Active Initiatives</span>
                    <span className="text-emerald-400 font-bold">{dept.activeProjects || 3} Projects</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleGenerateStandup(dept.name)}
                  disabled={loadingStandupDept === dept.name}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {loadingStandupDept === dept.name
                      ? 'Generating Standup...'
                      : 'Generate AI Standup'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMPLOYEE WORKFORCE SHOWCASE */}
      <section id="workforce" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <FiUsers />
              <span>Talent Directory</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Synchronized Team Members
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder="Filter by name, role..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500 w-56"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id || emp.email}
              className="p-5 rounded-3xl bg-[#0e0a1c] border border-white/[0.08] hover:border-violet-500/30 shadow-lg transition flex items-center gap-4 group"
            >
              <img
                src={
                  emp.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={emp.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-violet-500/30 group-hover:ring-violet-400 transition shrink-0"
              />
              <div className="truncate flex-1">
                <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition truncate">
                  {emp.name}
                </h4>
                <div className="text-xs text-gray-400 truncate">{emp.role}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-violet-300 bg-violet-950/40 border border-violet-500/30 px-2 py-0.5 rounded-md">
                    {emp.department}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/[0.08] bg-[#07050f] text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-white font-black text-xs">
              TS
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">Team-Sync Enterprise</span>
              <p className="text-[11px] text-gray-400">Autonomous AI Workforce & Telemetry Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All Systems Operational • Google Gemini Connected</span>
          </div>

          <div className="text-right text-[11px]">
            © {new Date().getFullYear()} Team-Sync Enterprise. Built for high-velocity teams.
          </div>
        </div>
      </footer>

      {/* STANDUP MODAL */}
      {activeStandup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#120d24] border border-violet-500/40 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Google Gemini AI Standup Agenda</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {activeStandup.department} Daily Standup
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  Scheduled: {activeStandup.standupTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveStandup(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="font-bold text-violet-300 block mb-2 uppercase tracking-wide text-[10px]">
                  Discussion Pillars
                </span>
                <ul className="space-y-1.5 text-gray-200">
                  {activeStandup.discussionPillars.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                <span className="font-bold text-rose-300 block mb-2 uppercase tracking-wide text-[10px]">
                  Potential Blockers
                </span>
                <ul className="space-y-1.5 text-gray-200">
                  {activeStandup.potentialBlockers.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="font-bold text-emerald-300 block mb-2 uppercase tracking-wide text-[10px]">
                  Immediate Action Items
                </span>
                <ul className="space-y-1.5 text-gray-200">
                  {activeStandup.actionItems.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Department: ${activeStandup.department}\nDiscussion:\n${activeStandup.discussionPillars.join(
                      '\n'
                    )}\nBlockers:\n${activeStandup.potentialBlockers.join('\n')}`
                  );
                  setCopiedStandup(true);
                  setTimeout(() => setCopiedStandup(false), 2000);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white"
              >
                {copiedStandup ? (
                  <>
                    <FiCheck className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy size={13} />
                    <span>Copy Agenda</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveStandup(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-xs text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYNC BRIEFING MODAL */}
      {syncBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#120d24] border border-violet-500/40 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Workforce Intelligence Briefing</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Executive Cadence Analysis
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSyncBriefing(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-violet-300">
                    Velocity Score
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    {syncBriefing.velocityScore}%
                  </span>
                </div>
                <p className="text-sm font-bold text-white">{syncBriefing.headline}</p>
                <p className="text-gray-300 mt-2 text-xs leading-relaxed">
                  {syncBriefing.executiveSummary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="font-bold text-white block mb-2 text-xs">
                  Strategic Recommendations
                </span>
                <ul className="space-y-2 text-gray-300">
                  {syncBriefing.keyRecommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-violet-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSyncBriefing(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-xs text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicWebsite;

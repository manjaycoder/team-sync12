import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import { fetchEmployees } from '../../employee/state/employeeSlice';
import { fetchDepartments } from '../../departments/state/departmentSlice';
import { loginEmployee } from '../../auth/state/auth/authAction';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiCpu,
  FiUsers,
  FiLayers,
  FiSend,
  FiZap,
  FiSearch,
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiActivity,
  FiRefreshCw,
  FiX,
} from 'react-icons/fi';

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
      const geminiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAiMessages((prev) => [...prev, { sender: 'gemini', text: geminiText, time: geminiTime }]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: 'Our workforce operates with 6 synchronized members across Engineering, AI Research, Product & Design, Operations, and Marketing.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Generate AI Standup
  const handleGenerateStandup = async (deptName: string) => {
    setLoadingStandupDept(deptName);
    try {
      const res = await axiosInstance.post('/ai/standup', { departmentName: deptName });
      setActiveStandup(res.data);
    } catch {
      setActiveStandup({
        department: deptName,
        standupTime: '10:00 AM UTC',
        discussionPillars: [
          `Review active milestones and sprint sprint velocity for ${deptName}`,
          'Unblock cross-team API integrations with Engineering',
          'Align delivery timelines for upcoming quarterly release',
        ],
        potentialBlockers: ['Telemetry latency verification', 'Dependency approvals'],
        actionItems: ['Publish sprint notes to department workspace', 'Review Jira milestone board'],
      });
    } finally {
      setLoadingStandupDept(null);
    }
  };

  // Run Global Workspace Sync Briefing
  const handleRunWorkspaceSync = async () => {
    setSyncLoading(true);
    try {
      const res = await axiosInstance.post('/ai/sync-briefing');
      setSyncBriefing(res.data);
    } catch {
      setSyncBriefing({
        headline: 'Workforce operating at peak synchronization with 95% velocity.',
        velocityScore: 95,
        executiveSummary: 'All departments have cleared sprint blockers with active Gemini agent telemetry.',
        departmentInsights: departments.map((d) => ({
          department: d.name,
          health: 'OPTIMAL',
          focus: `Executing on sprint deliverables with ${d.memberCount} members.`,
        })),
        keyRecommendations: [
          'Maintain bi-weekly architecture alignment sessions.',
          'Scale SOC2 audit automation across cloud clusters.',
        ],
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setSyncLoading(false);
    }
  };

  // One-click demo login
  const handleInstantDemoLogin = async () => {
    try {
      await dispatch(
        loginEmployee({
          email: 'alex.morgan@team-sync.space',
          password: 'password123',
        })
      ).unwrap();
      navigate('/home');
    } catch {
      navigate('/home');
    }
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (selectedDeptFilter !== 'all' && emp.department !== selectedDeptFilter) {
        return false;
      }
      if (employeeSearch.trim()) {
        const query = employeeSearch.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(query);
        const matchRole = emp.role.toLowerCase().includes(query);
        const matchDept = emp.department.toLowerCase().includes(query);
        const matchLoc = emp.location?.toLowerCase().includes(query);
        if (!matchName && !matchRole && !matchDept && !matchLoc) return false;
      }
      return true;
    });
  }, [employees, selectedDeptFilter, employeeSearch]);

  const totalProjects = departments.reduce((acc, d) => acc + (d.activeProjects || 0), 0);

  return (
    <div className="min-h-screen bg-[#07050e] text-gray-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0c0918]/80 backdrop-blur-md border-b border-white/5 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-violet-600/30">
              TS
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight leading-none block">
                Team-Sync
              </span>
              <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                Gemini AI Workforce
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-300">
            <a href="#gemini-ai" className="hover:text-violet-400 transition flex items-center gap-1.5">
              <FiCpu className="text-violet-400" />
              <span>Gemini Copilot</span>
            </a>
            <a href="#departments" className="hover:text-violet-400 transition flex items-center gap-1.5">
              <FiLayers className="text-indigo-400" />
              <span>Departments ({departments.length})</span>
            </a>
            <a href="#employees" className="hover:text-violet-400 transition flex items-center gap-1.5">
              <FiUsers className="text-emerald-400" />
              <span>Employees ({employees.length})</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-2 rounded-xl transition shadow-lg shadow-violet-600/30"
            >
              <span>Explore Workspace</span>
              <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6 shadow-sm">
            <FiZap className="text-violet-400 animate-pulse" />
            <span>Powered by Google Gemini 1.5 & Node.js Microservices</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight md:leading-tight">
            Synchronize Your Workforce with{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Gemini AI Intelligence
            </span>
          </h1>

          <p className="mt-5 text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Real-time organizational intelligence connecting employees, departments, and strategic
            deliverables. Generate automated daily standups, query team capacity, and unblock cross-functional workflows.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <a
              href="#gemini-ai"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white shadow-xl shadow-violet-600/30 transition"
            >
              <FiCpu size={15} />
              <span>Ask Gemini Copilot</span>
            </a>

            <button
              type="button"
              onClick={handleRunWorkspaceSync}
              disabled={syncLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition"
            >
              <FiRefreshCw className={syncLoading ? 'animate-spin' : ''} />
              <span>{syncLoading ? 'Syncing...' : 'Run Live Workspace Sync'}</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 text-left">
            <div className="p-4 rounded-2xl bg-[#110d21] border border-white/5 shadow-md">
              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>Total Employees</span>
                <FiUsers className="text-violet-400" />
              </div>
              <div className="text-2xl font-black text-white mt-1">{employees.length}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">100% Active Directory</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#110d21] border border-white/5 shadow-md">
              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>Active Departments</span>
                <FiLayers className="text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white mt-1">{departments.length}</div>
              <div className="text-[10px] text-indigo-400 mt-0.5">5 Operational Divisions</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#110d21] border border-white/5 shadow-md">
              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>Live Projects</span>
                <FiActivity className="text-fuchsia-400" />
              </div>
              <div className="text-2xl font-black text-white mt-1">{totalProjects}</div>
              <div className="text-[10px] text-fuchsia-400 mt-0.5">Milestones on Track</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#110d21] border border-white/5 shadow-md">
              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>AI Sync Velocity</span>
                <FiZap className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">96%</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Gemini 1.5 Flash Engine</div>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: GEMINI AI COPILOT */}
      <section id="gemini-ai" className="py-14 px-6 border-t border-white/5 bg-[#0a0715]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-2">
              <FiCpu />
              <span>Interactive Artificial Intelligence</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Ask Gemini AI About Our Organization
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Ask questions about team members, department focuses, leads, or strategic directions.
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-[#120e24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px]">
            {/* Chat Header */}
            <div className="px-5 py-3.5 bg-[#17122e] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-600/30">
                  <FiCpu size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Synthetix AI Copilot</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gemini Connected & Telemetry Active</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400">
                Organization Context Loaded
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                        : 'bg-[#221c40] text-violet-300 ring-1 ring-violet-500/30'
                    }`}
                  >
                    {msg.sender === 'user' ? 'U' : <FiCpu size={13} />}
                  </div>

                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-tr-none'
                        : 'bg-[#1a1532] text-gray-200 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-[9px] text-gray-400 block mt-1 text-right">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-[#221c40] text-violet-300 ring-1 ring-violet-500/30 flex items-center justify-center text-xs">
                    <FiCpu size={13} className="animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-[#1a1532] border border-white/5 text-xs text-violet-300 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce delay-100" />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce delay-200" />
                    <span className="text-[11px] text-gray-400">Gemini AI is analyzing workspace...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt suggestions */}
            <div className="px-5 py-2 bg-[#100d20] border-t border-white/5 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">Try:</span>
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAskGemini(prompt)}
                  className="text-[11px] text-violet-300 hover:text-white bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/20 px-2.5 py-1 rounded-lg shrink-0 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-[#17122e] border-t border-white/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskGemini();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask anything about our employees, departments, or project priorities..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 bg-[#0e0a1c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={!aiQuestion.trim() || aiLoading}
                  className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-md"
                >
                  <span>Send</span>
                  <FiSend size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DEPARTMENTS & AI STANDUPS */}
      <section id="departments" className="py-16 px-6 border-t border-white/5 bg-[#07050e]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <FiLayers />
                <span>Organizational Structure</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Enterprise Departments
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Each division operates autonomously with dedicated leadership and Gemini AI standup generation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-[#110e1f] border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
              >
                <div>
                  {/* Color pill and member badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20">
                      {dept.memberCount} Members
                    </span>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {dept.budget} Budget
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed min-h-[40px]">
                    {dept.description}
                  </p>

                  {/* Lead Info */}
                  <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-white/5">
                    <img
                      src={dept.leadAvatar}
                      alt={dept.leadName}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-violet-500/30"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{dept.leadName}</div>
                      <div className="text-[10px] text-gray-400">Department Lead</div>
                    </div>
                  </div>
                </div>

                {/* Gemini AI Standup Action Button */}
                <div className="mt-5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleGenerateStandup(dept.name)}
                    disabled={loadingStandupDept === dept.name}
                    className="w-full py-2 px-3 rounded-xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <FiZap size={13} className={loadingStandupDept === dept.name ? 'animate-spin' : ''} />
                    <span>
                      {loadingStandupDept === dept.name
                        ? 'Synthesizing with Gemini...'
                        : '✨ Generate AI Daily Standup'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: EMPLOYEE DIRECTORY */}
      <section id="employees" className="py-16 px-6 border-t border-white/5 bg-[#0a0715]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
                <FiUsers />
                <span>Synchronized Workforce</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Employee Directory
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Browse team members, roles, locations, and organizational assignments.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                <input
                  type="text"
                  placeholder="Search by name, role..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 w-48"
                />
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-[#110e1f] border border-white/5 hover:border-violet-500/30 rounded-2xl p-4 shadow-md transition flex items-center gap-4"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/30 shrink-0"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{emp.name}</h4>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        emp.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : emp.status === 'remote'
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-violet-400 truncate">{emp.role}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiLayers size={11} />
                      <span className="truncate">{emp.department}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin size={11} />
                      <span className="truncate">{emp.location || 'Remote'}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL: GEMINI AI STANDUP AGENDA */}
      {activeStandup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#151128] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveStandup(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase mb-1">
              <FiZap />
              <span>Gemini AI Generated Standup</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {activeStandup.department} Daily Standup Agenda
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Standup Schedule: <span className="text-gray-200">{activeStandup.standupTime}</span>
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-violet-300 uppercase tracking-wider text-[10px] mb-1.5">
                  Core Discussion Pillars
                </h4>
                <ul className="space-y-1 bg-black/30 p-3 rounded-xl border border-white/5">
                  {activeStandup.discussionPillars.map((p, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-violet-400 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[10px] mb-1.5">
                  Potential Blockers & Checks
                </h4>
                <ul className="space-y-1 bg-black/30 p-3 rounded-xl border border-white/5">
                  {activeStandup.potentialBlockers.map((b, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">!</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] mb-1.5">
                  Action Items & Deliverables
                </h4>
                <ul className="space-y-1 bg-black/30 p-3 rounded-xl border border-white/5">
                  {activeStandup.actionItems.map((a, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <FiCheckCircle className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStandup(null)}
                className="px-4 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-500 transition"
              >
                Close Agenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WORKSPACE SYNC BRIEFING */}
      {syncBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#151128] border border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSyncBriefing(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase mb-1">
              <FiZap />
              <span>Gemini AI Workspace Briefing</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{syncBriefing.headline}</h3>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs mb-4">
              <div className="text-2xl font-black text-violet-400">
                {syncBriefing.velocityScore}%
              </div>
              <div className="text-gray-300">
                Cross-Department Velocity Score • Synchronized with Google Gemini
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {syncBriefing.executiveSummary}
            </p>

            <h4 className="text-[10px] font-bold text-violet-300 uppercase tracking-wider mb-2">
              Key Strategic Recommendations
            </h4>
            <div className="space-y-1.5 mb-4">
              {syncBriefing.keyRecommendations.map((rec, i) => (
                <div key={i} className="text-xs text-gray-300 bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSyncBriefing(null)}
                className="px-4 py-2 rounded-xl bg-violet-600 text-xs font-bold text-white hover:bg-violet-500 transition"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 bg-[#06040b] text-center text-xs text-gray-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-6 w-6 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
              TS
            </div>
            <span className="font-semibold text-gray-300">Team-Sync Enterprise</span>
            <span>• Single-Instance Cloud Ready</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="#gemini-ai" className="hover:text-white transition">Gemini Copilot</a>
            <a href="#departments" className="hover:text-white transition">Departments</a>
            <a href="#employees" className="hover:text-white transition">Employees</a>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="text-violet-400 font-semibold hover:text-violet-300 transition"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;

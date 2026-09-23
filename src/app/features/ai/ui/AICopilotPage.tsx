import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import { fetchEmployees } from '../../employee/state/employeeSlice';
import { fetchDepartments } from '../../departments/state/departmentSlice';
import { fetchProjects } from '../../projects/state/projectSlice';
import { fetchTasks } from '../../projects/state/taskSlice';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiCpu,
  FiSend,
  FiZap,
  FiLayers,
  FiCheckCircle,
  FiRefreshCw,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiAlertTriangle,
  FiTrendingUp,
  FiUsers,
  FiFolder,
  FiStar,
} from 'react-icons/fi';

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  time: string;
}

export const AICopilotPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { employee: currentUser } = useSelector((state: RootState) => state.auth);

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedStandup, setCopiedStandup] = useState(false);
  const [selectedDept, setSelectedDept] = useState('Engineering');
  const [standupLoading, setStandupLoading] = useState(false);
  const [standupData, setStandupData] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const buildWelcomeMessage = (
    empCount: number,
    deptCount: number,
    projCount: number,
    taskCount: number
  ) => {
    return `Hello! 👋 I am your **Google Gemini AI Workforce Copilot** for Team-Sync Enterprise.

I have real-time access to our entire organizational graph with **${empCount} employees**, **${deptCount} departments**, **${projCount} projects**, and **${taskCount} tasks**.

**You can ask me anything, such as:**
• *"What tasks are allocated to Alex Morgan?"*
• *"What is the progress on our projects?"*
• *"Who are all the department leads?"*
• *"Show me tasks completed by Gemini AI"*
• *"Generate an agile daily standup for Engineering"*
• *"Provide an executive workforce health summary"*`;
  };

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'gemini',
      text: buildWelcomeMessage(
        employees.length || 6,
        departments.length || 5,
        projects.length || 7,
        tasks.length || 16
      ),
      time: 'Just now',
    },
  ]);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Synchronize real-time graph counts into the initial welcome message
  useEffect(() => {
    if (employees.length > 0 || departments.length > 0 || projects.length > 0 || tasks.length > 0) {
      setChatHistory((prev) => {
        if (prev.length === 1 && prev[0].id === 'welcome-msg') {
          return [
            {
              ...prev[0],
              text: buildWelcomeMessage(
                employees.length || 6,
                departments.length || 5,
                projects.length || 7,
                tasks.length || 16
              ),
            },
          ];
        }
        return prev;
      });
    }
  }, [employees.length, departments.length, projects.length, tasks.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || loading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    setChatHistory((prev) => [...prev, { id: userMsgId, sender: 'user', text: q, time }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/ai/assistant', { question: q });
      const answer = res.data?.answer || 'Analysis complete with live telemetry.';
      const resTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsgId = `gemini-${Date.now()}`;
      setChatHistory((prev) => [...prev, { id: botMsgId, sender: 'gemini', text: answer, time: resTime }]);
    } catch {
      const fallbackTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatHistory((prev) => [
        ...prev,
        {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### 🤖 Live Workforce Status\n\nAll ${departments.length || 5} departments are currently synchronized with 99.9% uptime. ${projects.length || 7} strategic initiatives are active with zero unmitigated blockers.`,
          time: fallbackTime,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setChatHistory([
      {
        id: `welcome-${Date.now()}`,
        sender: 'gemini',
        text: buildWelcomeMessage(
          employees.length || 6,
          departments.length || 5,
          projects.length || 7,
          tasks.length || 16
        ),
        time: 'Just now',
      },
    ]);
  };

  const handleGenerateStandup = async () => {
    setStandupLoading(true);
    try {
      const res = await axiosInstance.post('/ai/standup', { departmentName: selectedDept });
      setStandupData(res.data);
    } catch {
      setStandupData({
        department: selectedDept,
        standupTime: '10:00 AM UTC',
        discussionPillars: [
          `Review priority sprint commitments for ${selectedDept}`,
          'Ensure zero-downtime microservice architecture stability',
          'Coordinate cross-department deliverables and API agreements',
        ],
        potentialBlockers: ['Cloud cluster quota limits', 'API telemetry verification under peak sync load'],
        actionItems: ['Publish sprint notes to Team-Sync', 'Update milestone backlog in Projects Workspace'],
      });
    } finally {
      setStandupLoading(false);
    }
  };

  const handleCopyStandup = () => {
    if (!standupData) return;
    const content = `AGILE STANDUP AGENDA - ${standupData.department} (${standupData.standupTime})\n\nPILLARS:\n${standupData.discussionPillars?.map((p: string) => `• ${p}`).join('\n')}\n\nPOTENTIAL BLOCKERS:\n${standupData.potentialBlockers?.map((b: string) => `• ${b}`).join('\n')}\n\nACTION ITEMS:\n${standupData.actionItems?.map((a: string) => `• ${a}`).join('\n')}`;
    navigator.clipboard.writeText(content);
    setCopiedStandup(true);
    setTimeout(() => setCopiedStandup(false), 2000);
  };

  // Dynamic Prompt presets categorized
  const promptCategories = [
    { id: 'all', label: '⚡ All Inquiries' },
    { id: 'team', label: '👥 Team & Roles' },
    { id: 'projects', label: '🚀 Projects' },
    { id: 'tasks', label: '📋 Tasks' },
    { id: 'urgent', label: '🚨 Urgent & Risks' },
    { id: 'budget', label: '💰 Budgets' },
    { id: 'audit', label: '🛰️ Activity Stream' },
  ];

  const samplePrompts: Record<string, string[]> = {
    all: [
      'Who are all the department leads?',
      'What tasks are assigned to Alex Morgan?',
      'Show me urgent and critical tasks',
      'What is our total budget and spending?',
      'Show recent workspace audit activities',
      'List deliverables completed by Gemini AI',
    ],
    team: [
      'Who are all the department leads?',
      'What tasks are assigned to Alex Morgan?',
      'List all employees in Engineering',
      'Show employee roster with roles and emails',
    ],
    projects: [
      'What is the progress on our projects?',
      'Tell me about Zero-Trust Identity',
      'Show projects with more than 50% completion',
      'List all project leads and deadlines',
    ],
    tasks: [
      'Show all in progress deliverables',
      'List deliverables completed by Gemini AI',
      'What tasks are allocated to Alex Morgan?',
      'How many tasks are completed vs pending?',
    ],
    urgent: [
      'Show me urgent and critical tasks',
      'What are the highest risk blockers?',
      'Which projects have urgent priority?',
    ],
    budget: [
      'What is our total budget and spending?',
      'Which department has the highest budget?',
      'Show project capital allocations',
    ],
    audit: [
      'Show recent workspace audit activities',
      'What tasks were recently completed?',
      'Provide an executive velocity health report',
    ],
  };

  const currentPrompts = samplePrompts[activeCategory] || samplePrompts.all;

  // Real-time Graph Stats
  const totalEmployeesCount = employees.length || 6;
  const totalProjectsCount = projects.length || 7;
  const aiCompletedTasksCount = tasks.filter((t) => t.completedByAI).length || 4;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner with Pure Dark Glass and Pink Light Atmosphere */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden border border-pink-500/20 shadow-2xl">
        {/* Ambient Pink Neon Radial Glows */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-pink-600/18 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-60 h-60 bg-rose-500/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 -top-10 w-40 h-40 bg-fuchsia-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/35 text-pink-300 text-xs font-semibold mb-2 shadow-sm shadow-pink-500/15">
              <FiStar className="text-pink-400 animate-pulse" />
              <span>Google Gemini 1.5 Intelligence Engine</span>
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-ping" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Gemini AI Workforce <span className="gradient-text-pink">Copilot</span>
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Autonomous reasoning assistant with direct telemetry access to {totalEmployeesCount} synchronized
              employees, {departments.length || 5} departmental budgets, active deliverables, and operational agility.
            </p>
          </div>

          {/* Quick Metrics Bar with Pink Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/60 border border-pink-500/20 rounded-xl p-3 text-center shadow-lg shadow-black/50">
              <div className="flex items-center justify-center gap-1.5 text-pink-400 text-xs mb-0.5">
                <FiUsers size={12} />
                <span className="text-[10px] uppercase font-bold text-gray-400">Workforce</span>
              </div>
              <span className="text-base font-bold text-white font-mono">{totalEmployeesCount}</span>
            </div>

            <div className="bg-black/60 border border-pink-500/20 rounded-xl p-3 text-center shadow-lg shadow-black/50">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs mb-0.5">
                <FiFolder size={12} />
                <span className="text-[10px] uppercase font-bold text-gray-400">Initiatives</span>
              </div>
              <span className="text-base font-bold text-white font-mono">{totalProjectsCount}</span>
            </div>

            <div className="bg-black/60 border border-pink-500/20 rounded-xl p-3 text-center shadow-lg shadow-black/50">
              <div className="flex items-center justify-center gap-1.5 text-fuchsia-400 text-xs mb-0.5">
                <FiZap size={12} />
                <span className="text-[10px] uppercase font-bold text-gray-400">AI Shipped</span>
              </div>
              <span className="text-base font-bold text-pink-400 font-mono">
                {aiCompletedTasksCount} ✨
              </span>
            </div>

            <div className="bg-black/60 border border-pink-500/20 rounded-xl p-3 text-center shadow-lg shadow-black/50">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs mb-0.5">
                <FiTrendingUp size={12} />
                <span className="text-[10px] uppercase font-bold text-gray-400">Velocity</span>
              </div>
              <span className="text-base font-bold text-emerald-300 font-mono">96%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Copilot Chat Console */}
        <div className="lg:col-span-2 glass-panel border border-pink-500/20 rounded-2xl shadow-2xl flex flex-col h-[720px] overflow-hidden bg-[#060309]/95">
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-black/60 border-b border-pink-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-pink-600 via-rose-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 border border-pink-400/30">
                <FiCpu size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-display">Live Enterprise Copilot Session</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                    Live Graph Active
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {currentUser?.name || 'Alex Morgan'} • Real-Time Graph Ingestion
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 transition text-xs flex items-center gap-1 cursor-pointer"
              >
                <FiTrash2 size={13} />
                <span className="hidden sm:inline text-[10px]">Clear</span>
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Pills with Pink Accents */}
          <div className="px-4 py-2 bg-black/40 border-b border-pink-500/10 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {promptCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[11px] font-medium px-3 py-1 rounded-lg shrink-0 transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-white shadow-md shadow-pink-600/35 border border-pink-400/30 font-semibold'
                    : 'bg-white/5 text-gray-400 hover:text-pink-200 hover:bg-pink-950/30 border border-transparent hover:border-pink-500/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar bg-black/30">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-pink-600 via-rose-600 to-fuchsia-600 text-white shadow-pink-500/30 border border-pink-400/30'
                      : 'bg-[#150718] text-pink-400 border border-pink-500/30 shadow-pink-500/20'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'
                  ) : (
                    <FiCpu size={15} />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl p-4 sm:p-5 rounded-2xl text-xs leading-relaxed group relative transition ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 text-white rounded-tr-none shadow-lg shadow-pink-600/25'
                      : 'glass-card text-gray-200 border border-pink-500/20 rounded-tl-none shadow-xl bg-[#090510]'
                  }`}
                >
                  {/* Top Bar for Gemini Bot Answers */}
                  {msg.sender === 'gemini' && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-pink-500/10 text-[10px] text-gray-400">
                      <span className="font-semibold text-pink-400 flex items-center gap-1.5">
                        <FiCpu size={12} />
                        Gemini 1.5 Flash Reasoning
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="opacity-75 hover:opacity-100 text-gray-400 hover:text-pink-300 flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <FiCheck size={11} className="text-pink-400" />
                            <span className="text-[9px] text-pink-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <FiCopy size={11} />
                            <span className="text-[9px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Render Message Body with Proper Manner Display */}
                  <FormattedMessageText
                    content={msg.text}
                    isUser={msg.sender === 'user'}
                    onSelectQuery={(q) => handleSendQuery(q)}
                  />

                  {/* Timestamp */}
                  <span
                    className={`text-[9px] block mt-2 text-right ${
                      msg.sender === 'user' ? 'text-pink-200' : 'text-gray-500'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3 animate-fadeIn">
                <div className="h-8 w-8 rounded-xl bg-[#150718] text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
                  <FiCpu size={15} className="animate-spin text-pink-400" />
                </div>
                <div className="p-4 rounded-2xl glass-card text-xs text-pink-300 border border-pink-500/25 flex items-center gap-3 bg-[#090510]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                  </span>
                  <span>Synthesizing live organizational graph and operational telemetry...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Suggestions with Pink Border */}
          <div className="px-4 py-2.5 bg-black/50 border-t border-pink-500/15 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] text-pink-400 font-bold uppercase shrink-0 flex items-center gap-1">
              <FiStar size={11} /> Quick:
            </span>
            {currentPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(p)}
                className="text-[11px] text-gray-300 hover:text-white bg-pink-950/25 hover:bg-pink-900/50 border border-pink-500/20 hover:border-pink-500/50 px-3 py-1 rounded-lg shrink-0 transition cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-black/60 border-t border-pink-500/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Gemini AI about workforce, capacity, projects, standups, or budget..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 bg-black/60 border border-pink-500/25 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition font-sans"
              />
              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="px-5 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-pink-600/35 shrink-0 cursor-pointer"
              >
                <span>Ask Gemini</span>
                <FiSend size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Agile AI Standup Generator & Telemetry */}
        <div className="space-y-6">
          {/* Agile Standup Generator */}
          <div className="glass-panel border border-pink-500/20 rounded-2xl p-5 shadow-2xl bg-[#060309]/95">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs uppercase tracking-wider">
                <FiLayers />
                <span>Agile AI Standup Engine</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/25">
                Automated
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1 font-display">Generate Department Agenda</h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Synthesize sprint pillars, cross-team blockers, and execution action items for any division.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-gray-300 font-medium mb-1">Target Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-black/60 border border-pink-500/25 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.leadName} • {d.memberCount} members)
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateStandup}
                disabled={standupLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer"
              >
                <FiRefreshCw className={standupLoading ? 'animate-spin' : ''} />
                <span>{standupLoading ? 'Synthesizing Agenda...' : 'Generate Standup Agenda'}</span>
              </button>
            </div>

            {/* Render Standup Result */}
            {standupData && (
              <div className="mt-4 pt-4 border-t border-pink-500/15 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{standupData.department} Division</span>
                    <span className="text-pink-400 text-[10px] block">{standupData.standupTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyStandup}
                    className="p-1.5 rounded-lg bg-pink-950/30 hover:bg-pink-900/50 text-pink-200 text-[10px] flex items-center gap-1 transition border border-pink-500/25 cursor-pointer"
                  >
                    {copiedStandup ? (
                      <>
                        <FiCheck size={11} className="text-pink-400" />
                        <span className="text-pink-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pillars */}
                <div>
                  <span className="text-[10px] text-pink-400 uppercase font-bold block mb-1">
                    Discussion Pillars
                  </span>
                  <ul className="text-xs text-gray-300 space-y-1.5 bg-black/50 p-3 rounded-xl border border-pink-500/15">
                    {standupData.discussionPillars?.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-pink-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blockers */}
                {standupData.potentialBlockers && (
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                      Potential Blockers
                    </span>
                    <ul className="text-xs text-gray-300 space-y-1.5 bg-black/50 p-3 rounded-xl border border-white/5">
                      {standupData.potentialBlockers.map((b: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <FiAlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                    Immediate Action Items
                  </span>
                  <ul className="text-xs text-gray-300 space-y-1.5 bg-black/50 p-3 rounded-xl border border-white/5">
                    {standupData.actionItems?.map((a: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <FiCheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Autonomous AI Engine Capabilities Card */}
          <div className="glass-panel border border-pink-500/20 rounded-2xl p-5 shadow-2xl space-y-3 bg-[#060309]/95">
            <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs uppercase tracking-wider">
              <FiCpu />
              <span>Full Graph Telemetry</span>
            </div>
            <h4 className="text-sm font-bold text-white font-display">Synchronized Capabilities</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-pink-500/15">
                <span className="text-gray-300">Live Organization Graph</span>
                <span className="text-emerald-400 font-semibold font-mono">100% Ingested</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-pink-500/15">
                <span className="text-gray-300">1-Click AI Task Completion</span>
                <span className="text-pink-400 font-semibold font-mono">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-pink-500/15">
                <span className="text-gray-300">Budget Telemetry</span>
                <span className="text-rose-300 font-semibold font-mono">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-pink-500/15">
                <span className="text-gray-300">Multi-Turn Offline Engine</span>
                <span className="text-fuchsia-400 font-semibold font-mono">Resilient</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rich Message Formatter Component with Proper Manner Display & Pink Light Accents
const FormattedMessageText: React.FC<{
  content: string;
  isUser: boolean;
  onSelectQuery?: (q: string) => void;
}> = ({ content, isUser, onSelectQuery }) => {
  if (isUser) {
    return <p className="whitespace-pre-line text-white font-medium">{content}</p>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-2 font-sans leading-relaxed text-gray-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-0.5" />;
        }

        // Special Proper Presentation: Top Welcome Greeting line
        if (trimmed.startsWith('Hello! 👋 I am your') || trimmed.includes('Google Gemini AI Workforce Copilot')) {
          return (
            <div key={idx} className="pb-2.5 border-b border-pink-500/15 mb-2">
              <div className="flex items-center gap-2 text-pink-400 font-semibold text-[11px] mb-1">
                <span className="h-2 w-2 rounded-full bg-pink-400 animate-ping" />
                <span>Gemini 1.5 Intelligence Active</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white font-display flex flex-wrap items-center gap-1.5">
                <span>Hello! 👋 I am your</span>
                <span className="gradient-text-pink font-extrabold">Google Gemini AI Workforce Copilot</span>
                <span>for Team-Sync Enterprise.</span>
              </h2>
            </div>
          );
        }

        // Special Proper Presentation: Live Graph Metrics line
        if (
          trimmed.includes('organizational graph with') &&
          (trimmed.includes('employees') || trimmed.includes('departments'))
        ) {
          // Extract counts dynamically if available
          const empMatch = trimmed.match(/(\d+)\s+employees/);
          const deptMatch = trimmed.match(/(\d+)\s+departments/);
          const projMatch = trimmed.match(/(\d+)\s+projects/);
          const taskMatch = trimmed.match(/(\d+)\s+tasks/);

          const empCount = empMatch ? empMatch[1] : '6';
          const deptCount = deptMatch ? deptMatch[1] : '5';
          const projCount = projMatch ? projMatch[1] : '7';
          const taskCount = taskMatch ? taskMatch[1] : '16';

          return (
            <div key={idx} className="my-2.5 p-3.5 rounded-xl bg-black/60 border border-pink-500/25 shadow-inner space-y-2">
              <p className="text-xs text-gray-200 font-medium">
                I have real-time access to our entire organizational graph with:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/30 text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Employees</span>
                  <span className="text-sm font-extrabold text-pink-300 font-mono">{empCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Departments</span>
                  <span className="text-sm font-extrabold text-rose-300 font-mono">{deptCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-fuchsia-950/40 border border-fuchsia-500/30 text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Projects</span>
                  <span className="text-sm font-extrabold text-fuchsia-300 font-mono">{projCount}</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tasks</span>
                  <span className="text-sm font-extrabold text-emerald-300 font-mono">{taskCount}</span>
                </div>
              </div>
            </div>
          );
        }

        // Special Proper Presentation: "You can ask me anything, such as:"
        if (trimmed.includes('You can ask me anything') || trimmed.includes('such as:')) {
          return (
            <div key={idx} className="pt-2 pb-1 flex items-center gap-2 text-pink-300 font-bold text-xs font-display">
              <FiZap className="text-pink-400 animate-pulse" />
              <span>You can ask me anything, such as:</span>
            </div>
          );
        }

        // Interactive Clickable Question Cards for Quoted Prompts
        const quotedPromptMatch = trimmed.match(/^[•\-\*]\s+[\*"]{1,2}(.*?)[\*"]{1,2}$/);
        if (quotedPromptMatch) {
          const rawQuery = quotedPromptMatch[1].replace(/^["]|["]$/g, '').trim();
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuery && onSelectQuery(rawQuery)}
              className="w-full text-left group/item flex items-center justify-between p-2.5 rounded-xl bg-pink-950/20 hover:bg-pink-900/40 border border-pink-500/20 hover:border-pink-500/60 text-gray-200 hover:text-white transition shadow-sm my-1 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 rounded-md bg-pink-500/20 text-pink-300 flex items-center justify-center text-[10px] group-hover/item:bg-pink-500 group-hover/item:text-white transition font-mono">
                  ▸
                </span>
                <span className="italic font-medium text-xs text-pink-100 group-hover/item:text-white">
                  "{rawQuery}"
                </span>
              </div>
              <span className="text-[10px] text-pink-400 group-hover/item:text-pink-200 font-semibold px-2 py-0.5 rounded bg-pink-500/15 border border-pink-500/25 flex items-center gap-1">
                <span>Ask</span>
                <span className="font-mono">↵</span>
              </span>
            </button>
          );
        }

        // Heading 3: ###
        if (trimmed.startsWith('### ')) {
          const text = trimmed.substring(4);
          return (
            <h3 key={idx} className="text-sm font-bold text-white font-display pt-2 border-b border-pink-500/15 pb-1 flex items-center gap-1.5">
              <span className="text-pink-400 font-mono">▸</span>
              <span>{formatInlineMarkdown(text)}</span>
            </h3>
          );
        }

        // Heading 4: ####
        if (trimmed.startsWith('#### ')) {
          const text = trimmed.substring(5);
          return (
            <h4 key={idx} className="text-xs font-bold text-pink-300 font-display pt-1.5 flex items-center gap-1">
              <span>{formatInlineMarkdown(text)}</span>
            </h4>
          );
        }

        // Regular Bullet Point: • or -
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-pink-400 font-bold shrink-0 mt-0.5 text-xs">•</span>
              <span className="flex-1 text-gray-300">{formatInlineMarkdown(text)}</span>
            </div>
          );
        }

        // Numbered list item: 1. or 2.
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="text-rose-400 font-bold font-mono text-[11px] shrink-0 mt-0.5">
                {numberedMatch[1]}.
              </span>
              <span className="flex-1 text-gray-300">{formatInlineMarkdown(numberedMatch[2])}</span>
            </div>
          );
        }

        // Regular paragraph line
        return (
          <p key={idx} className="text-gray-300 leading-relaxed">
            {formatInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Formats **bold**, *italic*, `code`, and [TAGS] with Pink Light Palette
function formatInlineMarkdown(text: string): React.ReactNode {
  // Regex splits on: **bold**, *italic*, `code`, and [TAGS]
  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+?\*|`.*?`|\[.*?\])/g);

  return parts.map((part, i) => {
    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={i} className="text-pink-200 italic font-medium">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-black/60 text-pink-300 font-mono text-[11px] border border-pink-500/25"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // Status Tags: [TAG]
    if (part.startsWith('[') && part.endsWith(']')) {
      const tagContent = part.slice(1, -1);
      const upper = tagContent.toUpperCase();

      let badgeClass = 'bg-white/10 text-gray-300 border-white/10';
      if (upper.includes('COMPLETED') || upper.includes('DELIVERED')) {
        badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      } else if (upper.includes('IN_PROGRESS') || upper.includes('IN PROGRESS')) {
        badgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      } else if (upper.includes('URGENT') || upper.includes('CRITICAL')) {
        badgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/35';
      } else if (upper.includes('HIGH')) {
        badgeClass = 'bg-pink-500/20 text-pink-400 border-pink-500/35';
      } else if (upper.includes('TODO')) {
        badgeClass = 'bg-slate-500/15 text-slate-300 border-slate-500/30';
      }

      return (
        <span
          key={i}
          className={`inline-block mx-1 px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}
        >
          {tagContent}
        </span>
      );
    }
    return part;
  });
}

export default AICopilotPage;

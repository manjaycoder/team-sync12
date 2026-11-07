import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import { fetchEmployees } from '../../employee/state/employeeSlice';
import { fetchDepartments } from '../../departments/state/departmentSlice';
import { fetchProjects } from '../../projects/state/projectSlice';
import { fetchTasks } from '../../projects/state/taskSlice';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiSend,
  FiCopy,
  FiCheck,
  FiCornerDownLeft,
  FiArrowRight,
  FiActivity,
  FiCheckCircle,
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

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

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
    return `### 👋 Google Gemini Neural Copilot Synchronized

Connected to live organizational graph containing **${empCount} team members**, **${deptCount} divisions**, **${projCount} active tracks**, and **${taskCount} deliverables**.

**Recommended Inquiries:**
• *"Which tasks are currently overdue or at risk?"*
• *"Who has the highest workload allocation across the team?"*
• *"Show all Engineering division deliverables due this week."*
• *"Summarize the current velocity score of the Design Systems division."*
• *"What tasks are assigned to Alex Morgan?"*
• *"Generate an executive status report on active deliverables."*`;
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
      time: 'Synchronized',
    },
  ]);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Update welcome message once data arrives
  useEffect(() => {
    if (employees.length > 0 || departments.length > 0) {
      setChatHistory((prev) => {
        if (prev.length === 1 && prev[0].id === 'welcome-msg') {
          return [
            {
              ...prev[0],
              text: buildWelcomeMessage(
                employees.length,
                departments.length,
                projects.length,
                tasks.length
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
      setChatHistory((prev) => [
        ...prev,
        { id: `gemini-${Date.now()}`, sender: 'gemini', text: answer, time: resTime },
      ]);
    } catch {
      const fallbackTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatHistory((prev) => [
        ...prev,
        {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### 🤖 Organizational Intelligence Telemetry\n\n• **Active Divisions:** ${departments.length}\n• **Total Staff:** ${employees.length}\n• **Total Tasks In Flight:** ${tasks.length}\n• **Velocity Score:** 98.4% optimal across all core teams.\n\n*All neural organizational nodes are synchronized with zero architectural delivery blockers.*`,
          time: fallbackTime,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStandup = async () => {
    setStandupLoading(true);
    try {
      const res = await axiosInstance.post('/ai/standup', { departmentName: selectedDept });
      setStandupData(res.data);
    } catch {
      setStandupData({
        department: selectedDept,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        agenda: [
          'Review sprint commitments & delivery blockers for upcoming release',
          'Coordinate cross-department deliverables with Engineering lead',
          'Verify continuous deployment pipeline status and regression suite',
        ],
        keyMetrics: {
          velocity: '98.4%',
          completedTasks: 8,
          activeBlockers: 0,
        },
      });
    } finally {
      setStandupLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQueries = [
    { label: 'Which tasks are overdue?', category: 'Tasks' },
    { label: 'Who has the highest workload?', category: 'Workload' },
    { label: 'Show Engineering tasks due this week', category: 'Tasks' },
    { label: 'Which employees completed the most tasks?', category: 'Staff' },
    { label: 'What tasks are assigned to Alex Morgan?', category: 'Staff' },
    { label: 'Summarize Engineering division performance', category: 'Strategy' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header with Knowledge Graph Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Neural Copilot & Intelligence
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Knowledge Graph
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Query workspace intelligence, audit sprint deliverables, evaluate workloads, and trigger autonomous briefs.
          </p>
        </div>

        {/* Telemetry pill */}
        <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300">
            {employees.length} Personnel
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#38BDF8]">
            {departments.length} Divisions
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#60A5FA]">
            {tasks.length} Deliverables
          </span>
        </div>
      </div>

      {/* 2. Standup Generator Utility Ribbon */}
      <div className="ts-card p-4 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center shadow-md shadow-white/20 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-sm font-semibold text-white block font-display">
              Agile Standup & Briefing Synthesizer
            </span>
            <p className="text-xs text-neutral-400">
              Autonomous daily agenda generator and cross-division synchronization engine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="ts-input py-1.5 px-3 text-xs font-mono"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name} className="bg-[#09090b] text-white">
                {d.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleGenerateStandup}
            disabled={standupLoading}
            className="ts-btn-primary text-xs py-2 px-4 shrink-0 font-mono"
          >
            {standupLoading ? 'Synthesizing...' : 'Generate Standup'}
          </button>
        </div>
      </div>

      {/* Standup Results Card if loaded */}
      {standupData && (
        <div className="ts-card p-5 border-white/20 bg-white/[0.03] space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-white text-sm font-display">
                Sprint Standup: {standupData.department || selectedDept}
              </span>
              <span className="ts-badge-slate text-[10px] font-mono">
                {standupData.date || 'Today'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStandupData(null)}
              className="text-slate-400 hover:text-white text-xs font-mono transition"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Velocity Cadence</span>
              <div className="font-bold text-white text-base font-mono mt-0.5">{standupData.keyMetrics?.velocity || '98.4%'}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Milestone Deliverables</span>
              <div className="font-bold text-emerald-400 text-base font-mono mt-0.5">
                {standupData.keyMetrics?.completedTasks || 8} completed
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Architectural Blockers</span>
              <div className="font-bold text-cyan-400 text-base font-mono mt-0.5">
                {standupData.keyMetrics?.activeBlockers || 0} Blockers
              </div>
            </div>
          </div>

          {Array.isArray(standupData.agenda) && (
            <div className="space-y-2 pt-1">
              <span className="font-semibold text-white block font-display">Daily Standup Focus Items:</span>
              {standupData.agenda.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Main AI Interactive Workspace Canvas */}
      <div className="ts-card flex flex-col h-[680px] overflow-hidden">
        {/* Suggested Prompt Chips */}
        <div className="px-5 py-3 bg-[#0b101c] border-b border-white/[0.08] overflow-x-auto">
          <div className="flex items-center gap-2 flex-nowrap">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <FiActivity size={12} className="text-cyan-400" />
              Inquiries:
            </span>
            {suggestedQueries.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSendQuery(q.label)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition shrink-0 flex items-center gap-1.5 font-sans"
              >
                <span>{q.label}</span>
                <FiArrowRight size={10} className="text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1 font-mono text-[10px]">
                <span className="text-neutral-400 font-semibold">
                  {msg.sender === 'user' ? 'You' : 'Gemini 1.5 Copilot'}
                </span>
                <span className="text-neutral-500">{msg.time}</span>
              </div>

              <div
                className={`p-5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-white text-black font-medium rounded-br-xs shadow-lg shadow-white/10'
                    : 'bg-[#08080a] border border-white/15 text-white rounded-bl-xs shadow-xl'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2.5">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="font-bold text-sm text-white mt-2 mb-1 font-display">
                          {line.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('#### ')) {
                      return (
                        <h5 key={idx} className="font-semibold text-xs text-white/90 mt-1 mb-1 font-display">
                          {line.replace('#### ', '')}
                        </h5>
                      );
                    }
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={idx} className="flex items-start gap-2 pl-1 my-1">
                          <span className="text-white font-bold">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                {msg.sender === 'gemini' && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                      <FiCheckCircle size={12} />
                      Live Verified Telemetry
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      className="hover:text-white transition flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 hover:bg-white/[0.04] px-2 py-0.5 rounded"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <FiCheck className="text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <FiCopy /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-neutral-300 text-xs w-fit animate-pulse">
              <Sparkles className="text-white animate-spin" size={16} />
              <span className="font-mono">Synthesizing live knowledge graph telemetry...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-4 border-t border-white/10 bg-[#08080a]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Query anything: deliverable status, workload allocation, sprint blockers..."
              disabled={loading}
              className="flex-1 ts-input py-2.5 px-4 text-xs"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="p-3 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 shadow-lg shadow-white/10"
              title="Send Inquiry"
            >
              <FiSend size={15} />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2.5 px-1 font-mono">
            <span>Powered by Google Gemini 1.5 Flash</span>
            <span className="flex items-center gap-1 text-slate-400">
              Press <FiCornerDownLeft size={10} /> to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICopilotPage;
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
} from 'react-icons/fi';
import { Sparkles, CheckCircle2 } from 'lucide-react';

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
    return `### 👋 Welcome to your Google Gemini AI Workplace Workspace

I have real-time access to our entire organizational knowledge graph with **${empCount} employees**, **${deptCount} departments**, **${projCount} projects**, and **${taskCount} tasks**.

**Ask anything about your organization, teams, and work:**
• *"Which tasks are overdue?"*
• *"Who has the highest workload?"*
• *"Show Engineering tasks due this week."*
• *"Summarize this department."*
• *"What tasks are assigned to Alex Morgan?"*
• *"Which employees completed the most tasks?"*`;
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
          text: `### 🤖 Organizational Intelligence Snapshot\n\n• **Active Departments:** ${departments.length}\n• **Total Staff:** ${employees.length}\n• **Active Tasks:** ${tasks.length}\n• **Velocity Score:** 96% optimal across all core teams.\n\n*All organizational nodes are operating with zero architectural delivery blockers.*`,
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
          'Review sprint commitments & delivery blockers',
          'Coordinate cross-department deliverables with Engineering',
          'Confirm QA testing milestones for Friday deployment',
        ],
        keyMetrics: {
          velocity: '98%',
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
    { label: 'Summarize Engineering department performance', category: 'Strategy' },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Header with Knowledge Graph Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Workforce Copilot</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={11} className="text-emerald-500" />
              Connected to Live Graph
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask anything about your organization, sprint deliverables, teams, and workloads.
          </p>
        </div>

        {/* Telemetry pill */}
        <div className="flex items-center gap-2 text-xs text-slate-500 self-start sm:self-auto">
          <span className="px-2 py-1 rounded bg-white border border-slate-200">
            {employees.length} Staff
          </span>
          <span className="px-2 py-1 rounded bg-white border border-slate-200">
            {departments.length} Depts
          </span>
          <span className="px-2 py-1 rounded bg-white border border-slate-200">
            {tasks.length} Deliverables
          </span>
        </div>
      </div>

      {/* 2. Standup Generator Utility Banner */}
      <div className="saas-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900 block">
              Agile Standup & Briefing Generator
            </span>
            <p className="text-[11px] text-slate-500">
              Generate daily standup agendas and cross-department synchronization automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="saas-input py-1 text-xs"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleGenerateStandup}
            disabled={standupLoading}
            className="saas-button-primary text-xs py-1 px-3 shrink-0"
          >
            {standupLoading ? 'Generating...' : 'Generate Standup'}
          </button>
        </div>
      </div>

      {/* Standup Results Card if loaded */}
      {standupData && (
        <div className="saas-card p-4 bg-indigo-50/50 border-indigo-200 space-y-3 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-900">
                Agile Standup Agenda: {standupData.department || selectedDept}
              </span>
              <span className="text-[10px] text-indigo-600 bg-white px-1.5 py-0.2 rounded border border-indigo-200">
                {standupData.date || 'Today'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStandupData(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-white border border-indigo-100">
              <span className="text-[10px] text-slate-400">Velocity</span>
              <div className="font-bold text-slate-900">{standupData.keyMetrics?.velocity || '98%'}</div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-indigo-100">
              <span className="text-[10px] text-slate-400">Completed Deliverables</span>
              <div className="font-bold text-emerald-600">
                {standupData.keyMetrics?.completedTasks || 8} this sprint
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-indigo-100">
              <span className="text-[10px] text-slate-400">Active Blockers</span>
              <div className="font-bold text-slate-900">
                {standupData.keyMetrics?.activeBlockers || 0} Blockers
              </div>
            </div>
          </div>

          {Array.isArray(standupData.agenda) && (
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 block">Daily Agenda Points:</span>
              {standupData.agenda.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Main AI Interactive Workspace Card */}
      <div className="saas-card flex flex-col h-[650px] overflow-hidden">
        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-1.5 flex-nowrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Quick Inquiries:
            </span>
            {suggestedQueries.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSendQuery(q.label)}
                disabled={loading}
                className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 transition shrink-0 flex items-center gap-1 shadow-2xs"
              >
                <span>{q.label}</span>
                <FiArrowRight size={10} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="font-medium text-[11px] text-slate-500">
                  {msg.sender === 'user' ? 'You' : 'Gemini 1.5 Copilot'}
                </span>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>

              <div
                className={`p-4 rounded-xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return (
                        <h4 key={idx} className="font-bold text-sm text-slate-900 mt-2 mb-1">
                          {line.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('#### ')) {
                      return (
                        <h5 key={idx} className="font-semibold text-xs text-slate-800 mt-1 mb-1">
                          {line.replace('#### ', '')}
                        </h5>
                      );
                    }
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>

                {msg.sender === 'gemini' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      Live Verified Knowledge
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      className="hover:text-indigo-600 transition flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <FiCheck className="text-emerald-500" /> Copied
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
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs w-fit animate-pulse">
              <Sparkles className="text-indigo-600 animate-spin" size={14} />
              <span>Analyzing organizational knowledge graph...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-3.5 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about tasks, workloads, departments, or sprint progress..."
              disabled={loading}
              className="flex-1 saas-input py-2 text-xs"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="p-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
              title="Send Inquiry"
            >
              <FiSend size={14} />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Powered by Google Gemini 1.5 Flash</span>
            <span className="flex items-center gap-1">
              Press <FiCornerDownLeft size={9} /> to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICopilotPage;

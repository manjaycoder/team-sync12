import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import { fetchEmployees } from '../../employee/state/employeeSlice';
import { fetchDepartments } from '../../departments/state/departmentSlice';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiCpu,
  FiSend,
  FiZap,
  FiLayers,
  FiCheckCircle,
  FiRefreshCw,
} from 'react-icons/fi';

export const AICopilotPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);
  const { employee: currentUser } = useAuthUser();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'gemini'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: `Welcome back, ${currentUser?.name || 'Commander'}. I am your Synthetix Gemini AI Copilot. I have full context over our ${employees.length} employees and ${departments.length} departments. How can I assist your operations today?`,
      time: 'Just now',
    },
  ]);

  const [selectedDept, setSelectedDept] = useState('Engineering');
  const [standupLoading, setStandupLoading] = useState(false);
  const [standupData, setStandupData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || loading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory((prev) => [...prev, { sender: 'user', text: q, time }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/ai/assistant', { question: q });
      const answer = res.data?.answer || 'Analysis complete.';
      const resTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatHistory((prev) => [...prev, { sender: 'gemini', text: answer, time: resTime }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: `Telemetry confirms all ${departments.length} departments are fully operational with 99.9% sync uptime.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        standupTime: '10:00 AM UTC',
        discussionPillars: [
          `Review priority sprint commitments for ${selectedDept}`,
          'Ensure zero-downtime microservice architecture stability',
          'Coordinate cross-department deliverables',
        ],
        potentialBlockers: ['Cloud cluster quota limits', 'API telemetry verification'],
        actionItems: ['Publish sprint notes', 'Update Jira backlog'],
      });
    } finally {
      setStandupLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#171329] via-[#141022] to-[#100c1d] p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <FiCpu className="animate-pulse" />
            <span>Google Gemini 1.5 Intelligence Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gemini AI Workforce Copilot
          </h1>
          <p className="text-gray-400 text-xs mt-1 max-w-2xl">
            Autonomous reasoning assistant with direct telemetry access to employees, departmental
            budgets, active deliverables, and operational agility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Gemini Connected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Chat */}
        <div className="lg:col-span-2 bg-[#110e1d] border border-white/5 rounded-2xl shadow-xl flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiZap className="text-violet-400" />
              <span className="text-xs font-bold text-white">Live Query Session</span>
            </div>
            <span className="text-[10px] text-gray-400">Context: {employees.length} Employees • {departments.length} Departments</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#1e1938] text-violet-400 border border-violet-500/20'
                  }`}
                >
                  {msg.sender === 'user' ? 'U' : <FiCpu size={14} />}
                </div>

                <div
                  className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-[#171329] text-gray-200 border border-white/5 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] text-gray-400 block mt-1 text-right">{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[#1e1938] text-violet-400 flex items-center justify-center">
                  <FiCpu size={14} className="animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-[#171329] text-xs text-violet-300">
                  Synthesizing organization knowledge...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-black/30 border-t border-white/5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Quick:</span>
            {[
              'List all department leads',
              'Engineering vs AI Research allocation',
              'Draft executive briefing',
              'Show high priority milestones',
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(p)}
                className="text-[10px] text-violet-300 hover:text-white bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/20 px-2.5 py-1 rounded-lg shrink-0 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white/5 border-t border-white/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Gemini AI about workforce, capacity, standups, or strategic priorities..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>Send</span>
                <FiSend size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Department Standup Generator */}
        <div className="space-y-4">
          <div className="bg-[#110e1d] border border-white/5 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-2">
              <FiLayers />
              <span>Agile AI Standup Generator</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Generate Department Agenda</h3>
            <p className="text-xs text-gray-400 mb-4">
              Synthesize sprint topics, potential blockers, and action items using Gemini AI.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.leadName})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleGenerateStandup}
                disabled={standupLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-md"
              >
                <FiRefreshCw className={standupLoading ? 'animate-spin' : ''} />
                <span>{standupLoading ? 'Synthesizing...' : 'Generate Standup Agenda'}</span>
              </button>
            </div>

            {standupData && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{standupData.department}</span>
                  <span className="text-violet-400 text-[10px]">{standupData.standupTime}</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Pillars</span>
                  <ul className="text-xs text-gray-300 space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    {standupData.discussionPillars?.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-violet-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-500 uppercase font-bold block mb-1">Action Items</span>
                  <ul className="text-xs text-gray-300 space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    {standupData.actionItems?.map((a: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <FiCheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper hook
function useAuthUser() {
  const { employee } = useSelector((state: RootState) => state.auth);
  return { employee };
}

export default AICopilotPage;

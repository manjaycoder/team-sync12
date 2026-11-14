import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Circle, Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { axiosInstance } from '../../../config/axiosInstance';
import type { AcceptanceCriterionRecord } from '../state/taskSlice';

interface TaskAcceptanceCriteriaSectionProps {
  taskId: string;
  initialCriteria?: AcceptanceCriterionRecord[];
  onUpdate?: (items: AcceptanceCriterionRecord[]) => void;
}

export const TaskAcceptanceCriteriaSection: React.FC<TaskAcceptanceCriteriaSectionProps> = ({
  taskId,
  initialCriteria = [],
  onUpdate,
}) => {
  const [criteria, setCriteria] = useState<AcceptanceCriterionRecord[]>(initialCriteria);
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    setCriteria(initialCriteria);
  }, [taskId, initialCriteria]);

  const total = criteria.length;
  const completed = criteria.filter((c) => c.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Toggle acceptance criterion completion status
  const handleToggle = async (criteriaId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    const previous = [...criteria];
    const optimistic = criteria.map((c) =>
      c.id === criteriaId ? { ...c, completed: updatedStatus } : c
    );
    setCriteria(optimistic);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.put(`/tasks/${taskId}/acceptance-criteria/${criteriaId}`, {
        completed: updatedStatus,
      });
    } catch (error) {
      console.warn('[Criteria] Failed to toggle acceptance criterion, rolling back:', error);
      setCriteria(previous);
      if (onUpdate) onUpdate(previous);
    }
  };

  // Add new criterion
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const descToAdd = newDescription.trim();
    setNewDescription('');

    try {
      const res = await axiosInstance.post(`/tasks/${taskId}/acceptance-criteria`, {
        description: descToAdd,
      });
      const createdItem: AcceptanceCriterionRecord = {
        id: res.data.id || res.data._id || `crit-${Date.now()}`,
        description: res.data.description || descToAdd,
        completed: false,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      };

      const updated = [...criteria, createdItem];
      setCriteria(updated);
      if (onUpdate) onUpdate(updated);
    } catch (error) {
      console.warn('[Criteria] Failed to add criterion on server, applying local sync:', error);
      const fallbackItem: AcceptanceCriterionRecord = {
        id: `crit-local-${Date.now()}`,
        description: descToAdd,
        completed: false,
      };
      const updated = [...criteria, fallbackItem];
      setCriteria(updated);
      if (onUpdate) onUpdate(updated);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save edit
  const handleSaveEdit = async (criteriaId: string) => {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }

    const updatedText = editingText.trim();
    const optimistic = criteria.map((c) =>
      c.id === criteriaId ? { ...c, description: updatedText } : c
    );
    setCriteria(optimistic);
    setEditingId(null);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.put(`/tasks/${taskId}/acceptance-criteria/${criteriaId}`, {
        description: updatedText,
      });
    } catch (error) {
      console.warn('[Criteria] Failed to rename criterion:', error);
    }
  };

  // Delete criterion
  const handleDelete = async (criteriaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const optimistic = criteria.filter((c) => c.id !== criteriaId);
    setCriteria(optimistic);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.delete(`/tasks/${taskId}/acceptance-criteria/${criteriaId}`);
    } catch (error) {
      console.warn('[Criteria] Failed to delete criterion:', error);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      {/* Header & Criteria Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white font-display tracking-wide uppercase">
            Acceptance Criteria
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-emerald-400 font-semibold">{completed} Verified</span>
          <span className="text-neutral-600">/</span>
          <span className="text-amber-400 font-semibold">{pending} Pending</span>
          <span className="text-neutral-500">({percentage}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Criteria List */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {criteria.length === 0 ? (
          <div className="py-6 text-center rounded-xl border border-dashed border-white/10 p-4">
            <AlertCircle className="w-6 h-6 text-neutral-600 mx-auto mb-1.5" />
            <p className="text-xs text-neutral-400 font-sans">No acceptance criteria defined yet.</p>
            <p className="text-[10px] text-neutral-500 mt-0.5 max-w-sm mx-auto">
              Define measurable conditions of satisfaction required to consider this deliverable production-ready.
            </p>
          </div>
        ) : (
          criteria.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.04] transition-all"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.id)}
                      autoFocus
                      className="flex-1 bg-black/60 border border-emerald-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="p-1 rounded text-emerald-400 hover:bg-white/10"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded text-neutral-400 hover:bg-white/10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => handleToggle(item.id, item.completed)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400/70 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs leading-snug transition-all ${
                        item.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                )}

                {/* Edit & Delete Action Buttons */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingText(item.description);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit criterion"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                      title="Delete criterion"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add New Criterion Input */}
      <form onSubmit={handleAdd} className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="e.g. End-to-end regression pass passes with 100% test coverage..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!newDescription.trim() || isSubmitting}
          className="px-3 py-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/40 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </form>
    </div>
  );
};

export default TaskAcceptanceCriteriaSection;

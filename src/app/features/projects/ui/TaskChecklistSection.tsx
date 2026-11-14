import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Edit2, Check, X, ListChecks } from 'lucide-react';
import { axiosInstance } from '../../../config/axiosInstance';
import type { ChecklistItemRecord } from '../state/taskSlice';

interface TaskChecklistSectionProps {
  taskId: string;
  initialChecklist?: ChecklistItemRecord[];
  onUpdate?: (items: ChecklistItemRecord[]) => void;
}

export const TaskChecklistSection: React.FC<TaskChecklistSectionProps> = ({
  taskId,
  initialChecklist = [],
  onUpdate,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItemRecord[]>(initialChecklist);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Sync with initialChecklist when task changes
  useEffect(() => {
    setChecklist(initialChecklist);
  }, [taskId, initialChecklist]);

  // Compute metrics
  const total = checklist.length;
  const completed = checklist.filter((item) => item.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Toggle item completion
  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    // Optimistic update
    const previous = [...checklist];
    const optimistic = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: updatedStatus } : item
    );
    setChecklist(optimistic);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.put(`/tasks/${taskId}/checklist/${itemId}`, {
        completed: updatedStatus,
      });
    } catch (error) {
      console.warn('[Checklist] Failed to toggle item status, rolling back:', error);
      setChecklist(previous);
      if (onUpdate) onUpdate(previous);
    }
  };

  // Add new item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const titleToAdd = newTitle.trim();
    setNewTitle('');

    try {
      const res = await axiosInstance.post(`/tasks/${taskId}/checklist`, {
        title: titleToAdd,
      });
      const createdItem: ChecklistItemRecord = {
        id: res.data.id || res.data._id || `chk-${Date.now()}`,
        title: res.data.title || titleToAdd,
        completed: false,
        createdAt: res.data.createdAt,
        updatedAt: res.data.updatedAt,
      };

      const updated = [...checklist, createdItem];
      setChecklist(updated);
      if (onUpdate) onUpdate(updated);
    } catch (error) {
      console.warn('[Checklist] Failed to create item on server, applying local sync:', error);
      // Fallback local addition if offline
      const fallbackItem: ChecklistItemRecord = {
        id: `chk-local-${Date.now()}`,
        title: titleToAdd,
        completed: false,
      };
      const updated = [...checklist, fallbackItem];
      setChecklist(updated);
      if (onUpdate) onUpdate(updated);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save edit
  const handleSaveEdit = async (itemId: string) => {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }

    const updatedText = editingText.trim();
    const optimistic = checklist.map((item) =>
      item.id === itemId ? { ...item, title: updatedText } : item
    );
    setChecklist(optimistic);
    setEditingId(null);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.put(`/tasks/${taskId}/checklist/${itemId}`, {
        title: updatedText,
      });
    } catch (error) {
      console.warn('[Checklist] Failed to rename item:', error);
    }
  };

  // Delete item
  const handleDelete = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const optimistic = checklist.filter((item) => item.id !== itemId);
    setChecklist(optimistic);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.delete(`/tasks/${taskId}/checklist/${itemId}`);
    } catch (error) {
      console.warn('[Checklist] Failed to delete item:', error);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      {/* Header & Progress Gauge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-white font-display tracking-wide uppercase">
            Task Checklist
          </h4>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          {completed}/{total} Completed ({percentage}%)
        </span>
      </div>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Items List */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {checklist.length === 0 ? (
          <div className="py-6 text-center rounded-xl border border-dashed border-white/10 p-4">
            <CheckSquare className="w-6 h-6 text-neutral-600 mx-auto mb-1.5" />
            <p className="text-xs text-neutral-400 font-sans">No checklist items yet.</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Break down this task into bite-sized actionable items.
            </p>
          </div>
        ) : (
          checklist.map((item) => {
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
                      className="flex-1 bg-black/60 border border-blue-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
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
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs leading-snug transition-all ${
                        item.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                )}

                {/* Edit & Delete Action Buttons */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingText(item.title);
                      }}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit item"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                      title="Delete item"
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

      {/* Add New Item Input */}
      <form onSubmit={handleAdd} className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="Add an actionable checklist step..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!newTitle.trim() || isSubmitting}
          className="px-3 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:bg-blue-600/40 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </form>
    </div>
  );
};

export default TaskChecklistSection;

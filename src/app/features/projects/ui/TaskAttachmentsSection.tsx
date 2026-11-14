import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Upload,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Eye,
  X,
} from 'lucide-react';
import { axiosInstance, API_BASE_URL } from '../../../config/axiosInstance';
import type { AttachmentRecord } from '../state/taskSlice';

interface TaskAttachmentsSectionProps {
  taskId: string;
  initialAttachments?: AttachmentRecord[];
  onUpdate?: (items: AttachmentRecord[]) => void;
}

export const TaskAttachmentsSection: React.FC<TaskAttachmentsSectionProps> = ({
  taskId,
  initialAttachments = [],
  onUpdate,
}) => {
  const [attachments, setAttachments] = useState<AttachmentRecord[]>(initialAttachments);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAttachments(initialAttachments);
  }, [taskId, initialAttachments]);

  // Format bytes into readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to get matching format icon
  const getFileIcon = (fileType: string, fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (fileType.includes('image') || ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4 text-blue-400" />;
    }
    if (fileType.includes('pdf') || ext === 'pdf') {
      return <FileText className="w-4 h-4 text-red-400" />;
    }
    if (fileType.includes('sheet') || fileType.includes('excel') || ['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    }
    if (fileType.includes('zip') || fileType.includes('tar') || ['zip', 'tar', 'gz'].includes(ext || '')) {
      return <FileArchive className="w-4 h-4 text-amber-400" />;
    }
    return <FileCode className="w-4 h-4 text-purple-400" />;
  };

  // Upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const updatedList = [...attachments];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Enforce 20MB limit
        if (file.size > 20 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds 20MB maximum size limit.`);
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await axiosInstance.post(`/tasks/${taskId}/attachments`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const createdItem: AttachmentRecord = {
          id: res.data.id || res.data._id || `att-${Date.now()}-${i}`,
          fileName: res.data.fileName || file.name,
          fileType: res.data.fileType || file.type,
          fileSize: res.data.fileSize || file.size,
          fileUrl: res.data.fileUrl || '',
          uploadedBy: res.data.uploadedBy || 'Team Member',
          uploadedAt: res.data.uploadedAt || new Date().toISOString(),
        };

        updatedList.push(createdItem);
      }

      setAttachments(updatedList);
      if (onUpdate) onUpdate(updatedList);
    } catch (err: any) {
      console.error('[Upload] Error uploading task attachment:', err);
      setUploadError(err.response?.data?.message || err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Download handler
  const handleDownload = (attachment: AttachmentRecord) => {
    // If running in development or single-instance, resolve absolute URL
    let downloadUrl = attachment.fileUrl;
    if (downloadUrl.startsWith('/uploads')) {
      const serverOrigin = API_BASE_URL.replace('/api', '');
      downloadUrl = `${serverOrigin}${downloadUrl}`;
    }
    window.open(downloadUrl, '_blank');
  };

  // Delete attachment
  const handleDelete = async (attachmentId: string) => {
    const optimistic = attachments.filter((a) => a.id !== attachmentId);
    setAttachments(optimistic);
    if (onUpdate) onUpdate(optimistic);

    try {
      await axiosInstance.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    } catch (error) {
      console.warn('[Attachment] Failed to delete attachment from server:', error);
    }
  };

  // Drag and drop listeners
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white font-display tracking-wide uppercase">
            File Attachments ({attachments.length})
          </h4>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Upload className="w-3 h-3" />
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)}
        multiple
        className="hidden"
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-purple-400 bg-purple-950/30 scale-[1.01]'
            : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            <p className="text-xs text-neutral-300 font-sans">Uploading secure files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload className="w-5 h-5 text-neutral-500 mb-0.5" />
            <p className="text-xs text-neutral-300 font-medium">
              Drag &amp; drop specs, mockups, or deliverables here
            </p>
            <p className="text-[10px] text-neutral-500">
              PDF, Word, Excel, PowerPoint, Images, ZIP up to 20MB
            </p>
          </div>
        )}
      </div>

      {/* Attachments List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {attachments.length === 0 ? (
          <p className="text-[11px] text-neutral-500 text-center py-2 font-mono">
            No files attached to this task.
          </p>
        ) : (
          attachments.map((att) => {
            const isImage =
              att.fileType.includes('image') ||
              /\.(png|jpg|jpeg|webp|svg)$/i.test(att.fileName);

            return (
              <div
                key={att.id}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(att.fileType, att.fileName)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-xs font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      {att.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                      <span>{formatBytes(att.fileSize)}</span>
                      <span>·</span>
                      <span>{att.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isImage && (
                    <button
                      onClick={() => setPreviewAttachment(att)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Preview image"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(att)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Download / Open file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(att.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Delete attachment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Image Preview Modal */}
      {previewAttachment && (
        <div
          onClick={() => setPreviewAttachment(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full rounded-2xl bg-[#090D1A] border border-white/20 p-4 overflow-hidden relative shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs font-semibold text-white truncate">
                {previewAttachment.fileName}
              </span>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center overflow-auto rounded-xl bg-black">
              <img
                src={
                  previewAttachment.fileUrl.startsWith('/uploads')
                    ? `${API_BASE_URL.replace('/api', '')}${previewAttachment.fileUrl}`
                    : previewAttachment.fileUrl
                }
                alt={previewAttachment.fileName}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAttachmentsSection;

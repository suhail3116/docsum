import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FileText, Trash2, Eye, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatFileSize, getFileCategory, generateAISummary } from '../utils/docUtils';

export default function FileUploadZone({
  queuedFiles,
  onAddFiles,
  onRemoveFile,
  onClearQueue,
  onSubmitFiles,
  onInspectSummary,
  isSubmitting
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = ''; // reset
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>File Manager</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Staging Dropzone
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag & drop document files to extract AI summaries & commit to local records.
          </p>
        </div>

        {queuedFiles.length > 0 && (
          <button
            onClick={onClearQueue}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 font-medium px-2.5 py-1 rounded-lg hover:bg-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Queue
          </button>
        )}
      </div>

      {/* Drag & Drop Surface */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed relative overflow-hidden group ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : 'border-emerald-500/30 hover:border-emerald-400/80 bg-slate-900/40 hover:bg-emerald-500/5'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className={`p-4 rounded-2xl transition-transform duration-300 ${
            isDragOver ? 'scale-110 bg-emerald-500/20 text-emerald-300' : 'bg-slate-800/80 text-emerald-400 group-hover:scale-110'
          }`}>
            <CloudUpload className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              {isDragOver ? 'Drop files to stage' : 'Choose files or drag & drop'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, DOCX, CSV, JSON, TXT & Images (Up to 25MB each)
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            <Sparkles className="w-3 h-3" /> Auto AI Summarization Enabled
          </span>
        </div>
      </motion.div>

      {/* Queued Files List */}
      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {queuedFiles.map((fileObj, idx) => {
            const category = getFileCategory(fileObj.name);
            const sizeFormatted = formatFileSize(fileObj.size);

            return (
              <motion.div
                key={fileObj.id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${category.color}`}>
                    {category.type.toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-white truncate max-w-[220px] sm:max-w-[320px]">
                      {fileObj.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{sizeFormatted}</span>
                      <span>•</span>
                      <span className="text-emerald-400">Ready to audit</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const summaryData = generateAISummary(fileObj.name, sizeFormatted);
                      onInspectSummary({
                        name: fileObj.name,
                        size: sizeFormatted,
                        timestamp: 'Staged Preview',
                        summary: summaryData
                      });
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors text-xs flex items-center gap-1 font-medium border border-slate-700"
                    title="Quick AI Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveFile(idx)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {queuedFiles.length === 0 && (
          <div className="py-4 text-center text-xs text-slate-500 border border-slate-800/50 rounded-xl bg-slate-950/20">
            No files staged in queue yet. Select or drop files above to start.
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={onSubmitFiles}
          disabled={queuedFiles.length === 0 || isSubmitting}
          className="w-full py-4 px-6 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Processing & Committing Records...</span>
            </>
          ) : (
            <>
              <CloudUpload className="w-5 h-5 stroke-[2.2]" />
              <span>Submit {queuedFiles.length > 0 ? `${queuedFiles.length} File(s)` : ''} to Storage Vault</span>
              <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

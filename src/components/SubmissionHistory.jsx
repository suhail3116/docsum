import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Trash2, FileText, Sparkles, Calendar, FileCode, CheckCircle, ExternalLink } from 'lucide-react';
import { getFileCategory } from '../utils/docUtils';

export default function SubmissionHistory({
  historyRecords,
  onDeleteItem,
  onClearAll,
  onInspectItem
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = historyRecords.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.timestamp && item.timestamp.toLowerCase().includes(term)) ||
      (item.size && item.size.toLowerCase().includes(term))
    );
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Submission History</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of committed document records & AI insights.
          </p>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {historyRecords.length} Record{historyRecords.length !== 1 ? 's' : ''}
          </span>
          {historyRecords.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      {historyRecords.length > 0 && (
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by name or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      )}

      {/* History Items Scroll Area */}
      <div className="flex-1 min-h-[320px] max-h-[460px] overflow-y-auto space-y-3 pr-1">
        <AnimatePresence>
          {filteredRecords.map((record) => {
            const category = getFileCategory(record.name);

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/15 hover:border-emerald-500/35 p-4 rounded-2xl transition-all group flex items-start justify-between gap-3"
              >
                <div className="overflow-hidden space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${category.color}`}>
                      {category.type.toUpperCase()}
                    </span>
                    <h4
                      onClick={() => onInspectItem(record)}
                      className="text-sm font-semibold text-emerald-300 hover:text-emerald-200 truncate cursor-pointer transition-colors"
                      title={record.name}
                    >
                      {record.name}
                    </h4>
                  </div>

                  <div className="flex items-center text-[11px] text-slate-400 space-x-3 font-mono">
                    <span>{record.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {record.timestamp}
                    </span>
                  </div>

                  {record.summary && (
                    <div className="text-[11px] text-slate-300 line-clamp-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{record.summary.summaryText}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onInspectItem(record)}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700/50 transition-colors"
                    title="View AI Breakdown"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(record.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredRecords.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 text-slate-500 space-y-2">
            <FileCode className="w-10 h-10 stroke-[1.2] text-slate-600 mb-1" />
            <p className="text-sm font-medium text-slate-400">
              {searchTerm ? 'No matching records found' : 'No submission records found'}
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              {searchTerm
                ? 'Try searching with a different file name or clear search filter.'
                : 'Stage files in the File Manager dropzone and click submit to record audit data.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

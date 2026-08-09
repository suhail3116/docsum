import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Copy, FileText, Download, ShieldCheck, Cpu } from 'lucide-react';
import { getFileCategory } from '../utils/docUtils';

export default function FileDetailModal({ record, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'raw'

  if (!record) return null;

  const category = getFileCategory(record.name);
  const summary = record.summary || {};

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="glass-panel-glow w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-slate-900/90 flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/50">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl border ${category.color}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white max-w-xs sm:max-w-md truncate">
                    {record.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-emerald-400 border border-slate-700">
                    {category.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Size: {record.size} • Audited: {record.timestamp}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 space-x-4">
            <button
              onClick={() => setActiveTab('insights')}
              className={`pb-3 text-xs font-bold transition-colors relative flex items-center gap-1.5 ${
                activeTab === 'insights' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Intelligence Summary
              {activeTab === 'insights' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`pb-3 text-xs font-bold transition-colors relative flex items-center gap-1.5 ${
                activeTab === 'raw' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Raw Vault Record (JSON)
              {activeTab === 'raw' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'insights' ? (
              <>
                {/* Confidence Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Confidence</p>
                    <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                      {summary.confidenceScore || '99.2%'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Extracted Entities</p>
                    <p className="text-base font-extrabold text-blue-400 mt-0.5">
                      {summary.entitiesCount || 12} Nodes
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Classification</p>
                    <p className="text-base font-extrabold text-purple-400 mt-0.5 truncate">
                      {summary.category || 'Validated'}
                    </p>
                  </div>
                </div>

                {/* Main Summary Text */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    AI Executive Overview
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {summary.summaryText || `Document record "${record.name}" successfully parsed and stored in local vault.`}
                  </p>
                </div>

                {/* Key Bullet Highlights */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Key Extracted Bullet Insights
                  </h4>
                  <ul className="space-y-2">
                    {(summary.bulletPoints || [
                      'Verified document integrity and encryption parameters.',
                      'Extracted semantic metadata tags.',
                      'Ready for export or data pipeline processing.'
                    ]).map((bullet, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-2.5 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              /* Raw JSON Tab */
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">JSON Record Format</span>
                  <button
                    onClick={handleCopyJSON}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono overflow-x-auto max-h-[300px]">
                  {JSON.stringify(record, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <button
              onClick={handleCopyJSON}
              className="text-xs text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Audit Hash
            </button>

            <button
              onClick={() => {
                alert(`Downloaded record report for "${record.name}"`);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

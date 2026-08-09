import React from 'react';
import { motion } from 'framer-motion';
import { Database, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '../utils/docUtils';

export default function StatsOverview({ historyRecords, queuedFiles }) {
  const totalSubmissions = historyRecords.length;
  
  // Estimate total size processed
  const totalSizeBytes = historyRecords.reduce((acc, curr) => {
    let sizeNum = parseFloat(curr.size) || 0;
    if (curr.size && curr.size.toLowerCase().includes('mb')) sizeNum *= 1024;
    return acc + sizeNum;
  }, 0) * 1024;

  const formattedTotalSize = formatFileSize(totalSizeBytes);

  const stats = [
    {
      id: 'total',
      label: 'Committed Records',
      value: totalSubmissions,
      subtext: 'Audited in vault',
      icon: Database,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'queue',
      label: 'Queued Staging',
      value: queuedFiles.length,
      subtext: queuedFiles.length > 0 ? 'Ready for submission' : 'No pending files',
      icon: Clock,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30'
    },
    {
      id: 'storage',
      label: 'Processed Volume',
      value: formattedTotalSize,
      subtext: 'Local storage index',
      icon: CheckCircle2,
      color: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30'
    },
    {
      id: 'speed',
      label: 'AI Ingestion Speed',
      value: '0.4s / doc',
      subtext: '99.9% OCR accuracy',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`glass-panel p-5 rounded-2xl border bg-gradient-to-br ${stat.color} transition-all relative overflow-hidden group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  {stat.subtext}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            
            {/* Subtle glow orb */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}

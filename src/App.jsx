import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import FileUploadZone from './components/FileUploadZone';
import SubmissionHistory from './components/SubmissionHistory';
import FileDetailModal from './components/FileDetailModal';
import AuthModal from './components/AuthModal';

import {
  STORAGE_KEYS,
  loadHistoryFromStorage,
  saveHistoryToStorage,
  generateAISummary,
  formatFileSize
} from './utils/docUtils';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [queuedFiles, setQueuedFiles] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals & Notifications
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize workspace & storage state
  useEffect(() => {
    // 1. Load user from storage
    try {
      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
      if (storedUser) {
        setCurrentUser(storedUser);
      }
    } catch (e) {
      console.error('Failed to parse currentUser:', e);
    }

    // 2. Load submission history
    const initialRecords = loadHistoryFromStorage();
    setHistoryRecords(initialRecords);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add files to queue
  const handleAddFiles = (newFiles) => {
    const formatted = newFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      size: f.size,
      rawFile: f
    }));
    setQueuedFiles(prev => [...prev, ...formatted]);
    showToast(`Added ${newFiles.length} file(s) to staging queue`, 'info');
  };

  // Remove single file from queue
  const handleRemoveQueuedFile = (index) => {
    setQueuedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all queued files
  const handleClearQueue = () => {
    setQueuedFiles([]);
    showToast('Staged file queue cleared', 'info');
  };

  // Submit queue to storage records
  const handleSubmitFiles = () => {
    if (queuedFiles.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const nowStr = new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const newSubmissions = queuedFiles.map(fileObj => {
        const sizeStr = formatFileSize(fileObj.size);
        return {
          id: Date.now() + Math.random(),
          name: fileObj.name,
          size: sizeStr,
          timestamp: nowStr,
          summary: generateAISummary(fileObj.name, sizeStr)
        };
      });

      const updatedHistory = [...newSubmissions, ...historyRecords];
      setHistoryRecords(updatedHistory);
      saveHistoryToStorage(updatedHistory);

      setQueuedFiles([]);
      setIsSubmitting(false);

      // Trigger celebration confetti animation
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
        });
      } catch (e) {
        // fallback if canvas canvas-confetti environment restricts canvas
      }

      showToast(`Successfully committed ${newSubmissions.length} record(s) to vault storage!`, 'success');
    }, 800);
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id) => {
    const updated = historyRecords.filter(item => item.id !== id);
    setHistoryRecords(updated);
    saveHistoryToStorage(updated);
    showToast('Deleted submission record', 'info');
  };

  // Clear all submission history
  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to permanently delete all submission records?")) {
      setHistoryRecords([]);
      saveHistoryToStorage([]);
      showToast('All submission records cleared', 'info');
    }
  };

  // User Auth Profile Handlers
  const handleSaveUser = (userData) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      setCurrentUser(userData);
      showToast(`Welcome back, ${userData.name}!`, 'success');
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setCurrentUser(null);
      showToast('Switched to Guest Mode', 'info');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
    showToast('Signed out of workspace', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Interactive 3D WebGL Background */}
      <ThreeBackground />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-lg border text-xs font-semibold flex items-center space-x-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                : 'bg-slate-900/90 text-slate-200 border-slate-700 shadow-slate-900/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 z-10 space-y-8">
        
        {/* Workspace Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Live Document Pipeline
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentUser?.company || 'Enterprise Partner Workspace'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Workspace{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                {currentUser?.name ? `${currentUser.name}'s Dashboard` : 'Dashboard'}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Manage, commit, and audit your document records with 3D canvas visual effects and instant AI document insights.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-emerald-300 font-bold">SHA-256 Vault Active</div>
              <div className="text-[10px] text-slate-500">Auto-synced with browser storage</div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Overview Cards */}
        <StatsOverview
          historyRecords={historyRecords}
          queuedFiles={queuedFiles}
        />

        {/* Main Grid: Upload Staging Zone & Submission Audit History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* File Upload & Staging Zone */}
          <div className="lg:col-span-7">
            <FileUploadZone
              queuedFiles={queuedFiles}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveQueuedFile}
              onClearQueue={handleClearQueue}
              onSubmitFiles={handleSubmitFiles}
              onInspectSummary={(record) => setSelectedRecord(record)}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Submission History Panel */}
          <div className="lg:col-span-5">
            <SubmissionHistory
              historyRecords={historyRecords}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              onInspectItem={(record) => setSelectedRecord(record)}
            />
          </div>

        </div>

      </main>

      {/* Detail Modal for AI Insights & JSON Audit Inspection */}
      <FileDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Authentication & User Session Settings Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSaveUser={handleSaveUser}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 z-10 glass-panel mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-400">DocSum AI Workspace</span>
            <span>• Built with React, Vite & Three.js</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            © {new Date().getFullYear()} DocSum. All document audit records persisted locally.
          </div>
        </div>
      </footer>
    </div>
  );
}

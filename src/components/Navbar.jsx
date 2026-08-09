import React from 'react';
import { Briefcase, Power, UserCheck, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout }) {
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Section */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Doc<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Sum</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden md:block">
              Intelligent Workspace & Document Intelligence
            </p>
          </div>
        </div>

        {/* Right User & Actions Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Vault</span>
          </div>

          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all text-xs font-semibold group shadow-sm"
            title="Configure User Profile"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs">
              {currentUser ? currentUser.name?.[0]?.toUpperCase() || 'U' : 'G'}
            </div>
            <span className="max-w-[120px] truncate text-emerald-300">
              {currentUser ? currentUser.email || currentUser.name || 'Active User' : 'Guest Mode'}
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all duration-200 shadow-sm"
            title={currentUser ? "Sign Out" : "Reset Workspace"}
            aria-label="Logout"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>

      </div>
    </nav>
  );
}

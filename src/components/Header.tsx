import React from 'react';
import { Play, Square, Pause, RotateCcw, AlertTriangle, Cpu, Terminal, Shield } from 'lucide-react';
import { SystemStatus } from '../types';

interface HeaderProps {
  status: SystemStatus;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onOpenSettings: () => void;
}

export function Header({ status, onStart, onStop, onPause, onResume, onOpenSettings }: HeaderProps) {
  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="border-b border-zinc-805 bg-zinc-950 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans select-none" id="dashboard_header">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-900 border border-emerald-500/40 text-emerald-400 shadow-[0_0_8px_#10b981]/50 animate-pulse">
          <Cpu className="h-4.5 w-4.5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className={`w-2.5 h-2.5 rounded-full ${status.isRunning ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'}`}></div>
            <h1 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Autonomous Developer Studio</h1>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
            PROJECT: <span className="text-zinc-300 font-bold uppercase">Xenon_Drift_V3</span> | STATUS: <span className={status.isRunning ? "text-emerald-400 font-bold" : "text-zinc-500"}>{status.isRunning ? (status.isPaused ? 'PAUSED' : 'AUTONOMOUS_RUN') : 'OFFLINE'}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-4 font-mono text-xs">
        {/* Metric widgets */}
        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 flex flex-col min-w-[80px]">
          <span className="text-[10px] text-zinc-500 uppercase">Iteration</span>
          <span className="text-zinc-300 font-bold font-sans">#{status.currentIteration}</span>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 flex flex-col min-w-[80px]">
          <span className="text-[10px] text-zinc-500 uppercase">Uptime</span>
          <span className="text-zinc-300 font-bold font-sans">{formatUptime(status.uptime)}</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 flex flex-col min-w-[80px]">
          <span className="text-[10px] text-zinc-500 uppercase">Crash Safe</span>
          <span className="text-zinc-300 font-bold font-sans flex items-center gap-1">
            {status.crashCount} <Shield className="h-3 w-3 text-emerald-400" />
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 flex flex-col min-w-[100px]">
          <span className="text-[10px] text-zinc-500 uppercase">Tokens Consumed</span>
          <span className="text-zinc-300 font-bold font-sans text-right">
            {status.totalTokensUsed.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!status.isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold font-mono text-xs cursor-pointer transition-all duration-200 active:scale-95 uppercase"
            id="start_system_btn"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> START WORKSPACE
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {status.isPaused ? (
              <button
                onClick={onResume}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold font-mono text-xs cursor-pointer transition-all duration-200 active:scale-95 uppercase"
                id="resume_system_btn"
              >
                <Play className="h-3.5 w-3.5" /> RESUME
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-amber-950/30 hover:bg-amber-900/40 text-amber-450 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)] font-bold font-mono text-xs cursor-pointer transition-all duration-200 active:scale-95 animate-pulse uppercase"
                id="pause_system_btn"
              >
                <Pause className="h-3.5 w-3.5" /> PAUSE LOOP
              </button>
            )}

            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 border border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)] font-bold font-mono text-xs cursor-pointer transition-all duration-200 active:scale-95 uppercase"
              id="stop_system_btn"
            >
              <Square className="h-3.5 w-3.5 fill-current" /> STOP SYSTEMS
            </button>
          </div>
        )}

        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all font-mono text-xs font-bold cursor-pointer uppercase"
          title="Engine configuration settings"
          id="open_config_btn"
        >
          SETTINGS
        </button>
      </div>
    </header>
  );
}

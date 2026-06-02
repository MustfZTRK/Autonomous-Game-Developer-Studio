import React from 'react';
import { Shield, Sparkles, Activity, Target, Layers, Zap } from 'lucide-react';
import { SystemStatus } from '../types';

interface OverviewProps {
  status: SystemStatus;
}

export function Overview({ status }: OverviewProps) {
  // Compute styling gradients depending on score levels
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score >= 65) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-rose-400 border-rose-500/20 bg-rose-500/5";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 65) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-zinc-950 font-sans" id="overview_layout_section">
      
      {/* Objective Card - Takes 2 columns width on medium screens */}
      <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
        <div>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-semibold mb-2">
            <Target className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> CURRENT AI ENGINE ROADMAP
          </span>
          <h2 className="text-sm font-semibold text-zinc-300 font-mono">OBJECTIVE:</h2>
          <p className="text-lg font-bold text-white tracking-tight mt-1 mb-3">
            {status.isRunning ? status.currentObjective : "Systems offline. Configure your Gemini secret and click START."}
          </p>
        </div>
        <div className="flex gap-4 border-t border-zinc-800/80 pt-4 text-xs font-mono">
          <div className="flex items-center gap-1 text-zinc-400">
            <Layers className="h-3.5 w-3.5 text-zinc-500" /> Mode: <span className="text-zinc-250 font-semibold">Autonomous Endless Development</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Zap className="h-3.5 w-3.5 text-zinc-500 animate-bounce" /> Target Loop: <span className="text-emerald-400 font-semibold">Resilient Pygame Framework</span>
          </div>
        </div>
      </div>

      {/* Stability score meter */}
      <div className={`bg-zinc-900 border border-zinc-800 rounded p-4 flex flex-col justify-between shadow-md ${getScoreColorClass(status.stabilityScore)}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-bold flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-emerald-400" /> Stability Rating
          </span>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-zinc-950/40">COMPLIANT</span>
        </div>
        <div className="my-2.5">
          <span className="text-2xl font-extrabold text-white font-sans tracking-tight">{status.stabilityScore}%</span>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 overflow-hidden border border-zinc-850/40 p-[1px]">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${status.stabilityScore >= 85 ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : status.stabilityScore >= 65 ? 'bg-amber-405 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}
              style={{ width: `${status.stabilityScore}%` }}
            />
          </div>
        </div>
        <p className="text-[10px] font-mono text-zinc-450 leading-relaxed">
          Determines compiler error frequency, crash prevention thresholds and patch stability.
        </p>
      </div>

      {/* Playability & Fun rating meter */}
      <div className={`bg-zinc-900 border border-zinc-800 rounded p-4 flex flex-col justify-between shadow-md ${getScoreColorClass(status.funScore)}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-bold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Fun Multiplier
          </span>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-zinc-950/40">INTEGRATED</span>
        </div>
        <div className="my-2.5">
          <span className="text-2xl font-extrabold text-white font-sans tracking-tight">{status.funScore}%</span>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 overflow-hidden border border-zinc-850/40 p-[1px]">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${status.funScore >= 85 ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : status.funScore >= 65 ? 'bg-amber-405 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-505 shadow-[0_0_8px_#f43f5e]'}`}
              style={{ width: `${status.funScore}%` }}
            />
          </div>
        </div>
         <p className="text-[10px] font-mono text-zinc-450 leading-relaxed">
          Dynamic scoring based on level composition, items drops density, weather layers, and battle dynamics.
        </p>
      </div>

    </div>
  );
}

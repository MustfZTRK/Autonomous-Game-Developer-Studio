import React from 'react';
import { History, GitCommit, CheckCircle, Shield, Award, Layers } from 'lucide-react';
import { Iteration } from '../types';

interface IterationTimelineProps {
  iterations: Iteration[];
}

export function IterationTimeline({ iterations }: IterationTimelineProps) {
  // Sort reverse list so newest milestone is shown on top
  const sortedIterations = [...iterations].sort((a,b) => b.id - a.id);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-sans h-full flex flex-col shadow-lg" id="iteration_history_timeline">
      
      {/* Header element */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-tight">
            <History className="h-4.5 w-4.5 text-purple-400" /> MASTER ITERATION TIMELINE
          </h3>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Log timeline traces of completed development cycles.
          </p>
        </div>
        <span className="text-[9px] bg-zinc-850 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase select-none">Git Commited</span>
      </div>

      {/* Main scrolling entries list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin h-[350px]">
        {sortedIterations.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-650 py-12">
            No iterations committed yet. Initiate loops to populate milestones.
          </div>
        ) : (
          sortedIterations.map((it, idx) => (
            <div key={it.id} className="relative pl-6 border-l border-zinc-800 pb-4 last:pb-0 group">
              
              {/* Dot marker */}
              <div className="absolute left-[-5.5px] top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-900 border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center justify-center bg-zinc-900 shrink-0">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400 group-hover:scale-130 transition" />
              </div>

              {/* Box */}
              <div className="bg-zinc-950 border border-zinc-850/80 rounded-lg p-4 hover:border-purple-500/30 transition-all duration-300">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-white">#ITER_0{it.id}</span>
                    <span className="text-zinc-600">|</span>
                    <span className="text-purple-400 font-bold tracking-tight uppercase flex items-center gap-0.5">
                      <GitCommit className="h-3.5 w-3.5 shrink-0" /> {it.commitHash}
                    </span>
                  </div>
                  <span className="text-zinc-555 shrink-0 block">
                    {new Date(it.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-medium mb-3">
                  {it.summary}
                </p>

                {/* Scope changes lists */}
                <div className="mb-3.5">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 flex items-center gap-1 mb-1.5 font-mono select-none">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Incremental Patches Written:
                  </span>
                  <ul className="space-y-1 pl-1 text-[11px] text-zinc-400">
                    {it.changes.map((change, id) => (
                      <li key={id} className="flex items-start gap-1.5">
                        <span className="text-zinc-600 inline-block mt-0.5 select-none font-sans font-bold">•</span>
                        <span className="font-sans leading-normal">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Score details badges footer */}
                <div className="flex items-center flex-wrap gap-2 pt-2.5 border-t border-zinc-900/60 font-mono text-[9px] select-none">
                  <div className="flex items-center gap-1 text-zinc-400 border border-zinc-850 rounded bg-zinc-900 px-2 py-0.5">
                    <Shield className="h-3 w-3 text-emerald-400" /> Stability: <span className="text-emerald-400 font-bold">{it.stabilityScore}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 border border-zinc-850 rounded bg-zinc-900 px-2 py-0.5">
                    <Award className="h-3 w-3 text-cyan-400" /> Score Index: <span className="text-cyan-400 font-bold">{it.score}/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 border border-zinc-850 rounded bg-zinc-900 px-2 py-0.5">
                    <Layers className="h-3 w-3 text-amber-500" /> MemSize: <span className="text-amber-500 font-bold">{it.memoryUsage}</span>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

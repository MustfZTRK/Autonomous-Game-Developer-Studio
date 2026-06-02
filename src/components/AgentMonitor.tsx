import React from 'react';
import { Cpu, Users, Layers, BadgeAlert } from 'lucide-react';
import { AgentState } from '../types';

interface AgentMonitorProps {
  agents: AgentState[];
  activeAgentId: string | null;
}

export function AgentMonitor({ agents, activeAgentId }: AgentMonitorProps) {
  const getAgentColor = (id: string, active: boolean) => {
    if (!active) return "border-zinc-800 bg-zinc-900/40 opacity-50";
    
    switch(id) {
      case "pm": return "border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.25)] ring-[1px] ring-emerald-500/30";
      case "architect": return "border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_10px_rgba(6,182,212,0.25)] ring-[1px] ring-cyan-500/30";
      case "coder": return "border-rose-500/60 bg-rose-950/20 shadow-[0_0_10px_rgba(244,63,94,0.25)] ring-[1px] ring-rose-500/30";
      case "builder": return "border-amber-500/60 bg-amber-950/20 shadow-[0_0_10px_rgba(245,158,11,0.25)] ring-[1px] ring-amber-500/30";
      default: return "border-purple-500/60 bg-purple-950/20 shadow-[0_0_10px_rgba(168,85,247,0.25)] ring-[1px] ring-purple-500/30";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working': return <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded animate-pulse">WORKING</span>;
      case 'analyzing': return <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded animate-pulse">ANALYZING</span>;
      default: return <span className="text-zinc-500 text-[9px] font-bold">IDLE</span>;
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 font-sans h-full flex flex-col" id="agent_monitor_section">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-tight">
          <Users className="h-4 w-4 text-emerald-400" />AGENTS MONITORING
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">8 SPECIALIZED AGENTS ONLINE</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 flex-1 overflow-y-auto">
        {agents.map((agent) => {
          const isActive = activeAgentId === agent.id;
          return (
            <div
              key={agent.id}
              className={`p-3.5 border rounded-lg transition-all duration-300 flex flex-col justify-between min-h-[140px] hover:scale-[1.02] ${getAgentColor(agent.id, isActive)}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-semibold text-white tracking-tight text-xs block truncate" title={agent.name}>{agent.name}</span>
                  {getStatusBadge(isActive ? 'working' : 'idle')}
                </div>
                <span className="text-[10px] text-zinc-400 leading-tight block mb-2">{agent.role}</span>
              </div>

              <div className="border-t border-zinc-850 pt-2.5 mt-2 font-mono text-[9px] text-zinc-500">
                <div className="flex justify-between items-center mb-1">
                  <span>Tokens:</span>
                  <span className={`${agent.tokensUsed > 0 ? 'text-zinc-300 font-bold' : ''}`}>
                    {agent.tokensUsed.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-zinc-600 truncate">
                  <span className="shrink-0">Model:</span>
                  <span className="truncate text-right ml-1" title={agent.modelUsed}>{agent.modelUsed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

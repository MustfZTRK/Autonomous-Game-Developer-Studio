import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Trash2, ShieldAlert, Cpu, Download } from 'lucide-react';
import { LogMessage } from '../types';

interface TerminalLogsProps {
  logs: LogMessage[];
  onClearLogs: () => void;
}

export function TerminalLogs({ logs, onClearLogs }: TerminalLogsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to newest log entry
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400 font-semibold';
      case 'warn': return 'text-amber-400 font-semibold';
      case 'success': return 'text-emerald-400 font-semibold';
      case 'terminal': return 'text-zinc-300 font-mono';
      default: return 'text-zinc-400';
    }
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'warn': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'success': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-zinc-900 text-zinc-400 border border-zinc-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.agentName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterLevel === "all" || log.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const exportLogsAsText = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.agentName ? `${l.agentName}: ` : ''}${l.message}`).join("\n");
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autonomous_studio_logs_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[400px] font-mono text-xs" id="terminal_logs_block">
      
      {/* Search and control header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest font-mono">Swarm Operations Console</span>
        </div>
        
        <div className="flex items-center flex-wrap gap-2">
          {/* Level Filter badges */}
          <div className="flex items-center gap-1 bg-zinc-950 rounded border border-zinc-800 p-0.5">
            {['all', 'info', 'warn', 'error', 'success'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer transition-colors ${filterLevel === lvl ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 pl-8 pr-3 py-1 rounded placeholder-zinc-600 focus:outline-none focus:border-emerald-500/40 text-[11px] w-36"
            />
          </div>

          <button
            onClick={exportLogsAsText}
            className="p-1 px-2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            title="Download Logs as text file"
          >
            <Download className="h-3 w-3" /> EXPORT
          </button>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/35 transition-colors cursor-pointer"
            title="Clear logs terminal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal log rows */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-950/95 scrollbar-thin scrollbar-thumb-zinc-800">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 py-12 select-none">
            <Cpu className="h-8 w-8 text-zinc-800 mb-2 animate-spin" />
            <p className="font-mono text-xs">Waiting for agent loop execution signals...</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-2 leading-relaxed hover:bg-zinc-900/40 px-1 py-0.5 rounded transition-colors group">
              <span className="text-[10px] text-zinc-600 flex-shrink-0 select-none">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              
              {log.agentName && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold flex-shrink-0 select-none ${getBadgeStyle(log.level)}`}>
                  {log.agentName}
                </span>
              )}
              
              <span className={`break-all ${getLogColor(log.level)}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer status info */}
      <div className="bg-zinc-950 text-[10px] text-zinc-500 border-t border-zinc-900 px-4 py-1.5 flex items-center justify-between select-none">
        <span>LOGSCOUNT: {logs.length} | FILTER_ROWS: {filteredLogs.length}</span>
        <span className="text-zinc-600">CONNECTED_AGENTS: crewai_core_supervisor v2</span>
      </div>
    </div>
  );
}

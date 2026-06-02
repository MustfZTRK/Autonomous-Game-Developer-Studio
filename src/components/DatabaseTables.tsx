import React, { useState, useEffect } from 'react';
import { Database, Bug, ClipboardList, CheckCircle2, RefreshCw, XCircle, AlertCircle } from 'lucide-react';
import { Task, Bug as BugType, Iteration } from '../types';

interface DatabaseTablesProps {
  tasks: Task[];
  bugs: BugType[];
  iterations: Iteration[];
}

export function DatabaseTables({ tasks, bugs, iterations }: DatabaseTablesProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'bugs' | 'iterations'>('tasks');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-cyan-400 shrink-0 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      default: return <AlertCircle className="h-4 w-4 text-zinc-500 shrink-0" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10 font-bold';
      case 'running': return 'text-cyan-400 bg-cyan-500/5 border-cyan-500/10 font-bold';
      case 'failed': return 'text-rose-400 bg-rose-500/5 border-rose-500/10 font-bold';
      default: return 'text-zinc-500 bg-zinc-950 border-zinc-800';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-sans h-full flex flex-col shadow-lg" id="sqlite_database_tables">
      {/* Table select trigger tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3 mb-4 select-none">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-tight">
            <Database className="h-4.5 w-4.5 text-cyan-400" /> SYSTEM SQLITE DATABASE TABLES
          </h3>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Structured logging relational state tables synced with system execution memory.
          </p>
        </div>

        {/* Tab options selector */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-850">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer transition ${activeTab === 'tasks' ? 'bg-zinc-850 text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            TASKS ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('bugs')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer transition ${activeTab === 'bugs' ? 'bg-zinc-850 text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            BUG_TRAX ({bugs.length})
          </button>
          <button
            onClick={() => setActiveTab('iterations')}
            className={`px-3 py-1 rounded text-xs font-mono font-medium cursor-pointer transition ${activeTab === 'iterations' ? 'bg-zinc-850 text-cyan-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            ITERATIONS ({iterations.length})
          </button>
        </div>
      </div>

      {/* Grid Content Viewer based on active selection */}
      <div className="flex-1 overflow-x-auto h-[350px]">
        {activeTab === 'tasks' && (
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 select-none uppercase text-[10px]">
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Title Description</th>
                <th className="py-2.5 px-3">Assigned Agent</th>
                <th className="py-2.5 px-3">State Status</th>
                <th className="py-2.5 px-3 text-right">Time Registered</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-600">No active tasks registered.</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="border-b border-zinc-850/60 hover:bg-zinc-950/40 transition">
                    <td className="py-3 px-3 text-cyan-400 font-semibold shrink-0">#{task.id.slice(-6)}</td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-medium text-white max-w-[320px] truncate">{task.title}</div>
                      <div className="text-[10px] text-zinc-500 max-w-[320px] truncate mt-0.5">{task.description}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{task.agent}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase border ${getStatusStyle(task.status)}`}>
                        {getStatusIcon(task.status)} {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-600 text-[10px]">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'bugs' && (
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 select-none uppercase text-[10px]">
                <th className="py-2.5 px-3">Bug ID</th>
                <th className="py-2.5 px-3">Threat Profile description</th>
                <th className="py-2.5 px-3">Target Cause</th>
                <th className="py-2.5 px-3">Sandbox Fix Action</th>
                <th className="py-2.5 px-3 text-right">Severity Status</th>
              </tr>
            </thead>
            <tbody>
              {bugs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-600">No active warning patterns registered in DB.</td>
                </tr>
              ) : (
                bugs.map((bug) => (
                  <tr key={bug.id} className="border-b border-zinc-850/60 hover:bg-zinc-950/40 transition">
                    <td className="py-3 px-3 text-rose-400 font-semibold">#{bug.id.slice(-6)}</td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-semibold text-rose-300 max-w-[220px] truncate">{bug.description}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{new Date(bug.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 max-w-[200px] truncate" title={bug.cause}>{bug.cause}</td>
                    <td className="py-3 px-3 text-zinc-300 max-w-[200px] truncate" title={bug.fixAttempt}>{bug.fixAttempt}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bug.resolved ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950 text-rose-400 border border-rose-800/40 animate-pulse'}`}>
                        {bug.resolved ? "RESOLVED" : "ACTIVE WARNING"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'iterations' && (
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 select-none uppercase text-[10px]">
                <th className="py-2.5 px-3">Iter#</th>
                <th className="py-2.5 px-3">Release Summary details</th>
                <th className="py-2.5 px-3">Metrics (Stab/Perf)</th>
                <th className="py-2.5 px-3">Git Commit Tree</th>
                <th className="py-2.5 px-3 text-right">Commit Time</th>
              </tr>
            </thead>
            <tbody>
              {iterations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-600">No iterations committed.</td>
                </tr>
              ) : (
                iterations.map((iter) => (
                  <tr key={iter.id} className="border-b border-zinc-850/60 hover:bg-zinc-950/40 transition">
                    <td className="py-3 px-3 font-extrabold text-white">#{iter.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-medium text-white max-w-[320px] truncate">{iter.summary}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                        <span>Modules:</span>
                        <span className="truncate max-w-[280px]" title={iter.features.join(", ")}>{iter.features.join(", ")}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">
                      <div className="text-[10px]">Stability: <span className="font-bold text-emerald-400">{iter.stabilityScore}%</span></div>
                      <div className="text-[10px]">Performance: <span className="font-bold text-cyan-400">{iter.performanceScore}%</span></div>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      <span className="bg-zinc-950 px-1.5 py-1 rounded text-[10px] text-amber-500 border border-zinc-800 font-mono select-all">
                        {iter.commitHash}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-zinc-650 text-[10px]">
                      {new Date(iter.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

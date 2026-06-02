import React, { useEffect, useState } from 'react';
import { Play, Square, Pause, Settings, Layers, Code, Database, Gamepad2, History, Terminal, Info, ShieldAlert } from 'lucide-react';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { GameCanvas } from './components/GameCanvas';
import { TerminalLogs } from './components/TerminalLogs';
import { AgentMonitor } from './components/AgentMonitor';
import { FileExplorer } from './components/FileExplorer';
import { DatabaseTables } from './components/DatabaseTables';
import { SettingsModal } from './components/SettingsModal';
import { IterationTimeline } from './components/IterationTimeline';
import { SystemStatus, SystemSettings, Iteration, Task, Bug, LogMessage, AgentState } from './types';

export default function App() {
  // Sync Status
  const [status, setStatus] = useState<SystemStatus>({
    isRunning: false,
    isPaused: false,
    currentIteration: 1,
    activeAgentId: null,
    activeTaskId: null,
    currentObjective: "Systems idle. Configure your settings and launch workspace loops.",
    stabilityScore: 92,
    performanceScore: 94,
    funScore: 65,
    totalTokensUsed: 0,
    uptime: 0,
    crashCount: 0
  });

  // Database Streams States
  const [settings, setSettings] = useState<SystemSettings>({
    modelProvider: "gemini-3.5-flash",
    apiKey: "",
    iterationSpeed: 5,
    maxIterations: 100,
    autonomousMode: true,
    screenshotInterval: 1,
    tokenLimit: 1500000,
    retryLimit: 3,
    targetGenre: "Action RPG"
  });

  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [agents, setAgents] = useState<AgentState[]>([]);

  // Page layout toggles
  const [activeTab, setActiveTab] = useState<'sandbox' | 'explorer' | 'database' | 'timeline'>('sandbox');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync initial stats
  const syncInitialState = async () => {
    try {
      const [resStatus, resIter, resTasks, resBugs, resLogs, resConfig, resAgents] = await Promise.all([
        fetch("/api/status").then(r => r.json()),
        fetch("/api/iterations").then(r => r.json()),
        fetch("/api/tasks").then(r => r.json()),
        fetch("/api/bugs").then(r => r.json()),
        fetch("/api/logs").then(r => r.json()),
        fetch("/api/config").then(r => r.json()),
        fetch("/api/agents").then(r => r.json())
      ]);

      setStatus(resStatus);
      setIterations(resIter);
      setTasks(resTasks);
      setBugs(resBugs);
      setLogs(resLogs);
      setSettings(resConfig);
      setAgents(resAgents);
    } catch (e) {
      console.error("Connection drops syncing application state trees", e);
    }
  };

  useEffect(() => {
    syncInitialState();

    // Listen to backend real-time Server-Sent Events (SSE)
    const eventSource = new EventSource("/api/stream");
    
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "state") {
          const s = payload.data;
          setStatus({
            isRunning: s.isRunning,
            isPaused: s.isPaused,
            currentIteration: s.currentIteration,
            activeAgentId: s.activeAgentId,
            activeTaskId: s.activeTaskId,
            currentObjective: s.currentObjective,
            stabilityScore: s.stabilityScore,
            performanceScore: s.performanceScore,
            funScore: s.funScore,
            totalTokensUsed: s.totalTokensUsed,
            uptime: s.uptime,
            crashCount: s.crashCount
          });
          setAgents(s.agents || []);
          setTasks(s.tasks || []);
        } else if (payload.type === "log") {
          setLogs(prev => [...prev, payload.data]);
          
          // Incremental pulls on dynamic stats changes
          if (payload.data.message?.includes("Iteration") || payload.data.message?.includes("bug")) {
            fetch("/api/iterations").then(r => r.json()).then(setIterations);
            fetch("/api/bugs").then(r => r.json()).then(setBugs);
          }
        }
      } catch (err) {
        console.error("SSE parse exception", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // System actions
  const handleStartLoop = async () => {
    try {
      await fetch("/api/system/start", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopLoop = async () => {
    try {
      await fetch("/api/system/stop", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePauseLoop = async () => {
    try {
      await fetch("/api/system/pause", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeLoop = async () => {
    try {
      await fetch("/api/system/resume", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (newConfig: any) => {
    try {
      const resp = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig)
      });
      const data = await resp.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed saving settings parameters:", err);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans" id="autodev_app_container">
      
      {/* Central Navigation and Commands controls Header */}
      <Header
        status={status}
        onStart={handleStartLoop}
        onStop={handleStopLoop}
        onPause={handlePauseLoop}
        onResume={handleResumeLoop}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Target Roadmap Indicator */}
      <Overview status={status} />

      {/* Layout Tabs navigation select */}
      <div className="px-6 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between pointer-events-auto select-none" id="tabs_navigation_bar">
        <div className="flex overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-5 py-3.5 text-xs font-mono font-bold tracking-tight border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${activeTab === 'sandbox' ? 'border-emerald-500 text-white bg-zinc-900/40' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <Gamepad2 className="h-4 w-4 text-emerald-400" /> GAME PLAY TESTPLAY VIRTUALVIEWPORT
          </button>
          
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-5 py-3.5 text-xs font-mono font-bold tracking-tight border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${activeTab === 'explorer' ? 'border-amber-500 text-white bg-zinc-900/40' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <Code className="h-4 w-4 text-amber-500" /> FILE WORKSPACE REPOSITORIES
          </button>
          
          <button
            onClick={() => setActiveTab('database')}
            className={`px-5 py-3.5 text-xs font-mono font-bold tracking-tight border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${activeTab === 'database' ? 'border-cyan-500 text-white bg-zinc-900/40' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <Database className="h-4 w-4 text-cyan-400" /> SQLITE STATE TABLES BROWSER
          </button>
          
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-5 py-3.5 text-xs font-mono font-bold tracking-tight border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${activeTab === 'timeline' ? 'border-purple-500 text-white bg-zinc-900/40' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <History className="h-4 w-4 text-purple-400" /> RELEASE MILESTONES TIMELINE
          </button>
        </div>
        
        {/* Genre theme spec tag indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500">TARGET_GENRE:</span>
          <span className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded font-bold uppercase">{settings.targetGenre}</span>
        </div>
      </div>

      {/* Main Dual Grid Viewport layout */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 overflow-y-auto" id="dashboard_tab_screens_layout">
        
        {/* Dynamic Tab Panel (Takes 2/3 width on wide desktop monitors) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {activeTab === 'sandbox' && (
            <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="h-auto flex flex-col">
                <GameCanvas status={status} />
              </div>
              <div className="flex-1">
                <AgentMonitor agents={agents} activeAgentId={status.activeAgentId} />
              </div>
            </div>
          )}

          {activeTab === 'explorer' && (
            <div className="flex-1 animate-in fade-in duration-300 h-full">
              <FileExplorer />
            </div>
          )}

          {activeTab === 'database' && (
            <div className="flex-1 animate-in fade-in duration-300 h-full">
              <DatabaseTables tasks={tasks} bugs={bugs} iterations={iterations} />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="flex-1 animate-in fade-in duration-300 h-full">
              <IterationTimeline iterations={iterations} />
            </div>
          )}
        </div>

        {/* Right Columns (Takes 1/3 width, contains central log terminal viewer permanently visible on desktop layouts) */}
        <div className="flex flex-col gap-4">
          
          {/* Missing API Key warning card */}
          {!settings.apiKey && !import.meta.env.VITE_API_URL && (
            <div className="bg-amber-950/20 border border-amber-500/20 rounded-lg p-4 font-mono text-[11px] text-amber-400 leading-normal flex items-start gap-2.5 shadow-md">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <span className="font-bold block uppercase mb-1">Simulation Mode Engaged</span>
                Please configure your Google Gemini API secret under <span className="underline cursor-pointer font-bold" onClick={() => setIsSettingsOpen(true)}>Settings</span> to process reasoning prompts directly through real LLMs, otherwise we fallback to safe simulation scripts.
              </div>
            </div>
          )}

          {/* Persistent log terminal */}
          <div className="xl:h-[650px] flex-1">
            <TerminalLogs logs={logs} onClearLogs={handleClearLogs} />
          </div>
        </div>

      </main>

      {/* Engine Config parameter Modal windows */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

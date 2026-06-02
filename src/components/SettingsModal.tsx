import React, { useState } from 'react';
import { X, Save, Key, ShieldAlert, Cpu, Settings } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsModalProps {
  settings: SystemSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: any) => void;
}

export function SettingsModal({ settings, isOpen, onClose, onSave }: SettingsModalProps) {
  const [modelType, setModelType] = useState(settings.modelProvider);
  const [keyInput, setKeyInput] = useState(settings.apiKey);
  const [speed, setSpeed] = useState(settings.iterationSpeed);
  const [maxIter, setMaxIter] = useState(settings.maxIterations);
  const [genre, setGenre] = useState(settings.targetGenre);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      modelProvider: modelType,
      apiKey: keyInput,
      iterationSpeed: Number(speed),
      maxIterations: Number(maxIter),
      targetGenre: genre
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans select-none" id="settings_config_modal">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header content */}
        <div className="bg-zinc-950 border-b border-zinc-805 px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tight font-mono">
            <Settings className="h-4.5 w-4.5 text-cyan-400" /> ENGINE CONFIGURATION RULES
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 cursor-pointer p-0.5 transition">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Configurations form limits */}
        <form onSubmit={handleApply} className="p-5 space-y-4">
          
          {/* Models */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">AI Reasoning Model</label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-350 text-xs font-mono focus:border-cyan-500/40 focus:outline-none"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended / Default)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Balanced speed / quality)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Advanced Technical Reasoning)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Low latency)</option>
              <option value="gemma-4-26b-a4b-it">Gemma 4 26B A4B IT (High efficiency instruct)</option>
              <option value="gemma-4-31b-it">Gemma 4 31B IT (Advanced open reasoning)</option>
            </select>
            <p className="text-[10px] text-zinc-500 italic mt-1 font-mono">
              Models are instantiated server-side via Google GenAI typescript routines.
            </p>
          </div>

          {/* Secret Key Input (No API secrets are sent directly to client page bundles) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-[9px] text-zinc-550 border border-zinc-800 px-1 py-0.5 rounded cursor-default uppercase">Secret Parameter</span>
            </label>
            <div className="relative">
              <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-650" />
              <input
                type="password"
                placeholder="Paste your key here (leaves empty for simulation mode)..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 rounded text-zinc-300 text-xs font-mono focus:border-cyan-500/40 focus:outline-none placeholder-zinc-700"
              />
            </div>
            <p className="text-[9px] text-zinc-500 leading-relaxed font-mono">
              If left empty, system runs on a high-fidelity simulator mode. You can find your current API keys in Settings &gt; Secrets on AI Studio workspace.
            </p>
          </div>

          {/* Speeds and limit slider */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Iteration Speed (s)</label>
              <input
                type="number"
                min={2}
                max={60}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-300 text-xs font-mono focus:border-cyan-500/40 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Max Loops</label>
              <input
                type="number"
                min={10}
                max={500}
                value={maxIter}
                onChange={(e) => setMaxIter(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-300 text-xs font-mono focus:border-cyan-500/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Genre theme specs context */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Game Genre Theme Scope</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-300 text-xs font-mono focus:border-cyan-500/40 focus:outline-none focus:text-white"
            />
            <p className="text-[9px] text-zinc-650 font-mono">
              Controls high-level core PM roadmaps (e.g. Rogue-like adventure, Space Bullet Hell).
            </p>
          </div>

          {/* Submit */}
          <div className="border-t border-zinc-800/80 pt-4 mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 font-medium font-mono cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded font-mono shadow-md cursor-pointer transition active:scale-95"
            >
              <Save className="h-3.5 w-3.5" /> SAVE CONFIGS
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

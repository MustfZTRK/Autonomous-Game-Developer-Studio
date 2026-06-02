import React, { useEffect, useState } from 'react';
import { Folder, FileCode, Check, AlertCircle, Save, Layers, PlaySquare } from 'lucide-react';
import { WorkspaceFile } from '../types';

export function FileExplorer() {
  const [filesList, setFilesList] = useState<WorkspaceFile[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [currentFileContent, setCurrentFileContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);

  // Read available workspace files from backend
  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/files");
      const list = await resp.json();
      setFilesList(list);
      
      // Auto-select first main.py if available
      if (list.length > 0 && !activeFilePath) {
        const defaultFile = list.find((f: any) => f.name === "main.py") || list[0];
        handleSelectFile(defaultFile.path);
      }
    } catch (err: any) {
      setErrorLogs("Failed to query file tree catalog structure.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSelectFile = async (filePath: string) => {
    setActiveFilePath(filePath);
    setIsSaving(false);
    setSaveSuccess(false);
    try {
      const resp = await fetch(`/api/files/view?path=${encodeURIComponent(filePath)}`);
      const data = await resp.json();
      if (data.content !== undefined) {
        setCurrentFileContent(data.content);
      } else {
        setErrorLogs("Failed to retrieve file contents.");
      }
    } catch (err: any) {
      setErrorLogs("Connection error viewing target text file.");
    }
  };

  const handleSaveFileOverwrites = async () => {
    if (!activeFilePath) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const resp = await fetch("/api/files/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: activeFilePath, content: currentFileContent })
      });
      const data = await resp.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        setErrorLogs("Failed to write manual code commit overrides.");
      }
    } catch (err: any) {
      setErrorLogs("Network save exception.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-sans h-full flex flex-col shadow-lg" id="workspace_file_explorer">
      
      {/* Tab Visual Headers */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 select-none">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-tight">
            <Folder className="h-4.5 w-4.5 text-amber-500 fill-current" /> PHYSICAL WORKSPACE FILE EXPLORER
          </h3>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Physical python files written by Developer agents in local container.
          </p>
        </div>
        <button
          onClick={fetchFiles}
          className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded border border-zinc-850 hover:bg-zinc-800 transition cursor-pointer font-bold"
        >
          FORCE REFRESHTREE
        </button>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 h-[420px] overflow-hidden">
        
        {/* Left Hand Tree File Names select panel */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 flex flex-col gap-1.5 overflow-y-auto select-none">
          <span className="text-[9px] text-zinc-500 font-mono tracking-wider font-semibold uppercase mb-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-amber-500" /> workspace_root /
          </span>

          {isLoading ? (
            <div className="text-xs text-zinc-600 font-mono p-4">Indexing workspace directory...</div>
          ) : (
            filesList.map((file) => {
              const isActive = activeFilePath === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => handleSelectFile(file.path)}
                  className={`flex items-center gap-2 p-2 rounded text-left text-xs font-mono font-medium transition cursor-pointer w-full border ${isActive ? 'bg-zinc-900 text-amber-400 border-amber-500/30 font-semibold' : 'text-zinc-400 hover:bg-zinc-900 border-transparent hover:text-zinc-200'}`}
                >
                  <FileCode className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Right Hand Code view editor blocks */}
        <div className="md:col-span-3 flex flex-col bg-zinc-950 border border-zinc-850 rounded-lg overflow-hidden relative">
          
          {/* Editor Action header */}
          <div className="bg-zinc-900 border-b border-zinc-850 px-4 py-2.5 flex items-center justify-between select-none">
            <span className="text-zinc-300 font-bold font-mono text-xs flex items-center gap-1.5">
              <PlaySquare className="h-4 w-4 text-emerald-400" />
              EDITOR: {activeFilePath ? `/workspace/${activeFilePath}` : "No file active"}
            </span>

            {activeFilePath && (
              <button
                onClick={handleSaveFileOverwrites}
                disabled={isSaving}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-mono font-bold transition flex-shrink-0 cursor-pointer ${saveSuccess ? 'bg-emerald-600 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'}`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> CHANGES COMMITTED
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> {isSaving ? "SAVING..." : "COMMIT OVERWRITE"}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Actual text edit terminal layout */}
          <textarea
            value={currentFileContent}
            onChange={(e) => setCurrentFileContent(e.target.value)}
            placeholder="Choose a python target code module to review logic code patterns..."
            disabled={!activeFilePath}
            className="flex-1 w-full p-4 bg-zinc-950/90 text-zinc-300 font-mono text-xs focus:outline-none resize-none focus:ring-0 select-text leading-relaxed scrollbar-thin overflow-y-auto"
            spellCheck="false"
          />

          {errorLogs && (
            <div className="absolute bottom-4 left-4 right-4 bg-rose-950/90 border border-rose-500/20 text-rose-300 rounded p-3 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorLogs}</span>
              <button onClick={() => setErrorLogs(null)} className="ml-auto underline font-bold cursor-pointer">dismiss</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export interface SystemSettings {
  modelProvider: string;
  apiKey: string;
  iterationSpeed: number; // in seconds per phase
  maxIterations: number;
  autonomousMode: boolean;
  screenshotInterval: number; // in iterations
  tokenLimit: number;
  retryLimit: number;
  targetGenre: string;
}

export type TaskStatus = 'pending' | 'running' | 'failed' | 'completed' | 'blocked';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  agent: string;
  dependencies: string[];
  retryCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface Bug {
  id: string;
  description: string;
  cause: string;
  fixAttempt: string;
  resolved: boolean;
  timestamp: string;
}

export interface Iteration {
  id: number;
  timestamp: string;
  summary: string;
  result: string;
  score: number;
  commitHash: string;
  changes: string[];
  stabilityScore: number;
  performanceScore: number;
  funScore: number;
  fps: number;
  memoryUsage: string;
  features: string[];
  screenshotUrl?: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  agentName?: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'terminal';
}

export interface AgentState {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'analyzing' | 'completed' | 'failed';
  activeTask?: string;
  tokensUsed: number;
  modelUsed: string;
  avatarUrl?: string;
}

export interface WorkspaceFile {
  path: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: WorkspaceFile[];
}

export interface SystemStatus {
  isRunning: boolean;
  isPaused: boolean;
  currentIteration: number;
  activeAgentId: string | null;
  activeTaskId: string | null;
  currentObjective: string;
  stabilityScore: number;
  performanceScore: number;
  funScore: number;
  totalTokensUsed: number;
  uptime: number; // in seconds
  crashCount: number;
}

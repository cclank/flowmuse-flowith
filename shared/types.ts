import type { LucideIcon } from 'lucide-react';
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// FlowMuse Types
export interface NodeData {
  title: string;
  icon?: keyof typeof import('lucide-react');
  content?: string;
  color?: string;
}
export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}
export interface Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}
export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
}
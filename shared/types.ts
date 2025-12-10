import type { Node as RFNode, Edge as RFEdge } from '@xyflow/react';
import * as Lucide from 'lucide-react';
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
  title?: string;
  icon?: keyof typeof Lucide;
  content?: string;
  color?: string;
  [key: string]: unknown; // Index signature for compatibility with react-flow
}
// Extend react-flow types for type safety
export type Node = RFNode<NodeData>;
export type Edge = RFEdge;
export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
}
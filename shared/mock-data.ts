import type { User, Chat, ChatMessage } from './types';
import type { Board, Node, Edge } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// FlowMuse Mock Data
export const MOCK_NODES: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: { title: 'Welcome to FlowMuse', icon: 'Sparkles', content: 'This is a custom node.' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 400, y: 150 },
    data: { title: 'Drag me around', icon: 'Move', content: 'You can move nodes on the canvas.' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 250, y: 300 },
    data: { title: 'Connect the dots', icon: 'Share2', content: 'Create connections between nodes.' },
  },
];
export const MOCK_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];
export const MOCK_BOARDS: Board[] = [
  {
    id: 'board-1',
    title: 'My First Flow',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: MOCK_NODES,
    edges: MOCK_EDGES,
  },
  {
    id: 'board-2',
    title: 'Project Plan Q3',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nodes: [
      { id: 'q3-1', type: 'custom', position: { x: 50, y: 50 }, data: { title: 'Kickoff Meeting', icon: 'Users' } },
      { id: 'q3-2', type: 'custom', position: { x: 250, y: 150 }, data: { title: 'Design Phase', icon: 'Palette' } },
      { id: 'q3-3', type: 'custom', position: { x: 50, y: 250 }, data: { title: 'Development Sprint', icon: 'Code' } },
    ],
    edges: [
      { id: 'qe1-2', source: 'q3-1', target: 'q3-2' },
      { id: 'qe1-3', source: 'q3-1', target: 'q3-3' },
    ],
  },
  {
    id: 'board-3',
    title: 'Empty Board',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [],
    edges: [],
  },
];
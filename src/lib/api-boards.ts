import { MOCK_BOARDS } from '@shared/mock-data';
import type { Board } from '@shared/types';
// In Phase 1, we use mock data. In Phase 2, this will use `api-client`.
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export async function listBoards(): Promise<Board[]> {
  console.log('API: Fetching boards...');
  await apiDelay(500); // Simulate network latency
  return MOCK_BOARDS;
}
export async function getBoard(id: string): Promise<Board | undefined> {
  console.log(`API: Fetching board ${id}...`);
  await apiDelay(500);
  const board = MOCK_BOARDS.find(b => b.id === id);
  if (!board) {
    throw new Error('Board not found');
  }
  return board;
}
export async function createBoard(title: string): Promise<Board> {
  console.log(`API: Creating board with title "${title}"...`);
  await apiDelay(500);
  const newBoard: Board = {
    id: `board-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [],
    edges: [],
  };
  // Note: This won't persist in the mock data across reloads in Phase 1.
  console.log('API: Board created (mock)', newBoard);
  return newBoard;
}
export async function saveBoard(board: Board): Promise<Board> {
  console.log(`API: Saving board ${board.id}...`);
  await apiDelay(700);
  // In a real API, you'd save the board data here.
  console.log('API: Board saved (mock)', board);
  return { ...board, updatedAt: new Date().toISOString() };
}
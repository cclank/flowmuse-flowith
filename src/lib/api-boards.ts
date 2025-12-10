import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from './api-client';
import type { Board } from '@shared/types';
const BOARD_QUERY_KEY = 'boards';
// API Functions
export async function listBoards(): Promise<{ items: Board[]; next: string | null }> {
  return api('/api/boards');
}
export async function getBoard(id: string): Promise<Board> {
  return api(`/api/boards/${id}`);
}
export async function createBoard(title: string): Promise<Board> {
  return api('/api/boards', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}
export async function saveBoard(board: Board): Promise<Board> {
  return api(`/api/boards/${board.id}`, {
    method: 'PUT',
    body: JSON.stringify(board),
  });
}
export async function deleteBoard(id: string): Promise<{ id: string; deleted: boolean }> {
  return api(`/api/boards/${id}`, {
    method: 'DELETE',
  });
}
// React Query Hooks
export const useBoards = () => {
  return useQuery({
    queryKey: [BOARD_QUERY_KEY],
    queryFn: listBoards,
  });
};
export const useBoard = (id: string | undefined) => {
  return useQuery({
    queryKey: [BOARD_QUERY_KEY, id],
    queryFn: () => getBoard(id!),
    enabled: !!id,
  });
};
export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => createBoard(title),
    onSuccess: (newBoard) => {
      toast.success(`Board "${newBoard.title}" created!`);
      queryClient.invalidateQueries({ queryKey: [BOARD_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(`Failed to create board: ${error.message}`);
    },
  });
};
export const useSaveBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (board: Board) => saveBoard(board),
    onSuccess: (updatedBoard) => {
      toast.success(`Board "${updatedBoard.title}" saved!`);
      queryClient.invalidateQueries({ queryKey: [BOARD_QUERY_KEY] });
      queryClient.setQueryData([BOARD_QUERY_KEY, updatedBoard.id], updatedBoard);
    },
    onError: (error) => {
      toast.error(`Failed to save board: ${error.message}`);
    },
  });
};
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: (data, id) => {
      toast.success('Board deleted.');
      queryClient.invalidateQueries({ queryKey: [BOARD_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [BOARD_QUERY_KEY, id] });
    },
    onError: (error) => {
      toast.error(`Failed to delete board: ${error.message}`);
    },
  });
};
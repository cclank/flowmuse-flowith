import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Search, MoreHorizontal, FileText, Clock, Loader2, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useBoards, useCreateBoard, useDeleteBoard } from '@/lib/api-boards';
import type { Board } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
export function BoardsPage() {
  const { data: boardsData, isLoading } = useBoards();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const filteredBoards = useMemo(() => {
    if (!boardsData?.items) return [];
    return boardsData.items.filter(board =>
      board.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [boardsData, debouncedSearchQuery]);
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Boards</h1>
              <p className="text-muted-foreground">Your creative canvases await.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon"><Link to="/settings"><Settings className="h-5 w-5" /></Link></Button>
              <CreateBoardDialog />
            </div>
          </header>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
            </div>
          </div>
          {isLoading ? (
            <BoardGridSkeleton />
          ) : filteredBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBoards.map(board => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}
function BoardCard({ board }: { board: Board }) {
  const navigate = useNavigate();
  const deleteBoardMutation = useDeleteBoard();
  return (
    <motion.div whileHover={{ scale: 1.03, y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full flex flex-col group shadow-sm hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle className="text-lg font-semibold pr-2">{board.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteBoardMutation.mutate(board.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow cursor-pointer" onClick={() => navigate(`/boards/${board.id}`)}>
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Edited {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}</span>
          </div>
          <Badge variant="secondary">{board.nodes.length} nodes</Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
function CreateBoardDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const createBoardMutation = useCreateBoard();
  const handleCreate = () => {
    if (!title.trim()) return;
    createBoardMutation.mutate(title, {
      onSuccess: (newBoard) => {
        setOpen(false);
        setTitle('');
        navigate(`/boards/${newBoard.id}`);
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> New Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
          <DialogDescription>Give your new canvas a name to get started.</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="e.g., Q3 Project Plan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={createBoardMutation.isPending || !title.trim()}>
            {createBoardMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Board
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function BoardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-lg">
      <h3 className="text-xl font-semibold text-foreground">No boards yet</h3>
      <p className="text-muted-foreground mt-2 mb-4">Get started by creating your first board.</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <CreateBoardDialog />
      </motion.div>
    </div>
  );
}
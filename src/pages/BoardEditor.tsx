import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  Plus,
  Palette,
  Settings,
  Loader2,
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { BoardCanvas } from '@/components/board/BoardCanvas';
import { getBoard } from '@/lib/api-boards';
import type { Board, Node, Edge } from '@shared/types';
import { Toaster, toast } from 'sonner';
export function BoardEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      toast.error("No board ID provided.");
      navigate('/boards');
      return;
    }
    const fetchBoard = async () => {
      setIsLoading(true);
      try {
        const boardData = await getBoard(id);
        if (boardData) {
          setBoard(boardData);
        } else {
          toast.error("Board not found.");
          navigate('/boards');
        }
      } catch (error) {
        toast.error("Failed to load board.");
        console.error(error);
        navigate('/boards');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoard();
  }, [id, navigate]);
  if (isLoading) {
    return <EditorSkeleton />;
  }
  if (!board) {
    return null; // Or a more specific error component
  }
  return (
    <TooltipProvider>
      <div className="h-screen w-screen flex flex-col bg-muted/40">
        <header className="h-16 flex items-center justify-between px-4 border-b bg-background z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/boards')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">{board.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Undo className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Redo className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><ZoomOut className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><ZoomIn className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
            <Button size="sm"><Save className="h-4 w-4 mr-2" /> Save</Button>
          </div>
        </header>
        <main className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="bg-background p-4">
              <div className="flex flex-col h-full">
                <h2 className="text-md font-semibold mb-4">Node Library</h2>
                <div className="space-y-2">
                  <div className="p-3 border rounded-md flex items-center gap-2 cursor-grab active:cursor-grabbing">
                    <Plus className="h-4 w-4" /> Text Node
                  </div>
                  <div className="p-3 border rounded-md flex items-center gap-2 cursor-grab active:cursor-grabbing">
                    <Palette className="h-4 w-4" /> Color Node
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65}>
              <BoardCanvas nodes={board.nodes} edges={board.edges} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-background p-4">
              <div className="flex flex-col h-full">
                <h2 className="text-md font-semibold mb-4">Inspector</h2>
                <div className="flex-1 center-col text-sm text-muted-foreground">
                  <Settings className="h-8 w-8 mb-2" />
                  <p>Select a node to see its properties.</p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      <Toaster richColors />
    </TooltipProvider>
  );
}
function EditorSkeleton() {
  return (
    <div className="h-screen w-screen flex flex-col bg-muted/40">
      <header className="h-16 flex items-center justify-between px-4 border-b bg-background z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </header>
      <main className="flex-1 min-h-0 center-col">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="mt-4 text-muted-foreground">Loading your board...</p>
      </main>
    </div>
  );
}
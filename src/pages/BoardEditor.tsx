import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Undo, Redo, ZoomIn, ZoomOut, Download, Share2, Plus, Palette, Settings, Loader2, Trash2
} from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { BoardCanvas } from '@/components/board/BoardCanvas';
import { useBoard, useSaveBoard } from '@/lib/api-boards';
import { Toaster, toast } from 'sonner';
import { applyNodeChanges, applyEdgeChanges, addEdge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import type { Node, Edge } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
export function BoardEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: board, isLoading, isError } = useBoard(id);
  const saveBoardMutation = useSaveBoard();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  useEffect(() => {
    if (board) {
      setNodes(board.nodes);
      setEdges(board.edges);
    }
  }, [board]);
  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [setNodes]);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges]);
  const onConnect: OnConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, [setEdges]);
  const handleSave = () => {
    if (board) {
      const updatedBoard = { ...board, nodes, edges };
      saveBoardMutation.mutate(updatedBoard);
    }
  };
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);
  const updateSelectedNodeData = (data: Partial<Node['data']>) => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, data: { ...selectedNode.data, ...data } };
    setSelectedNode(updatedNode);
    setNodes(nds => nds.map(n => n.id === selectedNode.id ? updatedNode : n));
  };
  if (isLoading) return <EditorSkeleton />;
  if (isError || !board) {
    toast.error("Failed to load board or board not found.");
    navigate('/boards');
    return null;
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
            <Button size="sm" onClick={handleSave} disabled={saveBoardMutation.isPending}>
              {saveBoardMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
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
              <BoardCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-background p-4">
              <div className="flex flex-col h-full">
                <h2 className="text-md font-semibold mb-4">Inspector</h2>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input value={selectedNode.data.title} onChange={e => updateSelectedNodeData({ title: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content</label>
                      <Textarea value={selectedNode.data.content || ''} onChange={e => updateSelectedNodeData({ content: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Color</label>
                      <Input type="color" value={selectedNode.data.color || '#ffffff'} onChange={e => updateSelectedNodeData({ color: e.target.value })} className="p-1 h-10" />
                    </div>
                    <Button variant="destructive" size="sm" className="w-full mt-4"><Trash2 className="h-4 w-4 mr-2" /> Delete Node</Button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-sm text-muted-foreground">
                    <Settings className="h-8 w-8 mb-2" />
                    <p>Select a node to see its properties.</p>
                  </div>
                )}
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
      <main className="flex-1 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <p className="mt-4 text-muted-foreground">Loading your board...</p>
        </div>
      </main>
    </div>
  );
}
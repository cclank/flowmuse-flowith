import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Undo, Redo, Download, Share2, Plus, Palette, Settings, Loader2, Trash2, Copy
} from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BoardCanvas } from '@/components/board/BoardCanvas';
import { useBoard, useSaveBoard } from '@/lib/api-boards';
import { Toaster, toast } from 'sonner';
import { applyNodeChanges, applyEdgeChanges, addEdge, OnNodesChange, OnEdgesChange, OnConnect, OnNodeClick } from '@xyflow/react';
import type { Node, Edge, NodeData } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DndContext, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
const DraggableNode = ({ type, label, icon: Icon }: { type: string; label: string; icon: React.ElementType }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `draggable-${type}` });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 border rounded-md flex items-center gap-2 cursor-grab active:cursor-grabbing bg-card hover:bg-accent"
    >
      <Icon className="h-4 w-4" /> {label}
    </div>
  );
};
export function BoardEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: board, isLoading, isError } = useBoard(id);
  const saveBoardMutation = useSaveBoard();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (board) {
      setNodes(board.nodes);
      setEdges(board.edges);
      const initialHistory = [{ nodes: board.nodes, edges: board.edges }];
      setHistory(initialHistory);
      setHistoryIndex(0);
    }
  }, [board]);
  const updateHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistoryEntry = { nodes: newNodes, edges: newEdges };
    const newHistory = [...history.slice(0, historyIndex + 1), newHistoryEntry];
    setHistory(newHistory.slice(-20)); // Limit history size
    setHistoryIndex(newHistory.length - 1);
  };
  const onNodesChange: OnNodesChange = useCallback((changes) => {
    const newNodes = applyNodeChanges(changes, nodes);
    setNodes(newNodes);
    if (changes.some(c => c.type === 'remove' || c.type === 'position' && c.dragging === false)) {
      updateHistory(newNodes, edges);
    }
  }, [nodes, edges, historyIndex, history]);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    const newEdges = applyEdgeChanges(changes, edges);
    setEdges(newEdges);
    updateHistory(nodes, newEdges);
  }, [nodes, edges, historyIndex, history]);
  const onConnect: OnConnect = useCallback((connection) => {
    const newEdges = addEdge(connection, edges);
    setEdges(newEdges);
    updateHistory(nodes, newEdges);
  }, [nodes, edges, historyIndex, history]);
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };
  const handleSave = () => {
    if (board) {
      const updatedBoard = { ...board, nodes, edges };
      saveBoardMutation.mutate(updatedBoard);
    }
  };
  const onNodeClick: OnNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);
  const updateSelectedNodeData = (data: Partial<NodeData>) => {
    if (!selectedNode) return;
    const updatedNode = { ...selectedNode, data: { ...selectedNode.data, ...data } };
    setSelectedNode(updatedNode);
    const newNodes = nodes.map(n => n.id === selectedNode.id ? updatedNode : n);
    setNodes(newNodes);
    updateHistory(newNodes, edges);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.over.id === 'droppable-canvas' && reactFlowWrapper.current) {
      const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
      const newNode: Node = {
        id: uuidv4(),
        type: 'custom',
        position: { x: event.activatorEvent.clientX - left - 75, y: event.activatorEvent.clientY - top - 25 },
        data: { title: 'New Node', icon: 'FileText', content: 'Edit me!' },
      };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      updateHistory(newNodes, edges);
    }
  };
  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${board?.title || 'flow'}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('JSON file exported.');
  };
  const handleExportPNG = async () => {
    const flowEl = document.querySelector('.react-flow') as HTMLElement;
    if (!flowEl) {
      toast.error('Could not find canvas element to export.');
      return;
    }
    try {
      const canvas = await html2canvas(flowEl, { useCORS: true, backgroundColor: null });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${board?.title || 'flow'}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('PNG image exported.');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      toast.error('Failed to export PNG.');
    }
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Board link copied to clipboard!');
  };
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    const newNodes = nodes.filter(n => n.id !== selectedNode.id);
    const newEdges = edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id);
    setNodes(newNodes);
    setEdges(newEdges);
    updateHistory(newNodes, newEdges);
    setSelectedNode(null);
  };
  if (isLoading) return <EditorSkeleton />;
  if (isError || !board) {
    toast.error("Failed to load board or board not found.");
    navigate('/boards');
    return null;
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen w-screen flex flex-col bg-muted/40">
        <header className="h-16 flex items-center justify-between px-4 border-b bg-background z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/boards')}><ArrowLeft className="h-4 w-4" /></Button>
            <h1 className="text-lg font-semibold">{board.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}><Undo className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><Redo className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}><Copy className="h-4 w-4 mr-2" /> Share</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportPNG}>as PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>as JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <DraggableNode type="text" label="Text Node" icon={Plus} />
                  <DraggableNode type="color" label="Color Node" icon={Palette} />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65} id="droppable-canvas" ref={reactFlowWrapper}>
              <BoardCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} />
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full mt-4"><Trash2 className="h-4 w-4 mr-2" /> Delete Node</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the selected node.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteSelectedNode}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-sm text-muted-foreground text-center">
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
    </DndContext>
  );
}
function EditorSkeleton() {
  return (
    <div className="h-screen w-screen flex flex-col bg-muted/40">
      <header className="h-16 flex items-center justify-between px-4 border-b bg-background z-10 shrink-0">
        <div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-6 w-40" /></div>
        <div className="flex items-center gap-2"><Skeleton className="h-8 w-20" /><Skeleton className="h-8 w-20" /><Skeleton className="h-8 w-20" /></div>
      </header>
      <main className="flex-1 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /><p className="mt-4 text-muted-foreground">Loading your board...</p></div>
      </main>
    </div>
  );
}
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
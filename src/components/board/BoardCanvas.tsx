import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from '@xyflow/react';
import type { Node, Edge } from '@shared/types';
import { NodeCard } from './NodeCard';
import '@xyflow/react/dist/style.css';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
interface BoardCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
}
export function BoardCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick }: BoardCanvasProps) {
  const nodeTypes = useMemo(() => ({ custom: NodeCard }), []) as NodeTypes;
  if (!nodes.length) {
    return (
      <div className="flex-1 relative flex items-center justify-center h-full text-muted-foreground bg-background canvas-grid">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 border-2 border-dashed rounded-lg"
        >
          <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 font-medium">Your canvas is empty.</p>
          <p className="text-sm">Drag nodes from the left panel to start building.</p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-background relative canvas-grid flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-transparent"
      >
        <Background gap={30} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
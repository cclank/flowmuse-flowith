import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import type { Node as RFNode, Edge as RFEdge } from '@xyflow/react';
import { NodeCard } from './NodeCard';
import 'allotment/dist/style.css';
import '@xyflow/react/dist/style.css';
interface BoardCanvasProps {
  nodes: RFNode[];
  edges: RFEdge[];
}
export function BoardCanvas({ nodes, edges }: BoardCanvasProps) {
  const nodeTypes = useMemo(() => ({ custom: NodeCard }), []);
  return (
    <div className="w-full h-full bg-background relative canvas-grid">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background gap={30} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
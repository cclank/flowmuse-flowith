import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import * as Lucide from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { NodeData } from '@shared/types';
const Icon = ({ name, ...props }: { name: keyof typeof Lucide } & Lucide.LucideProps) => {
  const LucideIcon = Lucide[name];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};
export function NodeCard({ data, selected }: NodeProps<NodeData>) {
  return (
    <Card
      className={cn(
        'w-60 shadow-soft transition-all duration-150 border-2',
        selected ? 'border-brand-primary shadow-lg' : 'border-transparent'
      )}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      <CardHeader className="p-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {data.icon && <Icon name={data.icon} className="w-4 h-4 text-muted-foreground" />}
          <span>{data.title}</span>
        </CardTitle>
      </CardHeader>
      {data.content && (
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
          {data.content}
        </CardContent>
      )}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
    </Card>
  );
}
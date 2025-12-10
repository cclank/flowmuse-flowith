import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import * as Lucide from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { NodeData } from '@shared/types';
import { motion } from 'framer-motion';
const Icon = ({ name, ...props }: { name: keyof typeof Lucide } & Lucide.LucideProps) => {
  const LucideIcon = Lucide[name];
  // A simple check to see if it's a renderable component
  if (!LucideIcon || typeof LucideIcon === 'string' || !('render' in LucideIcon)) {
    return <Lucide.HelpCircle {...props} />; // Fallback icon
  }
  return <LucideIcon {...props} />;
};
export function NodeCard({ data, selected, id }: NodeProps<NodeData>) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.1 }}>
      <Card
        className={cn(
          'w-60 shadow-md transition-all duration-150 border-2 hover:shadow-xl',
          selected ? 'border-brand-primary shadow-lg ring-2 ring-brand-primary/50 ring-offset-2' : 'border-transparent'
        )}
        style={{ backgroundColor: data?.color || 'hsl(var(--card))' }}
      >
        <Handle type="target" position={Position.Top} id={`${id}-top`} className="!w-3 !h-3" />
        <CardHeader className="p-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {data?.icon && <Icon name={data.icon} className="w-4 h-4 text-muted-foreground" />}
            <span>{data?.title || 'Untitled Node'}</span>
          </CardTitle>
        </CardHeader>
        {data?.content && (
          <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
            {data.content}
          </CardContent>
        )}
        <Handle type="source" position={Position.Bottom} id={`${id}-bottom`} className="!w-3 !h-3" />
      </Card>
    </motion.div>
  );
}
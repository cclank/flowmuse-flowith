import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Search, MoreHorizontal, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { listBoards } from '@/lib/api-boards';
import type { Board } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';
export function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      try {
        const boardsData = await listBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error("Failed to load boards:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Boards</h1>
              <p className="text-muted-foreground">Your creative canvases await.</p>
            </div>
            <Button onClick={() => navigate('/boards/new')}>
              <Plus className="mr-2 h-4 w-4" /> New Board
            </Button>
          </header>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search boards..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
            </div>
          </div>
          {isLoading ? (
            <BoardGridSkeleton />
          ) : boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map(board => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
function BoardCard({ board }: { board: Board }) {
  return (
    <Link to={`/boards/${board.id}`}>
      <Card className="h-full flex flex-col group transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle className="text-lg font-semibold">{board.title}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Edited {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
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
  const navigate = useNavigate();
  return (
    <div className="text-center py-20 border-2 border-dashed rounded-lg">
      <h3 className="text-xl font-semibold text-foreground">No boards yet</h3>
      <p className="text-muted-foreground mt-2 mb-4">Get started by creating your first board.</p>
      <Button onClick={() => navigate('/boards/new')}>
        <Plus className="mr-2 h-4 w-4" /> Create Board
      </Button>
    </div>
  );
}
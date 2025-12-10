import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw } from 'lucide-react';
export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const handleResetData = () => {
    // This would ideally trigger a backend endpoint to re-seed data.
    // For now, we'll just show a toast.
    toast.info('Data reset functionality is not yet implemented.');
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/boards"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Boards</Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences and view app information.</p>
          </div>
          <Tabs defaultValue="preferences" className="w-full">
            <TabsList>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="preferences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                    <Switch id="dark-mode" checked={isDark} onCheckedChange={toggleTheme} />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                    <div>
                      <Label className="font-medium">Reset Demo Data</Label>
                      <p className="text-sm text-muted-foreground">Restore the initial mock boards and nodes.</p>
                    </div>
                    <Button variant="outline" onClick={handleResetData}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About FlowMuse</CardTitle>
                  <CardDescription>Version 1.0.0</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Disclaimer:</span> This website is a technical demonstration and a visual tribute inspired by <a href="https://flowith.me/" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary">Flowith</a>. It is not affiliated with, endorsed by, or connected to the official Flowith product or its creators.
                  </p>
                  <p>Built with ❤️ at Cloudflare.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
export default SettingsPage;
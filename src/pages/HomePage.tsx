import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, GitFork } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 lg:py-32 text-center relative">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary-light dark:bg-brand-primary-light rounded-full filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-accent-light dark:bg-brand-accent-light rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-primary-light dark:bg-brand-primary-light rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 text-sm font-medium py-1 px-3">
                <GitFork className="w-4 h-4 mr-2" />
                Flowith Style Demo
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight text-balance">
                Craft Aesthetic Flowcharts with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F38020] to-[#764BA2]">FlowMuse</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground text-balance">
                A visually-driven canvas for your ideas. Inspired by the elegance of Flowith, this is a demonstration of what's possible.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex justify-center items-center gap-x-6"
            >
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link to="/boards">
                  Create a Board <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://github.com/your-repo/flowmuse" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 max-w-3xl mx-auto"
            >
              <div className="p-4 border rounded-lg bg-card/50 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Disclaimer:</span> This website is a technical demonstration and a visual tribute inspired by <a href="https://flowith.me/" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary">Flowith</a>. It is not affiliated with, endorsed by, or connected to the official Flowith product or its creators.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
    </div>
  );
}
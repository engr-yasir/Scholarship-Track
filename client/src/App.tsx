import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import ScholarshipList from "@/pages/ScholarshipList";
import NotFound from "@/pages/not-found";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";

// Mobile Navigation Wrapper
function MobileNav() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
      <span className="font-display font-bold text-lg">ScholarTrack</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-lg">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-background">
            <div className="p-6 border-b border-border/50">
              <span className="font-display font-bold text-xl">ScholarTrack</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/" onClick={() => setOpen(false)}>
                <div className="px-4 py-3 rounded-xl hover:bg-muted cursor-pointer font-medium">Dashboard</div>
              </Link>
              <Link href="/scholarships" onClick={() => setOpen(false)}>
                <div className="px-4 py-3 rounded-xl hover:bg-muted cursor-pointer font-medium">All Scholarships</div>
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Nav */}
      <MobileNav />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
        <div className="max-w-7xl mx-auto w-full h-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/scholarships" component={ScholarshipList} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

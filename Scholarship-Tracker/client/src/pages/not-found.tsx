import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center bg-muted rounded-full">
          <Ghost className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">Page not found</h1>
          <p className="text-muted-foreground">
            The scholarship you are looking for might have been moved or doesn't exist.
          </p>
        </div>

        <Link href="/">
          <Button size="lg" className="rounded-xl w-full sm:w-auto">
            <Home className="mr-2 h-4 w-4" /> Return Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

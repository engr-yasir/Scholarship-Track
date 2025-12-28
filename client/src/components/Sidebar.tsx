import { Link, useLocation } from "wouter";
import { LayoutDashboard, GraduationCap, PlusCircle, Settings, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scholarships", label: "All Scholarships", icon: GraduationCap },
  ];

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r border-border/50 bg-card/50 backdrop-blur-xl z-30">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ScholarTrack</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border/50">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
          <h4 className="font-semibold text-indigo-900 text-sm mb-1">Pro Tip</h4>
          <p className="text-xs text-indigo-700/80 leading-relaxed">
            Track deadlines carefully. Set reminders 2 weeks before due dates.
          </p>
        </div>
      </div>
    </aside>
  );
}

import { useMemo } from "react";
import { useScholarships } from "@/hooks/use-scholarships";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { 
  GraduationCap, Loader2, Send, CheckCircle2, XCircle, Clock, AlertCircle, TrendingUp 
} from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function Dashboard() {
  const { data: scholarships, isLoading } = useScholarships();

  const stats = useMemo(() => {
    if (!scholarships) return null;

    const total = scholarships.length;
    const accepted = scholarships.filter(s => s.status === "Accepted").length;
    const applied = scholarships.filter(s => s.status === "Applied").length;
    const upcomingDeadlines = scholarships
      .filter(s => s.deadline && new Date(s.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);

    // Group by status for Pie Chart
    const statusCounts: Record<string, number> = {};
    scholarships.forEach(s => {
      statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
    });
    const pieData = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key],
    }));

    // Group by country for Bar Chart
    const countryCounts: Record<string, number> = {};
    scholarships.forEach(s => {
      countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
    });
    const barData = Object.keys(countryCounts)
      .map(key => ({ name: key, count: countryCounts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 countries

    return { total, accepted, applied, upcomingDeadlines, pieData, barData };
  }, [scholarships]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Track your application progress and upcoming tasks.</p>
        </div>
        <Link href="/scholarships">
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <GraduationCap className="mr-2 h-4 w-4" /> View All Scholarships
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Applications" 
          value={stats.total} 
          icon={GraduationCap} 
          color="bg-indigo-50 text-indigo-600"
          trend="+2 this week"
        />
        <StatsCard 
          title="Submitted" 
          value={stats.applied} 
          icon={Send} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatsCard 
          title="Accepted" 
          value={stats.accepted} 
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatsCard 
          title="Pending Actions" 
          value={stats.total - (stats.applied + stats.accepted)} 
          icon={Clock} 
          color="bg-amber-50 text-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Application Status Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {stats.pieData.map((entry, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {entry.name}: {entry.value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="text-lg font-bold mb-6">Target Countries</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.barData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <RechartsTooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Deadlines */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" /> Upcoming Deadlines
            </h3>
            
            {stats.upcomingDeadlines.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>No upcoming deadlines!</p>
                <Link href="/scholarships">
                  <Button variant="ghost" className="mt-2 text-primary">Add one now</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.upcomingDeadlines.map((scholarship) => {
                  const daysLeft = differenceInDays(new Date(scholarship.deadline!), new Date());
                  return (
                    <motion.div 
                      key={scholarship.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-background border border-border/60 hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {scholarship.scholarshipName}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">{scholarship.universityName}</p>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          daysLeft <= 7 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        )}>
                          {daysLeft} days left
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{scholarship.country}</p>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Due {format(new Date(scholarship.deadline!), 'MMM d, yyyy')}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-border/50">
              <Link href="/scholarships">
                <Button variant="outline" className="w-full rounded-xl">View Calendar</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2 font-display">{value}</h3>
          {trend && <p className="text-xs text-green-600 font-medium mt-1">{trend}</p>}
        </div>
        <div className={cn("p-3 rounded-xl", color)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

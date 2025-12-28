import { useState } from "react";
import { useScholarships, useCreateScholarship, useUpdateScholarship, useDeleteScholarship } from "@/hooks/use-scholarships";
import { 
  Plus, Search, Filter, MoreHorizontal, ExternalLink, Calendar as CalendarIcon, 
  MapPin, Loader2, FileText, Trash2, Pencil, GraduationCap, X
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { ScholarshipForm } from "@/components/ScholarshipForm";
import { type InsertScholarship, type Scholarship } from "@shared/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ScholarshipList() {
  const { data: scholarships, isLoading } = useScholarships();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Scholarship | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const createMutation = useCreateScholarship();
  const updateMutation = useUpdateScholarship();
  const deleteMutation = useDeleteScholarship();

  const filtered = scholarships?.filter(s => {
    const matchesSearch = s.universityName.toLowerCase().includes(search.toLowerCase()) || 
                          s.country.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus ? s.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  const handleCreate = async (data: InsertScholarship) => {
    await createMutation.mutateAsync(data);
    setCreateOpen(false);
  };

  const handleUpdate = async (data: InsertScholarship) => {
    if (!editItem) return;
    await updateMutation.mutateAsync({ id: editItem.id, ...data });
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Accepted": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
      case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-100";
      case "Applied": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "In Progress": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "Not Started": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading your opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Scholarships</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your applications.</p>
        </div>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Add New Scholarship</DialogTitle>
              <DialogDescription>
                Fill in the details for a new university or funding opportunity.
              </DialogDescription>
            </DialogHeader>
            <ScholarshipForm 
              onSubmit={handleCreate} 
              isSubmitting={createMutation.isPending}
              onCancel={() => setCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search universities, countries..." 
            className="pl-9 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {["All", "Not Started", "In Progress", "Applied", "Accepted", "Rejected"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === (status === "All" ? null : status) ? "default" : "outline"}
              onClick={() => setFilterStatus(status === "All" ? null : status)}
              className="rounded-xl px-4 whitespace-nowrap"
              size="sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* List Grid */}
      {filtered?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
          <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground">No scholarships found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Try adjusting your search filters or add your first scholarship application to get started.
          </p>
            <Button 
              variant="ghost" 
              onClick={() => { setSearch(""); setFilterStatus(null); }}
              className="mt-4 text-primary"
            >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setEditItem(item)}
                className="group bg-card hover:bg-accent/5 rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <Badge className={cn("rounded-lg px-2.5 py-1 font-medium border-0", getStatusColor(item.status))}>
                    {item.status}
                  </Badge>
                  
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => setEditItem(item)} className="cursor-pointer">
                          <Pencil className="w-4 h-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        {item.applyLink && (
                          <DropdownMenuItem asChild>
                            <a href={item.applyLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                              <ExternalLink className="w-4 h-4 mr-2" /> Visit Website
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(item.id)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                    {item.scholarshipName}
                  </h3>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {item.universityName}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    {item.country}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Application Progress</span>
                      <span>
                        {Math.round((
                          (item.portalSignup ? 1 : 0) + 
                          (item.applyStarted ? 1 : 0) + 
                          (item.requiredDocuments && item.requiredDocuments.length > 0 
                            ? (item.documentsDone?.length || 0) / item.requiredDocuments.length 
                            : 0)
                        ) / (item.requiredDocuments && item.requiredDocuments.length > 0 ? 3 : 2) * 100)}%
                      </span>
                    </div>
                    <Progress value={
                      (
                        (item.portalSignup ? 1 : 0) + 
                        (item.applyStarted ? 1 : 0) + 
                        (item.requiredDocuments && item.requiredDocuments.length > 0 
                          ? (item.documentsDone?.length || 0) / item.requiredDocuments.length 
                          : 0)
                      ) / (item.requiredDocuments && item.requiredDocuments.length > 0 ? 3 : 2) * 100
                    } className="h-2 rounded-full" />
                  </div>

                <div className="space-y-2.5">
                  <div className="flex items-center text-sm bg-muted/40 p-2 rounded-lg">
                    <CalendarIcon className="w-4 h-4 mr-2.5 text-primary/70" />
                    <span className="text-muted-foreground">Deadline: </span>
                    <span className="ml-auto font-medium text-foreground">
                      {item.deadline ? format(new Date(item.deadline), 'MMM d, yyyy') : 'No date set'}
                    </span>
                  </div>

                  <div className="flex items-center text-sm bg-muted/40 p-2 rounded-lg">
                    <FileText className="w-4 h-4 mr-2.5 text-primary/70" />
                    <span className="text-muted-foreground">Funding: </span>
                    <span className="ml-auto font-medium text-foreground">{item.fundingType}</span>
                  </div>
                </div>

                {item.requiredDocuments && item.requiredDocuments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Docs Required</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.requiredDocuments.slice(0, 3).map((doc, i) => (
                        <span key={i} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                          {doc}
                        </span>
                      ))}
                      {item.requiredDocuments.length > 3 && (
                        <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                          +{item.requiredDocuments.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Edit Scholarship</DialogTitle>
          </DialogHeader>
          {editItem && (
            <ScholarshipForm 
              defaultValues={editItem}
              onSubmit={handleUpdate}
              isSubmitting={updateMutation.isPending}
              onCancel={() => setEditItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the scholarship application from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-xl"
            >
              Delete Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

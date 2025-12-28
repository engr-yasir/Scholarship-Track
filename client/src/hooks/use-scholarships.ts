import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertScholarship } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useScholarships() {
  return useQuery({
    queryKey: [api.scholarships.list.path],
    queryFn: async () => {
      const res = await fetch(api.scholarships.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scholarships");
      return api.scholarships.list.responses[200].parse(await res.json());
    },
  });
}

export function useScholarship(id: number) {
  return useQuery({
    queryKey: [api.scholarships.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.scholarships.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scholarship");
      return api.scholarships.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateScholarship() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertScholarship) => {
      // Validate with schema first (client-side check)
      const validated = api.scholarships.create.input.parse(data);
      
      const res = await fetch(api.scholarships.create.path, {
        method: api.scholarships.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.scholarships.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create scholarship");
      }
      return api.scholarships.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scholarships.list.path] });
      toast({ title: "Success", description: "Scholarship added successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateScholarship() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertScholarship>) => {
      const validated = api.scholarships.update.input.parse(updates);
      const url = buildUrl(api.scholarships.update.path, { id });
      
      const res = await fetch(url, {
        method: api.scholarships.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.scholarships.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update scholarship");
      }
      return api.scholarships.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scholarships.list.path] });
      toast({ title: "Updated", description: "Scholarship details updated" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteScholarship() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.scholarships.delete.path, { id });
      const res = await fetch(url, { 
        method: api.scholarships.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete scholarship");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.scholarships.list.path] });
      toast({ title: "Deleted", description: "Scholarship removed from database" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

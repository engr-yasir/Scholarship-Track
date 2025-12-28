import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertScholarshipSchema, scholarships, type Scholarship } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2, Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";

const formSchema = insertScholarshipSchema.extend({
  scholarshipName: z.string().min(1, "Scholarship name is required"),
  universityName: z.string().min(1, "University name is required"),
  deadline: z.union([z.string(), z.date()]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ScholarshipFormProps {
  defaultValues?: Partial<Scholarship>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function ScholarshipForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: ScholarshipFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scholarshipName: "",
      universityName: "",
      country: "",
      fundingType: "Full",
      status: "Not Started",
      requiredDocuments: [],
      documentsDone: [],
      professorEmail: "",
      applyLink: "",
      notes: "",
      portalSignup: false,
      applyStarted: false,
      ...defaultValues,
      deadline: defaultValues?.deadline ? new Date(defaultValues.deadline) : undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "requiredDocuments" as any,
  } as any);

  const documentsDone = form.watch("documentsDone") || [];

  const toggleDocumentDone = (doc: string) => {
    const current = [...documentsDone];
    const index = current.indexOf(doc);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(doc);
    }
    form.setValue("documentsDone", current);
  };

  const addDocument = () => {
    append("" as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="scholarshipName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scholarship Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Knight-Hennessy Scholarship" {...field} className="rounded-xl border-border/60 focus:ring-primary/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="universityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Stanford University" {...field} className="rounded-xl border-border/60 focus:ring-primary/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portalSignup"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Portal Signup Done</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applyStarted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Application Started</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. USA" {...field} className="rounded-xl border-border/60 focus:ring-primary/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fundingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-border/60">
                      <SelectValue placeholder="Select funding" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full">Full Funding</SelectItem>
                    <SelectItem value="Partial">Partial Funding</SelectItem>
                    <SelectItem value="Self-funded">Self-funded</SelectItem>
                    <SelectItem value="External">External Scholarship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-border/60">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="Researching">Researching</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professor Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="prof@university.edu" {...field} value={field.value || ""} className="rounded-xl border-border/60" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Application Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal rounded-xl border-border/60",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Required Documents</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocument}
              className="h-8 text-xs rounded-lg"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Document
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((field, index) => {
              const docName = form.getValues(`requiredDocuments.${index}` as any);
              return (
                <div key={field.id} className="flex gap-2 items-center">
                  <Checkbox 
                    checked={documentsDone.includes(docName)}
                    onCheckedChange={() => toggleDocumentDone(docName)}
                    className="rounded-md"
                  />
                  <FormField
                    control={form.control}
                    name={`requiredDocuments.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1 space-y-0">
                        <FormControl>
                          <Input {...field} placeholder="Document name" className="rounded-xl h-10 border-border/60" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2 italic">No documents listed yet.</p>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="applyLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application / Website Link</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value || ""} className="rounded-xl border-border/60" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any extra details, login credentials, or specific requirements..." 
                  className="resize-none rounded-xl border-border/60 min-h-[100px]" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Scholarship
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

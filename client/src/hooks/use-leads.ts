import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type LeadInput, type LeadResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: LeadInput) => {
      const res = await fetch(api.leads.create.path, {
        method: api.leads.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to submit lead");
      }

      return api.leads.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Lead submitted successfully. We will be in touch shortly.",
      });
      // Invalidate relevant queries if we had a list view
      // queryClient.invalidateQueries({ queryKey: [api.leads.list.path] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    },
  });
}

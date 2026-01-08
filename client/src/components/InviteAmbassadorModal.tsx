import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, UserPlus, Gift, DollarSign, Users } from "lucide-react";

const inviteSchema = z.object({
  inviteeName: z.string().min(2, "Name must be at least 2 characters"),
  inviteeEmail: z.string().email("Please enter a valid email address"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteAmbassadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteAmbassadorModal({ open, onOpenChange }: InviteAmbassadorModalProps) {
  const { toast } = useToast();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      inviteeName: "",
      inviteeEmail: "",
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteFormValues) => {
      const response = await apiRequest("POST", "/api/ambassador/invite", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invitation sent!",
        description: data.emailSent 
          ? "Your invite email is on its way." 
          : "Invitation recorded. Email delivery is not configured.",
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["/api/ambassador/invitations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InviteFormValues) => {
    inviteMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite a New Ambassador
          </DialogTitle>
          <DialogDescription>
            Grow your team and earn bonuses for each person you recruit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 mb-1" />
              <span className="text-lg font-bold text-green-600">$50</span>
              <span className="text-xs text-muted-foreground text-center">Instant Bonus</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Gift className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-lg font-bold text-blue-600">20%</span>
              <span className="text-xs text-muted-foreground text-center">Recurring</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-lg font-bold text-purple-600">Team</span>
              <span className="text-xs text-muted-foreground text-center">Builder</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inviteeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Their Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Smith" 
                      {...field} 
                      data-testid="input-invitee-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inviteeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Their Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      {...field}
                      data-testid="input-invitee-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-invite"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={inviteMutation.isPending}
                className="flex-1"
                data-testid="button-send-invite"
              >
                {inviteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Invite
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

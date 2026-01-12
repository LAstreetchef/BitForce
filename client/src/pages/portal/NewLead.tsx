import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { QuestionnaireWizard } from "@/components/QuestionnaireWizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, UserPlus, ClipboardList, Loader2 } from "lucide-react";

const customerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type Step = "customer-info" | "questionnaire";

export default function NewLead() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("customer-info");
  const [customerData, setCustomerData] = useState<CustomerFormValues | null>(null);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: { customer: CustomerFormValues; services: string[]; summary: string }) => {
      const response = await apiRequest("POST", "/api/leads", {
        fullName: data.customer.fullName,
        email: data.customer.email,
        phone: data.customer.phone,
        address: data.customer.address,
        interests: data.summary,
        suggestedServices: data.services,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lead created successfully!",
        description: "The customer information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      navigate("/portal/leads");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create lead",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCustomerInfoSubmit = (data: CustomerFormValues) => {
    setCustomerData(data);
    setStep("questionnaire");
  };

  const handleQuestionnaireComplete = (serviceIds: string[], summary: string) => {
    if (customerData) {
      createLeadMutation.mutate({ customer: customerData, services: serviceIds, summary });
    }
  };

  const handleSkipQuestionnaire = () => {
    if (customerData) {
      createLeadMutation.mutate({ customer: customerData, services: [], summary: "" });
    }
  };

  return (
    <div className="space-y-6" data-testid="page-new-lead">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/portal/leads")}
          data-testid="button-back-to-leads"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">New Client Lead</h1>
          <p className="text-muted-foreground">
            {step === "customer-info" 
              ? "Enter customer information" 
              : "Answer questions to get service recommendations"}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === "customer-info" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">1. Customer Info</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === "questionnaire" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <ClipboardList className="w-4 h-4" />
          <span className="text-sm font-medium">2. Questionnaire</span>
        </div>
      </div>

      {step === "questionnaire" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Service Questionnaire</CardTitle>
            <CardDescription>
              Answer a few questions to get personalized service recommendations for {customerData?.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {createLeadMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Creating lead...</p>
              </div>
            ) : (
              <>
                <QuestionnaireWizard
                  onComplete={handleQuestionnaireComplete}
                  onSkip={handleSkipQuestionnaire}
                />
                <div className="mt-6 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("customer-info")}
                    data-testid="button-back-to-customer-info"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Customer Info
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === "customer-info" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Enter the customer's contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCustomerInfoSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" data-testid="input-fullname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" data-testid="input-phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" data-testid="input-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State" data-testid="input-address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="px-8"
                    data-testid="button-next-to-questionnaire"
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Next: Questionnaire
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

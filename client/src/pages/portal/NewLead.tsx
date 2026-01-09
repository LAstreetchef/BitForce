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
import { ArrowLeft, UserPlus, ClipboardList, Loader2, Sparkles } from "lucide-react";
import { services } from "@/data/services";

const customerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;
type Step = "questionnaire" | "customer-info";

export default function NewLead() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("questionnaire");
  const [recommendedServices, setRecommendedServices] = useState<string[]>([]);
  const [interestsSummary, setInterestsSummary] = useState("");

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
    mutationFn: async (data: CustomerFormValues) => {
      const response = await apiRequest("POST", "/api/leads", {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        interests: interestsSummary,
        suggestedServices: recommendedServices,
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

  const handleQuestionnaireComplete = (serviceIds: string[], summary: string) => {
    setRecommendedServices(serviceIds);
    setInterestsSummary(summary);
    setStep("customer-info");
  };

  const handleSkipQuestionnaire = () => {
    setStep("customer-info");
  };

  const onSubmit = (data: CustomerFormValues) => {
    createLeadMutation.mutate(data);
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
            {step === "questionnaire" 
              ? "Answer questions to get service recommendations" 
              : "Enter customer information"}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === "questionnaire" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <ClipboardList className="w-4 h-4" />
          <span className="text-sm font-medium">1. Questionnaire</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === "customer-info" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">2. Customer Info</span>
        </div>
      </div>

      {step === "questionnaire" && (
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <QuestionnaireWizard
              onComplete={handleQuestionnaireComplete}
              onSkip={handleSkipQuestionnaire}
            />
          </CardContent>
        </Card>
      )}

      {step === "customer-info" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              {recommendedServices.length > 0 
                ? `${recommendedServices.length} services recommended based on questionnaire`
                : "Enter the customer's contact details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedServices.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Recommended Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendedServices.map((id) => {
                    const service = services.find((s) => s.id === id);
                    if (!service) return null;
                    return (
                      <span
                        key={id}
                        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full"
                      >
                        {service.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("questionnaire")}
                    data-testid="button-back-to-questionnaire"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={createLeadMutation.isPending}
                    className="flex-1"
                    data-testid="button-create-lead"
                  >
                    {createLeadMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    Create Lead
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

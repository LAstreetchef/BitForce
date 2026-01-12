import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, FileCheck, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingData {
  fullName: string;
  email: string;
  phone: string;
  referredByCode: string;
  agreedToTerms: boolean;
}

interface OnboardingWizardProps {
  onComplete: () => void;
  initialData?: {
    fullName?: string;
    email?: string;
    phone?: string;
    referredByCode?: string;
    onboardingStep?: number;
  };
}

export function OnboardingWizard({ onComplete, initialData }: OnboardingWizardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(initialData?.onboardingStep || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: initialData?.fullName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ""),
    email: initialData?.email || user?.email || "",
    phone: initialData?.phone || "",
    referredByCode: initialData?.referredByCode || "",
    agreedToTerms: false,
  });

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps = [
    { title: "Personal Info", icon: User, description: "Tell us about yourself" },
    { title: "Contact Details", icon: Phone, description: "How can we reach you" },
    { title: "Terms & Agreement", icon: FileCheck, description: "Review and accept terms" },
  ];

  const handleInputChange = (field: keyof OnboardingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveProgress = async (step: number, complete = false) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch("/api/ambassador/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          step: complete ? 3 : step,
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving onboarding progress:", error);
      throw error;
    }
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      if (currentStep === 0 && !formData.fullName.trim()) {
        toast({
          title: "Required Field",
          description: "Please enter your full name",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (currentStep === 1 && !formData.email.trim()) {
        toast({
          title: "Required Field",
          description: "Please enter your email address",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await saveProgress(currentStep + 1);
      
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await saveProgress(3, true);
      toast({
        title: "Welcome to BitForce!",
        description: "Your ambassador account is now set up",
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome to BitForce</h1>
          <p className="text-muted-foreground mt-2">Let's set up your ambassador account</p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : index === currentStep 
                      ? "bg-primary/20 text-primary border-2 border-primary" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep].icon;
                return <StepIcon className="w-5 h-5" />;
              })()}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    data-testid="input-fullname"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code (optional)</Label>
                  <Input
                    id="referralCode"
                    data-testid="input-referral-code"
                    placeholder="Enter referral code if you have one"
                    value={formData.referredByCode}
                    onChange={(e) => handleInputChange("referredByCode", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    If someone referred you, enter their code to connect with them
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    data-testid="input-email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    data-testid="input-phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll only use this for important account notifications
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-3">
                  <p>By joining the BitForce Ambassador Program, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Represent BitForce professionally and ethically</li>
                    <li>Not make false claims about products or services</li>
                    <li>Maintain confidentiality of customer information</li>
                    <li>Follow all applicable laws and regulations</li>
                    <li>The monthly subscription fee of $19.99 after the initial $29 signup</li>
                  </ul>
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="terms"
                    data-testid="checkbox-terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I have read and agree to the Ambassador Program Terms and Conditions, 
                    and I understand the subscription pricing structure.
                  </Label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6 gap-3">
              {currentStep > 0 ? (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={isSubmitting}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep < totalSteps - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={isSubmitting || !formData.agreedToTerms}
                  data-testid="button-complete"
                >
                  Complete Setup
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

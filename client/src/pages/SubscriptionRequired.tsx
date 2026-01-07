import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, ArrowLeft, Zap, Users, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

interface SubscriptionRequiredProps {
  userId: string;
}

export default function SubscriptionRequired({ userId }: SubscriptionRequiredProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const success = urlParams.get("success");

    if (sessionId && success === "true" && !isVerifying && !verificationSuccess) {
      setIsVerifying(true);
      
      apiRequest("POST", "/api/ambassador/verify-checkout", { sessionId })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVerificationSuccess(true);
            toast({
              title: "Welcome to Bit Force!",
              description: "Your subscription is now active. Redirecting to your dashboard...",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/ambassador/subscription-status"] });
            
            setTimeout(() => {
              window.history.replaceState({}, "", "/portal");
              setLocation("/portal");
            }, 2000);
          } else {
            throw new Error(data.message || "Verification failed");
          }
        })
        .catch(err => {
          console.error("Verification error:", err);
          toast({
            title: "Verification Issue",
            description: "There was an issue verifying your payment. Please try again or contact support.",
            variant: "destructive",
          });
          setIsVerifying(false);
        });
    }
  }, [isVerifying, verificationSuccess, toast, setLocation]);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ambassador/create-checkout-session", {});
      return response.json();
    },
    onSuccess: (data: { url: string }) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Failed",
        description: error.message || "Could not start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const benefits = [
    { icon: Zap, text: "Access to lead management tools" },
    { icon: Users, text: "Earn $50 per qualified referral" },
    { icon: DollarSign, text: "20% recurring commission on referrals" },
    { icon: TrendingUp, text: "Gamification rewards and leaderboard" },
  ];

  if (isVerifying || verificationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            {verificationSuccess ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Welcome to Bit Force!</h2>
                <p className="text-muted-foreground">Your subscription is now active. Redirecting to your dashboard...</p>
              </>
            ) : (
              <>
                <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
                <h2 className="text-2xl font-bold">Verifying Payment</h2>
                <p className="text-muted-foreground">Please wait while we confirm your subscription...</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              B
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">Bit Force</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Become an Ambassador</h1>
          <p className="text-muted-foreground">
            Subscribe to unlock the full ambassador portal and start earning
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary">Most Popular</Badge>
            </div>
            <CardTitle className="text-2xl">Ambassador Plan</CardTitle>
            <CardDescription>Everything you need to succeed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                + $29 one-time activation fee
              </p>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              data-testid="button-subscribe"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up checkout...
                </>
              ) : (
                "Subscribe Now"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Stripe. Cancel anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

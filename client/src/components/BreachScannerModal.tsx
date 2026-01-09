import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mail,
  Calendar,
  Database,
  Key,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Breach {
  name: string;
  title: string;
  domain: string;
  breachDate: string;
  dataClasses: string[];
  description: string;
  pwnCount: number;
  isVerified: boolean;
}

interface BreachResult {
  status: "found" | "not_found" | "error";
  breachCount: number;
  breaches: Breach[];
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
  message?: string;
}

interface PasswordCheckResult {
  strength: "weak" | "moderate" | "strong" | "very_strong";
  score: number;
  compromised: boolean;
  occurrences?: number;
  suggestions: string[];
}

interface BreachScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BreachScannerModal({ open, onOpenChange }: BreachScannerModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [breachResult, setBreachResult] = useState<BreachResult | null>(null);
  const [passwordResult, setPasswordResult] = useState<PasswordCheckResult | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "password">("email");

  const resetState = () => {
    setEmail("");
    setPassword("");
    setBreachResult(null);
    setPasswordResult(null);
    setScanProgress(0);
    setActiveTab("email");
  };

  const handleScanEmail = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setBreachResult(null);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch("/api/check-breaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Scan failed");
      }

      const data = await response.json();
      setScanProgress(100);
      setBreachResult(data);
    } catch (error: any) {
      toast({
        title: "Scan failed",
        description: "Unable to complete the security scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsScanning(false);
    }
  };

  const handleCheckPassword = async () => {
    if (!password || password.length < 1) {
      toast({
        title: "Enter a password",
        description: "Please enter a password to check its strength.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingPassword(true);
    setPasswordResult(null);

    try {
      const response = await fetch("/api/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Check failed");
      }

      const data = await response.json();
      setPasswordResult(data);
    } catch (error: any) {
      toast({
        title: "Check failed",
        description: "Unable to check password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingPassword(false);
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <ShieldCheck className="w-12 h-12 text-green-500" />;
      case "medium":
        return <ShieldAlert className="w-12 h-12 text-yellow-500" />;
      case "high":
        return <ShieldX className="w-12 h-12 text-red-500" />;
      default:
        return <Shield className="w-12 h-12 text-muted-foreground" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case "weak":
        return "bg-red-500";
      case "moderate":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      case "very_strong":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetState();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Digital Footprint Scanner
          </DialogTitle>
          <DialogDescription>
            Check if your email or passwords have been exposed in data breaches
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={activeTab === "email" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("email")}
            data-testid="button-tab-email"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Breach Check
          </Button>
          <Button
            variant={activeTab === "password" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("password")}
            data-testid="button-tab-password"
          >
            <Key className="w-4 h-4 mr-2" />
            Password Checker
          </Button>
        </div>

        {/* Email Scan Tab */}
        {activeTab === "email" && (
          <div className="space-y-4">
            {!breachResult ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter your email address</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isScanning}
                      data-testid="input-email-scan"
                    />
                    <Button
                      onClick={handleScanEmail}
                      disabled={isScanning || !email}
                      data-testid="button-scan-email"
                    >
                      {isScanning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Scan"
                      )}
                    </Button>
                  </div>
                </div>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Scanning breach databases...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} />
                  </div>
                )}

                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/50 dark:bg-accent/20 p-3 rounded-md">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    We don't store your email after scanning. Your privacy is our priority.
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Test emails you can try:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>account-exists@hibp-integration-tests.com (shows breaches)</li>
                    <li>test@example.com (shows no breaches)</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {/* Results Header */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 dark:bg-accent/10">
                  {getRiskIcon(breachResult.riskLevel)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {breachResult.status === "not_found"
                        ? "Good news! No breaches found"
                        : `Found in ${breachResult.breachCount} breach${breachResult.breachCount !== 1 ? "es" : ""}`}
                    </h3>
                    <Badge className={getRiskColor(breachResult.riskLevel)}>
                      {breachResult.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>

                {/* Breach List */}
                {breachResult.breaches.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Breaches containing your email:
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {breachResult.breaches.map((breach, index) => (
                        <Card key={index} data-testid={`card-breach-${index}`}>
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium">{breach.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(breach.breachDate).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{formatNumber(breach.pwnCount)} accounts</span>
                                </div>
                              </div>
                              {breach.isVerified && (
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {breach.dataClasses.slice(0, 4).map((dc, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {dc}
                                </Badge>
                              ))}
                              {breach.dataClasses.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{breach.dataClasses.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Recommended Actions:
                  </h4>
                  <ul className="space-y-1.5">
                    {breachResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upsell */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Get Ongoing Protection
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Sign up for monthly monitoring and get alerted immediately when your email appears in new breaches.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" data-testid="button-monthly-monitoring">
                        $5/month - Start Monitoring
                      </Button>
                      <span className="text-xs text-muted-foreground">Cancel anytime</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Scan Again */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setBreachResult(null);
                    setEmail("");
                  }}
                  data-testid="button-scan-again"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scan Another Email
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Password Check Tab */}
        {activeTab === "password" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter a password to check</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password to check"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isCheckingPassword}
                    data-testid="input-password-check"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleCheckPassword}
                  disabled={isCheckingPassword || !password}
                  data-testid="button-check-password"
                >
                  {isCheckingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Check"
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/50 dark:bg-accent/20 p-3 rounded-md">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Your password is checked securely using k-anonymity - only the first 5 characters of a hash are sent, never your actual password. We don't store any data.
              </span>
            </div>

            {passwordResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/30 dark:bg-accent/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Password Strength</span>
                    <Badge className={`${getPasswordStrengthColor(passwordResult.strength)} text-white`}>
                      {passwordResult.strength.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor(passwordResult.strength)} transition-all`}
                      style={{ width: `${passwordResult.score}%` }}
                    />
                  </div>
                </div>

                {passwordResult.compromised && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-md">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">This password has been compromised!</p>
                      <p className="text-sm">
                        Found in {formatNumber(passwordResult.occurrences || 0)} data breaches. 
                        You should change this password immediately.
                      </p>
                    </div>
                  </div>
                )}

                {!passwordResult.compromised && passwordResult.strength !== "weak" && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 rounded-md">
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Password not found in known breaches</p>
                      <p className="text-sm">This password hasn't appeared in our database of compromised passwords.</p>
                    </div>
                  </div>
                )}

                {passwordResult.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Suggestions to improve:</h4>
                    <ul className="space-y-1">
                      {passwordResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Video,
  FileText,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  PlayCircle,
  Lightbulb,
  Target,
  Users,
  DollarSign
} from "lucide-react";

const trainingModules = [
  {
    id: 1,
    title: "Getting Started as an Ambassador",
    description: "Learn the basics of the platform and how to make your first sale",
    duration: "15 min",
    type: "video",
    status: "completed",
    category: "Onboarding"
  },
  {
    id: 2,
    title: "Mastering the AI Questionnaire",
    description: "How to guide customers through the questionnaire for best results",
    duration: "20 min",
    type: "video",
    status: "completed",
    category: "Skills"
  },
  {
    id: 3,
    title: "Service Deep Dive: Home Services",
    description: "Everything you need to know about roofing, paving, and plumbing services",
    duration: "30 min",
    type: "video",
    status: "in-progress",
    category: "Products"
  },
  {
    id: 4,
    title: "Service Deep Dive: Digital Services",
    description: "Master AI assistant setup and document digitizing offerings",
    duration: "25 min",
    type: "video",
    status: "not-started",
    category: "Products"
  },
  {
    id: 5,
    title: "Closing Techniques That Work",
    description: "Proven strategies to convert leads into sales",
    duration: "35 min",
    type: "video",
    status: "not-started",
    category: "Skills"
  },
  {
    id: 6,
    title: "Building Your Team",
    description: "How to recruit and mentor new ambassadors",
    duration: "40 min",
    type: "video",
    status: "not-started",
    category: "Leadership"
  },
];

const resources = [
  {
    id: 1,
    title: "Service Catalog PDF",
    description: "Complete list of all services with pricing and commission rates",
    type: "pdf",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Sales Script Templates",
    description: "Proven scripts for common customer conversations",
    type: "doc",
    size: "156 KB"
  },
  {
    id: 3,
    title: "Commission Calculator",
    description: "Excel spreadsheet to project your earnings",
    type: "excel",
    size: "89 KB"
  },
  {
    id: 4,
    title: "Customer FAQ Sheet",
    description: "Answers to the most common customer questions",
    type: "pdf",
    size: "1.1 MB"
  },
];

const tips = [
  {
    icon: Target,
    title: "Set Daily Goals",
    description: "Aim for 3-5 customer conversations per day to build momentum"
  },
  {
    icon: Users,
    title: "Follow Up Fast",
    description: "Contact leads within 24 hours for the highest conversion rates"
  },
  {
    icon: DollarSign,
    title: "Bundle Services",
    description: "Customers who buy bundles save money and you earn more commission"
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  "completed": { label: "Completed", color: "bg-green-100 text-green-800" },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  "not-started": { label: "Not Started", color: "bg-slate-100 text-slate-800" },
};

export default function Resources() {
  const completedModules = trainingModules.filter(m => m.status === "completed").length;
  const totalModules = trainingModules.length;
  const progressPercent = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="space-y-6" data-testid="page-resources">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Training & Resources</h1>
        <p className="text-muted-foreground">Materials to help you succeed as an ambassador</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="section-training">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  Training Modules
                </CardTitle>
                <Badge variant="secondary">
                  {completedModules}/{totalModules} Complete ({progressPercent}%)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingModules.map((module) => {
                  const status = statusConfig[module.status];
                  return (
                    <Card key={module.id} className="p-4" data-testid={`module-${module.id}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          module.status === "completed" 
                            ? "bg-green-100" 
                            : module.status === "in-progress"
                            ? "bg-blue-100"
                            : "bg-slate-100"
                        }`}>
                          {module.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <PlayCircle className={`w-5 h-5 ${
                              module.status === "in-progress" ? "text-blue-600" : "text-slate-400"
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-medium">{module.title}</h3>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {module.duration}
                            </span>
                            <Badge variant="outline" className="text-xs">{module.category}</Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={module.status === "not-started" ? "default" : "outline"}
                          data-testid={`button-watch-${module.id}`}
                        >
                          {module.status === "completed" ? "Review" : module.status === "in-progress" ? "Continue" : "Start"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="section-downloads">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Downloadable Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {resources.map((resource) => (
                  <Card key={resource.id} className="p-4" data-testid={`resource-${resource.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1">{resource.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
                        <Badge variant="outline" className="text-xs">{resource.type.toUpperCase()} - {resource.size}</Badge>
                      </div>
                      <Button size="icon" variant="ghost" data-testid={`button-download-${resource.id}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card data-testid="section-tips">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <div key={index} className="flex items-start gap-3" data-testid={`tip-${index}`}>
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card data-testid="section-help">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-help-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Help Center
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-contact-support">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

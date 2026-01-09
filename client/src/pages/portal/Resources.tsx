import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DollarSign,
  Trophy,
  Award,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Flame,
  Star,
  Lock
} from "lucide-react";
import { trainingModules, categories, getTotalDuration, type TrainingModule } from "@/data/trainingModules";
import { TrainingModuleModal } from "@/components/TrainingModuleModal";

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
  {
    id: 5,
    title: "Objection Handling Guide",
    description: "Responses to the 20 most common objections",
    type: "pdf",
    size: "890 KB"
  },
  {
    id: 6,
    title: "Event Setup Checklist",
    description: "Everything you need to rock community events",
    type: "doc",
    size: "234 KB"
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
  {
    icon: Flame,
    title: "Stay Consistent",
    description: "Top performers work a little bit every day, not marathons once a week"
  },
];

const STORAGE_KEY = "training_progress";

function loadProgress(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveProgress(completedLessons: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
}

export default function Resources() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    setCompletedLessons(loadProgress());
  }, []);

  const handleLessonComplete = (lessonId: string) => {
    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);
    saveProgress(updated);
  };

  const getModuleProgress = (module: TrainingModule) => {
    const lessonIds = module.lessons.map((l) => l.id);
    const completed = lessonIds.filter((id) => completedLessons.includes(id)).length;
    return { completed, total: lessonIds.length, percent: Math.round((completed / lessonIds.length) * 100) };
  };

  const getModuleStatus = (module: TrainingModule) => {
    const { completed, total } = getModuleProgress(module);
    if (completed === total) return "completed";
    if (completed > 0) return "in-progress";
    return "not-started";
  };

  const totalLessons = trainingModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalCompleted = completedLessons.length;
  const overallProgress = Math.round((totalCompleted / totalLessons) * 100);
  const modulesCompleted = trainingModules.filter((m) => getModuleStatus(m) === "completed").length;

  const filteredModules = activeCategory === "all" 
    ? trainingModules 
    : trainingModules.filter((m) => m.category === activeCategory);

  const openModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setModalOpen(true);
  };

  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <div className="space-y-6" data-testid="page-resources">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Training & Resources</h1>
        <p className="text-muted-foreground">Everything you need to become a top ambassador</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold">{overallProgress}%</p>
                <p className="text-sm text-white/80">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{modulesCompleted}/{trainingModules.length}</p>
                <p className="text-sm text-muted-foreground">Modules Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalCompleted}/{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{getTotalDuration()}</p>
                <p className="text-sm text-muted-foreground">Total Content</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {overallProgress > 0 && overallProgress < 100 && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Keep it up! You're making great progress! 🔥</p>
                <p className="text-sm text-muted-foreground">
                  {totalLessons - totalCompleted} lessons to go. You've got this!
                </p>
              </div>
              <Progress value={overallProgress} className="w-32" />
            </div>
          </CardContent>
        </Card>
      )}

      {overallProgress === 100 && (
        <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Award className="w-10 h-10 text-green-600" />
              <div className="flex-1">
                <p className="font-bold text-lg text-green-800 dark:text-green-300">
                  Congratulations! You're a Certified Ambassador! 🎓
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  You've completed all training modules. You're ready to crush it!
                </p>
              </div>
              <Button variant="outline" className="border-green-300">
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(() => {
        const specialModule = trainingModules.find(m => m.isSpecial);
        if (!specialModule) return null;
        const specialProgress = getModuleProgress(specialModule);
        const specialStatus = getModuleStatus(specialModule);
        const SpecialIcon = specialModule.icon;
        
        return (
          <Card 
            className="relative overflow-hidden border-2 border-amber-400 dark:border-amber-600 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openModule(specialModule)}
            data-testid="featured-special-module"
          >
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                {specialModule.specialBadge}
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex items-start gap-5">
                <div className={`${specialModule.color} w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <SpecialIcon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-bold">{specialModule.title}</h3>
                    {specialStatus === "completed" && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                    {specialStatus === "in-progress" && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {specialModule.description}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {specialModule.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BookOpen className="w-3 h-3" />
                      {specialModule.lessons.length} lessons
                    </span>
                    <Badge className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      Charts & Examples
                    </Badge>
                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 dark:text-amber-400">
                      <Award className="w-3 h-3 mr-1" />
                      Certificate
                    </Badge>
                  </div>
                  {specialStatus !== "not-started" ? (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{specialProgress.completed}/{specialProgress.total} lessons</span>
                        <span>{specialProgress.percent}%</span>
                      </div>
                      <Progress value={specialProgress.percent} className="h-2" />
                    </div>
                  ) : (
                    <Button size="sm">
                      Start Learning
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="section-training">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    Training Modules
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {trainingModules.length} modules with {totalLessons} lessons
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="flex-wrap h-auto gap-1">
                  <TabsTrigger value="all" data-testid="tab-all">
                    All
                  </TabsTrigger>
                  {categories.map((cat) => (
                    <TabsTrigger key={cat.name} value={cat.name} data-testid={`tab-${cat.name.toLowerCase()}`}>
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="space-y-3">
                {filteredModules.map((module) => {
                  const status = getModuleStatus(module);
                  const progress = getModuleProgress(module);
                  const IconComponent = module.icon;

                  return (
                    <Card 
                      key={module.id} 
                      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                        status === "completed" ? "border-green-200 dark:border-green-800" : ""
                      }`}
                      onClick={() => openModule(module)}
                      data-testid={`module-${module.id}`}
                    >
                      <div className="flex">
                        <div className={`w-2 ${
                          status === "completed" 
                            ? "bg-green-500" 
                            : status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`} />
                        <div className="flex-1 p-4">
                          <div className="flex items-start gap-4">
                            <div className={`${module.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold">{module.title}</h3>
                                {module.isSpecial && module.specialBadge && (
                                  <Badge className="bg-gradient-to-r from-amber-500 to-red-500 text-white border-0 text-[10px]">
                                    <Flame className="w-2.5 h-2.5 mr-1" />
                                    {module.specialBadge}
                                  </Badge>
                                )}
                                {status === "completed" && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Complete
                                  </Badge>
                                )}
                                {status === "in-progress" && (
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    <PlayCircle className="w-3 h-3 mr-1" />
                                    In Progress
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {module.description}
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {module.duration}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <BookOpen className="w-3 h-3" />
                                  {module.lessons.length} lessons
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {module.category}
                                </Badge>
                                <Badge className={`text-xs ${difficultyColors[module.difficulty]}`}>
                                  {module.difficulty}
                                </Badge>
                                {module.certificate && (
                                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 dark:text-amber-400">
                                    <Award className="w-3 h-3 mr-1" />
                                    Certificate
                                  </Badge>
                                )}
                              </div>
                              {status !== "not-started" && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span>{progress.completed}/{progress.total} lessons</span>
                                    <span>{progress.percent}%</span>
                                  </div>
                                  <Progress value={progress.percent} className="h-1.5" />
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </div>
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
              <CardDescription>
                Printable guides, scripts, and tools to help you succeed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {resources.map((resource) => (
                  <Card key={resource.id} className="p-4 hover:shadow-sm transition-shadow" data-testid={`resource-${resource.id}`}>
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
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Star className="w-5 h-5" />
                Recommended Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const nextModule = trainingModules.find((m) => getModuleStatus(m) !== "completed");
                if (!nextModule) {
                  return (
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      You've completed all modules! You're a training superstar! 🌟
                    </p>
                  );
                }
                const IconComponent = nextModule.icon;
                return (
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => openModule(nextModule)}
                    data-testid="recommended-module"
                  >
                    <div className={`${nextModule.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{nextModule.title}</p>
                      <p className="text-xs text-muted-foreground">{nextModule.duration} • {nextModule.lessons.length} lessons</p>
                    </div>
                    <Button size="sm" data-testid="button-start-recommended">
                      Start
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

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

          <Card data-testid="section-achievements">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`flex items-center gap-3 p-2 rounded-lg ${overallProgress >= 1 ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-gray-900/30 opacity-50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${overallProgress >= 1 ? "bg-green-200 dark:bg-green-800" : "bg-gray-200 dark:bg-gray-700"}`}>
                  {overallProgress >= 1 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">First Steps</p>
                  <p className="text-xs text-muted-foreground">Complete your first lesson</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-lg ${modulesCompleted >= 1 ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-gray-900/30 opacity-50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${modulesCompleted >= 1 ? "bg-green-200 dark:bg-green-800" : "bg-gray-200 dark:bg-gray-700"}`}>
                  {modulesCompleted >= 1 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">Module Master</p>
                  <p className="text-xs text-muted-foreground">Complete your first module</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-lg ${overallProgress >= 50 ? "bg-green-50 dark:bg-green-950/30" : "bg-gray-50 dark:bg-gray-900/30 opacity-50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${overallProgress >= 50 ? "bg-green-200 dark:bg-green-800" : "bg-gray-200 dark:bg-gray-700"}`}>
                  {overallProgress >= 50 ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">Halfway Hero</p>
                  <p className="text-xs text-muted-foreground">Complete 50% of all training</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-lg ${overallProgress === 100 ? "bg-yellow-50 dark:bg-yellow-950/30" : "bg-gray-50 dark:bg-gray-900/30 opacity-50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${overallProgress === 100 ? "bg-yellow-200 dark:bg-yellow-800" : "bg-gray-200 dark:bg-gray-700"}`}>
                  {overallProgress === 100 ? <Award className="w-4 h-4 text-yellow-600" /> : <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm">Training Champion</p>
                  <p className="text-xs text-muted-foreground">Complete all training modules</p>
                </div>
              </div>
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

      <TrainingModuleModal
        module={selectedModule}
        open={modalOpen}
        onOpenChange={setModalOpen}
        completedLessons={completedLessons}
        onLessonComplete={handleLessonComplete}
      />
    </div>
  );
}

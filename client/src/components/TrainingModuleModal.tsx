import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Circle,
  Clock,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Sparkles,
  ArrowRight,
  Trophy,
  Lock,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Flame,
  AlertTriangle,
} from "lucide-react";
import type { TrainingModule, Lesson, ChartData } from "@/data/trainingModules";

function SimpleChart({ chart }: { chart: ChartData }) {
  const maxValue = Math.max(...chart.data.filter(d => d.value > 0).map(d => d.value), 1);
  const isPercentage = chart.type === "pie" || chart.type === "risk-scale";
  const isTimeline = chart.type === "timeline";
  const formatValue = (val: number) => {
    if (isPercentage) return `${val}%`;
    if (isTimeline) return `$${val.toLocaleString()}`;
    return val.toString();
  };
  
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border">
      <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-blue-500" />
        {chart.title}
      </h5>
      <div className="space-y-2">
        {chart.data.map((item, i) => {
          const widthPercent = Math.max(0, Math.min(100, (item.value / maxValue) * 100));
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{formatValue(item.value)}</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${widthPercent}%`,
                    backgroundColor: item.color || "#3b82f6"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {chart.description && (
        <p className="text-xs text-muted-foreground mt-3 italic">{chart.description}</p>
      )}
    </div>
  );
}

function CommonSenseBox({ example }: { example: { scenario: string; badChoice: string; goodChoice: string; lesson: string } }) {
  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 border-b border-blue-200 dark:border-blue-800">
        <h5 className="font-medium text-sm flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <Brain className="w-4 h-4" />
          Common Sense Check
        </h5>
        <p className="text-sm mt-1 text-blue-700 dark:text-blue-400">{example.scenario}</p>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
            <ThumbsDown className="w-3 h-3 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-red-700 dark:text-red-400">Bad Choice</p>
            <p className="text-sm text-red-600 dark:text-red-300">{example.badChoice}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
            <ThumbsUp className="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-700 dark:text-green-400">Good Choice</p>
            <p className="text-sm text-green-600 dark:text-green-300">{example.goodChoice}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 pt-2 border-t">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300"><strong>The Lesson:</strong> {example.lesson}</p>
        </div>
      </div>
    </div>
  );
}

interface TrainingModuleModalProps {
  module: TrainingModule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedLessons: string[];
  onLessonComplete: (lessonId: string) => void;
}

export function TrainingModuleModal({
  module,
  open,
  onOpenChange,
  completedLessons,
  onLessonComplete,
}: TrainingModuleModalProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (open && module?.lessons[0]) {
      setExpandedLesson(module.lessons[0].id);
    }
  }, [open, module]);

  if (!module) return null;

  const moduleLessons = module.lessons.map((l) => l.id);
  const completedInModule = moduleLessons.filter((id) =>
    completedLessons.includes(id)
  ).length;
  const progressPercent = Math.round(
    (completedInModule / moduleLessons.length) * 100
  );
  const isModuleComplete = completedInModule === moduleLessons.length;

  const IconComponent = module.icon;

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleMarkComplete = (lessonId: string) => {
    onLessonComplete(lessonId);
    const currentIndex = module.lessons.findIndex((l) => l.id === lessonId);
    if (currentIndex < module.lessons.length - 1) {
      setExpandedLesson(module.lessons[currentIndex + 1].id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0">
        <div
          className={`${module.color} p-6 text-white`}
          data-testid="module-header"
        >
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl text-white mb-1">
                  {module.title}
                </DialogTitle>
                <p className="text-white/80 text-sm">{module.tagline}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {module.duration}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    {module.difficulty}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    {module.category}
                  </Badge>
                  {module.certificate && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-400/30 text-yellow-100 border-0"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Certificate
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>
                {completedInModule}/{module.lessons.length} lessons complete
              </span>
              <span>{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2 bg-white/20"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-6 px-6 py-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-primary" />
                  What You'll Learn
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {module.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {module.funFact && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                    Fun Fact
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {module.funFact}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Lessons
              </h3>

              {module.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isExpanded = expandedLesson === lesson.id;
                const prevCompleted =
                  index === 0 ||
                  completedLessons.includes(module.lessons[index - 1].id);
                const isLocked = !prevCompleted && !isCompleted;

                return (
                  <Card
                    key={lesson.id}
                    className={`transition-all ${
                      isExpanded
                        ? "ring-2 ring-primary/50"
                        : isLocked
                        ? "opacity-60"
                        : ""
                    }`}
                    data-testid={`lesson-card-${lesson.id}`}
                  >
                    <button
                      onClick={() => !isLocked && toggleLesson(lesson.id)}
                      className="w-full p-4 flex items-center gap-4 text-left"
                      disabled={isLocked}
                      data-testid={`lesson-toggle-${lesson.id}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-green-100 dark:bg-green-900/30"
                            : isLocked
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-primary/10"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : (
                          <span className="font-semibold text-primary">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            isCompleted
                              ? "text-green-700 dark:text-green-400"
                              : ""
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </p>
                      </div>
                      {!isLocked &&
                        (isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ))}
                    </button>

                    {isExpanded && !isLocked && (
                      <CardContent className="pt-0 pb-4 px-4 border-t">
                        <div className="pt-4 space-y-4">
                          <p className="text-sm leading-relaxed">
                            {lesson.content}
                          </p>

                          <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Key Points
                            </h4>
                            <ul className="space-y-1.5">
                              {lesson.keyPoints.map((point, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {lesson.charts && lesson.charts.length > 0 && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {lesson.charts.map((chart, i) => (
                                <SimpleChart key={i} chart={chart} />
                              ))}
                            </div>
                          )}

                          {lesson.commonSenseExample && (
                            <CommonSenseBox example={lesson.commonSenseExample} />
                          )}

                          {lesson.proTip && (
                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                              <Lightbulb className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                                  Pro Tip
                                </p>
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                  {lesson.proTip}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end pt-2">
                            {!isCompleted ? (
                              <Button
                                onClick={() => handleMarkComplete(lesson.id)}
                                data-testid={`button-complete-${lesson.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Complete
                              </Button>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            <Card
              className={`${
                isModuleComplete
                  ? "border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
                  : "border-gray-200 bg-gray-50 dark:bg-gray-900/30"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isModuleComplete
                        ? "bg-green-200 dark:bg-green-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <Trophy
                      className={`w-6 h-6 ${
                        isModuleComplete
                          ? "text-green-700 dark:text-green-300"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {isModuleComplete
                        ? "Module Complete! 🎉"
                        : "Finish to Unlock Quiz"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isModuleComplete
                        ? `Take the quiz (${module.quiz.questions} questions, ${module.quiz.passingScore}% to pass) to earn your certificate!`
                        : `Complete all ${module.lessons.length} lessons to take the quiz and earn your certificate.`}
                    </p>
                  </div>
                  <Button
                    variant={isModuleComplete ? "default" : "secondary"}
                    disabled={!isModuleComplete}
                    data-testid="button-take-quiz"
                  >
                    {isModuleComplete ? "Take Quiz" : "Locked"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

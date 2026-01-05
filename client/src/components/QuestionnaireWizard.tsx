import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  questionnaire, 
  calculateServiceScores, 
  getTopServices,
  generateInterestsSummary,
  type Question 
} from "@/data/questionnaire";
import { services } from "@/data/services";

interface QuestionnaireWizardProps {
  onComplete: (recommendedServices: string[], interestsSummary: string) => void;
  onSkip: () => void;
}

export function QuestionnaireWizard({ onComplete, onSkip }: QuestionnaireWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const totalSteps = questionnaire.length;
  const currentQuestion = questionnaire[currentStep];
  const progress = ((currentStep) / totalSteps) * 100;

  const handleSingleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultipleAnswer = (optionId: string, checked: boolean) => {
    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
    const newAnswers = checked
      ? [...currentAnswers, optionId]
      : currentAnswers.filter((id) => id !== optionId);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: newAnswers }));
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "single") {
      return !!answer;
    }
    return Array.isArray(answer) && answer.length > 0;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    const scores = calculateServiceScores(answers);
    const topServiceIds = getTopServices(scores, 3);
    const summary = generateInterestsSummary(answers);
    onComplete(topServiceIds.length > 0 ? topServiceIds : ["custom"], summary);
  };

  const scores = calculateServiceScores(answers);
  const topServiceIds = getTopServices(scores, 3);
  const recommendedServices = topServiceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean);

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl shadow-blue-900/20"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete</h2>
          <p className="text-slate-500">Based on your answers, here are the recommended services:</p>
        </div>

        <div className="space-y-3 mb-6">
          {recommendedServices.length > 0 ? (
            recommendedServices.map((service, index) => {
              if (!service) return null;
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-500">
                      Match score: {scores[service.id] || 0} points
                    </p>
                  </div>
                  <div className="text-blue-600 font-bold text-lg">
                    #{index + 1}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500">
              We recommend our Custom Services to discuss your unique needs.
            </div>
          )}
        </div>

        <Button
          onClick={handleFinish}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
          data-testid="button-continue-to-form"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue to Client Form
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 lg:p-8 shadow-2xl shadow-blue-900/20"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            data-testid="button-skip-wizard"
          >
            Skip questionnaire
          </button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description && (
            <p className="text-slate-500 mb-6">{currentQuestion.description}</p>
          )}

          {currentQuestion.type === "single" ? (
            <RadioGroup
              value={(answers[currentQuestion.id] as string) || ""}
              onValueChange={handleSingleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={`
                    flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                    ${answers[currentQuestion.id] === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-100 hover:border-slate-200 bg-white"
                    }
                  `}
                  onClick={() => handleSingleAnswer(option.id)}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    data-testid={`radio-${currentQuestion.id}-${option.id}`}
                  />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer font-medium text-slate-700"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isChecked = ((answers[currentQuestion.id] as string[]) || []).includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${isChecked
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-100 hover:border-slate-200 bg-white"
                      }
                    `}
                    onClick={() => handleMultipleAnswer(option.id, !isChecked)}
                  >
                    <Checkbox
                      id={option.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => 
                        handleMultipleAnswer(option.id, checked as boolean)
                      }
                      data-testid={`checkbox-${currentQuestion.id}-${option.id}`}
                    />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer font-medium text-slate-700"
                    >
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex-1"
          data-testid="button-prev-step"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="button-next-step"
        >
          {currentStep === totalSteps - 1 ? "See Results" : "Next"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

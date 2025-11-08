import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TutorialStep {
  title: string;
  description: string;
  targetElement?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to CourseBuddy!",
    description: "Let's take a quick tour of the main features. You can skip this tutorial at any time.",
  },
  {
    title: "Save Your Schedule",
    description: "Click the Save button to store your current schedule. You can create multiple schedules and switch between them anytime.",
    targetElement: "save-schedule-btn",
  },
  {
    title: "Load Saved Schedules",
    description: "Access your previously saved schedules here. Perfect for comparing different schedule options or switching between terms.",
    targetElement: "load-schedule-btn",
  },
  {
    title: "Course Insights",
    description: "Navigate to Course Insights to view detailed analytics, ratings, and information about courses to help you make informed decisions.",
    targetElement: "course-insights-link",
  },
  {
    title: "Prerequisite Map",
    description: "Explore the Prerequisite Map to visualize course dependencies and plan your academic path effectively.",
    targetElement: "prerequisite-map-link",
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function TutorialOverlay({ onComplete, onSkip }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTargetPosition = () => {
    if (!step.targetElement) return null;

    const element = document.getElementById(step.targetElement);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  };

  const targetPos = getTargetPosition();

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in" />

      {/* Highlight target element */}
      {targetPos && (
        <>
          <div
            className="fixed z-50 ring-4 ring-primary rounded-lg animate-pulse pointer-events-none"
            style={{
              top: targetPos.top - 4,
              left: targetPos.left - 4,
              width: targetPos.width + 8,
              height: targetPos.height + 8,
            }}
          />
          <div
            className="fixed z-40 bg-background/0"
            style={{
              top: targetPos.top,
              left: targetPos.left,
              width: targetPos.width,
              height: targetPos.height,
            }}
          />
        </>
      )}

      {/* Tutorial card */}
      <Card 
        className="fixed z-50 w-[90vw] max-w-md animate-scale-in shadow-2xl"
        style={{
          top: targetPos 
            ? targetPos.top + targetPos.height + 20 
            : "50%",
          left: targetPos 
            ? Math.min(targetPos.left, window.innerWidth - 400)
            : "50%",
          transform: !targetPos ? "translate(-50%, -50%)" : "none",
        }}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{step.title}</CardTitle>
              <CardDescription className="mt-2">
                Step {currentStep + 1} of {tutorialSteps.length}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSkip}
              className="h-6 w-6 -mt-1 -mr-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-foreground/90">{step.description}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Skip Tutorial
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
        </CardFooter>

        {/* Progress indicator */}
        <div className="px-6 pb-4">
          <div className="flex gap-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

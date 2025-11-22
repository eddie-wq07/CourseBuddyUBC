import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { Footer } from "@/components/Footer";
import { SaveScheduleDialog } from "@/components/SaveScheduleDialog";
import { LoadScheduleDialog } from "@/components/LoadScheduleDialog";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import { AiOptimizerPanel, type ChatMessage } from "@/components/AiOptimizerPanel";
import { useCourses, type Course, getCourseType, type CourseType } from "@/hooks/useCourses";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export interface ScheduledCourse {
  name: string;
  day: string;
  time: string;
  section?: string;
  status?: string;
  color?: string;
}

const loadingPhrases = [
  "😴 Avoiding 8am classes",
  "🪑 Hunting for empty seats",
  "📋 Consulting office hours",
  "📚 Dusting off the textbooks",
  "🃏 Shuffling the course cards",
  "✅ Checking prerequisites",
  "☕ Planning study breaks",
  "🔢 Herding the course codes",
  "🚫 Avoiding course conflicts",
  "💤 Maximizing your sleep schedule",
  "🗺️ Mapping out your degree",
  "⭐ Finding the perfect schedule"
];

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [session, setSession] = useState<Session | null>(null);
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>([]);
  const [term, setTerm] = useState('2025W');
  const [selectedCoursesMap, setSelectedCoursesMap] = useState<Map<string, Map<CourseType, Course>>>(new Map());
  const [draggingCourse, setDraggingCourse] = useState<ScheduledCourse | null>(null);
  const [availableAlternatives, setAvailableAlternatives] = useState<Course[]>([]);
  const { data: availableCourses } = useCourses(term);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loadingPhrase] = useState(() => loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [isProcessingChat, setIsProcessingChat] = useState(false);

  // History management
  const [history, setHistory] = useState<ScheduledCourse[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Schedule management
  const [currentScheduleName, setCurrentScheduleName] = useState<string>();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Welcome animation and tutorial
  useEffect(() => {
    if (session?.user) {
      const timer = setTimeout(async () => {
        setShowWelcome(false);

        // Check if user has seen tutorial from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_seen_tutorial')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile && !profile.has_seen_tutorial) {
          setShowTutorial(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const handleTutorialComplete = async () => {
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ has_seen_tutorial: true })
        .eq('id', session.user.id);

      setShowTutorial(false);
      toast.success("Tutorial completed! You're all set!");
    }
  };

  const handleTutorialSkip = async () => {
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ has_seen_tutorial: true })
        .eq('id', session.user.id);

      setShowTutorial(false);
      toast.info("Tutorial skipped");
    }
  };

  const loadSchedule = async (userId: string, scheduleName?: string) => {
    let query = supabase
      .from('user_schedules')
      .select('*')
      .eq('user_id', userId);

    if (scheduleName) {
      query = query.eq('schedule_name', scheduleName);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading schedule:', error);
      return;
    }

    if (data && data.length > 0) {
      // If no specific schedule name, load the most recent one
      const scheduleToLoad = scheduleName || data[0].schedule_name;
      const filteredData = scheduleName
        ? data
        : data.filter(item => item.schedule_name === scheduleToLoad);

      const loadedSchedule: ScheduledCourse[] = filteredData.map(item => ({
        name: item.course_name,
        section: item.course_section,
        day: item.day,
        time: item.time,
        status: item.status,
        color: item.color,
      }));

      setScheduledCourses(loadedSchedule);
      setHistory([loadedSchedule]);
      setHistoryIndex(0);
      setCurrentScheduleName(scheduleToLoad);
    }
  };

  const handleLoadSchedule = (courses: ScheduledCourse[], scheduleName: string) => {
    setScheduledCourses(courses);
    setCurrentScheduleName(scheduleName);
    setHistory([courses]);
    setHistoryIndex(0);

    // Rebuild selectedCoursesMap from loaded schedule so AI can modify it
    if (availableCourses && courses.length > 0) {
      const newMap = new Map<string, Map<CourseType, Course>>();

      courses.forEach(scheduledCourse => {
        const matchingCourse = availableCourses.find(
          c => c.course_code === scheduledCourse.name &&
            c.section === scheduledCourse.section
        );

        if (matchingCourse) {
          const courseType = getCourseType(matchingCourse.section);

          if (!newMap.has(matchingCourse.course_code)) {
            newMap.set(matchingCourse.course_code, new Map());
          }

          const typeMap = newMap.get(matchingCourse.course_code);
          if (typeMap && !typeMap.has(courseType)) {
            typeMap.set(courseType, matchingCourse);
          }
        }
      });

      setSelectedCoursesMap(newMap);
    }
  };

  const saveSchedule = async (schedule: ScheduledCourse[], scheduleName: string) => {
    if (!session?.user) return;

    // Delete existing schedule entries with this name
    const { error: deleteError } = await supabase
      .from('user_schedules')
      .delete()
      .eq('user_id', session.user.id)
      .eq('schedule_name', scheduleName);

    if (deleteError) {
      console.error('Error deleting old schedule:', deleteError);
      toast.error('Failed to save schedule');
      return;
    }

    // Insert new schedule entries
    if (schedule.length > 0) {
      const scheduleData = schedule.map(course => ({
        user_id: session.user.id,
        schedule_name: scheduleName,
        course_name: course.name,
        course_section: course.section,
        day: course.day,
        time: course.time,
        status: course.status,
        color: course.color,
      }));

      const { error: insertError } = await supabase
        .from('user_schedules')
        .insert(scheduleData);

      if (insertError) {
        console.error('Error saving schedule:', insertError);
        toast.error('Failed to save schedule');
      } else {
        toast.success('Schedule saved');
        setCurrentScheduleName(scheduleName);
      }
    }
  };

  const addToHistory = useCallback((schedule: ScheduledCourse[]) => {
    setHistory(prev => {
      // Remove any "future" history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new state
      return [...newHistory, schedule];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleRemoveCourseFromSchedule = useCallback((courseCode: string, courseType: CourseType) => {
    setScheduledCourses(prev => {
      // Remove schedule entries that match both course code and course type
      const filtered = prev.filter(course => {
        if (course.name !== courseCode) return true;
        // Check if this course section matches the type being removed
        const sectionType = getCourseType(course.section || '');
        return sectionType !== courseType;
      });
      addToHistory(filtered);
      return filtered;
    });
    toast.success(`Removed ${courseCode} ${courseType} from schedule`);
  }, [addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setScheduledCourses(history[historyIndex - 1]);
      toast.success("Undone");
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setScheduledCourses(history[historyIndex + 1]);
      toast.success("Redone");
    }
  }, [historyIndex, history]);

  const handleClearSchedule = useCallback(() => {
    setScheduledCourses([]);
    setSelectedCoursesMap(new Map());
    addToHistory([]);
    toast.success("Schedule cleared");
  }, [addToHistory]);

  const getColorClasses = (color?: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-200 text-purple-800 border-purple-400";
      case "green":
        return "bg-green-200 text-green-800 border-green-400";
      case "tan":
        return "bg-amber-100 text-amber-800 border-amber-400";
      case "orange":
        return "bg-orange-200 text-orange-700 border-orange-400";
      case "blue":
        return "bg-blue-200 text-blue-800 border-blue-400";
      default:
        return "bg-primary text-primary-foreground border-primary";
    }
  };

  const handleGenerateSchedule = (selectedCourses: Course[], coursesMap: Map<string, Map<CourseType, Course>>) => {
    setSelectedCoursesMap(coursesMap);

    const schedule: ScheduledCourse[] = [];
    const colors = ["purple", "green", "tan", "orange", "blue"];
    const courseColorMap = new Map<string, string>();
    let colorIndex = 0;

    // Process each selected course
    selectedCourses.forEach((course: Course) => {
      if (!course.days || !course.time_start) return;

      // Assign color based on course code
      if (!courseColorMap.has(course.course_code)) {
        courseColorMap.set(course.course_code, colors[colorIndex % colors.length]);
        colorIndex++;
      }

      // Add course to each day it meets
      course.days.forEach((day: string) => {
        schedule.push({
          name: course.course_code,
          section: course.section,
          status: course.status || "Unknown",
          color: courseColorMap.get(course.course_code),
          day: day,
          time: course.time_start!,
        });
      });
    });

    setScheduledCourses(schedule);
    addToHistory(schedule);
    toast.success("Schedule generated successfully!");
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedCourse = scheduledCourses.find(
      c => `${c.name}-${c.section}-${c.day}-${c.time}` === event.active.id
    );

    if (!draggedCourse || !availableCourses) return;

    setDraggingCourse(draggedCourse);

    // Find all alternative sections for this course
    const courseType = getCourseType(draggedCourse.section!);
    const alternatives = availableCourses.filter((course: Course) =>
      course.course_code === draggedCourse.name &&
      getCourseType(course.section) === courseType
    );

    setAvailableAlternatives(alternatives);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setDraggingCourse(null);
    setAvailableAlternatives([]);

    if (!over || !draggingCourse) return;

    // Parse the drop zone ID: "drop-{day}-{time}"
    const dropId = over.id as string;
    if (!dropId.startsWith('drop-')) return;

    const [, targetDay, targetTime] = dropId.split('-');

    // Find the alternative course that matches this time slot
    const newCourse = availableAlternatives.find((course: Course) =>
      course.days?.includes(targetDay.toUpperCase()) &&
      course.time_start === targetTime
    );

    if (!newCourse) {
      toast.error("No section available for this time slot");
      return;
    }

    // Update the selected courses map
    const newMap = new Map(selectedCoursesMap);
    const courseType = getCourseType(draggingCourse.section!);
    const courseMap = newMap.get(draggingCourse.name);

    if (courseMap) {
      courseMap.set(courseType, newCourse);

      // Regenerate schedule
      const allCourses: Course[] = [];
      newMap.forEach(typeMap => {
        typeMap.forEach(course => allCourses.push(course));
      });

      handleGenerateSchedule(allCourses, newMap);
      toast.success(`Switched to section ${newCourse.section}`);
    }
  };

  const handleSendChatMessage = async () => {
    if (!currentChatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentChatInput
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentChatInput("");
    setIsProcessingChat(true);

    try {
      // Convert selectedCourses to array for AI
      const selectedCoursesArray: Course[] = [];
      selectedCoursesMap.forEach(typeMap => {
        typeMap.forEach(course => {
          selectedCoursesArray.push(course);
        });
      });

      const { data, error } = await supabase.functions.invoke('optimize-schedule-ai', {
        body: {
          messages: [...chatMessages, userMessage],
          selectedCourses: selectedCoursesArray,
          allCourses: availableCourses || []
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        changes: data.changes
      };

      setChatMessages(prev => [...prev, assistantMessage]);

      // Apply changes if any
      if (data.changes && data.changes.length > 0) {
        const newSelectedCourses = new Map(selectedCoursesMap);

        interface ScheduleChange {
          courseCode: string;
          oldSection: string;
          newSection: string;
        }

        data.changes.forEach((change: ScheduleChange) => {
          const courseCode = change.courseCode;
          const oldSection = change.oldSection;
          const newSection = change.newSection;

          const oldCourse = selectedCoursesArray.find(
            c => c.course_code === courseCode && c.section === oldSection
          );

          if (oldCourse) {
            const courseType = getCourseType(oldCourse.section);
            const newCourse = availableCourses?.find(
              c => c.course_code === courseCode && c.section === newSection
            );

            if (newCourse) {
              const typeMap = newSelectedCourses.get(courseCode);
              if (typeMap) {
                typeMap.set(courseType, newCourse);
              }
            }
          }
        });

        const updatedCourses: Course[] = [];
        newSelectedCourses.forEach(typeMap => {
          typeMap.forEach(course => {
            updatedCourses.push(course);
          });
        });

        handleGenerateSchedule(updatedCourses, newSelectedCourses);
        toast.success("Schedule updated based on your request");
      }
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error("Failed to process your message. Please try again.");
      setChatMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsProcessingChat(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-background">
        {showWelcome && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background transition-opacity duration-1000 ease-in-out opacity-100 animate-fade-in">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-foreground animate-[pulse_0.8s_ease-in-out_infinite]">
              {loadingPhrase}
            </p>
          </div>
        )}
        <Header
          onSaveSchedule={() => setSaveDialogOpen(true)}
          onLoadSchedule={() => setLoadDialogOpen(true)}
          onClearSchedule={handleClearSchedule}
        />
        <div className="flex flex-1 overflow-hidden">
          {isMobile ? (
            <>
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-4 left-4 z-40 h-14 w-14 rounded-full shadow-lg"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Course Selection</SheetTitle>
                  </SheetHeader>
                  <div className="h-[calc(100vh-80px)] overflow-hidden">
                    <Sidebar
                      onGenerateSchedule={(courses, map) => {
                        handleGenerateSchedule(courses, map);
                        setSidebarOpen(false);
                      }}
                      onRemoveCourseFromSchedule={handleRemoveCourseFromSchedule}
                      onClearSchedule={handleClearSchedule}
                      term={term}
                      setTerm={setTerm}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex-1">
                <ScheduleGrid
                  scheduledCourses={scheduledCourses}
                  draggingCourse={draggingCourse}
                  availableAlternatives={availableAlternatives}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={historyIndex > 0}
                  canRedo={historyIndex < history.length - 1}
                  selectedCourses={selectedCoursesMap}
                />
              </div>
            </>
          ) : (
            <>
              <Sidebar
                onGenerateSchedule={handleGenerateSchedule}
                onRemoveCourseFromSchedule={handleRemoveCourseFromSchedule}
                onClearSchedule={handleClearSchedule}
                term={term}
                setTerm={setTerm}
              />
              <ScheduleGrid
                scheduledCourses={scheduledCourses}
                draggingCourse={draggingCourse}
                availableAlternatives={availableAlternatives}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                selectedCourses={selectedCoursesMap}
              />
              <AiOptimizerPanel
                messages={chatMessages}
                currentInput={currentChatInput}
                onInputChange={setCurrentChatInput}
                onSendMessage={handleSendChatMessage}
                isProcessing={isProcessingChat}
                disabled={false}
              />
            </>
          )}
        </div>
        {!isMobile && <Footer />}

        <SaveScheduleDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          scheduledCourses={scheduledCourses}
          currentScheduleName={currentScheduleName}
        />

        <LoadScheduleDialog
          open={loadDialogOpen}
          onOpenChange={setLoadDialogOpen}
          onLoadSchedule={handleLoadSchedule}
          currentScheduleName={currentScheduleName}
        />

        {showTutorial && (
          <TutorialOverlay
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        )}

        <DragOverlay dropAnimation={null}>
          {draggingCourse && (
            <div className={cn(
              getColorClasses(draggingCourse.color),
              "rounded-lg px-4 py-3 shadow-2xl border-2 border-primary/50",
              "flex flex-col items-center justify-center text-center font-medium",
              "min-w-[120px] backdrop-blur-none"
            )}>
              <div className="text-sm font-semibold leading-tight">{draggingCourse.name}</div>
              <div className="text-xs leading-tight mt-1">Section {draggingCourse.section}</div>
              <div className="text-xs leading-tight mt-0.5 opacity-80">{draggingCourse.status}</div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Index;

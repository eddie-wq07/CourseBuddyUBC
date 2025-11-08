import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, FolderOpen, Instagram, LogOut, BarChart3, Info, Network, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/coursebuddy-logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportIssueDialog } from "./ReportIssueDialog";

interface HeaderProps {
  onSaveSchedule?: () => void;
  onLoadSchedule?: () => void;
  onClearSchedule?: () => void;
}

export const Header = ({ onSaveSchedule, onLoadSchedule, onClearSchedule }: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate('/auth');
    }
  };

  const handleNavigate = (path: string) => {
    // Clear schedule when navigating away from home
    if (path !== '/') {
      onClearSchedule?.();
    }
    navigate(path);
  };

  if (isMobile) {
    return (
      <TooltipProvider>
        <header className="relative z-50 bg-card text-foreground px-4 py-3 flex items-center justify-between border-b border-border/50">
          <button 
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src={logo} alt="CourseBuddy Logo" className="h-8 w-8" />
            <h1 className="text-lg font-bold tracking-tight font-display">
              CourseBuddy
            </h1>
          </button>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigate and manage your schedule</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => onSaveSchedule?.(), 100);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => onLoadSchedule?.(), 100);
                    setMobileMenuOpen(false);
                  }}
                >
                  <FolderOpen className="h-4 w-4" />
                  Load Schedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleNavigate('/course-insights');
                    setMobileMenuOpen(false);
                  }}
                >
                  <BarChart3 className="h-4 w-4" />
                  Course Insights
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleNavigate('/prerequisite-map');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Network className="h-4 w-4" />
                  Prerequisite Map
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleNavigate('/about');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Info className="h-4 w-4" />
                  About
                </Button>
                <div className="border-t my-2" />
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <a href="https://www.instagram.com/eddie_j._/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                    Follow on Instagram
                  </a>
                </Button>
                <Button 
                  variant="default" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setIsReportDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Report Issue
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <ReportIssueDialog 
            open={isReportDialogOpen} 
            onOpenChange={setIsReportDialogOpen}
          />
        </header>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <header className="relative z-50 bg-card text-foreground px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src={logo} alt="CourseBuddy Logo" className="h-10 w-10" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight font-display">
                CourseBuddy
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Your AI Course Assistant
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="save-schedule-btn"
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => onSaveSchedule?.(), 100);
                  }}
                >
                  <Save className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Schedule</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="load-schedule-btn"
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => onLoadSchedule?.(), 100);
                  }}
                >
                  <FolderOpen className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load Schedule</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="course-insights-link"
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                  onClick={() => handleNavigate('/course-insights')}
                >
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Course Insights</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="prerequisite-map-link"
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                  onClick={() => handleNavigate('/prerequisite-map')}
                >
                  <Network className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Prerequisite Map</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                  onClick={() => handleNavigate('/about')}
                >
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
          asChild
        >
          <a href="https://www.instagram.com/eddie_j._/" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-5 w-5" />
          </a>
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-primary hover:bg-primary/90 font-semibold"
          onClick={() => setIsReportDialogOpen(true)}
        >
          Report Issue
        </Button>
        <ReportIssueDialog 
          open={isReportDialogOpen} 
          onOpenChange={setIsReportDialogOpen}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-foreground hover:text-destructive hover:bg-secondary/50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      </header>
    </TooltipProvider>
  );
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import eddieImage from "@/assets/eddie.jpg";
export default function About() {
  return <div className="flex flex-col h-screen bg-background relative overflow-hidden">
    {/* Animated Aurora Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] animate-aurora-1" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-aurora-2" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-neon-blue/15 rounded-full blur-[100px] animate-aurora-3" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neon-cyan/15 rounded-full blur-[90px] animate-aurora-4" />
    </div>

    <Header />
    <main className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-6xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground animate-fade-in text-center">About CourseBuddy</h1>
        <p className="text-center text-muted-foreground text-base sm:text-lg mb-8 sm:mb-12 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
          AI-powered course scheduling, built by students for students
        </p>

        {/* Why CourseBuddy Section */}
        <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border animate-fade-in mb-6 sm:mb-8 hover-scale transition-all" style={{
          animationDelay: '0.2s'
        }}>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">Why CourseBuddy?</h2>
          <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4">
            Workday, the current course registration software used at UBC, is tedious and unintuitive.
            Students struggle with its complex interface and limited scheduling features, making course
            planning unnecessarily difficult and time-consuming.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            CourseBuddy was born from the frustration of navigating outdated systems. We believed
            students deserved better - a modern, intuitive platform that makes course planning
            enjoyable rather than stressful.
          </p>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 sm:p-6 md:p-8 border-2 border-primary/20 animate-fade-in mb-6 sm:mb-8 hover-scale transition-all" style={{
          animationDelay: '0.3s'
        }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🤖</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">AI Schedule Assistant</h2>
          </div>
          <p className="text-foreground/90 leading-relaxed text-base sm:text-lg mb-4">
            CourseBuddy's flagship feature is its <strong>intelligent AI assistant</strong> that acts as your personal course planning advisor.
            Unlike traditional scheduling tools, our AI can answer natural language questions and help you optimize your schedule through conversation.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <h3 className="font-semibold text-primary mb-2">💬 Conversational Interface</h3>
              <p className="text-muted-foreground text-sm">
                Ask questions like "What CPSC courses are available on Tuesdays?" or "Could you make my schedule more clustered?"
                and get intelligent, contextual responses.
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <h3 className="font-semibold text-primary mb-2">🔍 Course Discovery</h3>
              <p className="text-muted-foreground text-sm">
                Explore courses by asking about specific times, instructors, or requirements. The AI searches through
                the entire course database to find exactly what you need.
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <h3 className="font-semibold text-primary mb-2">⚡ Smart Optimization</h3>
              <p className="text-muted-foreground text-sm">
                Request schedule changes like "Free up my Fridays" or "Find me afternoon sections" and the AI
                automatically adjusts your schedule while avoiding conflicts.
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <h3 className="font-semibold text-primary mb-2">📍 Location & Timing Aware</h3>
              <p className="text-muted-foreground text-sm">
                The AI understands course meeting patterns, locations, and times, helping you plan efficient
                schedules that minimize travel time between classes.
              </p>
            </div>
          </div>
          <p className="text-foreground/80 leading-relaxed text-sm italic">
            We're continuously working to expand the AI's access to comprehensive course data including all meeting times,
            patterns, locations, and instructor information to provide even more accurate and helpful responses to student questions.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border animate-fade-in mb-6 sm:mb-8 hover-scale transition-all" style={{
          animationDelay: '0.4s'
        }}>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-foreground">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-2xl">📅</span>
                <h3>Visual Scheduling</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Drag-and-drop interface for intuitive course planning with real-time conflict detection
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-2xl">🧠</span>
                <h3>Smart Optimization</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Intelligent schedule generator that optimizes based on your preferences and constraints
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-2xl">📊</span>
                <h3>Course Insights</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Access instructor ratings, grade distributions, and enrollment statistics
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-2xl">🔗</span>
                <h3>Prerequisite Map</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Interactive visualization of course dependencies and academic pathways
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-2xl">💾</span>
                <h3>Save & Share</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Save multiple schedules and share them with friends or advisors
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span className="text-2xl">⚡</span>
                <h3>Real-time Updates</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Live course availability and seat counts updated continuously
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border animate-fade-in mb-6 sm:mb-8 hover-scale transition-all" style={{
          animationDelay: '0.5s'
        }}>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Search & Explore Courses</h3>
                <p className="text-muted-foreground">
                  Browse through UBC's course catalog with powerful search and filtering options.
                  View course details, prerequisites, and real-time availability.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Build Your Schedule</h3>
                <p className="text-muted-foreground">
                  Drag courses into your weekly calendar. The system automatically detects conflicts
                  and suggests alternative sections that fit your schedule.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Optimize & Refine</h3>
                <p className="text-muted-foreground">
                  Use the smart optimizer to generate schedules based on your preferences - minimize
                  gaps, avoid early mornings, or maximize specific days off.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Save & Register</h3>
                <p className="text-muted-foreground">
                  Save your finalized schedule to your account and use it as a reference when
                  registering through UBC's official system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why It's Useful Section */}
        <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border animate-fade-in mb-6 sm:mb-8 hover-scale transition-all" style={{
          animationDelay: '0.6s'
        }}>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-foreground">Why CourseBuddy is Useful</h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">⏱️ Save Time</h3>
              <p className="text-muted-foreground">
                What used to take hours of manually checking course schedules and cross-referencing
                sections now takes minutes. Our intelligent system does the heavy lifting for you.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">🎯 Reduce Stress</h3>
              <p className="text-muted-foreground">
                No more worrying about course conflicts or missing prerequisites. Visual feedback
                and real-time validation give you confidence in your planning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">📈 Make Better Decisions</h3>
              <p className="text-muted-foreground">
                Access to instructor ratings and grade distributions helps you make informed
                choices about which sections to take.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">🤝 Plan Together</h3>
              <p className="text-muted-foreground">
                Share schedules with friends to coordinate classes, or with advisors to get
                feedback on your academic plan.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <div className="md:col-span-2 bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border animate-fade-in hover-scale transition-all" style={{
            animationDelay: '0.7s'
          }}>
            <h2 className="text-3xl font-semibold mb-4 text-foreground">The Developer</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Edward Jung</strong>, a UBC student who experienced
              firsthand the frustrations of course registration, created CourseBuddy as part of the
              COMM 196 course project.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              What started as a solution for Sauder students evolved into a comprehensive platform
              designed to help all UBC students navigate course planning with ease.
            </p>
            <p className="text-muted-foreground leading-relaxed">Edward's vision was to create a tool that combines powerful functionality with an intuitive interface - making schedule planning not just easier, but actually enjoyable.


              Edward is studying the Combined Major in Business and Computer Science (BUCS), and is keen on working on his full-stack engineering skills.

              He thanks you for stopping by, and hopes you find use in this tool.

            </p>
          </div>

          <div className="flex flex-col justify-center animate-fade-in" style={{
            animationDelay: '0.8s'
          }}>
            <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border hover-scale transition-all">
              <img src={eddieImage} alt="Edward Jung - Creator of CourseBuddy" className="w-full h-auto" />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-foreground">Edward Jung</h3>
                <p className="text-sm text-muted-foreground">Creator & Developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-secondary/50 rounded-lg p-4 sm:p-6 border-2 border-border animate-fade-in" style={{
          animationDelay: '0.9s'
        }}>
          <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
            ⚠️ Important Disclaimer
          </h2>
          <div className="space-y-3 text-foreground/80 leading-relaxed">
            <p>
              <strong>Mock Data:</strong> All data displayed on this site is mock data for demonstration purposes only.
              This prototype showcases what CourseBuddy would look like with real UBC course data.
              The courses, schedules, and prerequisites shown are sample data to illustrate
              the functionality and user experience of the platform.
            </p>
            <p>
              <strong>Prototype Status:</strong> CourseBuddy is currently a demonstration prototype and may contain buggy functions
              or incomplete features. This is a proof-of-concept to showcase the potential of an AI-powered course planning tool
              for UBC students.
            </p>
            <p>
              <strong>AI Development:</strong> We are actively working to improve the AI assistant's capabilities.
              Our goal is to provide the AI with comprehensive access to all course times, meeting patterns, locations,
              and instructor information to deliver the most accurate and helpful responses to student questions.
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>;
}
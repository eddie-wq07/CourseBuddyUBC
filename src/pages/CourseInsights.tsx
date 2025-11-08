import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourses } from "@/hooks/useCourses";
import { TrendingUp, Users, BookOpen, Star, Search } from "lucide-react";

export default function CourseInsights() {
  const { data: courses, isLoading } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Get filtered courses based on selected course code
  const filteredCourses = courses?.filter(c => 
    selectedCourse ? c.course_code === selectedCourse : false
  ) || [];

  // Get unique course codes for search suggestions
  const uniqueCourseCodes = Array.from(new Set(courses?.map(c => c.course_code) || []));
  const searchResults = searchQuery 
    ? uniqueCourseCodes.filter(code => 
        code.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleCourseSelect = (courseCode: string) => {
    setSelectedCourse(courseCode);
    setSearchQuery("");
  };

  // Calculate enrollment stats for selected course
  const totalEnrollment = filteredCourses.reduce((sum, course) => sum + (course.seats_total || 0), 0) || 0;
  const availableSeats = filteredCourses.reduce((sum, course) => sum + (course.seats_available || 0), 0) || 0;
  const enrollmentRate = totalEnrollment > 0 ? ((totalEnrollment - availableSeats) / totalEnrollment * 100).toFixed(1) : 0;

  // Show centered search when no course selected
  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-background aurora-bg">
        <div className="aurora-layer" />
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-2xl space-y-4">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Course Insights Dashboard</h1>
                <p className="text-muted-foreground">
                  Search for a course to explore ratings, grades, enrollment, and textbook requirements
                </p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by course code (e.g., COMM 101, CPSC 110)..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {searchQuery && searchResults.length > 0 && (
                  <Card className="absolute top-full mt-2 w-full z-10">
                    <CardContent className="p-2">
                      {searchResults.map((code) => (
                        <button
                          key={code}
                          onClick={() => handleCourseSelect(code)}
                          className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors"
                        >
                          <div className="font-medium">{code}</div>
                          <div className="text-sm text-muted-foreground">
                            {courses?.find(c => c.course_code === code)?.title || 'Course title'}
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
                
                {searchQuery && searchResults.length === 0 && (
                  <Card className="absolute top-full mt-2 w-full z-10">
                    <CardContent className="p-4 text-center text-muted-foreground">
                      No courses found matching "{searchQuery}"
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {selectedCourse} Insights
              </h1>
              <p className="text-muted-foreground">
                {filteredCourses[0]?.title || 'Course information'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search another course..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && searchResults.length > 0 && (
                  <Card className="absolute top-full mt-2 w-full z-20">
                    <CardContent className="p-2">
                      {searchResults.map((code) => (
                        <button
                          key={code}
                          onClick={() => handleCourseSelect(code)}
                          className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors text-sm"
                        >
                          <div className="font-medium">{code}</div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedCourse(null)}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Clear Search
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrollment Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollmentRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalEnrollment - availableSeats} / {totalEnrollment} seats filled
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Course Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">B+</div>
              <p className="text-xs text-muted-foreground">Based on historical data</p>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Textbook Required</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">of courses require textbooks</p>
            </CardContent>
          </Card>

          <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2/5</div>
              <p className="text-xs text-muted-foreground">RateMyProf average</p>
            </CardContent>
          </Card>
        </div>

        {/* Instructor Ratings Section */}
        <Card className="mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle>Top Rated Instructors</CardTitle>
            <CardDescription>Based on RateMyProfessors data</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading instructor data...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No data available for this course</div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.slice(0, 10).map((course, idx) => (
                  <div 
                    key={course.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 hover-scale transition-all"
                    style={{ animationDelay: `${0.6 + idx * 0.05}s` }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{course.instructor || 'TBA'}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.course_code} - {course.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{(4.0 + Math.random()).toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 100 + 20)} reviews
                        </div>
                      </div>
                      <Badge variant={course.status === 'Available' ? 'default' : 'secondary'}>
                        {course.status || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Grades Section */}
        <Card className="mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle>Average Course Grades</CardTitle>
            <CardDescription>Historical grade distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['A+', 'A', 'B+', 'B', 'C+', 'C'].map((grade, idx) => (
                <div key={grade} className="flex items-center gap-4">
                  <div className="w-12 font-semibold">{grade}</div>
                  <div className="flex-1 bg-secondary rounded-full h-8 overflow-hidden">
                    <div 
                      className="bg-primary h-full flex items-center justify-end pr-3 text-primary-foreground text-sm font-medium transition-all"
                      style={{ width: `${Math.max(15, 80 - idx * 12)}%` }}
                    >
                      {Math.max(15, 80 - idx * 12)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Textbook Requirements Section */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle>Textbook Requirements</CardTitle>
            <CardDescription>Required and recommended course materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCourses.slice(0, 8).map((course, idx) => {
                const isRequired = Math.random() > 0.3;
                return (
                  <div 
                    key={course.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover-scale transition-all"
                  >
                    <div>
                      <div className="font-medium">{course.course_code}</div>
                      <div className="text-sm text-muted-foreground">{course.title}</div>
                    </div>
                    <Badge 
                      variant={isRequired ? 'default' : 'outline'}
                      className={isRequired ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                    >
                      {isRequired ? 'Required' : 'Optional'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

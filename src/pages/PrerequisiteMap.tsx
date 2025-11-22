import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SavedSchedule {
  schedule_name: string;
  courses: string[];
}

// Mock data: Maps courses to what they unlock (reverse prerequisite tree)
const courseUnlocksData: Record<string, string[]> = {
  'CPSC 110': ['CPSC 121', 'CPSC 203', 'CPSC 210'],
  'CPSC 121': ['CPSC 210', 'CPSC 213', 'CPSC 221', 'CPSC 259', 'CPSC 261'],
  'CPSC 210': ['CPSC 213', 'CPSC 221', 'CPSC 310', 'CPSC 304', 'CPSC 311', 'CPSC 340'],
  'CPSC 213': ['CPSC 313', 'CPSC 317', 'CPSC 415', 'CPSC 416', 'CPSC 418'],
  'CPSC 221': ['CPSC 320', 'CPSC 322', 'CPSC 317', 'CPSC 420', 'CPSC 421'],
  'CPSC 310': ['CPSC 410', 'CPSC 436', 'CPSC 455', 'CPSC 490'],
  'CPSC 313': ['CPSC 416', 'CPSC 418', 'CPSC 513'],
  'CPSC 320': ['CPSC 420', 'CPSC 421', 'CPSC 425', 'CPSC 430', 'CPSC 490'],
  'CPSC 317': ['CPSC 416', 'CPSC 417', 'CPSC 434'],
  'CPSC 304': ['CPSC 404', 'CPSC 448'],
  'CPSC 311': ['CPSC 411', 'CPSC 420'],
  'CPSC 322': ['CPSC 422', 'CPSC 424', 'CPSC 425', 'CPSC 540'],
  'CPSC 340': ['CPSC 330', 'CPSC 440', 'CPSC 532', 'CPSC 540'],
  'CPSC 410': ['CPSC 509', 'CPSC 510'],
  'CPSC 416': ['CPSC 516', 'CPSC 538'],
  'CPSC 420': ['CPSC 520', 'CPSC 521'],
  'CPSC 421': ['CPSC 521', 'CPSC 522'],
  'CPSC 425': ['CPSC 524', 'CPSC 426'],
  'MATH 100': ['MATH 101', 'MATH 102', 'MATH 103', 'MATH 184'],
  'MATH 101': ['MATH 200', 'MATH 215', 'MATH 221', 'STAT 251', 'PHYS 157'],
  'MATH 200': ['MATH 300', 'MATH 301', 'MATH 400'],
  'MATH 221': ['MATH 223', 'MATH 307', 'MATH 321', 'CPSC 302'],
  'STAT 251': ['STAT 302', 'STAT 305', 'STAT 306', 'CPSC 340'],
  'PHYS 157': ['PHYS 158', 'PHYS 170', 'PHYS 257'],
  'ENGL 110': ['ENGL 111', 'ENGL 112', 'ENGL 220'],
  'ECON 101': ['ECON 102', 'ECON 201', 'ECON 301', 'COMM 295'],
  'ECON 102': ['ECON 202', 'ECON 302', 'COMM 296'],
};

const PrerequisiteMap = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<SavedSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  }, [navigate]);

  const fetchSchedules = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_schedules')
        .select('schedule_name, course_name')
        .eq('user_id', user.id);

      if (error) throw error;

      const scheduleMap = new Map<string, string[]>();
      data?.forEach((item) => {
        const courses = scheduleMap.get(item.schedule_name) || [];
        if (!courses.includes(item.course_name)) {
          courses.push(item.course_name);
        }
        scheduleMap.set(item.schedule_name, courses);
      });

      const scheduleList = Array.from(scheduleMap.entries()).map(([name, courses]) => ({
        schedule_name: name,
        courses,
      }));

      setSchedules(scheduleList);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchSchedules();
  }, [checkAuth, fetchSchedules]);

  const buildPrerequisiteTree = useCallback((courses: string[]) => {
    const nodeMap = new Map<string, Node>();
    const edgeList: Edge[] = [];
    const visited = new Set<string>();

    const addNode = (courseCode: string, level: number, isUserCourse: boolean = false) => {
      if (visited.has(courseCode)) return;
      visited.add(courseCode);

      const unlockedCourses = courseUnlocksData[courseCode] || [];

      // Add current node
      if (!nodeMap.has(courseCode)) {
        nodeMap.set(courseCode, {
          id: courseCode,
          data: { label: courseCode },
          position: { x: 0, y: 0 }, // Will be calculated after
          style: {
            background: isUserCourse ? '#3b82f6' : '#64748b',
            color: 'white',
            border: '2px solid #1e293b',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          },
          className: 'hover:scale-110 hover:shadow-lg',
        });
      }

      // Recursively add courses that are unlocked (going downward)
      if (level < 5) {
        unlockedCourses.forEach((unlockedCourse) => {
          addNode(unlockedCourse, level + 1, false);
          edgeList.push({
            id: `${courseCode}-${unlockedCourse}`,
            source: courseCode,
            target: unlockedCourse,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#64748b', strokeWidth: 2 },
          });
        });
      }
    };

    // Start from selected courses (user's courses are at the top)
    courses.forEach((course) => addNode(course, 0, true));

    // Calculate positions using a tree layout
    const nodesArray = Array.from(nodeMap.values());
    const layoutNodes = calculateTreeLayout(nodesArray, edgeList);

    setNodes(layoutNodes);
    setEdges(edgeList);
  }, [setNodes, setEdges]);

  const calculateTreeLayout = (nodes: Node[], edges: Edge[]): Node[] => {
    const levelMap = new Map<string, number>();
    const childrenMap = new Map<string, string[]>();
    const parentMap = new Map<string, string[]>();

    // Build children and parent maps
    edges.forEach((edge) => {
      const children = childrenMap.get(edge.source) || [];
      children.push(edge.target);
      childrenMap.set(edge.source, children);

      const parents = parentMap.get(edge.target) || [];
      parents.push(edge.source);
      parentMap.set(edge.target, parents);
    });

    // Calculate levels (BFS from root nodes)
    const queue: { id: string; level: number }[] = [];
    nodes.forEach((node) => {
      const hasParent = parentMap.has(node.id);
      if (!hasParent) {
        // Root node (user's course)
        levelMap.set(node.id, 0);
        queue.push({ id: node.id, level: 0 });
      }
    });

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      const children = childrenMap.get(id) || [];
      children.forEach((childId) => {
        const currentLevel = levelMap.get(childId);
        if (currentLevel === undefined || level + 1 > currentLevel) {
          levelMap.set(childId, level + 1);
          queue.push({ id: childId, level: level + 1 });
        }
      });
    }

    // Group nodes by level
    const levelGroups = new Map<number, string[]>();
    const maxLevel = Math.max(...Array.from(levelMap.values()));
    levelMap.forEach((level, id) => {
      const group = levelGroups.get(level) || [];
      group.push(id);
      levelGroups.set(level, group);
    });

    // Position nodes - wider spacing for more nodes
    const positionedNodes = nodes.map((node) => {
      const level = levelMap.get(node.id) || 0;
      const group = levelGroups.get(level) || [];
      const indexInLevel = group.indexOf(node.id);
      const spacing = 180;
      const levelSpacing = 120;

      return {
        ...node,
        position: {
          x: indexInLevel * spacing - (group.length * spacing) / 2,
          y: level * levelSpacing,
        },
      };
    });

    // Add graduation message node at the bottom
    const graduationY = (maxLevel + 1) * 120 + 60;
    positionedNodes.push({
      id: 'graduation',
      data: {
        label: '🎓 Congratulations! You Graduate! 🎓'
      },
      position: { x: -200, y: graduationY },
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: '3px solid #065f46',
        borderRadius: '12px',
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        width: '400px',
        textAlign: 'center',
      },
      draggable: false,
      selectable: false,
    });

    return positionedNodes;
  };

  const handleScheduleSelect = (scheduleName: string) => {
    setSelectedSchedule(scheduleName);
    const schedule = schedules.find((s) => s.schedule_name === scheduleName);
    if (schedule) {
      buildPrerequisiteTree(schedule.courses);
      toast.success(`Loaded prerequisite map for ${scheduleName}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 sm:py-8">
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Course Progression Map</CardTitle>
            <CardDescription className="text-sm">
              Select a saved schedule to see your prerequisite pathway. Your completed courses (blue) are shown at the top.
              Locked courses (gray) flow downward - you must complete the courses above them to unlock them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Select value={selectedSchedule} onValueChange={handleScheduleSelect}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : schedules.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      No saved schedules found
                    </div>
                  ) : (
                    schedules.map((schedule) => (
                      <SelectItem key={schedule.schedule_name} value={schedule.schedule_name}>
                        {schedule.schedule_name} ({schedule.courses.length} courses)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedSchedule && (
                <Button variant="outline" onClick={() => setSelectedSchedule('')} className="w-full sm:w-auto">
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-[400px] sm:h-[500px] md:h-[600px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            minZoom={0.1}
            maxZoom={2}
          >
            <Background />
            <Controls />
            <Panel position="top-right" className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary" />
                  <span>Completed Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted-foreground" />
                  <span>Locked Courses</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </Card>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Use mouse wheel to zoom, click and drag to pan. The tree flows downward from your completed courses (top) through up to 5 levels of locked courses below.
            Each locked course requires you to complete the courses above it before you can take it.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrerequisiteMap;

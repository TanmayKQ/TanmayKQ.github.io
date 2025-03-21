import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Timer } from '@/components/Timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase, Subject as DbSubject } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Subject } from '@/lib/types';
import { 
  CheckCircle, 
  PlayCircle, 
  Clock, 
  BrainCircuit,
  Coffee,
  BarChart3
} from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const Focus = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timerDuration, setTimerDuration] = useState(FOCUS_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [studyStats, setStudyStats] = useState({
    todayMinutes: 0,
    todaySessions: 0,
    weekMinutes: 0
  });

  // Load subjects from database
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedSubjects = data.map((s: DbSubject) => ({
            id: s.id,
            name: s.name,
            priority: s.priority as 'high' | 'medium' | 'low',
            color: s.color,
            totalHours: s.total_hours,
            completedHours: s.completed_hours
          }));
          
          setSubjects(mappedSubjects);
          
          // If no subject is selected, select the first one
          if (!selectedSubject && mappedSubjects.length > 0) {
            setSelectedSubject(mappedSubjects[0]);
          }
        }

        // Fetch today's study stats
        await fetchStudyStats();
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: "Failed to load subjects",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  const fetchStudyStats = async () => {
    if (!user) return;

    try {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get a week ago
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Query for study sessions
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', weekAgo.toISOString());

      if (error) throw error;

      if (data) {
        // Calculate today's stats
        const todaySessions = data.filter(session => 
          new Date(session.start_time) >= today
        );
        
        const todayMinutes = todaySessions.reduce((acc, session) => {
          const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
          return acc + duration / (1000 * 60);
        }, 0);

        // Calculate week stats
        const weekMinutes = data.reduce((acc, session) => {
          const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
          return acc + duration / (1000 * 60);
        }, 0);

        setStudyStats({
          todayMinutes: Math.round(todayMinutes),
          todaySessions: todaySessions.length,
          weekMinutes: Math.round(weekMinutes)
        });
      }
    } catch (error) {
      console.error('Error fetching study stats:', error);
    }
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    
    // Reset timer when changing subjects
    setTimerMode('focus');
    setTimerDuration(FOCUS_TIME);
    setTimerRunning(false);
  };

  const handleTimerComplete = async () => {
    try {
      // Handle timer completion based on mode
      if (timerMode === 'focus') {
        // Record completed focus session
        if (selectedSubject) {
          const now = new Date();
          const startTime = new Date(now.getTime() - (FOCUS_TIME * 1000));
          
          // Record the study session
          const { error: sessionError } = await supabase
            .from('study_sessions')
            .insert({
              user_id: user?.id,
              subject_id: selectedSubject.id,
              start_time: startTime.toISOString(),
              end_time: now.toISOString(),
              focus_score: Math.floor(Math.random() * 40) + 60 // Mock score between 60-100
            });
            
          if (sessionError) throw sessionError;
          
          // Update subject's completed hours
          const updatedSubject = { ...selectedSubject };
          updatedSubject.completedHours += (FOCUS_TIME / 3600); // Convert seconds to hours
          
          const { error: subjectError } = await supabase
            .from('subjects')
            .update({ completed_hours: updatedSubject.completedHours })
            .eq('id', selectedSubject.id);
            
          if (subjectError) throw subjectError;
          
          // Update local state
          setSubjects(subjects.map(s => 
            s.id === selectedSubject.id ? updatedSubject : s
          ));
          setSelectedSubject(updatedSubject);
          
          // Show toast
          toast({
            title: "Focus session completed",
            description: `Great job! You've studied ${selectedSubject.name} for 25 minutes.`,
          });

          // Fetch updated stats
          await fetchStudyStats();
        }

        // Increment pomodoro count
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);
        
        // Decide on break type
        if (newCount % 4 === 0) {
          // After 4 pomodoros, take a long break
          setTimerMode('longBreak');
          setTimerDuration(LONG_BREAK);
          toast({
            title: "Time for a long break!",
            description: "Take 15 minutes to rest and recharge.",
          });
        } else {
          // Otherwise take a short break
          setTimerMode('shortBreak');
          setTimerDuration(SHORT_BREAK);
          toast({
            title: "Time for a short break!",
            description: "Take 5 minutes to rest before the next focus session.",
          });
        }
      } else {
        // Break is over, back to focus mode
        setTimerMode('focus');
        setTimerDuration(FOCUS_TIME);
        toast({
          title: "Break complete",
          description: "Ready for your next focus session?",
        });
      }
    } catch (error) {
      console.error('Error completing timer:', error);
      toast({
        title: "Failed to record session",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Focus Mode</h1>
          <p className="text-muted-foreground">
            Use the Pomodoro Technique to maximize your study efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subject selector */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5" />
                Your Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subjects found. Please create a study plan first.
                </p>
              ) : (
                subjects.map(subject => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject?.id === subject.id ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3 mb-2"
                    onClick={() => handleSubjectSelect(subject)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(subject.completedHours * 10) / 10} / {subject.totalHours} hours
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="ml-2 capitalize"
                    >
                      {subject.priority}
                    </Badge>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Timer */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                {timerMode === 'focus' ? (
                  <>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Focus Session
                  </>
                ) : (
                  <>
                    <Coffee className="mr-2 h-5 w-5" />
                    {timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {selectedSubject ? (
                <>
                  <p className="text-muted-foreground mb-4">
                    {timerMode === 'focus' 
                      ? `Currently studying: ${selectedSubject.name}` 
                      : 'Take a moment to rest and recharge'
                    }
                  </p>
                  
                  <Timer 
                    initialDuration={timerDuration} 
                    running={timerRunning}
                    onEnd={handleTimerComplete}
                  />
                  
                  <div className="flex items-center mt-6 space-x-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center">
                            <Badge variant="outline" className="py-2 px-3">
                              <Clock className="h-4 w-4 mr-1" />
                              {pomodoroCount}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">Sessions</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Completed focus sessions
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Separator orientation="vertical" className="h-10" />
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center">
                            <Badge variant="outline" className="py-2 px-3">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              {studyStats.todayMinutes}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">Min Today</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Minutes studied today
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Separator orientation="vertical" className="h-10" />
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center">
                            <Badge variant="outline" className="py-2 px-3">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {studyStats.todaySessions}
                            </Badge>
                            <span className="text-xs text-muted-foreground mt-1">Today</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Sessions completed today
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Please select a subject to start studying.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;

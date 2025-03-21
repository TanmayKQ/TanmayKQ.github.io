
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Timer } from '@/components/Timer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PomodoroSettings } from '@/lib/types';

const Focus = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentSubject, setCurrentSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4
  });

  useEffect(() => {
    if (user) {
      fetchSubjectsAndSettings();
    }
  }, [user]);

  const fetchSubjectsAndSettings = async () => {
    setIsLoading(true);
    try {
      // Fetch subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user?.id);

      if (subjectsError) throw subjectsError;

      // Fetch user preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (subjectsData && subjectsData.length > 0) {
        setSubjects(subjectsData);
        setCurrentSubject(subjectsData[0].id);
      } else {
        // No subjects found
        toast({
          title: "No subjects found",
          description: "Please create a study plan first",
          variant: "destructive"
        });
      }

      // If user has pomodoro settings, use them
      if (prefsData?.pomodoro_settings && 
          typeof prefsData.pomodoro_settings === 'object' &&
          !Array.isArray(prefsData.pomodoro_settings)) {
          
        const settings = prefsData.pomodoro_settings as Record<string, unknown>;
        
        // Create a properly typed settings object
        const typedSettings: PomodoroSettings = {
          focusTime: typeof settings.focusTime === 'number' ? settings.focusTime : 25,
          shortBreakTime: typeof settings.shortBreakTime === 'number' ? settings.shortBreakTime : 5,
          longBreakTime: typeof settings.longBreakTime === 'number' ? settings.longBreakTime : 15,
          longBreakInterval: typeof settings.longBreakInterval === 'number' ? settings.longBreakInterval : 4
        };
        
        setPomodoroSettings(typedSettings);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Failed to load data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimerStart = () => {
    setTimerRunning(true);
    setTimerEnded(false);
    setSessionStartTime(new Date());
    
    toast({
      title: "Focus session started",
      description: `Stay focused for the next ${pomodoroSettings.focusTime} minutes!`
    });
  };

  const handleTimerEnd = async () => {
    if (!sessionStartTime || !currentSubject) return;

    setTimerRunning(false);
    setTimerEnded(true);
    
    try {
      // Get the subject that was being studied
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', currentSubject)
        .single();
      
      if (subjectError) throw subjectError;
      
      // Record the study session
      const now = new Date();
      const focusMinutes = pomodoroSettings.focusTime;
      const startTime = sessionStartTime;
      const endTime = now;
      
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user?.id,
          subject_id: currentSubject,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          focus_score: 95 // Mock focus score for now
        });
      
      if (sessionError) throw sessionError;
      
      // Update subject's completed hours
      const completedHours = subjectData.completed_hours + (focusMinutes / 60);
      
      const { error: updateError } = await supabase
        .from('subjects')
        .update({ completed_hours: completedHours })
        .eq('id', currentSubject);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Session completed!",
        description: `You've studied ${subjectData.name} for ${focusMinutes} minutes.`
      });
    } catch (error) {
      console.error('Error recording session:', error);
      toast({
        title: "Failed to record session",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (subjects.length === 0) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle>Focus Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You haven't created any subjects yet. Please create a study plan first.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Focus Mode</h1>
        <p className="text-muted-foreground mb-8">
          Stay focused and track your study sessions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Subject</label>
                  <Select
                    value={currentSubject}
                    onValueChange={setCurrentSubject}
                    disabled={timerRunning}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center">
                            <div 
                              className="h-3 w-3 rounded-full mr-2" 
                              style={{ backgroundColor: subject.color }} 
                            />
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleTimerStart}
                  disabled={timerRunning || !currentSubject}
                >
                  Start Focus Session
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pomodoro Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Focus Time</label>
                    <p className="text-2xl font-bold">{pomodoroSettings.focusTime} min</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Short Break</label>
                    <p className="text-2xl font-bold">{pomodoroSettings.shortBreakTime} min</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Long Break</label>
                    <p className="text-2xl font-bold">{pomodoroSettings.longBreakTime} min</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Interval</label>
                    <p className="text-2xl font-bold">{pomodoroSettings.longBreakInterval} sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-center">Focus Timer</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                <Timer 
                  duration={pomodoroSettings.focusTime * 60} 
                  running={timerRunning}
                  onEnd={handleTimerEnd}
                />
                
                {timerEnded && (
                  <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">Session Complete!</h2>
                    <p className="mb-4">Great job staying focused. Take a short break before your next session.</p>
                    <Button onClick={handleTimerStart} className="mt-2">
                      Start Another Session
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-center">
                {timerRunning && (
                  <Button 
                    variant="destructive"
                    onClick={() => setTimerRunning(false)}
                  >
                    End Session Early
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;

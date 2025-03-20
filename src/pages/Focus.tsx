
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { PomodoroSettings, Subject } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { supabase, Subject as DbSubject, UserPreference } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Focus = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<string>('');
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
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

      // Fetch pomodoro settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      // Update state with fetched data
      if (subjectsData && subjectsData.length > 0) {
        const formattedSubjects = subjectsData.map((s: DbSubject) => ({
          id: s.id,
          name: s.name,
          priority: s.priority as 'high' | 'medium' | 'low',
          color: s.color,
          totalHours: s.total_hours,
          completedHours: s.completed_hours
        }));
        setSubjects(formattedSubjects);
        setActiveSubjectId(formattedSubjects[0].id);
      }

      if (settingsData?.pomodoro_settings) {
        setPomodoroSettings(settingsData.pomodoro_settings);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Failed to load data",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeSubject = subjects.find(s => s.id === activeSubjectId);

  const handleTimerComplete = async () => {
    if (!user || !activeSubjectId) return;
    
    try {
      // Record the study session
      const now = new Date();
      const focusTime = pomodoroSettings.focusTime;
      const startTime = new Date(now.getTime() - focusTime * 60 * 1000);
      
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          subject_id: activeSubjectId,
          start_time: startTime.toISOString(),
          end_time: now.toISOString(),
          focus_score: Math.floor(Math.random() * 100) // Mock score for demo
        });
        
      if (sessionError) throw sessionError;
      
      // Update subject completed hours
      const subject = subjects.find(s => s.id === activeSubjectId);
      if (subject) {
        const updatedHours = subject.completedHours + (focusTime / 60);
        
        const { error: updateError } = await supabase
          .from('subjects')
          .update({ completed_hours: updatedHours })
          .eq('id', activeSubjectId);
          
        if (updateError) throw updateError;
        
        // Update local state
        setSubjects(subjects.map(s => 
          s.id === activeSubjectId 
            ? {...s, completedHours: updatedHours} 
            : s
        ));
      }
      
      toast({
        title: "Session completed",
        description: `Great job! You've studied for ${focusTime} minutes.`,
      });
    } catch (error) {
      console.error('Error recording session:', error);
      toast({
        title: "Failed to record session",
        description: "Your progress might not be saved.",
        variant: "destructive"
      });
    }
  };

  const updateSetting = async (setting: keyof PomodoroSettings, value: number) => {
    const updatedSettings = {
      ...pomodoroSettings,
      [setting]: value,
    };
    
    setPomodoroSettings(updatedSettings);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            pomodoro_settings: updatedSettings
          }, { onConflict: 'user_id' });
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (subjects.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">No Subjects Found</h1>
          <p className="text-muted-foreground mb-8">
            You need to create a study plan before you can use the Focus Mode.
          </p>
          <Button asChild>
            <Link to="/dashboard">Create Study Plan</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Focus Mode</h1>
          <p className="text-muted-foreground">
            Eliminate distractions and concentrate on your studies with the Pomodoro technique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Subject selector */}
            <Card className="shadow-elevation-low">
              <CardContent className="pt-6">
                <Label htmlFor="subject-select" className="mb-2 block">Select Subject</Label>
                <Select value={activeSubjectId} onValueChange={setActiveSubjectId}>
                  <SelectTrigger id="subject-select" className="w-full">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
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
              </CardContent>
            </Card>

            {/* Timer */}
            <Timer 
              activeSubject={activeSubject} 
              settings={pomodoroSettings} 
              onComplete={handleTimerComplete} 
            />
          </div>

          <div className="space-y-6">
            {/* Pomodoro settings */}
            <Card className="shadow-elevation-low">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Timer Settings</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="focus-time" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Focus Time</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.focusTime} min</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={5}
                          max={60}
                          step={5}
                          value={[pomodoroSettings.focusTime]}
                          onValueChange={(values) => updateSetting('focusTime', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="short-break" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Short Break</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.shortBreakTime} min</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={1}
                          max={15}
                          step={1}
                          value={[pomodoroSettings.shortBreakTime]}
                          onValueChange={(values) => updateSetting('shortBreakTime', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="long-break" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Long Break</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.longBreakTime} min</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={10}
                          max={30}
                          step={5}
                          value={[pomodoroSettings.longBreakTime]}
                          onValueChange={(values) => updateSetting('longBreakTime', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="interval" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Sessions Before Long Break</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.longBreakInterval}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={2}
                          max={8}
                          step={1}
                          value={[pomodoroSettings.longBreakInterval]}
                          onValueChange={(values) => updateSetting('longBreakInterval', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Focus tips */}
            <Card className="shadow-elevation-low">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Focus Tips</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <p>Remove distractions by turning off notifications and placing your phone out of sight.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <p>Stay hydrated and keep a bottle of water nearby during your study sessions.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <p>Use your breaks to move around and stretch to maintain energy levels.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <p>After completing a focus session, write down what you accomplished to track progress.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;

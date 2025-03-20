
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { StudyPlanForm } from '@/components/StudyPlanForm';
import { ProgressView } from '@/components/ProgressView';
import { Subject, TimeBlock } from '@/lib/types';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dailyHours, setDailyHours] = useState(4);
  const [productivityRatings, setProductivityRatings] = useState({
    morning: 75,
    afternoon: 60,
    evening: 85,
    night: 40
  });
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [studyPlanCreated, setStudyPlanCreated] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing study plan data
  useEffect(() => {
    if (user) {
      fetchStudyData();
    }
  }, [user]);

  const fetchStudyData = async () => {
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

      if (prefsError && prefsError.code !== 'PGRST116') throw prefsError;

      // Fetch study sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user?.id);

      if (sessionsError) throw sessionsError;

      // Update state with fetched data
      if (subjectsData && subjectsData.length > 0) {
        setSubjects(subjectsData.map(s => ({
          id: s.id,
          name: s.name,
          priority: s.priority,
          color: s.color,
          totalHours: s.total_hours,
          completedHours: s.completed_hours
        })));
        setStudyPlanCreated(true);
      }

      if (prefsData) {
        setDailyHours(prefsData.daily_goal_hours || 4);
        setProductivityRatings(prefsData.productive_times || {
          morning: 75,
          afternoon: 60,
          evening: 85,
          night: 40
        });
      }

      if (sessionsData) {
        setCompletedSessions(sessionsData.length);
        const totalMinutes = sessionsData.reduce((acc, session) => {
          const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
          return acc + duration / (1000 * 60);
        }, 0);
        setTotalStudyTime(Math.round(totalMinutes));
      }

      // Calculate streak (simplified version)
      if (sessionsData && sessionsData.length > 0) {
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);
        
        const studiedToday = sessionsData.some(session => {
          const sessionDate = new Date(session.start_time).setHours(0, 0, 0, 0);
          return sessionDate === today;
        });
        
        const studiedYesterday = sessionsData.some(session => {
          const sessionDate = new Date(session.start_time).setHours(0, 0, 0, 0);
          return sessionDate === yesterday;
        });
        
        setStreak(studiedToday ? (studiedYesterday ? 2 : 1) : 0);
      }
    } catch (error) {
      console.error('Error fetching study data:', error);
      toast({
        title: "Failed to load data",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (
    subjects: Subject[], 
    dailyHours: number, 
    productivityRatings: any
  ) => {
    if (!user) return;
    
    try {
      // Start by saving user preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          daily_goal_hours: dailyHours,
          productive_times: productivityRatings
        }, { onConflict: 'user_id' });

      if (prefsError) throw prefsError;

      // Save subjects (first delete existing ones)
      const { error: deleteError } = await supabase
        .from('subjects')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new subjects
      const subjectsToInsert = subjects.map(s => ({
        id: s.id,
        user_id: user.id,
        name: s.name,
        priority: s.priority,
        color: s.color,
        total_hours: s.totalHours,
        completed_hours: s.completedHours || 0
      }));

      const { error: subjectsError } = await supabase
        .from('subjects')
        .insert(subjectsToInsert);

      if (subjectsError) throw subjectsError;

      // Update local state
      setSubjects(subjects);
      setDailyHours(dailyHours);
      setProductivityRatings(productivityRatings);
      setStudyPlanCreated(true);
      
      toast({
        title: "Study Plan Created",
        description: "Your personalized study plan is ready!",
      });
      
      // Initialize progress metrics
      setCompletedSessions(0);
      setTotalStudyTime(0);
      setStreak(0);
    } catch (error) {
      console.error('Error saving study plan:', error);
      toast({
        title: "Failed to save study plan",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteSession = async (subjectId: string) => {
    if (!user) return;
    
    // Find the subject
    const subjectIndex = subjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) return;
    
    try {
      // Update the subject's completed hours
      const updatedSubjects = [...subjects];
      updatedSubjects[subjectIndex] = {
        ...updatedSubjects[subjectIndex],
        completedHours: updatedSubjects[subjectIndex].completedHours + 0.5
      };
      
      // Update in database
      const { error: updateError } = await supabase
        .from('subjects')
        .update({ completed_hours: updatedSubjects[subjectIndex].completedHours })
        .eq('id', subjectId);
        
      if (updateError) throw updateError;
      
      // Record the study session
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          subject_id: subjectId,
          start_time: thirtyMinutesAgo.toISOString(),
          end_time: now.toISOString(),
          focus_score: Math.floor(Math.random() * 100) // Mock score for demo
        });
        
      if (sessionError) throw sessionError;
      
      // Update local state
      setSubjects(updatedSubjects);
      setCompletedSessions(prev => prev + 1);
      setTotalStudyTime(prev => prev + 30); // Add 30 minutes
      
      // In a real app, this would check for consecutive days
      setStreak(prev => prev + 1);
      
      toast({
        title: "Session Completed",
        description: `Great job! You've studied ${updatedSubjects[subjectIndex].name} for 30 minutes.`,
      });
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Failed to record session",
        description: "Please try again later.",
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Your Study Dashboard</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your personalized study plan.
          </p>
        </div>
        
        <Tabs defaultValue={studyPlanCreated ? "progress" : "create"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">Create Plan</TabsTrigger>
            <TabsTrigger value="progress" disabled={!studyPlanCreated}>
              View Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-0">
            <StudyPlanForm onSubmit={handleFormSubmit} initialSubjects={subjects} initialDailyHours={dailyHours} initialProductivityRatings={productivityRatings} />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            {studyPlanCreated && (
              <ProgressView 
                subjects={subjects}
                completedSessions={completedSessions}
                totalStudyTime={totalStudyTime}
                streak={streak}
                onCompleteSession={handleCompleteSession}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;

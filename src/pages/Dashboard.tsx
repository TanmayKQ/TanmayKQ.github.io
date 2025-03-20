
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { StudyPlanForm } from '@/components/StudyPlanForm';
import { ProgressView } from '@/components/ProgressView';
import { Subject } from '@/lib/types';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dailyHours, setDailyHours] = useState(4);
  const [productivityRatings, setProductivityRatings] = useState({});
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [studyPlanCreated, setStudyPlanCreated] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleFormSubmit = (
    subjects: Subject[], 
    dailyHours: number, 
    productivityRatings: any
  ) => {
    setSubjects(subjects);
    setDailyHours(dailyHours);
    setProductivityRatings(productivityRatings);
    setStudyPlanCreated(true);
    
    // In a real app, this would save to a database and generate a more complex plan
    
    toast({
      title: "Study Plan Created",
      description: "Your personalized study plan is ready!",
    });
    
    // Simulate some data for the progress view
    setCompletedSessions(0);
    setTotalStudyTime(0);
    setStreak(0);
  };

  const handleCompleteSession = (subjectId: string) => {
    // Find the subject
    const subjectIndex = subjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) return;
    
    // Update the subject
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex] = {
      ...updatedSubjects[subjectIndex],
      completedHours: updatedSubjects[subjectIndex].completedHours + 0.5
    };
    
    setSubjects(updatedSubjects);
    setCompletedSessions(prev => prev + 1);
    setTotalStudyTime(prev => prev + 30); // Add 30 minutes
    setStreak(1); // In a real app, this would check for consecutive days
    
    toast({
      title: "Session Completed",
      description: `Great job! You've studied ${updatedSubjects[subjectIndex].name} for 30 minutes.`,
    });
  };

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
            <StudyPlanForm onSubmit={handleFormSubmit} />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            {studyPlanCreated && (
              <ProgressView 
                subjects={subjects}
                completedSessions={completedSessions}
                totalStudyTime={totalStudyTime}
                streak={streak}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;

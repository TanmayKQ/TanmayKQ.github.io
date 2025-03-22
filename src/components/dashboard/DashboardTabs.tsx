
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { StudyPlanForm } from '@/components/StudyPlanForm';
import { ProgressView } from '@/components/ProgressView';
import { Subject } from '@/lib/types';

interface DashboardTabsProps {
  studyPlanCreated: boolean;
  subjects: Subject[];
  dailyHours: number;
  productivityRatings: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  completedSessions: number;
  totalStudyTime: number;
  streak: number;
  onFormSubmit: (subjects: Subject[], dailyHours: number, productivityRatings: any) => void;
  onCompleteSession: (subjectId: string) => void;
  onResetPlan?: () => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  studyPlanCreated,
  subjects,
  dailyHours,
  productivityRatings,
  completedSessions,
  totalStudyTime,
  streak,
  onFormSubmit,
  onCompleteSession,
  onResetPlan
}) => {
  return (
    <Tabs defaultValue={studyPlanCreated ? "progress" : "create"} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="create">Create Plan</TabsTrigger>
        <TabsTrigger value="progress" disabled={!studyPlanCreated}>
          View Progress
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="create" className="mt-0">
        <StudyPlanForm 
          onSubmit={onFormSubmit} 
          initialSubjects={subjects} 
          initialDailyHours={dailyHours} 
          initialProductivityRatings={productivityRatings} 
        />
      </TabsContent>
      
      <TabsContent value="progress" className="mt-0">
        {studyPlanCreated && (
          <ProgressView 
            subjects={subjects}
            completedSessions={completedSessions}
            totalStudyTime={totalStudyTime}
            streak={streak}
            productivityRatings={productivityRatings}
            dailyHours={dailyHours}
            onCompleteSession={onCompleteSession}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

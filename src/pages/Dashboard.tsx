
import React from 'react';
import { Layout } from '@/components/Layout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { useStudyData } from '@/hooks/useStudyData';

const Dashboard = () => {
  const {
    subjects,
    dailyHours,
    productivityRatings,
    completedSessions,
    totalStudyTime,
    studyPlanCreated,
    streak,
    isLoading,
    handleFormSubmit,
    handleCompleteSession,
    resetStudyPlan
  } = useStudyData();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <DashboardHeader isLoading={isLoading} />
        
        {!isLoading && (
          <DashboardTabs
            studyPlanCreated={studyPlanCreated}
            subjects={subjects}
            dailyHours={dailyHours}
            productivityRatings={productivityRatings}
            completedSessions={completedSessions}
            totalStudyTime={totalStudyTime}
            streak={streak}
            onFormSubmit={handleFormSubmit}
            onCompleteSession={handleCompleteSession}
            onResetPlan={resetStudyPlan}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;


import React from 'react';

interface DashboardHeaderProps {
  isLoading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Your Study Dashboard</h1>
      <p className="text-muted-foreground">
        Create, manage, and track your personalized study plan.
      </p>
    </div>
  );
};

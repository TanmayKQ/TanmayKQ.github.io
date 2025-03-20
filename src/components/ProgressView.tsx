
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Subject, TimeBlock } from '@/lib/types';
import { CheckCircle2, Clock, BarChart3, Calendar } from 'lucide-react';

interface ProgressViewProps {
  subjects: Subject[];
  completedSessions: number;
  totalStudyTime: number;
  streak: number;
  timeBlocks?: TimeBlock[];
}

export function ProgressView({ subjects, completedSessions, totalStudyTime, streak }: ProgressViewProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate overall completion percentage
  const totalHours = subjects.reduce((acc, subject) => acc + subject.totalHours, 0);
  const completedHours = subjects.reduce((acc, subject) => acc + subject.completedHours, 0);
  const overallCompletion = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-elevation-low">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Study Time</p>
                <h2 className="text-3xl font-semibold">{formatTime(totalStudyTime)}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-elevation-low">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions Completed</p>
                <h2 className="text-3xl font-semibold">{completedSessions}</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-elevation-low">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <h2 className="text-3xl font-semibold">{overallCompletion}%</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-elevation-low">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <h2 className="text-3xl font-semibold">{streak} days</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-elevation-low">
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const percentage = subject.totalHours > 0 
                ? Math.round((subject.completedHours / subject.totalHours) * 100) 
                : 0;
              
              return (
                <div key={subject.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 mr-2 rounded-full" 
                        style={{ backgroundColor: subject.color }} 
                      />
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {subject.completedHours}/{subject.totalHours} hours ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: subject.color
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Subject } from '@/lib/types';
import { Clock, Award, BookOpen } from 'lucide-react';
import { StudyTimetable } from './study-plan/StudyTimetable';

interface ProgressViewProps {
  subjects: Subject[];
  completedSessions: number;
  totalStudyTime: number;
  streak: number;
  productivityRatings: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  dailyHours: number;
  onCompleteSession: (subjectId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  subjects,
  completedSessions,
  totalStudyTime,
  streak,
  productivityRatings,
  dailyHours,
  onCompleteSession
}) => {
  // Calculate total progress
  const totalHours = subjects.reduce((acc, subject) => acc + subject.totalHours, 0);
  const completedHours = subjects.reduce((acc, subject) => acc + subject.completedHours, 0);
  const overallProgress = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
            <p className="text-xs text-muted-foreground mt-1">Total study time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</div>
            <p className="text-xs text-muted-foreground mt-1">Current streak</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {subjects.map(subject => (
          <Card key={subject.id}>
            <CardContent className="pt-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div style={{ borderLeft: `4px solid ${subject.color}`, paddingLeft: '0.75rem' }}>
                  <h4 className="font-semibold">{subject.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Priority: {subject.priority}
                  </p>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{subject.completedHours}/{subject.totalHours} hours</span>
                  </div>
                  <Progress value={(subject.completedHours / subject.totalHours) * 100} className="h-2" />
                </div>
              </div>
              
              <div className="md:w-48 flex justify-start md:justify-end mt-4 md:mt-0">
                <button
                  onClick={() => onCompleteSession(subject.id)}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Complete 30m Session
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <StudyTimetable 
        subjects={subjects}
        productivityRatings={productivityRatings}
        dailyHours={dailyHours}
      />
    </div>
  );
};

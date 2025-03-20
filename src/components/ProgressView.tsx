
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subject, TimeBlock } from '@/lib/types';
import { CheckCircle2, Clock, BarChart3, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface ProgressViewProps {
  subjects: Subject[];
  completedSessions: number;
  totalStudyTime: number;
  streak: number;
  timeBlocks?: TimeBlock[];
  onCompleteSession?: (subjectId: string) => void;
}

export function ProgressView({ subjects, completedSessions, totalStudyTime, streak, onCompleteSession }: ProgressViewProps) {
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
    <div className="space-y-8 animate-fade-in">
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subject Progress</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/focus" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Start Study Session</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" 
                        style={{ 
                          "--progress-background": subject.color 
                        } as React.CSSProperties} 
                      />
                    </div>
                    {onCompleteSession && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="whitespace-nowrap"
                        onClick={() => onCompleteSession(subject.id)}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> +30 min
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            {completedHours} of {totalHours} total hours completed
          </p>
          <Progress value={overallCompletion} className="w-1/3 h-2" />
        </CardFooter>
      </Card>
    </div>
  );
}

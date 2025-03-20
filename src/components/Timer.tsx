
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { PomodoroSettings, Subject } from '@/lib/types';

interface TimerProps {
  activeSubject?: Subject;
  settings: PomodoroSettings;
  onComplete: () => void;
}

type TimerState = 'focus' | 'shortBreak' | 'longBreak';

export function Timer({ activeSubject, settings, onComplete }: TimerProps) {
  const [timerState, setTimerState] = useState<TimerState>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Get the appropriate time based on the current timer state
  const getTimeForState = (state: TimerState) => {
    switch (state) {
      case 'focus':
        return settings.focusTime * 60;
      case 'shortBreak':
        return settings.shortBreakTime * 60;
      case 'longBreak':
        return settings.longBreakTime * 60;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerLabel = () => {
    switch (timerState) {
      case 'focus':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(getTimeForState(timerState));
  };

  const skipTimer = () => {
    handleTimerComplete();
  };

  const handleTimerComplete = () => {
    pauseTimer();
    
    // Play sound or notification here
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    if (timerState === 'focus') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (newSessionsCompleted % settings.longBreakInterval === 0) {
        setTimerState('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
      } else {
        setTimerState('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
      }
      
      onComplete();
    } else {
      // After a break, go back to focus mode
      setTimerState('focus');
      setTimeLeft(settings.focusTime * 60);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Calculate progress percentage
  const totalTime = getTimeForState(timerState);
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  // Determine circle color based on timer state
  const circleColor = timerState === 'focus' 
    ? (activeSubject?.color || 'hsl(var(--primary))') 
    : timerState === 'shortBreak' ? '#22c55e' : '#0ea5e9';

  return (
    <Card className="glassmorphism overflow-hidden border shadow-elevation-low">
      <CardContent className="p-8 flex flex-col items-center">
        <div className="mb-4">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
            {getTimerLabel()}
          </span>
        </div>
        
        {activeSubject && timerState === 'focus' && (
          <div className="mb-6 text-center">
            <div 
              className="w-3 h-3 rounded-full inline-block mr-2"
              style={{ backgroundColor: activeSubject.color }}
            />
            <span className="font-medium">{activeSubject.name}</span>
          </div>
        )}

        <div className="relative w-60 h-60 mb-8">
          {/* Background circle */}
          <div 
            className="absolute inset-0 rounded-full border-8 border-secondary opacity-30"
          />
          
          {/* Progress circle - using conic gradient for the progress */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${circleColor} ${progress}%, transparent ${progress}%)`,
              rotate: '-90deg',
            }}
          />
          
          {/* Inner white circle to create the donut effect */}
          <div className="absolute inset-[10px] bg-background rounded-full" />
          
          {/* Timer text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={resetTimer}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          <Button
            variant={isRunning ? "outline" : "default"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={isRunning ? pauseTimer : startTimer}
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={skipTimer}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
            <div 
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i < (sessionsCompleted % settings.longBreakInterval) 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

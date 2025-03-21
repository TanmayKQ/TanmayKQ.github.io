
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, Pause, RotateCcw,
  Volume2, VolumeX
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface TimerProps {
  initialDuration?: number;
  running?: boolean;
  onEnd?: () => Promise<void>;
}

export function Timer({ 
  initialDuration = 25 * 60, // 25 minutes in seconds
  running = false,
  onEnd = async () => {}
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(running);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Reset timer when initialDuration changes
  useEffect(() => {
    setTimeLeft(initialDuration);
  }, [initialDuration]);
  
  // Timer logic
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerEnd();
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeLeft]);
  
  const handleTimerEnd = async () => {
    setIsRunning(false);
    if (soundEnabled) {
      playAlarmSound();
    }
    await onEnd();
  };
  
  const playAlarmSound = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.5;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
      }, 1000);
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = ((initialDuration - timeLeft) / initialDuration) * 100;
  
  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-6 bg-card rounded-xl border shadow-sm">
      <div className="text-5xl font-bold tabular-nums tracking-tight">
        {formatTime(timeLeft)}
      </div>
      
      <Progress value={progress} className="w-full h-2" />
      
      <div className="flex space-x-3 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTimeLeft(initialDuration)}
          disabled={isRunning}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant="default"
          size="lg"
          className="px-8"
        >
          {isRunning ? 
            <><Pause className="mr-2 h-5 w-5" /> Pause</> : 
            <><Play className="mr-2 h-5 w-5" /> Start</>
          }
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? 
            <Volume2 className="h-5 w-5" /> : 
            <VolumeX className="h-5 w-5" />
          }
        </Button>
      </div>
    </div>
  );
}

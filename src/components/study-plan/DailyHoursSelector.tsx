
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface DailyHoursSelectorProps {
  dailyHours: number;
  onChange: (value: number) => void;
}

export const DailyHoursSelector = ({ dailyHours, onChange }: DailyHoursSelectorProps) => {
  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Your Daily Schedule</h3>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="daily-hours">Daily Study Hours</Label>
            <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              {dailyHours} hours
            </span>
          </div>
          <Slider
            id="daily-hours"
            min={1}
            max={12}
            step={0.5}
            value={[dailyHours]}
            onValueChange={(values) => onChange(values[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

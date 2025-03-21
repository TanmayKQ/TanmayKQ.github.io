
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface DailyHoursSelectorProps {
  dailyHours: number;
  onChange: (value: number) => void;
}

export const DailyHoursSelector = ({ dailyHours, onChange }: DailyHoursSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Schedule</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="daily-hours">Daily Study Hours: {dailyHours} hours</Label>
          </div>
          <Slider
            id="daily-hours"
            min={1}
            max={12}
            step={0.5}
            value={[dailyHours]}
            onValueChange={(values) => onChange(values[0])}
          />
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ProductivityPatternsProps {
  productivityRatings: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  onChange: (time: string, value: number) => void;
}

export const ProductivityPatterns = ({ productivityRatings, onChange }: ProductivityPatternsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Productivity Patterns</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Rate your typical productivity level during different times of the day.
      </p>
      <div className="space-y-6">
        {Object.entries(productivityRatings).map(([time, value]) => (
          <div key={time} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={`productivity-${time}`} className="capitalize">
                {time} ({String(value)}%)
              </Label>
            </div>
            <Slider
              id={`productivity-${time}`}
              min={0}
              max={100}
              step={5}
              value={[Number(value)]}
              onValueChange={(values) => onChange(time, values[0])}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

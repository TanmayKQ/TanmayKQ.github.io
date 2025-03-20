
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Subject } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
];

interface StudyPlanFormProps {
  onSubmit: (subjects: Subject[], dailyHours: number, productivityRatings: any) => void;
  initialSubjects?: Subject[];
  initialDailyHours?: number;
  initialProductivityRatings?: any;
}

export function StudyPlanForm({ 
  onSubmit, 
  initialSubjects = [], 
  initialDailyHours = 4, 
  initialProductivityRatings = {
    morning: 75,
    afternoon: 60,
    evening: 85,
    night: 40
  } 
}: StudyPlanFormProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Partial<Subject>[]>(
    initialSubjects.length > 0 
      ? initialSubjects 
      : [{ name: '', priority: 'medium', color: '#3b82f6', totalHours: 8 }]
  );
  const [dailyHours, setDailyHours] = useState(initialDailyHours);
  const [productivityRatings, setProductivityRatings] = useState(initialProductivityRatings);

  const addSubject = () => {
    setSubjects([
      ...subjects, 
      { name: '', priority: 'medium', color: colorOptions[Math.floor(Math.random() * colorOptions.length)].value, totalHours: 8 }
    ]);
  };

  const removeSubject = (index: number) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const updateSubject = (index: number, field: string, value: any) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const invalidSubjects = subjects.filter(s => !s.name);
    if (invalidSubjects.length > 0) {
      toast({
        title: "Missing information",
        description: "Please provide a name for all subjects.",
        variant: "destructive"
      });
      return;
    }

    // Create proper Subject objects with IDs
    const completeSubjects = subjects.map(s => ({
      ...s,
      id: s.id || crypto.randomUUID(),
      completedHours: s.completedHours || 0
    })) as Subject[];

    onSubmit(completeSubjects, dailyHours, productivityRatings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Subjects</h3>
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-card animate-scale-in">
              <div 
                className="w-3 h-full rounded-full self-stretch mt-2" 
                style={{ backgroundColor: subject.color }}
              />
              <div className="grid gap-3 flex-1 md:grid-cols-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`subject-${index}`}>Subject Name</Label>
                  <Input
                    id={`subject-${index}`}
                    value={subject.name}
                    placeholder="E.g., Mathematics"
                    onChange={(e) => updateSubject(index, 'name', e.target.value)}
                    className="input-focus"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`priority-${index}`}>Priority</Label>
                  <Select
                    value={subject.priority}
                    onValueChange={(value) => updateSubject(index, 'priority', value)}
                  >
                    <SelectTrigger id={`priority-${index}`}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`color-${index}`}>Color</Label>
                  <Select
                    value={subject.color}
                    onValueChange={(value) => updateSubject(index, 'color', value)}
                  >
                    <SelectTrigger id={`color-${index}`} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: subject.color }} />
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: color.value }} />
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeSubject(index)}
                disabled={subjects.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-2 flex items-center justify-center gap-2" 
          onClick={addSubject}
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

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
              onValueChange={(values) => setDailyHours(values[0])}
            />
          </div>
        </div>
      </div>

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
                  {time} ({value}%)
                </Label>
              </div>
              <Slider
                id={`productivity-${time}`}
                min={0}
                max={100}
                step={5}
                value={[value as number]}
                onValueChange={(values) => 
                  setProductivityRatings({...productivityRatings, [time]: values[0]})
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full rounded-full mt-8"
      >
        {initialSubjects.length > 0 ? 'Update Study Plan' : 'Generate Study Plan'}
      </Button>
    </form>
  );
}

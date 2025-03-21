
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Subject } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { SubjectList } from './study-plan/SubjectList';
import { DailyHoursSelector } from './study-plan/DailyHoursSelector';
import { ProductivityPatterns } from './study-plan/ProductivityPatterns';
import { colorOptions } from './study-plan/constants';

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

  const updateProductivityRating = (time: string, value: number) => {
    setProductivityRatings({...productivityRatings, [time]: value});
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
      <SubjectList 
        subjects={subjects}
        colorOptions={colorOptions}
        onUpdateSubject={updateSubject}
        onRemoveSubject={removeSubject}
        onAddSubject={addSubject}
      />

      <DailyHoursSelector 
        dailyHours={dailyHours} 
        onChange={setDailyHours} 
      />

      <ProductivityPatterns 
        productivityRatings={productivityRatings}
        onChange={updateProductivityRating}
      />

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


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Subject } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { SubjectList } from './study-plan/SubjectList';
import { DailyHoursSelector } from './study-plan/DailyHoursSelector';
import { ProductivityPatterns } from './study-plan/ProductivityPatterns';
import { colorOptions } from './study-plan/constants';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

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
  
  // Set default total hours for new subjects
  const [defaultTotalHours, setDefaultTotalHours] = useState(2);
  
  const [subjects, setSubjects] = useState<Partial<Subject>[]>(
    initialSubjects.length > 0 
      ? initialSubjects 
      : [{ name: '', priority: 'medium', color: '#3b82f6', totalHours: defaultTotalHours }]
  );
  const [dailyHours, setDailyHours] = useState(initialDailyHours);
  const [productivityRatings, setProductivityRatings] = useState(initialProductivityRatings);

  // Update defaultTotalHours when dailyHours changes - but now we set a reasonable daily allocation per subject
  useEffect(() => {
    // For new subjects, we allocate 2 hours by default regardless of daily total
    setDefaultTotalHours(2);
  }, [dailyHours]);

  const addSubject = () => {
    setSubjects([
      ...subjects, 
      { name: '', priority: 'medium', color: colorOptions[Math.floor(Math.random() * colorOptions.length)].value, totalHours: defaultTotalHours }
    ]);
  };

  const removeSubject = (index: number) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const resetPlan = () => {
    setSubjects([{ name: '', priority: 'medium', color: '#3b82f6', totalHours: defaultTotalHours }]);
    setDailyHours(4);
    setProductivityRatings({
      morning: 75,
      afternoon: 60,
      evening: 85,
      night: 40
    });
    toast({
      title: "Plan Reset",
      description: "Your study plan has been reset",
    });
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daily Study Plan</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Reset Plan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Study Plan?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all your subjects and reset your study plan settings. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetPlan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-6">
        <p className="text-sm text-muted-foreground">
          <strong>How it works:</strong> Set your daily study hours and add subjects you want to study. 
          TimeWise will help you optimize your daily study routine based on your productivity patterns and priorities.
        </p>
      </div>

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

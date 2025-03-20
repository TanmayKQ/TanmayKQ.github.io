
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Timer } from '@/components/Timer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PomodoroSettings } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

// Sample subjects (in a real app would come from user's study plan)
const sampleSubjects = [
  { id: '1', name: 'Mathematics', color: '#ef4444', priority: 'high', totalHours: 10, completedHours: 2 },
  { id: '2', name: 'Physics', color: '#3b82f6', priority: 'medium', totalHours: 8, completedHours: 1 },
  { id: '3', name: 'Literature', color: '#22c55e', priority: 'low', totalHours: 6, completedHours: 0.5 },
];

const Focus = () => {
  const { toast } = useToast();
  const [activeSubjectId, setActiveSubjectId] = useState<string>(sampleSubjects[0].id);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
  });

  const activeSubject = sampleSubjects.find(s => s.id === activeSubjectId);

  const handleTimerComplete = () => {
    toast({
      title: "Session completed",
      description: "Great job! Take a moment to reset before continuing.",
    });
    // In a real app, this would update the user's progress
  };

  const updateSetting = (setting: keyof PomodoroSettings, value: number) => {
    setPomodoroSettings({
      ...pomodoroSettings,
      [setting]: value,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Focus Mode</h1>
          <p className="text-muted-foreground">
            Eliminate distractions and concentrate on your studies with the Pomodoro technique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Subject selector */}
            <Card className="shadow-elevation-low">
              <CardContent className="pt-6">
                <Label htmlFor="subject-select" className="mb-2 block">Select Subject</Label>
                <Select value={activeSubjectId} onValueChange={setActiveSubjectId}>
                  <SelectTrigger id="subject-select" className="w-full">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleSubjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center">
                          <div 
                            className="h-3 w-3 rounded-full mr-2" 
                            style={{ backgroundColor: subject.color }} 
                          />
                          {subject.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Timer */}
            <Timer 
              activeSubject={activeSubject} 
              settings={pomodoroSettings} 
              onComplete={handleTimerComplete} 
            />
          </div>

          <div className="space-y-6">
            {/* Pomodoro settings */}
            <Card className="shadow-elevation-low">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Timer Settings</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="focus-time" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Focus Time</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.focusTime} min</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={5}
                          max={60}
                          step={5}
                          value={[pomodoroSettings.focusTime]}
                          onValueChange={(values) => updateSetting('focusTime', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="short-break" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Short Break</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.shortBreakTime} min</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={1}
                          max={15}
                          step={1}
                          value={[pomodoroSettings.shortBreakTime]}
                          onValueChange={(values) => updateSetting('shortBreakTime', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="long-break" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Long Break</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.longBreakTime} min</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={10}
                          max={30}
                          step={5}
                          value={[pomodoroSettings.longBreakTime]}
                          onValueChange={(values) => updateSetting('longBreakTime', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="interval" className="border-b">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center">
                        <span>Sessions Before Long Break</span>
                        <span className="ml-auto text-muted-foreground">{pomodoroSettings.longBreakInterval}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="py-2">
                        <Slider
                          min={2}
                          max={8}
                          step={1}
                          value={[pomodoroSettings.longBreakInterval]}
                          onValueChange={(values) => updateSetting('longBreakInterval', values[0])}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Focus tips */}
            <Card className="shadow-elevation-low">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Focus Tips</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <p>Remove distractions by turning off notifications and placing your phone out of sight.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <p>Stay hydrated and keep a bottle of water nearby during your study sessions.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <p>Use your breaks to move around and stretch to maintain energy levels.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <p>After completing a focus session, write down what you accomplished to track progress.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;

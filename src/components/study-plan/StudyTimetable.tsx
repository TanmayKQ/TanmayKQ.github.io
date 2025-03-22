
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Subject } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  time: string;
  subject: Subject | null;
  productivity: number;
}

interface StudyTimetableProps {
  subjects: Subject[];
  productivityRatings: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  dailyHours: number;
}

export const StudyTimetable: React.FC<StudyTimetableProps> = ({
  subjects,
  productivityRatings,
  dailyHours
}) => {
  // Generate optimized timetable based on productivity ratings
  const generateTimetable = (): TimeSlot[] => {
    const timeSlots: TimeSlot[] = [
      { time: '6:00 - 9:00 AM', subject: null, productivity: productivityRatings.morning },
      { time: '9:00 - 12:00 PM', subject: null, productivity: productivityRatings.morning },
      { time: '12:00 - 3:00 PM', subject: null, productivity: productivityRatings.afternoon },
      { time: '3:00 - 6:00 PM', subject: null, productivity: productivityRatings.afternoon },
      { time: '6:00 - 9:00 PM', subject: null, productivity: productivityRatings.evening },
      { time: '9:00 - 12:00 AM', subject: null, productivity: productivityRatings.night }
    ];

    // Sort time slots by productivity (highest first)
    const sortedSlots = [...timeSlots].sort((a, b) => b.productivity - a.productivity);

    // Calculate how many hours to allocate to each subject based on priority
    const totalSubjectHours = subjects.reduce((acc, subject) => acc + subject.totalHours, 0);
    const scaleFactor = dailyHours / totalSubjectHours;
    
    const sortedSubjects = [...subjects]
      .sort((a, b) => {
        // Sort by priority (high, medium, low)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .map(subject => ({
        ...subject,
        // Scale hours based on daily goal
        allocatedHours: Math.round(subject.totalHours * scaleFactor * 2) / 2 // Round to nearest 0.5
      }));

    // Assign subjects to time slots based on productivity
    let subjectIndex = 0;
    let remainingHours: Record<string, number> = {};
    
    // Initialize the remainingHours object with proper typing
    sortedSubjects.forEach(subject => {
      remainingHours[subject.id] = subject.allocatedHours;
    });
    
    // First, assign high productivity slots
    for (const slot of sortedSlots) {
      // Skip if all subjects are allocated
      if (Object.values(remainingHours).every(hours => typeof hours === 'number' && hours <= 0)) break;
      
      // Find next subject with remaining hours
      while (subjectIndex < sortedSubjects.length && 
             remainingHours[sortedSubjects[subjectIndex].id] <= 0) {
        subjectIndex++;
      }
      
      // If we've gone through all subjects, start over
      if (subjectIndex >= sortedSubjects.length) {
        subjectIndex = 0;
        continue;
      }
      
      const subject = sortedSubjects[subjectIndex];
      
      // Assign subject to time slot if it has hours remaining
      if (remainingHours[subject.id] > 0) {
        // Find the original index of this slot
        const originalIndex = timeSlots.findIndex(ts => ts.time === slot.time);
        if (originalIndex !== -1) {
          timeSlots[originalIndex].subject = subject;
          remainingHours[subject.id] -= 3; // Each slot is 3 hours
        }
        
        // Move to next subject
        subjectIndex++;
      }
    }
    
    return timeSlots;
  };

  const timetable = generateTimetable();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Optimized Daily Timetable</span>
          <Badge variant="outline" className="ml-2">Based on your productivity</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            This timetable is optimized based on your productivity patterns and subject priorities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timetable.map((slot, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                slot.productivity > 70 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' :
                slot.productivity > 50 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900' :
                'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-800'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{slot.time}</span>
                  <Badge variant={slot.productivity > 70 ? "success" : slot.productivity > 50 ? "secondary" : "outline"}>
                    {slot.productivity}% Productivity
                  </Badge>
                </div>
                {slot.subject ? (
                  <div 
                    className="p-2 rounded-md" 
                    style={{ backgroundColor: `${slot.subject.color}30`, borderLeft: `4px solid ${slot.subject.color}` }}
                  >
                    <div className="font-medium" style={{ color: slot.subject.color }}>
                      {slot.subject.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Priority: {slot.subject.priority.charAt(0).toUpperCase() + slot.subject.priority.slice(1)}
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-md bg-muted text-center">
                    <span className="text-sm text-muted-foreground">Free Time</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Subject } from '@/lib/types';
import { SubjectItem } from './SubjectItem';

interface ColorOption {
  name: string;
  value: string;
}

interface SubjectListProps {
  subjects: Partial<Subject>[];
  colorOptions: ColorOption[];
  onUpdateSubject: (index: number, field: string, value: any) => void;
  onRemoveSubject: (index: number) => void;
  onAddSubject: () => void;
}

export const SubjectList = ({ 
  subjects, 
  colorOptions, 
  onUpdateSubject, 
  onRemoveSubject, 
  onAddSubject 
}: SubjectListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Subjects</h3>
      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <SubjectItem 
            key={index}
            subject={subject}
            index={index}
            colorOptions={colorOptions}
            onUpdate={onUpdateSubject}
            onRemove={onRemoveSubject}
            canRemove={subjects.length > 1}
          />
        ))}
      </div>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full mt-2 flex items-center justify-center gap-2" 
        onClick={onAddSubject}
      >
        <Plus className="h-4 w-4" />
        Add Subject
      </Button>
    </div>
  );
};

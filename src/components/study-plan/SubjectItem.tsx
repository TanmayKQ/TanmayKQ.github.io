
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Subject } from '@/lib/types';

interface ColorOption {
  name: string;
  value: string;
}

interface SubjectItemProps {
  subject: Partial<Subject>;
  index: number;
  colorOptions: ColorOption[];
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const SubjectItem = ({ 
  subject, 
  index, 
  colorOptions, 
  onUpdate, 
  onRemove,
  canRemove 
}: SubjectItemProps) => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card animate-scale-in">
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
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            className="input-focus"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`priority-${index}`}>Priority</Label>
          <Select
            value={subject.priority}
            onValueChange={(value) => onUpdate(index, 'priority', value)}
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
            onValueChange={(value) => onUpdate(index, 'color', value)}
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
        onClick={() => onRemove(index)}
        disabled={!canRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

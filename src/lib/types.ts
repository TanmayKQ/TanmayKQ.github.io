
export interface Subject {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
  totalHours: number;
  completedHours: number;
  deadline?: Date;
}

export interface TimeBlock {
  id: string;
  subjectId: string;
  startTime: Date;
  endTime: Date;
  isCompleted: boolean;
  focusScore?: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  subjects: Subject[];
  timeBlocks: TimeBlock[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormattedTimeBlock {
  id: string;
  subject: Subject;
  startTime: Date;
  endTime: Date;
  duration: number;
  isCompleted: boolean;
}

export interface PomodoroSettings {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
}

export interface UserPreferences {
  pomodoroSettings: PomodoroSettings;
  productiveTimes: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  dailyGoalHours: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: Date;
  endTime: Date;
  focusScore?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'update';
  isRead: boolean;
  createdAt: Date;
}

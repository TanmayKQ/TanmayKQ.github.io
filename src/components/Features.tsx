
import React from 'react';
import { CheckCircle, Clock, Calendar, BarChart3, Brain, BookOpen } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Intelligent Study Planner",
      description: "Create optimized study schedules based on your availability, subject priorities, and deadlines."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Customizable Focus Timer",
      description: "Stay productive with a Pomodoro timer tailored to your concentration patterns and preferences."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Progress Tracking",
      description: "Monitor your study habits, completion rates, and consistency with intuitive visualizations."
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Productivity Insights",
      description: "Discover your peak performance hours and optimize your study routine accordingly."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Subject Management",
      description: "Organize your courses, prioritize topics, and balance your study time effectively."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Goal Setting",
      description: "Set daily and weekly study targets to maintain momentum and track your achievements."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Features designed for optimal learning
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature in TimeWise Studio has been thoughtfully crafted to enhance your study experience and maximize productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-background rounded-xl p-6 shadow-elevation-low border flex flex-col h-full transition-all duration-300 hover:shadow-elevation-medium hover:translate-y-[-2px]"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

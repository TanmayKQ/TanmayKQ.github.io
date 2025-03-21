
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Brain, BarChart4 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Hero() {
  const { user } = useAuth();
  
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <span className="mr-1.5">✨</span> TimeWise - best study optimizer app
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-balance">
            Optimize your study routine for maximum productivity
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
            Create personalized study plans based on your schedule, energy levels, and priorities. 
            Track your progress and stay focused with our intelligent study assistant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild size="lg" className="flex-1 rounded-full gap-2 group bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90">
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Get started"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-full">
              <Link to="#features">Learn more</Link>
            </Button>
          </div>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" id="features">
          <div className="rounded-xl p-6 border bg-card shadow-elevation-low card-hover">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Automatically allocate study time based on subject priority and your peak productivity hours.
            </p>
          </div>
          
          <div className="rounded-xl p-6 border bg-card shadow-elevation-low card-hover">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Focus Enhancement</h3>
            <p className="text-muted-foreground">
              Boost your concentration with customized Pomodoro timers tailored to your attention span.
            </p>
          </div>
          
          <div className="rounded-xl p-6 border bg-card shadow-elevation-low card-hover">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart4 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground">
              Visualize your study habits and track improvements over time with detailed insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, Brain, BarChart4, BookOpen } from 'lucide-react';

const Index = () => {
  return (
    <Layout fullWidth withPadding={false}>
      <Hero />
      
      <Features />
      
      {/* Testimonials section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Students love TimeWise
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students who have transformed their study habits with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "TimeWise helped me organize my chaotic study schedule and actually stick to it. My grades improved dramatically this semester!",
                author: "Sarah K.",
                title: "Medical Student"
              },
              {
                quote: "The focus timer is a game-changer. I've never been able to concentrate for long periods until I started using this app.",
                author: "Michael T.",
                title: "Computer Science Major"
              },
              {
                quote: "I love how it adapts to my energy levels. Studying when I'm most productive has made a huge difference in my retention.",
                author: "Aisha N.",
                title: "Law Student"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-secondary/30 p-6 rounded-xl border shadow-elevation-low relative">
                <div className="absolute top-0 left-10 transform -translate-y-1/2 text-4xl text-primary opacity-20">
                  "
                </div>
                <blockquote className="mb-4 text-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-auto">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How TimeWise works
            </h2>
            <p className="text-lg text-muted-foreground">
              Our intelligent study platform is designed to adapt to your unique needs and help you achieve your academic goals.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-24 left-1/2 h-[calc(100%-6rem)] w-0.5 bg-border -translate-x-1/2 z-0"></div>
            
            <div className="space-y-12 relative z-10">
              {[
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: "Input your subjects and schedule",
                  description: "Tell us what you're studying, your deadlines, and when you're available. We'll handle the rest."
                },
                {
                  icon: <Brain className="h-6 w-6" />,
                  title: "Get a personalized study plan",
                  description: "Our algorithm creates an optimized study schedule based on your priorities and energy levels."
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Study with focus enhancement",
                  description: "Use our Pomodoro timer to maintain concentration and take breaks at the right intervals."
                },
                {
                  icon: <BarChart4 className="h-6 w-6" />,
                  title: "Track your progress",
                  description: "Visualize your study habits and see how consistent you've been over time."
                }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center z-10 border-4 border-background">
                    {step.icon}
                  </div>
                  <div className="md:pt-2 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to transform your study habits?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Join students around the world who are studying smarter, not harder.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

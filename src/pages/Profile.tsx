
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart4, Calendar, CheckCircle2, Clock, Edit, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudyData } from '@/hooks/useStudyData';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { user } = useAuth();
  const { subjects, completedSessions, totalStudyTime, streak } = useStudyData();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalHours = subjects.reduce((acc, subject) => acc + subject.totalHours, 0);
  const completedHours = subjects.reduce((acc, subject) => acc + subject.completedHours, 0);
  const overallCompletion = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Profile</CardTitle>
                <Link to="/settings">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src="" alt={user?.email || "User"} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {user?.email?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg mb-1">{user?.email || "User"}</h3>
                <p className="text-muted-foreground text-sm mb-4">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                <div className="w-full flex flex-col gap-2 items-start pt-4 border-t">
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Links</CardTitle>
                <CardDescription>Manage your account and preferences</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <div>
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </div>
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <div>
                      <BarChart4 className="mr-2 h-4 w-4" />
                      Dashboard
                    </div>
                  </Button>
                </Link>
                <Link to="/focus">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <div>
                      <Clock className="mr-2 h-4 w-4" />
                      Focus Timer
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Activity Summary */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Study Overview</CardTitle>
                    <CardDescription>Your study performance and progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Study Time</p>
                        <p className="text-2xl font-semibold">{formatTime(totalStudyTime)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Sessions</p>
                        <p className="text-2xl font-semibold">{completedSessions}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Progress</p>
                        <p className="text-2xl font-semibold">{overallCompletion}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Streak</p>
                        <p className="text-2xl font-semibold">{streak} days</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Overall Progress</p>
                        <p className="text-sm text-muted-foreground">
                          {completedHours}/{totalHours} hours
                        </p>
                      </div>
                      <Progress value={overallCompletion} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {completedSessions > 0 ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <p className="text-sm">{streak > 1 ? `${streak} day streak!` : "First day completed!"}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <p className="text-sm">Total: {formatTime(totalStudyTime)}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No recent activity recorded</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Next Goals</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              <p className="text-sm">Reach a 7-day streak</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <p className="text-sm">Complete 10 study sessions</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Link to="/dashboard">
                        <Button variant="outline" size="sm">View Dashboard</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="subjects">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Your Subjects</CardTitle>
                    <CardDescription>Progress on individual study subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {subjects.length > 0 ? (
                      <div className="space-y-6">
                        {subjects.map((subject) => {
                          const percentage = subject.totalHours > 0 
                            ? Math.round((subject.completedHours / subject.totalHours) * 100) 
                            : 0;
                          
                          return (
                            <div key={subject.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div 
                                    className="h-3 w-3 mr-2 rounded-full" 
                                    style={{ backgroundColor: subject.color }} 
                                  />
                                  <span className="font-medium">{subject.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {subject.completedHours}/{subject.totalHours} hours ({percentage}%)
                                </span>
                              </div>
                              <Progress 
                                value={percentage} 
                                className="h-2" 
                                style={{ 
                                  "--progress-background": subject.color 
                                } as React.CSSProperties} 
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">No subjects added yet</p>
                        <Link to="/dashboard">
                          <Button variant="outline">Create Study Plan</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

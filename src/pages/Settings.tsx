
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, User, Bell, Key, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password reset email sent",
      description: "Check your email to complete the password reset process.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveProfile}>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-start">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="" alt={user?.email || "User"} />
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {user?.email?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">Upload new image</Button>
                        <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Enter your name" 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ''} 
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Your email cannot be changed after registration.</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="secondary" type="reset">Reset</Button>
                    <Button type="submit">Save changes</Button>
                  </CardFooter>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-muted-foreground" />
                      <Switch 
                        checked={theme === 'dark'} 
                        onCheckedChange={toggleTheme}
                      />
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveNotifications}>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email reminders for your scheduled study sessions</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser notifications for study reminders</p>
                    </div>
                    <Switch 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save preferences</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password or reset it if you've forgotten it</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-2">
                    <p className="text-sm">
                      You can request a password reset email to change your password. For security, you will be asked to verify your identity.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Send password reset email</Button>
                  </CardFooter>
                </form>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle>Sign Out</CardTitle>
                  <CardDescription>Sign out from your account on this device</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to the sign-in page after signing out.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive" 
                    onClick={signOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;

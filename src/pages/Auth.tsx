import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import ubcCampus from '@/assets/ubc-campus.png';
import logo from '@/assets/coursebuddy-logo.png';

const authSchema = z.object({
  username: z.string().min(1, 'CWL username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validation = authSchema.safeParse({ username, password });

      if (!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        setError(errorMessage);
        toast({
          title: 'Validation Error',
          description: errorMessage,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const email = `${username}@cwl.ubc.ca`;

      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If user doesn't exist, auto-create account (simulating CWL)
        if (signInError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                username,
                full_name: username,
              },
            },
          });

          if (signUpError) {
            console.error('Signup error:', signUpError);
            toast({
              title: 'Authentication Error',
              description: signUpError.message || 'Unable to authenticate with CWL',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Welcome',
              description: 'CWL authentication successful',
            });
            navigate('/');
          }
        } else {
          toast({
            title: 'Error',
            description: 'Authentication failed',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome Back',
          description: 'CWL authentication successful',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${ubcCampus})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.7)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-700/60 z-0" />
      
      <Card className="w-full max-w-md mx-4 z-10 shadow-2xl">
        <CardHeader className="space-y-3 pb-4 sm:pb-6">
          <div className="flex flex-col items-center gap-2">
            <img src={logo} alt="CourseBuddy Logo" className="w-16 h-16" />
            <CardTitle className="text-2xl text-center">CWL Login</CardTitle>
          </div>
          <CardDescription className="text-center">
            Sign in with your Campus-Wide Login to access CourseBuddy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">CWL Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your CWL username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">CWL Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your CWL password (min 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In with CWL'}
            </Button>

            <div className="space-y-2 mt-4">
              <p className="text-xs text-center text-muted-foreground">
                This is a demo system. Any credentials will work for your first login.
              </p>
              <p className="text-xs text-center text-foreground/80 font-medium bg-secondary/50 p-2 rounded border border-border">
                Note: Password must be at least 6 characters. Your account will be saved automatically.
              </p>
              <p className="text-xs text-center text-foreground/80 font-medium bg-secondary/50 p-2 rounded border border-border">
                To learn more about functionality read more in the about page and written report.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

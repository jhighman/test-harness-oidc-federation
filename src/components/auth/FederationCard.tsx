'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/auth';

export function FederationCard() {
  const { toast } = useToast();
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In design mode, we'll use mock data
    setUser({
      givenName: 'John',
      familyName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+15555555555',
      emailVerified: true,
      phoneNumberVerified: false,
    });
  }, []);

  const handleFederate = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const federationUrl = `https://trua-headless.com/auth?client_id=test_harness&token=${token}`;
      
      toast({
        title: 'Federation URL Generated',
        description: federationUrl,
      });

      // In a real app, we would redirect to this URL
      console.log('Redirecting to:', federationUrl);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Federation request failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-2xl font-bold text-center">
        Identity Federation
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Name: {user.givenName} {user.familyName}</p>
          <p className="text-sm font-medium">Email: {user.email}</p>
          <p className="text-sm font-medium">Phone: {user.phoneNumber}</p>
          <p className="text-sm font-medium">
            Email Verified: {user.emailVerified ? '✅' : '❌'}
          </p>
          <p className="text-sm font-medium">
            Phone Verified: {user.phoneNumberVerified ? '✅' : '❌'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleFederate} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Federate Identity'}
        </Button>
      </CardFooter>
    </Card>
  );
} 
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RegisterFormData } from '@/types/auth';

export function RegisterForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: RegisterFormData = {
      givenName: formData.get('givenName') as string,
      familyName: formData.get('familyName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Registration failed');

      toast({
        title: 'Success',
        description: 'Registration successful! Please login.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Registration failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-2xl font-bold text-center">Register</CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              name="givenName"
              placeholder="First Name"
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="familyName"
              placeholder="Last Name"
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 
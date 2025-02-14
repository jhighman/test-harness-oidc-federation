import { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    givenName: 'John',
    familyName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    phoneNumber: '+15555555555',
    emailVerified: true,
    phoneNumberVerified: false,
  },
]; 
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    registrationDate: string;
    role: 'admin' | 'user';
  }
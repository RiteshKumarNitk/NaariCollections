
import type { AdminUser } from './types';

/**
 * This is a list of authorized admin users.
 * IMPORTANT: In a real production application, you should NEVER hardcode passwords.
 * This should be replaced with a secure database and a proper authentication backend.
 * For this prototype, we are simulating a user database with this array.
 */
export const admins: AdminUser[] = [
  { email: 'admin@naari.com', password: 'password123' },
  { email: 'another.admin@naari.com', password: 'securepassword' },
];

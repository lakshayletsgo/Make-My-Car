export type Role = 'USER' | 'VENDOR' | 'ADMIN';

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

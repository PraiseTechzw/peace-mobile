export type AppUserRole = 'user' | 'peer_educator' | 'admin';

export interface RequestUser {
  sub: string;
  email: string;
  roles: AppUserRole[];
}

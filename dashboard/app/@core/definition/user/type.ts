export interface User {
  id: number;
  account: string;
  nickname: string;
  email: string;
  password: string;
  avatar: string;
  roles: number[];
  url: string;
  meta: Record<string, any>;
}

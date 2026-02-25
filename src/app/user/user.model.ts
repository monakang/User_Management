export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  loginId?: {
    username: string;
    password: string;
  };
}

export interface User {
  name: string;
  email: string;
  gender: string;
  loginId?: {
    username: string;
    password: string;
  };
}

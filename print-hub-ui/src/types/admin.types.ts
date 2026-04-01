export interface ISession {
  token: string
  createdAt: Date
  expiresAt: Date
}

export interface IAdmin {
  username: string;
  sessions: ISession[];
  password: string;
  isLoggedIn: boolean;
  activeLoggedIn: number;
  multiFactorAuth: boolean;
  multiFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

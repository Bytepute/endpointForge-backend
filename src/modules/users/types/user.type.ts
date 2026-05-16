export type User = {
  id: number;
  userName: string;
  passwordHash: string;
  createdAt: Date;
  tokenVersion: number;
};

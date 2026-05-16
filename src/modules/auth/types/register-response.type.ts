export type RegisterResponse = {
  userId: number;
  userName: string;
  createdAt: Date;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

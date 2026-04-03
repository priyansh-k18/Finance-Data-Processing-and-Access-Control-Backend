export interface UserPayload {
  id: string;
  email: string;
  role: string;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

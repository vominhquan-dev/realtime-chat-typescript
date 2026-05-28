export function cn(...inputs: any[]): string;
export function decodeToken(token: string): Record<string, any> | null;
export function getCurrentUserFromToken(): {
  id: string;
  username: string;
  email: string;
  avatar?: any;
} | null;
export function getToken(): string | null;
export function setToken(token: string): void;
export function removeToken(): void;

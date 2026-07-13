import apiClient from './api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * 用户登录
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const { token, user } = response.data;

    // 保存token和用户信息到本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * 用户登出
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  }
}

/**
 * 获取认证Token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        return null;
      }
    }
  }
  return null;
}

/**
 * 验证Token是否有效
 */
export async function validateToken(): Promise<boolean> {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    await apiClient.get('/auth/validate');
    return true;
  } catch (error) {
    logout();
    return false;
  }
}
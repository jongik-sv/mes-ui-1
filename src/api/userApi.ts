import type { User, LoginCredentials, LoginResponse } from '@/types/user';

// Mock API - 실제 구현에서는 실제 API 호출로 대체
export const userApi = {
  async getCurrentUser(): Promise<User> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          username: 'jjang',
          displayName: '장종익',
          department: '냉연생산SM팀',
          email: 'jjang@company.com',
          phone: '010-1234-5678',
          role: 'user',
          permissions: ['read', 'write'],
          lastLoginAt: new Date(),
          preferences: {
            theme: 'dark',
            language: 'ko',
            notifications: {
              email: true,
              push: true,
              sound: false
            }
          }
        });
      }, 100);
    });
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = {
          id: '1',
          username: 'jjang',
          displayName: '장종익',
          department: '냉연생산SM팀',
          email: 'jjang@company.com',
          phone: '010-1234-5678',
          role: 'user',
          permissions: ['read', 'write'],
          lastLoginAt: new Date(),
          preferences: {
            theme: 'dark',
            language: 'ko',
            notifications: {
              email: true,
              push: true,
              sound: false
            }
          }
        };
        
        resolve({ ...currentUser, ...updates });
      }, 100);
    });
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'jjang' && credentials.password === 'password') {
          resolve({
            user: {
              id: '1',
              username: 'jjang',
              displayName: '장종익',
              department: '냉연생산SM팀',
              email: 'jjang@company.com',
              phone: '010-1234-5678',
              role: 'user',
              permissions: ['read', 'write'],
              lastLoginAt: new Date(),
              preferences: {
                theme: 'dark',
                language: 'ko',
                notifications: {
                  email: true,
                  push: true,
                  sound: false
                }
              }
            },
            token: 'mock-jwt-token'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 100);
    });
  },

  async logout(): Promise<void> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  },

  async getUnreadMessageCount(): Promise<number> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.floor(Math.random() * 10));
      }, 100);
    });
  },

  async refreshToken(): Promise<string> {
    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
          resolve('new-jwt-token');
        } else {
          reject(new Error('No token found'));
        }
      }, 100);
    });
  }
};
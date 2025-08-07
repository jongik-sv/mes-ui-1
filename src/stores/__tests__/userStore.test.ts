import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '../userStore';

// Mock API
vi.mock('@/api/userApi', () => ({
  userApi: {
    getCurrentUser: vi.fn(),
    updateUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getUnreadMessageCount: vi.fn(),
    refreshToken: vi.fn()
  }
}));

// Mock router
vi.mock('@/router', () => ({
  router: {
    push: vi.fn()
  }
}));

describe('UserStore', () => {
  let mockUserApi: any;
  let mockRouter: any;

  beforeEach(async () => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    
    // Get mocked modules
    const userApiModule = await import('@/api/userApi');
    const routerModule = await import('@/router');
    mockUserApi = userApiModule.userApi;
    mockRouter = routerModule.router;
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });
    
    // Mock confirm
    Object.defineProperty(window, 'confirm', {
      value: vi.fn(),
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정된다', () => {
      const userStore = useUserStore();
      
      expect(userStore.currentUser).toBeNull();
      expect(userStore.isAuthenticated).toBe(false);
      expect(userStore.loading).toBe(false);
      expect(userStore.error).toBeNull();
      expect(userStore.menuState.isOpen).toBe(false);
      expect(userStore.unreadMessageCount).toBe(0);
    });
  });

  describe('사용자 정보 조회', () => {
    it('사용자 정보를 성공적으로 가져온다', async () => {
      const mockUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };

      mockUserApi.getCurrentUser.mockResolvedValue(mockUser);
      mockUserApi.getUnreadMessageCount.mockResolvedValue(5);

      const userStore = useUserStore();
      await userStore.fetchUserInfo();

      expect(userStore.currentUser).toEqual(mockUser);
      expect(userStore.isAuthenticated).toBe(true);
      expect(userStore.unreadMessageCount).toBe(5);
      expect(userStore.loading).toBe(false);
      expect(userStore.error).toBeNull();
    });

    it('사용자 정보 조회 실패 시 에러를 처리한다', async () => {
      const errorMessage = '사용자 정보를 불러올 수 없습니다.';
      mockUserApi.getCurrentUser.mockRejectedValue(new Error(errorMessage));

      const userStore = useUserStore();
      await userStore.fetchUserInfo();

      expect(userStore.currentUser).toBeNull();
      expect(userStore.isAuthenticated).toBe(false);
      expect(userStore.error).toBe(errorMessage);
      expect(userStore.loading).toBe(false);
    });
  });

  describe('사용자 정보 업데이트', () => {
    it('사용자 정보를 성공적으로 업데이트한다', async () => {
      const initialUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };

      const updatedUser = {
        ...initialUser,
        displayName: '장종익(수정됨)'
      };

      const userStore = useUserStore();
      userStore.currentUser = initialUser;

      mockUserApi.updateUser.mockResolvedValue(updatedUser);

      await userStore.updateUserInfo({ displayName: '장종익(수정됨)' });

      expect(userStore.currentUser).toEqual(updatedUser);
      expect(userStore.error).toBeNull();
    });

    it('사용자 정보 업데이트 실패 시 에러를 처리한다', async () => {
      const errorMessage = '사용자 정보 업데이트에 실패했습니다.';
      mockUserApi.updateUser.mockRejectedValue(new Error(errorMessage));

      const userStore = useUserStore();
      
      await expect(userStore.updateUserInfo({ displayName: '새 이름' }))
        .rejects.toThrow(errorMessage);
      
      expect(userStore.error).toBe(errorMessage);
    });
  });

  describe('로그인/로그아웃', () => {
    it('로그인을 성공적으로 처리한다', async () => {
      const mockUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };

      const mockToken = 'mock-jwt-token';
      const credentials = { username: 'jjang', password: 'password' };

      mockUserApi.login.mockResolvedValue({ user: mockUser, token: mockToken });
      mockUserApi.getUnreadMessageCount.mockResolvedValue(3);

      const userStore = useUserStore();
      await userStore.login(credentials);

      expect(userStore.currentUser).toEqual(mockUser);
      expect(userStore.isAuthenticated).toBe(true);
      expect(userStore.unreadMessageCount).toBe(3);
      expect(localStorage.setItem).toHaveBeenCalledWith('auth-token', mockToken);
    });

    it('로그아웃을 성공적으로 처리한다', async () => {
      const userStore = useUserStore();
      
      // 초기 상태 설정
      userStore.currentUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };
      userStore.isAuthenticated = true;
      userStore.unreadMessageCount = 5;
      userStore.menuState.isOpen = true;

      mockUserApi.logout.mockResolvedValue(undefined);

      await userStore.logout();

      expect(userStore.currentUser).toBeNull();
      expect(userStore.isAuthenticated).toBe(false);
      expect(userStore.unreadMessageCount).toBe(0);
      expect(userStore.menuState.isOpen).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('메뉴 상태 관리', () => {
    it('메뉴를 토글한다', () => {
      const userStore = useUserStore();
      
      expect(userStore.menuState.isOpen).toBe(false);
      
      userStore.toggleUserMenu();
      expect(userStore.menuState.isOpen).toBe(true);
      
      userStore.toggleUserMenu();
      expect(userStore.menuState.isOpen).toBe(false);
    });

    it('메뉴를 닫는다', () => {
      const userStore = useUserStore();
      userStore.menuState.isOpen = true;
      
      userStore.closeUserMenu();
      expect(userStore.menuState.isOpen).toBe(false);
    });
  });

  describe('네비게이션 액션', () => {
    it('사용자 설정 페이지로 이동한다', () => {
      const userStore = useUserStore();
      
      userStore.openUserSettings();
      
      expect(mockRouter.push).toHaveBeenCalledWith('/settings/profile');
    });

    it('메시지함 페이지로 이동한다', () => {
      const userStore = useUserStore();
      
      userStore.openMessageBox();
      
      expect(mockRouter.push).toHaveBeenCalledWith('/messages');
    });

    it('로그아웃 확인 후 로그아웃한다', async () => {
      vi.mocked(window.confirm).mockReturnValue(true);
      mockUserApi.logout.mockResolvedValue(undefined);

      const userStore = useUserStore();
      userStore.currentUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };
      userStore.isAuthenticated = true;

      await userStore.handleLogout();

      expect(window.confirm).toHaveBeenCalledWith('정말 로그아웃하시겠습니까?');
      expect(userStore.currentUser).toBeNull();
      expect(userStore.isAuthenticated).toBe(false);
    });

    it('로그아웃 취소 시 상태를 유지한다', async () => {
      vi.mocked(window.confirm).mockReturnValue(false);

      const userStore = useUserStore();
      const initialUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };
      
      userStore.currentUser = initialUser;
      userStore.isAuthenticated = true;

      await userStore.handleLogout();

      expect(window.confirm).toHaveBeenCalledWith('정말 로그아웃하시겠습니까?');
      expect(userStore.currentUser).toEqual(initialUser);
      expect(userStore.isAuthenticated).toBe(true);
      expect(mockUserApi.logout).not.toHaveBeenCalled();
    });
  });

  describe('computed 속성', () => {
    it('userInitial을 올바르게 계산한다', () => {
      const userStore = useUserStore();
      
      // 사용자가 없을 때
      expect(userStore.userInitial).toBe('?');
      
      // 사용자가 있을 때
      userStore.currentUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };
      
      expect(userStore.userInitial).toBe('장');
    });

    it('isMenuOpen을 올바르게 계산한다', () => {
      const userStore = useUserStore();
      
      expect(userStore.isMenuOpen).toBe(false);
      
      userStore.menuState.isOpen = true;
      expect(userStore.isMenuOpen).toBe(true);
    });
  });

  describe('토큰 갱신', () => {
    it('토큰을 성공적으로 갱신한다', async () => {
      const newToken = 'new-jwt-token';
      mockUserApi.refreshToken.mockResolvedValue(newToken);

      const userStore = useUserStore();
      await userStore.refreshToken();

      expect(localStorage.setItem).toHaveBeenCalledWith('auth-token', newToken);
    });

    it('토큰 갱신 실패 시 로그아웃한다', async () => {
      mockUserApi.refreshToken.mockRejectedValue(new Error('Token expired'));
      mockUserApi.logout.mockResolvedValue(undefined);

      const userStore = useUserStore();
      userStore.currentUser = {
        id: '1',
        username: 'jjang',
        displayName: '장종익',
        department: '냉연생산SM팀',
        email: 'jjang@company.com',
        role: 'user',
        permissions: [],
        preferences: {
          theme: 'dark' as const,
          language: 'ko' as const,
          notifications: {
            email: true,
            push: true,
            sound: false
          }
        }
      };
      userStore.isAuthenticated = true;

      await expect(userStore.refreshToken()).rejects.toThrow('Token expired');
      
      expect(userStore.currentUser).toBeNull();
      expect(userStore.isAuthenticated).toBe(false);
    });
  });
});
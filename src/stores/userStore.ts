import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserPreferences, UserMenuState, LoginCredentials } from '@/types/user';
import { userApi } from '@/api/userApi';
import { router } from '@/router';

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const menuState = ref<UserMenuState>({
    isOpen: false,
    loading: false,
    error: null
  });
  const unreadMessageCount = ref(0);

  // Getters
  const userInitial = computed(() => {
    return currentUser.value?.displayName?.charAt(0).toUpperCase() || '?';
  });

  const isMenuOpen = computed(() => menuState.value.isOpen);

  // Actions
  const fetchUserInfo = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const userData = await userApi.getCurrentUser();
      currentUser.value = userData;
      isAuthenticated.value = true;
      
      // 읽지 않은 메시지 수 조회
      await fetchUnreadMessageCount();
    } catch (err) {
      error.value = err instanceof Error ? err.message : '사용자 정보를 불러올 수 없습니다.';
      isAuthenticated.value = false;
    } finally {
      loading.value = false;
    }
  };

  const updateUserInfo = async (updates: Partial<User>) => {
    try {
      loading.value = true;
      error.value = null;
      
      const updatedUser = await userApi.updateUser(updates);
      currentUser.value = updatedUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '사용자 정보 업데이트에 실패했습니다.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      if (!currentUser.value) return;
      
      const updatedPreferences = { ...currentUser.value.preferences, ...preferences };
      await updateUserInfo({ preferences: updatedPreferences });
    } catch (err) {
      error.value = err instanceof Error ? err.message : '설정 업데이트에 실패했습니다.';
      throw err;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true;
      error.value = null;
      
      const { user, token } = await userApi.login(credentials);
      
      // 토큰 저장
      localStorage.setItem('auth-token', token);
      
      currentUser.value = user;
      isAuthenticated.value = true;
      
      await fetchUnreadMessageCount();
    } catch (err) {
      error.value = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      
      await userApi.logout();
      
      // 상태 초기화
      currentUser.value = null;
      isAuthenticated.value = false;
      unreadMessageCount.value = 0;
      menuState.value.isOpen = false;
      
      // 토큰 제거
      localStorage.removeItem('auth-token');
      
      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (err) {
      error.value = err instanceof Error ? err.message : '로그아웃에 실패했습니다.';
    } finally {
      loading.value = false;
    }
  };

  const toggleUserMenu = () => {
    menuState.value.isOpen = !menuState.value.isOpen;
  };

  const closeUserMenu = () => {
    menuState.value.isOpen = false;
  };

  const openUserSettings = () => {
    router.push('/settings/profile');
  };

  const openMessageBox = () => {
    router.push('/messages');
  };

  const handleLogout = async () => {
    const confirmed = confirm('정말 로그아웃하시겠습니까?');
    if (confirmed) {
      await logout();
    }
  };

  const fetchUnreadMessageCount = async () => {
    try {
      const count = await userApi.getUnreadMessageCount();
      unreadMessageCount.value = count;
    } catch (err) {
      console.warn('읽지 않은 메시지 수를 불러올 수 없습니다:', err);
    }
  };

  const refreshToken = async () => {
    try {
      const newToken = await userApi.refreshToken();
      localStorage.setItem('auth-token', newToken);
    } catch (err) {
      // 토큰 갱신 실패 시 로그아웃
      await logout();
      throw err;
    }
  };

  return {
    // State
    currentUser,
    isAuthenticated,
    loading,
    error,
    menuState,
    unreadMessageCount,
    
    // Getters
    userInitial,
    isMenuOpen,
    
    // Actions
    fetchUserInfo,
    updateUserInfo,
    updatePreferences,
    login,
    logout,
    toggleUserMenu,
    closeUserMenu,
    openUserSettings,
    openMessageBox,
    handleLogout,
    fetchUnreadMessageCount,
    refreshToken
  };
});
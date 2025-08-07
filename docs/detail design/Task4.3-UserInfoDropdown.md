# Task 4.3 사용자 정보 드롭다운 메뉴 구현 설계서

## 개요

본 문서는 MES UI 프레임워크의 헤더 영역에 위치하는 사용자 정보 드롭다운 메뉴 컴포넌트의 상세 설계를 다룹니다. 이 컴포넌트는 사용자의 아바타, 소속명, 사용자명을 표시하고, 클릭 시 드롭다운 메뉴를 통해 사용자 설정, 메시지함, 로그아웃 기능을 제공합니다.

## 요구사항 분석

### 기능 요구사항
1. **사용자 정보 표시**: 아바타 + 소속명 + 사용자명 표시
2. **드롭다운 메뉴**: 클릭 시 메뉴 표시/숨김
3. **메뉴 항목**: 사용자 설정, 메시지함, 로그아웃
4. **상태 관리**: Pinia 스토어를 통한 사용자 상태 관리
5. **반응형**: 모바일에서도 적절한 크기와 터치 타겟 제공

### 비기능 요구사항
1. **접근성**: 키보드 네비게이션 및 스크린 리더 지원
2. **성능**: 빠른 렌더링 및 상태 변경
3. **일관성**: 전체 디자인 시스템과 일치
4. **확장성**: 추가 메뉴 항목 쉽게 추가 가능

## 컴포넌트 구조

### 컴포넌트 계층
```
UserInfoMenu
├── UserInfoButton (메인 버튼)
│   ├── UserAvatar (아바타)
│   └── UserDetails (소속명 + 사용자명)
└── UserDropdownMenu (드롭다운 메뉴)
    ├── MenuItem (사용자 설정)
    ├── MenuItem (메시지함)
    └── MenuItem (로그아웃)
```

### 데이터 모델
```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  department: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role: string;
  permissions: string[];
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
}

interface UserMenuState {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}
```

## 상태 관리 (Pinia Store)

### UserStore 설계
```typescript
interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  menuState: UserMenuState;
}

interface UserActions {
  // 사용자 정보 관리
  fetchUserInfo(): Promise<void>;
  updateUserInfo(updates: Partial<User>): Promise<void>;
  updatePreferences(preferences: Partial<UserPreferences>): Promise<void>;
  
  // 인증 관리
  login(credentials: LoginCredentials): Promise<void>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
  
  // 메뉴 상태 관리
  toggleUserMenu(): void;
  closeUserMenu(): void;
  
  // 기능별 액션
  openUserSettings(): void;
  openMessageBox(): void;
  handleLogout(): Promise<void>;
}
```

## UI/UX 설계

### 시각적 구성
```
┌─────────────────────────────────┐
│ [👤] 냉연생산SM팀               │ ← 메인 버튼
│      장종익                     │
└─────────────────────────────────┘
              │
              ▼ (클릭 시)
┌─────────────────────────────────┐
│ 👤 사용자 설정                  │ ← 드롭다운 메뉴
│ 📧 메시지함                     │
│ 🚪 로그아웃                     │
└─────────────────────────────────┘
```

### 스타일 가이드
- **아바타**: 32px 원형, 이니셜 표시
- **텍스트**: 소속명(작은 글씨), 사용자명(기본 글씨)
- **드롭다운**: 우측 정렬, 그림자 효과
- **메뉴 항목**: 아이콘 + 텍스트, 호버 효과

### 반응형 동작
- **데스크톱**: 전체 정보 표시
- **태블릿**: 아바타 + 사용자명만 표시
- **모바일**: 아바타만 표시, 드롭다운에서 전체 정보 확인

## 기술 구현

### 컴포넌트 구현
```vue
<template>
  <div class="user-info-menu" ref="menuContainer">
    <!-- 메인 버튼 -->
    <Button
      @click="toggleMenu"
      @keydown.enter="toggleMenu"
      @keydown.space.prevent="toggleMenu"
      @keydown.escape="closeMenu"
      class="user-info-button"
      :class="{ 'menu-open': menuState.isOpen }"
      aria-haspopup="true"
      :aria-expanded="menuState.isOpen"
      aria-label="사용자 메뉴"
    >
      <!-- 아바타 -->
      <div class="user-avatar">
        <img 
          v-if="currentUser?.avatar" 
          :src="currentUser.avatar" 
          :alt="`${currentUser.displayName} 아바타`"
          class="avatar-image"
        />
        <span v-else class="avatar-initial">
          {{ getInitial(currentUser?.displayName) }}
        </span>
      </div>
      
      <!-- 사용자 정보 -->
      <div class="user-details" v-if="!isMobile">
        <div class="user-department">{{ currentUser?.department }}</div>
        <div class="user-name">{{ currentUser?.displayName }}</div>
      </div>
      
      <!-- 드롭다운 화살표 -->
      <i class="pi pi-chevron-down dropdown-arrow" 
         :class="{ 'rotated': menuState.isOpen }"></i>
    </Button>
    
    <!-- 드롭다운 메뉴 -->
    <Transition name="dropdown">
      <div 
        v-if="menuState.isOpen"
        class="user-dropdown-menu"
        role="menu"
        aria-labelledby="user-menu-button"
      >
        <!-- 모바일에서 사용자 정보 표시 -->
        <div v-if="isMobile" class="mobile-user-info">
          <div class="user-avatar-large">
            <img 
              v-if="currentUser?.avatar" 
              :src="currentUser.avatar" 
              :alt="`${currentUser.displayName} 아바타`"
            />
            <span v-else class="avatar-initial-large">
              {{ getInitial(currentUser?.displayName) }}
            </span>
          </div>
          <div class="user-details-mobile">
            <div class="user-name-mobile">{{ currentUser?.displayName }}</div>
            <div class="user-department-mobile">{{ currentUser?.department }}</div>
            <div class="user-email-mobile">{{ currentUser?.email }}</div>
          </div>
        </div>
        
        <!-- 메뉴 항목들 -->
        <div class="menu-items">
          <Button
            @click="openUserSettings"
            class="menu-item"
            text
            role="menuitem"
            tabindex="0"
          >
            <i class="pi pi-user menu-icon"></i>
            <span>사용자 설정</span>
          </Button>
          
          <Button
            @click="openMessageBox"
            class="menu-item"
            text
            role="menuitem"
            tabindex="0"
          >
            <i class="pi pi-envelope menu-icon"></i>
            <span>메시지함</span>
            <Badge 
              v-if="unreadMessageCount > 0" 
              :value="unreadMessageCount" 
              severity="danger"
              class="message-badge"
            />
          </Button>
          
          <div class="menu-divider"></div>
          
          <Button
            @click="handleLogout"
            class="menu-item logout-item"
            text
            role="menuitem"
            tabindex="0"
          >
            <i class="pi pi-sign-out menu-icon"></i>
            <span>로그아웃</span>
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useBreakpoints } from '@/composables/useBreakpoints';

// Store 및 Composables
const userStore = useUserStore();
const { isMobile } = useBreakpoints();

// Refs
const menuContainer = ref<HTMLElement>();

// Computed
const currentUser = computed(() => userStore.currentUser);
const menuState = computed(() => userStore.menuState);
const unreadMessageCount = computed(() => userStore.unreadMessageCount);

// Methods
const toggleMenu = () => {
  userStore.toggleUserMenu();
};

const closeMenu = () => {
  userStore.closeUserMenu();
};

const getInitial = (name?: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const openUserSettings = () => {
  userStore.openUserSettings();
  closeMenu();
};

const openMessageBox = () => {
  userStore.openMessageBox();
  closeMenu();
};

const handleLogout = async () => {
  await userStore.handleLogout();
  closeMenu();
};

// 외부 클릭 감지
const handleClickOutside = (event: Event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target as Node)) {
    closeMenu();
  }
};

// 키보드 네비게이션
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menuState.value.isOpen) {
    closeMenu();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>
```

### 스타일 구현
```scss
.user-info-menu {
  position: relative;
  display: inline-block;
}

.user-info-button {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--surface-2);
  }
  
  &.menu-open {
    background: var(--bg-tertiary);
    border-color: var(--primary);
  }
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-initial {
    color: white;
    font-size: var(--text-sm);
    font-weight: 600;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  
  .user-department {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    line-height: 1.2;
  }
  
  .user-name {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }
}

.dropdown-arrow {
  font-size: var(--text-xs);
  color: var(--text-muted);
  transition: transform var(--transition-normal);
  
  &.rotated {
    transform: rotate(180deg);
  }
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-2);
  min-width: 240px;
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
}

.mobile-user-info {
  padding: var(--space-4);
  border-bottom: 1px solid var(--surface-2);
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  
  .user-avatar-large {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-initial-large {
      color: white;
      font-size: var(--text-lg);
      font-weight: 600;
    }
  }
  
  .user-details-mobile {
    flex: 1;
    min-width: 0;
    
    .user-name-mobile {
      font-size: var(--text-base);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }
    
    .user-department-mobile {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin-bottom: var(--space-1);
    }
    
    .user-email-mobile {
      font-size: var(--text-xs);
      color: var(--text-muted);
    }
  }
}

.menu-items {
  padding: var(--space-2);
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--space-3) var(--space-4);
  border: none;
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  
  .menu-icon {
    font-size: var(--text-base);
    color: var(--text-secondary);
    width: 20px;
    flex-shrink: 0;
  }
  
  span {
    font-size: var(--text-sm);
    font-weight: 500;
  }
  
  .message-badge {
    margin-left: auto;
  }
  
  &.logout-item {
    color: var(--error);
    
    .menu-icon {
      color: var(--error);
    }
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
}

.menu-divider {
  height: 1px;
  background: var(--surface-2);
  margin: var(--space-2) 0;
}

// 드롭다운 애니메이션
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-normal);
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

// 반응형
@media (max-width: 768px) {
  .user-details {
    display: none;
  }
  
  .user-dropdown-menu {
    right: -20px;
    min-width: 280px;
  }
  
  .menu-item {
    min-height: 44px; // 터치 타겟 크기
  }
}

@media (max-width: 640px) {
  .user-dropdown-menu {
    position: fixed;
    top: var(--header-height);
    right: 0;
    left: 0;
    margin-top: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    max-height: calc(100vh - var(--header-height));
    overflow-y: auto;
  }
}
```

### Pinia Store 구현
```typescript
// stores/userStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserPreferences, UserMenuState } from '@/types/user';
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

  const login = async (credentials: { username: string; password: string }) => {
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
```

## 테스트 전략

### 단위 테스트
```typescript
// UserInfoMenu.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UserInfoMenu from '@/components/header/UserInfoMenu.vue';
import { useUserStore } from '@/stores/userStore';

describe('UserInfoMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('사용자 정보를 올바르게 표시한다', () => {
    const wrapper = mount(UserInfoMenu);
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
        theme: 'dark',
        language: 'ko',
        notifications: {
          email: true,
          push: true,
          sound: false
        }
      }
    };

    expect(wrapper.find('.user-name').text()).toBe('장종익');
    expect(wrapper.find('.user-department').text()).toBe('냉연생산SM팀');
    expect(wrapper.find('.avatar-initial').text()).toBe('장');
  });

  it('메뉴 토글이 올바르게 동작한다', async () => {
    const wrapper = mount(UserInfoMenu);
    const userStore = useUserStore();
    
    expect(userStore.menuState.isOpen).toBe(false);
    expect(wrapper.find('.user-dropdown-menu').exists()).toBe(false);
    
    await wrapper.find('.user-info-button').trigger('click');
    
    expect(userStore.menuState.isOpen).toBe(true);
    expect(wrapper.find('.user-dropdown-menu').exists()).toBe(true);
  });

  it('키보드 네비게이션이 올바르게 동작한다', async () => {
    const wrapper = mount(UserInfoMenu);
    const userStore = useUserStore();
    
    // Enter 키로 메뉴 열기
    await wrapper.find('.user-info-button').trigger('keydown.enter');
    expect(userStore.menuState.isOpen).toBe(true);
    
    // Escape 키로 메뉴 닫기
    await wrapper.find('.user-info-button').trigger('keydown.escape');
    expect(userStore.menuState.isOpen).toBe(false);
  });

  it('로그아웃 확인 다이얼로그가 표시된다', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const wrapper = mount(UserInfoMenu);
    const userStore = useUserStore();
    
    userStore.menuState.isOpen = true;
    await wrapper.vm.$nextTick();
    
    await wrapper.find('.logout-item').trigger('click');
    
    expect(confirmSpy).toHaveBeenCalledWith('정말 로그아웃하시겠습니까?');
  });
});
```

### 통합 테스트
```typescript
// UserStore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { userApi } from '@/api/userApi';

vi.mock('@/api/userApi');

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('사용자 정보를 성공적으로 가져온다', async () => {
    const mockUser = {
      id: '1',
      username: 'test',
      displayName: '테스트 사용자',
      department: '테스트팀'
    };

    vi.mocked(userApi.getCurrentUser).mockResolvedValue(mockUser);
    vi.mocked(userApi.getUnreadMessageCount).mockResolvedValue(5);

    const userStore = useUserStore();
    await userStore.fetchUserInfo();

    expect(userStore.currentUser).toEqual(mockUser);
    expect(userStore.isAuthenticated).toBe(true);
    expect(userStore.unreadMessageCount).toBe(5);
  });

  it('로그아웃이 올바르게 동작한다', async () => {
    const userStore = useUserStore();
    userStore.currentUser = { id: '1', displayName: '테스트' };
    userStore.isAuthenticated = true;

    vi.mocked(userApi.logout).mockResolvedValue();

    await userStore.logout();

    expect(userStore.currentUser).toBeNull();
    expect(userStore.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth-token')).toBeNull();
  });
});
```

## 접근성 고려사항

### ARIA 속성
- `aria-haspopup="true"`: 드롭다운 메뉴가 있음을 표시
- `aria-expanded`: 메뉴 열림/닫힘 상태 표시
- `role="menu"`, `role="menuitem"`: 메뉴 구조 명시
- `aria-labelledby`: 메뉴와 버튼 연결

### 키보드 네비게이션
- `Tab`: 포커스 이동
- `Enter/Space`: 메뉴 열기/닫기
- `Escape`: 메뉴 닫기
- `Arrow Keys`: 메뉴 항목 간 이동

### 스크린 리더 지원
- 의미 있는 alt 텍스트
- 상태 변화 알림
- 구조적 마크업

## 성능 최적화

### 지연 로딩
- 드롭다운 메뉴 컴포넌트 지연 로딩
- 사용자 아바타 이미지 지연 로딩

### 메모이제이션
- 사용자 이니셜 계산 캐싱
- 메뉴 상태 변경 최적화

### 이벤트 최적화
- 외부 클릭 이벤트 디바운싱
- 메뉴 애니메이션 최적화

## 에러 처리

### 사용자 정보 로딩 실패
- 기본 아바타 표시
- 에러 메시지 표시
- 재시도 기능 제공

### 네트워크 오류
- 오프라인 상태 감지
- 캐시된 데이터 사용
- 연결 복구 시 자동 동기화

## 확장 가능성

### 추가 메뉴 항목
- 설정 서브메뉴
- 알림 센터
- 도움말 링크

### 사용자 역할별 메뉴
- 관리자 전용 메뉴
- 권한별 메뉴 표시/숨김

### 다국어 지원
- 메뉴 텍스트 국제화
- RTL 언어 지원

## 결론

본 설계서는 사용자 정보 드롭다운 메뉴 컴포넌트의 완전한 구현 가이드를 제공합니다. 접근성, 성능, 확장성을 모두 고려한 설계로 사용자 경험을 극대화하고, 유지보수가 용이한 코드 구조를 제시합니다.

이전 Phase의 컨셉과 일치하며, 전체 MES UI 프레임워크의 일관된 디자인 시스템을 따릅니다.
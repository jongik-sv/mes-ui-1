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
      :aria-expanded="menuState.isOpen.toString()"
      aria-label="사용자 메뉴"
      id="user-menu-button"
      text
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
import Button from 'primevue/button';
import Badge from 'primevue/badge';
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

const getInitial = (name?: string): string => {
  if (!name || name.trim().length === 0) return '?';
  return name.trim().charAt(0).toUpperCase();
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

// Event handlers
const handleClickOutside = (event: Event) => {
  const target = event.target as Node;
  if (menuContainer.value && 
      target && 
      !menuContainer.value.contains(target) && 
      menuState.value.isOpen) {
    closeMenu();
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menuState.value.isOpen) {
    event.preventDefault();
    closeMenu();
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside, { passive: true });
  document.addEventListener('keydown', handleKeyDown, { passive: false });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
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
  
  &:hover:not(.menu-open) {
    background: var(--bg-tertiary);
    border-color: var(--surface-2);
  }
  
  &.menu-open {
    background: var(--bg-tertiary);
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary-alpha-20);
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
</style>
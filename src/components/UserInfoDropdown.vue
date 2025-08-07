<template>
  <div class="user-info-dropdown" ref="dropdownRef" data-testid="user-info-dropdown">
    <Button
      @click="toggleDropdown"
      class="user-info-trigger"
      text
      :aria-expanded="isOpen"
      aria-haspopup="true"
      data-testid="user-info-button"
    >
      <div class="user-avatar">
        <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
        <span v-else class="avatar-initial">{{ getInitial(user.name) }}</span>
      </div>
      <div class="user-details">
        <div class="user-department">{{ user.department }}</div>
        <div class="user-name">{{ user.name }}</div>
      </div>
      <i class="pi pi-chevron-down" :class="{ 'rotate-180': isOpen }" />
    </Button>
    
    <div 
      v-if="isOpen" 
      class="dropdown-menu"
      role="menu"
      data-testid="user-dropdown-menu"
    >
      <Button
        text
        class="dropdown-item"
        @click="handleSettings"
        role="menuitem"
      >
        <i class="pi pi-cog" />
        사용자 설정
      </Button>
      <Button
        text
        class="dropdown-item"
        @click="handleMessages"
        role="menuitem"
      >
        <i class="pi pi-envelope" />
        메시지함
      </Button>
      <Divider />
      <Button
        text
        class="dropdown-item dropdown-item--danger"
        @click="handleLogout"
        role="menuitem"
      >
        <i class="pi pi-sign-out" />
        로그아웃
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import type { UserInfo } from '@/types/header';

interface Props {
  /** 사용자 정보 */
  user: UserInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  settings: [];
  messages: [];
  logout: [];
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const handleSettings = () => {
  emit('settings');
  isOpen.value = false;
};

const handleMessages = () => {
  emit('messages');
  isOpen.value = false;
};

const handleLogout = () => {
  emit('logout');
  isOpen.value = false;
};

// 외부 클릭 감지
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.user-info-dropdown {
  position: relative;
  
  .user-info-trigger {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--space-2);
    border-radius: 0.375rem;
    transition: var(--transition-normal);
    
    &:hover {
      background: var(--bg-tertiary);
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
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .avatar-initial {
      color: white;
      font-weight: 600;
      font-size: var(--text-sm);
    }
  }
  
  .user-details {
    text-align: left;
    min-width: 0;
    
    .user-department {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .user-name {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-primary);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .pi-chevron-down {
    transition: transform var(--transition-normal);
    color: var(--text-secondary);
    margin-left: var(--space-2);
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--space-2);
    background: var(--bg-secondary);
    border: 1px solid var(--surface-2);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    min-width: 200px;
    z-index: 1000;
    padding: var(--space-2);
    
    .dropdown-item {
      width: 100%;
      justify-content: flex-start;
      gap: var(--gap-sm);
      padding: var(--space-2) var(--space-3);
      border-radius: 0.375rem;
      color: var(--text-primary);
      
      &:hover {
        background: var(--bg-tertiary);
      }
      
      &:focus {
        outline: 2px solid var(--primary);
        outline-offset: -2px;
      }
      
      &--danger {
        color: var(--error);
        
        &:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      }
      
      i {
        font-size: var(--text-sm);
      }
    }
  }
  
  @media (max-width: 768px) {
    .user-details {
      display: none;
    }
    
    .dropdown-menu {
      right: -50px;
      min-width: 180px;
    }
  }
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
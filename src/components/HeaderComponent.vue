<template>
  <div 
    class="mes-header"
    :class="{ 'mes-header--fixed': fixed, 'mes-header--shadow': shadow }"
  >
    <div class="header-left">
      <button
        class="menu-tree-toggle-btn"
        @click="handleMenuTreeToggle"
        :aria-label="menuTreeOpen ? '메뉴트리 닫기' : '메뉴트리 열기'"
        :aria-expanded="menuTreeOpen"
      >
        <span class="hamburger-icon" :class="{ 'active': menuTreeOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <GlobalMenuButton
        :is-open="globalMenuOpen"
        @click="handleGlobalMenuClick"
      />
    </div>
    
    <div class="header-center">
      <CompanyLogo 
        :company-name="companyName"
        :logo-url="logoUrl"
        :size="logoSize"
      />
    </div>
    
    <div class="header-right">
      <UserInfoDropdown
        v-if="currentUser"
        :user="currentUser"
        @settings="handleUserSettings"
        @messages="handleUserMessages"
        @logout="handleUserLogout"
      />
      <ContactListButton
        :contacts="contacts"
        @open="handleContactOpen"
        @close="handleContactClose"
      />
      <RemoteSupportButton
        :url="remoteSupportUrl"
        @click="handleRemoteSupportClick"
      />
    </div>

    <!-- 전체 메뉴 모달 -->
    <GlobalMenuModal
      v-model:visible="globalMenuOpen"
      :menu-items="menuItems"
      @menu-select="handleMenuSelect"
      @favorite-toggle="handleFavoriteToggle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlobalMenuButton from './GlobalMenuButton.vue';
import CompanyLogo from './CompanyLogo.vue';
import UserInfoDropdown from './header/UserInfoMenu.vue';
import ContactListButton from './ContactListButton.vue';
import RemoteSupportButton from './RemoteSupportButton.vue';
import GlobalMenuModal from './modals/GlobalMenuModal.vue';
import type { HeaderProps, HeaderEvents } from '@/types/header';
import type { MenuItem } from '@/types/menu';
import { DEFAULT_COMPANY_NAME, DEFAULT_REMOTE_SUPPORT_URL, DEFAULT_USER, DEFAULT_CONTACTS } from '@/constants/header';

interface Props extends HeaderProps {
  /** 메뉴 아이템 목록 */
  menuItems?: MenuItem[]
}

const props = withDefaults(defineProps<Props>(), {
  fixed: true,
  shadow: true,
  companyName: DEFAULT_COMPANY_NAME,
  logoSize: 'md',
  currentUser: () => DEFAULT_USER,
  contacts: () => DEFAULT_CONTACTS,
  remoteSupportUrl: DEFAULT_REMOTE_SUPPORT_URL,
  menuItems: () => []
});

const emit = defineEmits<HeaderEvents>();

const globalMenuOpen = ref(false);
const menuTreeOpen = ref(false);

const handleMenuTreeToggle = () => {
  menuTreeOpen.value = !menuTreeOpen.value;
  emit('menu-tree-toggle', menuTreeOpen.value);
};

const handleGlobalMenuClick = () => {
  globalMenuOpen.value = !globalMenuOpen.value;
  emit('global-menu-click');
};

const handleUserSettings = () => {
  emit('user-settings');
};

const handleUserMessages = () => {
  emit('user-messages');
};

const handleUserLogout = () => {
  emit('user-logout');
};

const handleContactOpen = () => {
  emit('contact-open');
};

const handleContactClose = () => {
  emit('contact-close');
};

const handleRemoteSupportClick = (url: string) => {
  emit('remote-support-click', url);
};

const handleMenuSelect = (menu: MenuItem) => {
  emit('menu-select', menu);
};

const handleFavoriteToggle = (menuId: string) => {
  emit('favorite-toggle', menuId);
};
</script>

<style lang="scss" scoped>
.mes-header {
  height: 60px;
  width: 100%;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--surface-2);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0;
  z-index: 1000;
  
  &--fixed {
    position: sticky;
    top: 0;
  }
  
  &--shadow {
    box-shadow: var(--shadow-sm);
  }
  
  .header-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: var(--space-4);
    gap: var(--space-2);
  }
  
  .header-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
    padding-right: var(--space-4);
  }
  
  .menu-tree-toggle-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--border-radius-md);
    transition: background-color var(--transition-normal);
    
    &:hover {
      background: var(--bg-tertiary);
    }
    
    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }
  
  .hamburger-icon {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 24px;
    height: 18px;
    
    span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 1px;
      transition: all var(--transition-normal);
    }
    
    &.active {
      span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }
      
      span:nth-child(2) {
        opacity: 0;
      }
      
      span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
      }
    }
  }
  
  @media (max-width: 768px) {
    height: 56px;
    
    .header-left {
      padding-left: var(--space-3);
    }
    
    .header-right {
      gap: var(--space-1);
      padding-right: var(--space-3);
    }
  }
  
  @media (max-width: 480px) {
    .header-left {
      padding-left: var(--space-2);
    }
    
    .header-right {
      gap: var(--space-1);
      padding-right: var(--space-2);
    }
  }
}
</style>
<template>
  <div 
    class="mes-header"
    :class="{ 'mes-header--fixed': fixed, 'mes-header--shadow': shadow }"
  >
    <div class="header-left">
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
  padding: 0 var(--space-6);
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
  }
  
  @media (max-width: 768px) {
    height: 56px;
    padding: 0 var(--space-4);
    
    .header-right {
      gap: var(--space-1);
    }
  }
  
  @media (max-width: 480px) {
    padding: 0 var(--space-3);
    
    .header-right {
      gap: var(--space-1);
    }
  }
}
</style>
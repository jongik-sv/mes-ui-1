<template>
  <header 
    class="mes-header"
    :class="{
      'header-compact': layoutState.headerCompact
    }"
    role="banner"
  >
    <div class="header-left">
      <!-- 모바일/태블릿: 햄버거 메뉴 -->
      <Button
        v-if="!layoutState.toolbarVisible"
        icon="pi pi-bars"
        text
        rounded
        @click="toggleMobileMenu"
        class="hamburger-menu-btn touch-friendly"
        aria-label="메뉴 열기"
      />
      
      <!-- 데스크톱: 전체 메뉴 아이콘 -->
      <Button
        v-else
        icon="pi pi-th-large"
        text
        rounded
        @click="toggleGlobalMenu"
        class="global-menu-btn touch-friendly"
        aria-label="전체 메뉴"
      />
      
      <!-- 회사 로고 -->
      <div class="company-logo">
        <span class="logo-text">DONGKUK CM</span>
      </div>
    </div>
    
    <div class="header-right">
      <!-- 사용자 정보 (반응형 조정) -->
      <UserInfoMenu :compact="layoutState.headerCompact" />
      
      <!-- 연락처 (태블릿 이상에서만 표시) -->
      <ContactList v-if="currentBreakpoint !== 'mobile'" />
      
      <!-- 원격 지원 -->
      <RemoteSupport />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import Button from 'primevue/button';
import UserInfoMenu from './UserInfoMenu.vue';
import ContactList from './ContactList.vue';
import RemoteSupport from './RemoteSupport.vue';

const responsive = useResponsiveLayout();
const { 
  currentBreakpoint, 
  layoutState, 
  toggleMobileMenu 
} = responsive;

// 전체 메뉴 토글 (데스크톱용)
const toggleGlobalMenu = () => {
  // TODO: 전체 메뉴 모달 표시 로직 구현
  console.log('전체 메뉴 토글');
};
</script>

<style lang="scss" scoped>
.mes-header {
  height: var(--header-height, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4, 1rem);
  background: var(--bg-secondary, #1e293b);
  border-bottom: 1px solid var(--surface-2, #64748b);
  transition: all var(--transition-normal, 0.2s);
  
  &.header-compact {
    height: 56px;
    padding: 0 var(--space-3, 0.75rem);
    
    .logo-text {
      font-size: var(--text-sm, 0.875rem);
    }
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4, 1rem);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2, 0.5rem);
}

.company-logo {
  .logo-text {
    font-size: var(--text-lg, 1.125rem);
    font-weight: 700;
    color: var(--text-primary, #f8fafc);
    transition: font-size var(--transition-normal, 0.2s);
  }
}

.touch-friendly {
  min-width: 44px;
  min-height: 44px;
}

.hamburger-menu-btn,
.global-menu-btn {
  color: var(--text-primary, #f8fafc);
  
  &:hover {
    background: var(--bg-tertiary, #334155);
  }
}

@media (max-width: 768px) {
  .mes-header {
    height: 56px;
    padding: 0 var(--space-3, 0.75rem);
  }
}
</style>
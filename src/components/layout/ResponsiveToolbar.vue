<template>
  <!-- 데스크톱: 고정 툴바 -->
  <aside
    v-if="layoutState.value.toolbarVisible"
    class="toolbar-sidebar"
    role="navigation"
    aria-label="주요 메뉴"
  >
    <div class="toolbar-icons">
      <ToolbarIcon
        v-for="icon in toolbarIcons"
        :key="icon.id"
        :icon="icon"
        :active="activeIcon.value === icon.id"
        @click="handleIconClick(icon)"
      />
    </div>
  </aside>
  
  <!-- 모바일/태블릿: 햄버거 메뉴 -->
  <Sidebar
    v-else
    v-model:visible="mobileMenuOpen.value"
    position="left"
    class="mobile-toolbar-drawer"
    :modal="true"
    :dismissable="true"
    @hide="closeMobileMenu"
  >
    <template #header>
      <h3>메뉴</h3>
    </template>
    
    <div class="mobile-toolbar-content">
      <!-- 툴바 아이콘들 (세로 배치) -->
      <div class="mobile-toolbar-icons">
        <ToolbarIcon
          v-for="icon in toolbarIcons"
          :key="icon.id"
          :icon="icon"
          :active="activeIcon.value === icon.id"
          :mobile="true"
          @click="handleMobileIconClick(icon)"
        />
      </div>
      
      <!-- 메뉴 트리 (선택된 카테고리) -->
      <div v-if="selectedCategory.value" class="mobile-menu-tree">
        <MenuTree
          :nodes="selectedCategoryMenus.value"
          :mode="layoutState.value.menuTreeMode"
          @menu-select="handleMenuSelect"
        />
      </div>
    </div>
  </Sidebar>
</template>

<script setup lang="ts">
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
import { useToolbar, type ToolbarIcon } from '@/composables/useToolbar';
import Sidebar from 'primevue/sidebar';
import ToolbarIcon from './ToolbarIcon.vue';
import MenuTree from './MenuTree.vue';

const { 
  layoutState, 
  mobileMenuOpen, 
  closeMobileMenu 
} = useResponsiveLayout();

const {
  toolbarIcons,
  activeIcon,
  selectedCategory,
  selectedCategoryMenus,
  handleIconClick
} = useToolbar();

// 모바일에서 아이콘 클릭 시 메뉴 트리 표시
const handleMobileIconClick = (icon: ToolbarIcon) => {
  handleIconClick(icon);
  // 모바일에서는 메뉴를 닫지 않고 트리를 표시
};

const handleMenuSelect = (menu: any) => {
  // 메뉴 선택 시 모바일 메뉴 닫기
  closeMobileMenu();
  // TODO: 탭 생성 로직 구현
  console.log('메뉴 선택:', menu);
};
</script>

<style lang="scss" scoped>
.toolbar-sidebar {
  width: var(--toolbar-width, 80px);
  height: calc(100vh - var(--header-height, 60px));
  background: var(--bg-secondary, #1e293b);
  border-right: 1px solid var(--surface-2, #64748b);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: var(--header-height, 60px);
  z-index: 100;
}

.toolbar-icons {
  display: flex;
  flex-direction: column;
  gap: var(--space-2, 0.5rem);
  padding: var(--space-4, 1rem);
}

.mobile-toolbar-drawer {
  :deep(.p-sidebar-content) {
    width: 280px;
  }
}

.mobile-toolbar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-toolbar-icons {
  display: flex;
  flex-direction: column;
  gap: var(--space-2, 0.5rem);
  padding: var(--space-4, 1rem);
  border-bottom: 1px solid var(--surface-2, #64748b);
}

.mobile-menu-tree {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4, 1rem);
}

@media (max-width: 768px) {
  .mobile-toolbar-drawer :deep(.p-sidebar-content) {
    width: 100vw;
  }
}
</style>
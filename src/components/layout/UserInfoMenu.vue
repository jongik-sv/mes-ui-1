<template>
  <div class="user-info-menu" :class="{ 'user-info-compact': compact }">
    <Button
      @click="toggleUserMenu"
      class="user-info-btn"
      text
    >
      <div class="user-info-content">
        <div class="avatar">장</div>
        <div v-if="!compact" class="user-details">
          <div class="department">냉연생산SM팀</div>
          <div class="username">장종익</div>
        </div>
      </div>
    </Button>
    
    <!-- 드롭다운 메뉴 (구현 예정) -->
    <div v-if="showUserMenu" class="user-dropdown">
      <!-- TODO: 사용자 메뉴 구현 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

interface Props {
  compact?: boolean;
}

defineProps<Props>();

const showUserMenu = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};
</script>

<style lang="scss" scoped>
.user-info-menu {
  position: relative;
}

.user-info-btn {
  padding: var(--space-2, 0.5rem);
  
  &:hover {
    background: var(--bg-tertiary, #334155);
  }
}

.user-info-content {
  display: flex;
  align-items: center;
  gap: var(--space-2, 0.5rem);
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--primary, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--text-sm, 0.875rem);
  font-weight: 600;
}

.user-details {
  text-align: left;
  
  .department {
    font-size: var(--text-xs, 0.75rem);
    color: var(--text-secondary, #e2e8f0);
    line-height: 1.2;
  }
  
  .username {
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-primary, #f8fafc);
    font-weight: 500;
    line-height: 1.2;
  }
}

.user-info-compact {
  .avatar {
    width: 28px;
    height: 28px;
    font-size: var(--text-xs, 0.75rem);
  }
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: var(--space-2, 0.5rem);
  background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--surface-2, #64748b);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
  z-index: 50;
  min-width: 200px;
}
</style>
<template>
  <button
    :aria-label="ariaLabel"
    :aria-expanded="isOpen"
    @click="handleClick"
    class="global-menu-btn"
    data-testid="global-menu-button"
  >
    <i class="fi fi-sr-grid"></i>
  </button>
</template>

<script setup lang="ts">

interface Props {
  /** 메뉴 열림 상태 */
  isOpen?: boolean;
  /** 접근성 라벨 */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  ariaLabel: '전체 메뉴'
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit('click');
};
</script>

<style lang="scss" scoped>
.global-menu-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  
  i {
    font-size: 18px;
  }
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary);
  }
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
</style>
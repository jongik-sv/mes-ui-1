<template>
  <Button
    icon="pi pi-bars"
    text
    rounded
    size="large"
    :aria-label="ariaLabel"
    :aria-expanded="isOpen"
    @click="handleClick"
    class="global-menu-btn"
    data-testid="global-menu-button"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button';

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
  color: var(--text-primary);
  transition: var(--transition-normal);
  
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
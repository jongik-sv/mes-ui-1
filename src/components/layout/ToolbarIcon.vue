<template>
  <div 
    class="toolbar-icon-wrapper"
    :class="{ 'toolbar-icon-mobile': mobile }"
    @click="$emit('click')"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <Button
      :icon="icon.iconName"
      text
      rounded
      size="large"
      :class="{ 
        'toolbar-icon': true,
        'toolbar-icon--active': active,
        'toolbar-icon--rotating': isHovering && !mobile
      }"
    />
    
    <!-- 데스크톱 툴팁 -->
    <div 
      v-if="showTooltip && isHovering && !mobile"
      class="toolbar-tooltip"
    >
      {{ icon.label }}
    </div>
    
    <!-- 모바일 라벨 -->
    <span v-if="mobile" class="mobile-label">{{ icon.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

interface Props {
  icon: {
    id: string;
    label: string;
    iconName: string;
  };
  active?: boolean;
  mobile?: boolean;
}

defineProps<Props>();
defineEmits(['click']);

const isHovering = ref(false);
const showTooltip = ref(true);

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};
</script>

<style lang="scss" scoped>
.toolbar-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  
  &.toolbar-icon-mobile {
    gap: var(--space-3, 0.75rem);
    padding: var(--space-2, 0.5rem);
    border-radius: 0.375rem;
    
    &:hover {
      background: var(--bg-tertiary, #334155);
    }
  }
}

.toolbar-icon {
  transition: transform var(--transition-normal, 0.2s) ease;
  color: var(--text-primary, #f8fafc);
  
  &--rotating {
    transform: rotate(90deg);
  }
  
  &--active {
    background: var(--primary, #3b82f6);
    color: white;
  }
  
  &:hover {
    background: var(--bg-tertiary, #334155);
  }
}

.toolbar-tooltip {
  position: absolute;
  left: calc(100% + var(--space-2, 0.5rem));
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-primary, #0f172a);
  color: var(--text-primary, #f8fafc);
  padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
  border-radius: 0.375rem;
  font-size: var(--text-sm, 0.875rem);
  white-space: nowrap;
  z-index: 50;
  border: 1px solid var(--surface-2, #64748b);
  box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
}

.mobile-label {
  font-size: var(--text-sm, 0.875rem);
  color: var(--text-primary, #f8fafc);
  font-weight: 500;
}
</style>
<template>
  <component
    :is="iconComponent"
    :size="iconSizeValue"
    :stroke-width="strokeWidth"
    :class="iconClasses"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, shallowRef, watchEffect } from 'vue'
import { useIcons } from '@/composables/useIcons'
import type { IconSize } from '@/types/icons'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: IconSize
  strokeWidth?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  strokeWidth: 1.5
})

const { getIcon } = useIcons()

// 아이콘 크기를 픽셀 값으로 변환
const iconSizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40
}

const iconSizeValue = computed(() => iconSizeMap[props.size])

// 아이콘 컴포넌트 참조
const iconComponent = shallowRef(LucideIcons.HelpCircle)

// 아이콘 로드
watchEffect(() => {
  const lucideIconName = getIcon(props.name)
  const IconComponent = (LucideIcons as any)[lucideIconName]
  
  if (IconComponent) {
    iconComponent.value = IconComponent
  } else {
    console.warn(`Icon "${lucideIconName}" not found in lucide-vue-next`)
    iconComponent.value = LucideIcons.HelpCircle
  }
})

// CSS 클래스 계산
const iconClasses = computed(() => [
  'mes-icon',
  `mes-icon--${props.size}`,
  props.class
])
</script>

<style scoped>
.mes-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.mes-icon--xs {
  width: var(--icon-xs);
  height: var(--icon-xs);
}

.mes-icon--sm {
  width: var(--icon-sm);
  height: var(--icon-sm);
}

.mes-icon--md {
  width: var(--icon-md);
  height: var(--icon-md);
}

.mes-icon--lg {
  width: var(--icon-lg);
  height: var(--icon-lg);
}

.mes-icon--xl {
  width: var(--icon-xl);
  height: var(--icon-xl);
}

.mes-icon--2xl {
  width: var(--icon-2xl);
  height: var(--icon-2xl);
}
</style>
<template>
  <div class="menu-toggle-buttons">
    <SelectButton
      v-model="selectedMode"
      :options="options"
      option-label="label"
      option-value="value"
      data-testid="select-button"
      aria-label="메뉴 보기 모드 선택"
      @update:model-value="handleModeChange"
    >
      <template #option="{ option }">
        <div class="toggle-option">
          <i v-if="showIcons" :class="option.icon" class="option-icon" />
          <span class="option-label">{{ option.label }}</span>
          <span 
            v-if="option.badge && option.badgeValue > 0" 
            class="option-badge"
            :aria-label="`${option.badgeValue}개 항목`"
          >
            {{ option.badgeValue }}
          </span>
        </div>
      </template>
    </SelectButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SelectButton from 'primevue/selectbutton'
import type { ViewMode } from '@/types/menu'

interface ToggleOption {
  label: string
  value: ViewMode
  icon?: string
  badge?: boolean
  badgeValue?: number
}

interface Props {
  /** 현재 선택된 모드 */
  modelValue: ViewMode
  /** 아이콘 표시 여부 */
  showIcons?: boolean
  /** 즐겨찾기 개수 (배지 표시용) */
  favoriteCount?: number
  /** 전체 메뉴 개수 (배지 표시용) */
  totalCount?: number
  /** 사용자 정의 옵션 */
  customOptions?: ToggleOption[]
}

interface Emits {
  (e: 'update:modelValue', value: ViewMode): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'all',
  showIcons: false,
  favoriteCount: 0,
  totalCount: 0,
  customOptions: undefined
})

const emit = defineEmits<Emits>()

// 내부 상태
const selectedMode = ref<ViewMode>(props.modelValue)

// Props 변경 감지
watch(() => props.modelValue, (newValue) => {
  selectedMode.value = newValue
})

// 옵션 계산
const options = computed<ToggleOption[]>(() => {
  if (props.customOptions) {
    return props.customOptions
  }
  
  return [
    {
      label: '전체보기',
      value: 'all' as ViewMode,
      icon: 'pi pi-list',
      badge: true,
      badgeValue: props.totalCount
    },
    {
      label: '즐겨찾기',
      value: 'favorites' as ViewMode,
      icon: 'pi pi-star-fill',
      badge: true,
      badgeValue: props.favoriteCount
    }
  ]
})

// 이벤트 핸들러
const handleModeChange = (value: ViewMode) => {
  selectedMode.value = value
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.menu-toggle-buttons {
  :deep(.p-selectbutton) {
    .p-button {
      background: var(--bg-secondary);
      border: 1px solid var(--surface-2);
      color: var(--text-secondary);
      padding: var(--space-2) var(--space-4);
      transition: var(--transition-normal);
      position: relative;
      
      // 첫 번째 버튼
      &:first-child {
        border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
        border-right-width: 0.5px;
      }
      
      // 마지막 버튼
      &:last-child {
        border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
        border-left-width: 0.5px;
      }
      
      // 가운데 버튼들 (3개 이상일 때)
      &:not(:first-child):not(:last-child) {
        border-radius: 0;
        border-left-width: 0.5px;
        border-right-width: 0.5px;
      }
      
      // 버튼이 하나만 있을 때
      &:only-child {
        border-radius: var(--border-radius-md);
        border-width: 1px;
      }
      
      // 호버 상태
      &:hover:not(.p-highlight) {
        background: var(--bg-tertiary);
        border-color: var(--surface-1);
        color: var(--text-primary);
        transform: translateY(-1px);
      }
      
      // 선택된 상태
      &.p-highlight {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
        box-shadow: var(--shadow-sm);
        
        .option-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      }
      
      // 포커스 상태
      &:focus {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
        z-index: 1;
      }
      
      // 활성 상태
      &:active {
        transform: translateY(0);
      }
      
      // 비활성화 상태
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }
    }
  }
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  
  .option-icon {
    font-size: var(--text-sm);
    flex-shrink: 0;
  }
  
  .option-label {
    font-weight: 500;
    white-space: nowrap;
    font-size: var(--text-sm);
  }
  
  .option-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    background: var(--surface-3);
    color: var(--text-primary);
    border-radius: 10px;
    font-size: var(--text-xs);
    font-weight: 600;
    padding: 0 var(--space-1);
    margin-left: auto;
    transition: var(--transition-normal);
    
    // 숫자가 0일 때 숨김
    &:empty,
    &[aria-label*="0개"] {
      display: none;
    }
  }
}

// 애니메이션
.menu-toggle-buttons {
  :deep(.p-selectbutton .p-button) {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// 반응형 디자인
@media (max-width: 768px) {
  .menu-toggle-buttons {
    :deep(.p-selectbutton) {
      width: 100%;
      
      .p-button {
        flex: 1;
        padding: var(--space-3) var(--space-2);
        
        .toggle-option {
          justify-content: center;
          
          .option-label {
            font-size: var(--text-xs);
          }
          
          .option-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            min-width: 16px;
            height: 16px;
            font-size: 10px;
            margin-left: 0;
          }
        }
      }
    }
  }
}

// 다크 모드 최적화
@media (prefers-color-scheme: dark) {
  .menu-toggle-buttons {
    :deep(.p-selectbutton .p-button) {
      &.p-highlight {
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
      }
    }
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  .menu-toggle-buttons {
    :deep(.p-selectbutton .p-button) {
      border-width: 2px;
      
      &.p-highlight {
        border-color: var(--primary);
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    }
  }
}

// 모션 감소 선호 시
@media (prefers-reduced-motion: reduce) {
  .menu-toggle-buttons {
    :deep(.p-selectbutton .p-button) {
      transition: none;
      
      &:hover {
        transform: none;
      }
    }
  }
}

// RTL 지원
[dir="rtl"] .toggle-option {
  .option-badge {
    margin-left: 0;
    margin-right: auto;
  }
}

// 키보드 네비게이션 개선
.menu-toggle-buttons {
  :deep(.p-selectbutton) {
    &:focus-within {
      .p-button:focus {
        z-index: 2;
      }
    }
  }
}

// 로딩 상태 (향후 확장 가능)
.menu-toggle-buttons {
  &.loading {
    :deep(.p-selectbutton .p-button) {
      pointer-events: none;
      
      .toggle-option {
        opacity: 0.7;
      }
      
      .option-badge {
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(45deg, transparent 30%, var(--primary) 50%, transparent 70%);
          animation: badge-shimmer 1.5s infinite;
        }
      }
    }
  }
}

@keyframes badge-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}</style>
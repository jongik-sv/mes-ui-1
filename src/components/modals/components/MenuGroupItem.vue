<template>
  <div class="menu-group-item">
    <div
      class="menu-item"
      :class="{
        'has-children': hasChildren,
        'is-leaf': !hasChildren,
        [`level-${level}`]: true
      }"
      :data-testid="`menu-item-${item.id}`"
      @click="handleItemClick"
    >
      <!-- 들여쓰기 -->
      <div class="indent" :style="{ width: `${level * 16}px` }"></div>

      <!-- 확장/축소 아이콘 (자식이 있는 경우) -->
      <div class="expand-toggle" v-if="hasChildren">
        <i 
          class="expand-icon"
          :class="{ expanded: isExpanded }"
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </i>
      </div>
      <div class="expand-placeholder" v-else></div>

      <!-- 메뉴 아이콘 -->
      <div class="menu-icon" v-if="item.icon">
        <i :class="item.icon"></i>
      </div>

      <!-- 메뉴 제목 -->
      <div class="menu-title" :title="item.title">
        <span class="title-text" v-html="highlightedTitle"></span>
      </div>

      <!-- 즐겨찾기 버튼 -->
      <button
        class="favorite-btn"
        :class="{ active: isFavorite }"
        :data-testid="`favorite-btn-${item.id}`"
        @click.stop="handleFavoriteToggle"
        :aria-label="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
      >
        <i class="favorite-icon" :class="{ active: isFavorite }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon>
          </svg>
        </i>
      </button>
    </div>

    <!-- 자식 메뉴 아이템들 -->
    <div 
      v-if="hasChildren && isExpanded"
      class="children-container"
    >
      <MenuGroupItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :search-query="searchQuery"
        :favorites="favorites"
        :level="level + 1"
        @menu-select="handleMenuSelect"
        @favorite-toggle="handleFavoriteToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MenuItem } from '@/types/menu'

interface Props {
  /** 메뉴 아이템 */
  item: MenuItem
  /** 검색어 */
  searchQuery?: string
  /** 즐겨찾기 목록 */
  favorites?: Set<string>
  /** 들여쓰기 레벨 */
  level?: number
}

interface Emits {
  (e: 'menu-select', item: MenuItem): void
  (e: 'favorite-toggle', itemId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  favorites: () => new Set(),
  level: 0
})

const emit = defineEmits<Emits>()

// 상태
const isExpanded = ref(true) // 기본적으로 확장 상태

// 계산된 속성
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isFavorite = computed(() => {
  return props.favorites.has(props.item.id)
})

const highlightedTitle = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.item.title
  }

  const query = props.searchQuery.toLowerCase()
  const title = props.item.title
  const index = title.toLowerCase().indexOf(query)

  if (index === -1) {
    return title
  }

  const before = title.substring(0, index)
  const match = title.substring(index, index + query.length)
  const after = title.substring(index + query.length)

  return `${before}<mark class="search-highlight">${match}</mark>${after}`
})

// 이벤트 핸들러
const handleItemClick = () => {
  if (hasChildren.value) {
    // 자식이 있는 경우 확장/축소 토글
    isExpanded.value = !isExpanded.value
  } else {
    // 최종 메뉴인 경우 선택 이벤트 발생
    emit('menu-select', props.item)
  }
}

const handleMenuSelect = (item: MenuItem) => {
  emit('menu-select', item)
}

const handleFavoriteToggle = () => {
  emit('favorite-toggle', props.item.id)
}
</script>

<style lang="scss" scoped>
.menu-group-item {
  .menu-item {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    cursor: pointer;
    transition: var(--transition-normal);
    border-radius: var(--border-radius-sm);
    margin: 1px var(--space-2);
    min-height: 36px;

    &:hover {
      background: var(--bg-tertiary);
    }

    &.is-leaf:hover {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: -2px;
    }

    // 레벨별 스타일링
    &.level-0 {
      font-weight: 500;
    }

    &.level-1 {
      font-size: var(--text-sm);
    }

    &.level-2,
    &.level-3,
    &.level-4 {
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }
  }

  .indent {
    flex-shrink: 0;
  }

  .expand-toggle {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--space-2);

    .expand-icon {
      color: var(--text-secondary);
      transition: transform var(--transition-normal);
      display: flex;
      align-items: center;
      justify-content: center;

      &.expanded {
        transform: rotate(90deg);
      }

      svg {
        width: 12px;
        height: 12px;
      }
    }
  }

  .expand-placeholder {
    width: 20px;
    margin-right: var(--space-2);
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: var(--space-2);
    color: var(--text-secondary);

    i {
      font-size: 16px;
    }
  }

  .menu-title {
    flex: 1;
    min-width: 0;
    
    .title-text {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :deep(.search-highlight) {
      background: var(--warning-100);
      color: var(--warning-800);
      padding: 0 2px;
      border-radius: 2px;
      font-weight: 600;
    }
  }

  .favorite-btn {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-normal);
    margin-left: var(--space-2);

    &:hover {
      background: var(--bg-tertiary);
    }

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    .favorite-icon {
      color: var(--text-muted);
      transition: var(--transition-normal);

      &.active {
        color: var(--warning-500);
        
        svg {
          fill: currentColor;
        }
      }

      svg {
        width: 14px;
        height: 14px;
        fill: none;
      }
    }

    &:hover .favorite-icon {
      color: var(--warning-400);
    }
  }

  .children-container {
    margin-left: var(--space-2);
    border-left: 1px solid var(--surface-2);
    margin-top: var(--space-1);
  }
}

// 다크 테마에서의 하이라이트 색상 조정
[data-theme="dark"] {
  .menu-title :deep(.search-highlight) {
    background: var(--warning-900);
    color: var(--warning-200);
  }
}

// 접근성 개선
@media (prefers-reduced-motion: reduce) {
  .expand-icon,
  .menu-item,
  .favorite-btn {
    transition: none;
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  .menu-item {
    border: 1px solid transparent;

    &:hover,
    &:focus {
      border-color: var(--text-primary);
    }
  }
}

// 터치 디바이스 최적화
@media (hover: none) and (pointer: coarse) {
  .menu-item {
    min-height: 44px; // 터치 타겟 최소 크기
  }

  .favorite-btn {
    width: 32px;
    height: 32px;
  }
}
</style>
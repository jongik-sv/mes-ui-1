<template>
  <div class="menu-group">
    <!-- 그룹 헤더 -->
    <div
      class="group-header"
      role="button"
      :aria-expanded="expanded"
      :aria-controls="`group-content-${groupId}`"
      tabindex="0"
      @click="handleToggle"
      @keydown.enter="handleToggle"
      @keydown.space.prevent="handleToggle"
    >
      <h3 class="group-title">{{ title }}</h3>
      <i 
        class="expand-icon"
        :class="{ expanded }"
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </i>
    </div>

    <!-- 그룹 콘텐츠 -->
    <div
      :id="`group-content-${groupId}`"
      class="group-content"
      :class="{ expanded, collapsed: !expanded }"
    >
      <div class="menu-items">
        <template v-for="item in filteredItems" :key="item.id">
          <MenuGroupItem
            :item="item"
            :search-query="searchQuery"
            :favorites="favorites"
            :level="0"
            @menu-select="handleMenuSelect"
            @favorite-toggle="handleFavoriteToggle"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MenuGroupItem from './MenuGroupItem.vue'
import type { MenuItem } from '@/types/menu'

interface Props {
  /** 그룹 제목 */
  title: string
  /** 메뉴 아이템 목록 */
  items: MenuItem[]
  /** 확장 상태 */
  expanded: boolean
  /** 검색어 */
  searchQuery?: string
  /** 즐겨찾기 목록 */
  favorites?: Set<string>
}

interface Emits {
  (e: 'toggle'): void
  (e: 'menu-select', item: MenuItem): void
  (e: 'favorite-toggle', itemId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  favorites: () => new Set()
})

const emit = defineEmits<Emits>()

// 고유 ID 생성
const groupId = ref(`group-${Math.random().toString(36).substr(2, 9)}`)

// 필터링된 메뉴 아이템
const filteredItems = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.items
  }

  return filterMenuItems(props.items, props.searchQuery.toLowerCase())
})

// 메뉴 아이템 필터링 함수 (재귀적)
const filterMenuItems = (items: MenuItem[], query: string): MenuItem[] => {
  const filtered: MenuItem[] = []

  for (const item of items) {
    const matchesTitle = item.title.toLowerCase().includes(query)
    const filteredChildren = item.children ? filterMenuItems(item.children, query) : []

    if (matchesTitle || filteredChildren.length > 0) {
      filtered.push({
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : item.children
      })
    }
  }

  return filtered
}

// 이벤트 핸들러
const handleToggle = () => {
  emit('toggle')
}

const handleMenuSelect = (item: MenuItem) => {
  emit('menu-select', item)
}

const handleFavoriteToggle = (itemId: string) => {
  emit('favorite-toggle', itemId)
}
</script>

<style lang="scss" scoped>
.menu-group {
  border-bottom: 1px solid var(--surface-2);

  &:last-child {
    border-bottom: none;
  }
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--bg-tertiary);
  cursor: pointer;
  transition: var(--transition-normal);
  border: none;
  width: 100%;

  &:hover {
    background: var(--surface-1);
  }

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }

  .group-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-primary);
  }

  .expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: transform var(--transition-normal);

    &.expanded {
      transform: rotate(180deg);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
}

.group-content {
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.2s ease;
  background: var(--bg-primary);

  &.expanded {
    max-height: 2000px; // 충분히 큰 값
    opacity: 1;
  }

  &.collapsed {
    max-height: 0;
    opacity: 0;
  }

  .menu-items {
    padding: var(--space-2) 0;
  }
}

// 접근성 개선
@media (prefers-reduced-motion: reduce) {
  .group-content,
  .expand-icon {
    transition: none;
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  .group-header {
    border: 1px solid var(--text-primary);
  }
}
</style>
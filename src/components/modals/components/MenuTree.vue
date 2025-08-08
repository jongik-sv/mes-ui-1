<template>
  <div class="menu-tree-wrapper">
    <!-- 빈 상태 -->
    <div v-if="!props.items.length" class="empty-tree">
      <i class="pi pi-search empty-icon"></i>
      <h3 class="empty-title">메뉴가 없습니다</h3>
      <p class="empty-description">{{ getEmptyMessage() }}</p>
    </div>

    <!-- 메뉴 리스트 -->
    <div v-else class="menu-list-container">
      <div 
        v-for="category in props.items" 
        :key="category.id"
        class="category-section"
      >
        <!-- 카테고리별로 메뉴 그룹들 표시 -->
        <div 
          v-for="menuGroup in category.items" 
          :key="menuGroup.id"
          class="menu-group"
        >
          <!-- 메뉴 그룹 헤더 (접기/펼치기) -->
          <div 
            class="menu-group-header"
            @click="toggleGroup(menuGroup.id)"
          >
            <i 
              :class="isGroupExpanded(menuGroup.id) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
              class="expand-icon"
            />
            <span class="group-title">{{ menuGroup.text }}</span>
            <span class="group-count">({{ menuGroup.items?.length || 0 }})</span>
          </div>
          
          <!-- 메뉴 항목들 (4개씩 그리드) -->
          <div 
            v-if="isGroupExpanded(menuGroup.id) && menuGroup.items"
            class="menu-items-grid"
          >
            <div
              v-for="menuItem in menuGroup.items"
              :key="menuItem.id"
              class="menu-item"
              @click="handleMenuClick(menuItem)"
            >
              <span class="menu-text">{{ menuItem.text }}</span>
              <span 
                v-if="isFavorite(menuItem.id)"
                class="favorite-star"
                @click.stop="handleFavoriteToggle(menuItem.id)"
              >
                ★
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 오버레이 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner loading-icon"></i>
        <span class="loading-text">메뉴를 불러오는 중...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Tree from 'primevue/tree'
import Button from 'primevue/button'
import type { MenuItem } from '@/types/menu'

interface TreeNode {
  key: string
  label: string
  level: number
  children?: TreeNode[]
  leaf?: boolean
  icon?: string
  url?: string
  data?: MenuItem
}

interface Props {
  /** 메뉴 아이템 목록 */
  items: MenuItem[]
  /** 검색 쿼리 */
  searchQuery: string
  /** 검색 모드 */
  searchMode: 'text' | 'column'
  /** 확장된 노드 키들 */
  expandedNodes: Set<string>
  /** 즐겨찾기 노드 키들 */
  favorites: Set<string>
  /** 검색 하이라이팅 여부 */
  highlightSearch?: boolean
  /** 로딩 상태 */
  loading?: boolean
}

interface Emits {
  (e: 'node-expand', nodeId: string): void
  (e: 'node-collapse', nodeId: string): void
  (e: 'toggle-favorite', nodeId: string): void
  (e: 'menu-select', menu: MenuItem): void
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  searchQuery: '',
  searchMode: 'text',
  expandedNodes: () => new Set(),
  favorites: () => new Set(),
  highlightSearch: true,
  loading: false
})

const emit = defineEmits<Emits>()

// 내부 상태
const expandedGroups = ref<Set<string>>(new Set())

// 그룹 확장/축소 상태 확인
const isGroupExpanded = (groupId: string): boolean => {
  return expandedGroups.value.has(groupId)
}

// 그룹 토글
const toggleGroup = (groupId: string) => {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId)
    emit('node-collapse', groupId)
  } else {
    expandedGroups.value.add(groupId)
    emit('node-expand', groupId)
  }
}

// 컴포넌트 마운트 시 모든 그룹을 기본적으로 확장 상태로 설정
onMounted(() => {
  props.items.forEach(category => {
    if (category.items) {
      category.items.forEach(group => {
        expandedGroups.value.add(group.id)
      })
    }
  })
})

// 빈 상태 메시지
const getEmptyMessage = (): string => {
  if (props.searchQuery) {
    return `'${props.searchQuery}'와 일치하는 메뉴가 없습니다`
  }
  
  return '표시할 메뉴가 없습니다'
}

// 즐겨찾기 확인
const isFavorite = (nodeKey: string): boolean => {
  return props.favorites.has(nodeKey)
}

// 검색 텍스트 하이라이팅
const highlightSearchText = (text: string) => {
  if (!props.searchQuery || !props.highlightSearch) {
    return text
  }
  
  const query = props.searchQuery.trim()
  if (!query) return text
  
  // Vue 템플릿에서 v-html을 사용하지 않고 단순 텍스트로 반환
  return text
}

// 이벤트 핸들러
const handleMenuClick = (menuItem: MenuItem) => {
  if (menuItem.url) {
    emit('menu-select', menuItem)
  }
}

const handleFavoriteToggle = (nodeKey: string) => {
  emit('toggle-favorite', nodeKey)
}
</script>

<style lang="scss" scoped>
.menu-tree-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 빈 상태
.empty-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
  flex: 1;
  min-height: 200px;
  
  .empty-icon {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: var(--space-6);
    opacity: 0.5;
  }
  
  .empty-title {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-3);
  }
  
  .empty-description {
    color: var(--text-muted);
    font-size: var(--text-sm);
    max-width: 300px;
    line-height: 1.5;
    margin: 0;
  }
}

// 메뉴 리스트 컨테이너 (이미지와 동일한 구조)
.menu-list-container {
  height: 100%;
  overflow-y: auto;
  padding: 4px;
  
  .category-section {
    .menu-group {
      margin-bottom: 2px;
      
      // 메뉴 그룹 헤더 (접기/펼치기)
      .menu-group-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        cursor: pointer;
        background: var(--bg-secondary);
        border: none;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 2px;
        border-radius: var(--border-radius-sm);
        
        &:hover {
          background: var(--bg-tertiary);
        }
        
        .expand-icon {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .group-title {
          flex: 1;
        }
        
        .group-count {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
      
      // 메뉴 항목들 (4개씩 그리드)
      .menu-items-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1px;
        padding: 2px;
        background: var(--bg-primary);
        
        .menu-item {
          position: relative;
          padding: 6px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-primary);
          min-height: 35px;
          max-width: 400px;
          padding-left: 35px;
          display: flex;
          align-items: center;
          -webkit-align-items: center;
          float: left;
          
          &:hover {
            background: var(--bg-tertiary);
            border-radius: var(--border-radius-sm);
          }
          
          .menu-text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.2;
          }
          
          .favorite-star {
            color: #ffd700;
            font-size: 10px;
            margin-left: 2px;
            cursor: pointer;
            
            &:hover {
              color: #ffed4e;
            }
          }
        }
        
        // 반응형 그리드
        @media (max-width: 1200px) {
          grid-template-columns: repeat(3, 1fr);
        }
        
        @media (max-width: 900px) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

// 빈 상태 스타일
.empty-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
  flex: 1;
  min-height: 200px;
  
  .empty-icon {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: var(--space-6);
    opacity: 0.5;
  }
  
  .empty-title {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-3);
  }
  
  .empty-description {
    color: var(--text-muted);
    font-size: var(--text-sm);
    max-width: 300px;
    line-height: 1.5;
    margin: 0;
  }
}

// 로딩 오버레이
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--bg-primary-rgb), 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  z-index: 10;
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    
    .pi-spinner {
      font-size: 2rem;
      color: var(--primary);
    }
    
    .loading-text {
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }
  }
}

// 스크롤바 스타일링
.menu-tree {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--surface-3);
    border-radius: 4px;
    
    &:hover {
      background: var(--surface-2);
    }
  }
}

// 접근성을 위한 숨김 텍스트
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// 반응형 디자인
@media (max-width: 768px) {
  .tree-node-content {
    padding: var(--space-2);
    gap: var(--space-1);
    
    .node-icon {
      font-size: var(--text-sm);
    }
    
    .node-label {
      font-size: var(--text-sm);
    }
    
    .favorite-button {
      opacity: 1; // 모바일에서는 항상 표시
    }
  }
  
  :deep(.p-treenode .p-treenode-content) {
    padding: var(--space-2);
  }
  
  :deep(.p-treenode-children .p-treenode) {
    margin-left: var(--space-3);
    
    &::before {
      left: calc(-1 * var(--space-3) + var(--space-1));
    }
    
    .p-treenode-content::before {
      left: calc(-1 * var(--space-3) + var(--space-1));
      width: var(--space-2);
    }
  }
  
  .empty-tree {
    padding: var(--space-6) var(--space-3);
    min-height: 150px;
    
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-4);
    }
    
    .empty-title {
      font-size: var(--text-base);
      margin-bottom: var(--space-2);
    }
    
    .empty-description {
      font-size: var(--text-xs);
    }
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  :deep(.p-treenode .p-treenode-content) {
    border: 1px solid var(--surface-2);
    
    &.p-highlight {
      border-color: var(--primary);
      outline: 2px solid var(--primary);
      outline-offset: 1px;
    }
  }
  
  .favorite-button {
    border: 1px solid var(--surface-2);
    
    &--active {
      border-color: var(--warning);
    }
  }
}

// 모션 감소 선호 시
@media (prefers-reduced-motion: reduce) {
  :deep(.p-treenode .p-treenode-content),
  .favorite-button,
  .tree-node-content {
    transition: none;
  }
  
  .loading-overlay .pi-spinner {
    animation: none;
  }
}

// 인쇄 스타일
@media print {
  .favorite-button,
  .loading-overlay {
    display: none;
  }
  
  .tree-node-content {
    .node-label--has-url::after {
      content: ' (' attr(href) ')';
      font-size: smaller;
      color: var(--text-muted);
    }
  }
}</style>
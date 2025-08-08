<template>
  <div class="menu-tree-wrapper">
    <!-- 빈 상태 -->
    <div v-if="!props.items.length" class="empty-tree" data-testid="empty-tree">
      <i class="pi pi-search empty-icon"></i>
      <h3 class="empty-title">메뉴가 없습니다</h3>
      <p class="empty-description">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <!-- 메뉴 그리드 -->
    <div v-else class="menu-grid-container">
      <div 
        v-for="category in props.items" 
        :key="category.id"
        class="category-section"
      >
        <h3 class="category-title">{{ category.text }}</h3>
        
        <div 
          v-for="menuGroup in category.items" 
          :key="menuGroup.id"
          class="menu-group"
        >
          <h4 class="menu-group-title">{{ menuGroup.text }}</h4>
          
          <!-- 마지막 메뉴 항목들을 4개씩 그리드로 배치 -->
          <div class="menu-items-grid">
            <div
              v-for="menuItem in menuGroup.items"
              :key="menuItem.id"
              class="menu-item-card"
              @click="handleMenuClick(menuItem)"
            >
              <div class="menu-item-content">
                <i 
                  v-if="menuItem.icon" 
                  :class="menuItem.icon"
                  class="menu-item-icon"
                />
                <i 
                  v-else
                  class="pi pi-file menu-item-icon"
                />
                
                <span class="menu-item-text">{{ menuItem.text }}</span>
                
                <!-- 즐겨찾기 버튼 -->
                <Button
                  :icon="isFavorite(menuItem.id) ? 'pi pi-star-fill' : 'pi pi-star'"
                  text
                  rounded
                  size="small"
                  class="favorite-button"
                  :class="{ 'favorite-button--active': isFavorite(menuItem.id) }"
                  @click.stop="handleFavoriteToggle(menuItem.id)"
                  :title="isFavorite(menuItem.id) ? '즐겨찾기 제거' : '즐겨찾기 추가'"
                />
              </div>
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

    <!-- 스크린 리더용 안내 -->
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      class="sr-only"
    >
      {{ screenReaderAnnouncement }}
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
const screenReaderAnnouncement = ref('')
const selectionKeys = ref<Record<string, boolean>>({})

// PrimeVue Tree용 확장 키 객체
const expandedKeys = computed(() => {
  const keys: Record<string, boolean> = {}
  props.expandedNodes.forEach(nodeId => {
    keys[nodeId] = true
  })
  return keys
})

// MenuItem을 TreeNode로 변환
const treeNodes = computed<TreeNode[]>(() => {
  return convertMenuItemsToTreeNodes(props.items)
})

const convertMenuItemsToTreeNodes = (items: MenuItem[]): TreeNode[] => {
  return items.map(item => {
    const node: TreeNode = {
      key: item.id,
      label: item.text,
      level: item.level,
      leaf: !item.hasItems || !item.items || item.items.length === 0,
      icon: item.icon,
      url: item.url,
      data: item
    }
    
    if (item.items && item.items.length > 0) {
      node.children = convertMenuItemsToTreeNodes(item.items)
    }
    
    return node
  })
}

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
const handleNodeExpand = (node: TreeNode) => {
  emit('node-expand', node.key)
}

const handleNodeCollapse = (node: TreeNode) => {
  emit('node-collapse', node.key)
}

const handleNodeSelect = (node: TreeNode) => {
  if (node.leaf && node.data) {
    emit('menu-select', node.data)
    screenReaderAnnouncement.value = `${node.label} 메뉴가 선택되었습니다`
  }
}

const handleMenuClick = (menuItem: MenuItem) => {
  if (menuItem.url) {
    emit('menu-select', menuItem)
  }
}

const handleFavoriteToggle = (nodeKey: string) => {
  emit('toggle-favorite', nodeKey)
  
  // 메뉴 제목 찾기
  const findNodeLabel = (nodes: TreeNode[], key: string): string | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node.label
      }
      if (node.children) {
        const found = findNodeLabel(node.children, key)
        if (found) return found
      }
    }
    return null
  }
  
  const nodeLabel = findNodeLabel(treeNodes.value, nodeKey)
  if (nodeLabel) {
    const action = props.favorites.has(nodeKey) ? '제거' : '추가'
    screenReaderAnnouncement.value = `${nodeLabel}이(가) 즐겨찾기에서 ${action}되었습니다`
  }
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 초기 안내 메시지
  if (props.items.length > 0) {
    const menuCount = countTotalMenus(props.items)
    screenReaderAnnouncement.value = `총 ${menuCount}개의 메뉴가 있습니다`
  }
})

// 총 메뉴 개수 계산 (재귀)
const countTotalMenus = (items: MenuItem[]): number => {
  let count = 0
  items.forEach(item => {
    count++
    if (item.items) {
      count += countTotalMenus(item.items)
    }
  })
  return count
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

// 메뉴 그리드 컨테이너
.menu-grid-container {
  height: 100%;
  overflow-y: auto;
  padding: var(--space-1);
  
  .category-section {
    margin-bottom: var(--space-2);
    
    .category-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
      padding: var(--space-1) var(--space-2);
      background: var(--bg-secondary);
      border-radius: var(--border-radius-sm);
    }
    
    .menu-group {
      margin-bottom: var(--space-1);
      
      .menu-group-title {
        font-size: var(--text-base);
        font-weight: 500;
        color: var(--text-secondary);
        margin: 0 0 var(--space-1) 0;
        padding: var(--space-1) var(--space-2);
        background: var(--bg-tertiary);
        border-radius: var(--border-radius-sm);
      }
      
      .menu-items-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2px; // 최대한 좁은 간격
        padding: var(--space-1);
        
        .menu-item-card {
          background: var(--bg-secondary);
          border: 1px solid var(--surface-2);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: var(--transition-normal);
          min-height: 60px;
          
          &:hover {
            background: var(--bg-tertiary);
            border-color: var(--primary);
            transform: translateY(-1px);
            box-shadow: var(--shadow-sm);
          }
          
          .menu-item-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--space-1);
            height: 100%;
            position: relative;
            
            .menu-item-icon {
              font-size: var(--text-sm);
              color: var(--text-secondary);
              margin-bottom: 2px;
            }
            
            .menu-item-text {
              font-size: var(--text-xs);
              color: var(--text-primary);
              text-align: center;
              line-height: 1.2;
              word-break: keep-all;
              overflow-wrap: break-word;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            .favorite-button {
              position: absolute;
              top: 2px;
              right: 2px;
              opacity: 0;
              transition: var(--transition-normal);
              
              :deep(.p-button) {
                width: 16px;
                height: 16px;
                min-width: 16px;
                padding: 0;
                
                .p-button-icon {
                  font-size: 10px;
                }
              }
              
              &--active {
                opacity: 1;
                color: var(--warning);
              }
              
              &:hover {
                opacity: 1;
                color: var(--warning);
              }
            }
            
            &:hover .favorite-button {
              opacity: 1;
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
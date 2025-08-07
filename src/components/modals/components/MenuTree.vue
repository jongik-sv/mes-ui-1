<template>
  <div class="menu-tree-wrapper">
    <!-- 빈 상태 -->
    <div v-if="!treeNodes.length" class="empty-tree" data-testid="empty-tree">
      <i class="pi pi-sitemap empty-icon" />
      <h3 class="empty-title">메뉴가 없습니다</h3>
      <p class="empty-description">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <!-- 메뉴 트리 -->
    <Tree
      v-else
      v-model:expanded-keys="internalExpandedKeys"
      :value="treeNodes"
      selection-mode="single"
      class="menu-tree"
      data-testid="menu-tree"
      @node-select="handleNodeSelect"
    >
      <template #default="{ node }">
        <div class="tree-node-content">
          <!-- 메뉴 아이콘 -->
          <i 
            v-if="node.icon" 
            :class="node.icon" 
            class="node-icon"
          />
          <i 
            v-else-if="node.leaf" 
            class="pi pi-file node-icon default-icon"
          />
          <i 
            v-else 
            class="pi pi-folder node-icon default-icon"
          />

          <!-- 메뉴 제목 -->
          <span 
            :class="[
              'node-label',
              {
                'node-label--leaf': node.leaf,
                'node-label--has-url': node.url
              }
            ]"
            v-html="highlightSearchQuery(node.label)"
          />

          <!-- 즐겨찾기 버튼 -->
          <Button
            :icon="node.favorite ? 'pi pi-star-fill' : 'pi pi-star'"
            text
            rounded
            size="small"
            :class="[
              'favorite-button',
              {
                'favorite-button--active': node.favorite
              }
            ]"
            :aria-label="node.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
            :data-testid="`favorite-${node.key}`"
            @click.stop="toggleFavorite(node)"
          />

          <!-- 외부 링크 표시 -->
          <i 
            v-if="node.url && isExternalUrl(node.url)" 
            class="pi pi-external-link external-icon"
            aria-label="외부 링크"
          />
        </div>
      </template>
    </Tree>

    <!-- 로딩 오버레이 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner" />
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
import type { MenuItem, MenuTreeNode, ViewMode } from '@/types/menu'

interface Props {
  /** 메뉴 아이템 목록 */
  items: MenuItem[]
  /** 검색 쿼리 */
  searchQuery: string
  /** 뷰 모드 */
  viewMode: ViewMode
  /** 선택된 카테고리 */
  selectedCategory: string | null
  /** 확장된 노드 키들 */
  expandedNodes: Set<string>
  /** 즐겨찾기 노드 키들 */
  favorites: Set<string>
  /** 검색 하이라이팅 여부 */
  highlightSearch?: boolean
  /** 로딩 상태 */
  loading?: boolean
  /** 최대 트리 깊이 */
  maxDepth?: number
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
  viewMode: 'all',
  selectedCategory: null,
  expandedNodes: () => new Set(),
  favorites: () => new Set(),
  highlightSearch: true,
  loading: false,
  maxDepth: 5
})

const emit = defineEmits<Emits>()

// 내부 상태
const internalExpandedKeys = ref<Record<string, boolean>>({})
const screenReaderAnnouncement = ref('')

// Props 변경 감지
watch(() => props.expandedNodes, (newExpandedNodes) => {
  const keys: Record<string, boolean> = {}
  newExpandedNodes.forEach(key => {
    keys[key] = true
  })
  internalExpandedKeys.value = keys
}, { immediate: true })

// 확장된 키 변경 감지
watch(internalExpandedKeys, (newKeys) => {
  const expandedSet = new Set<string>()
  Object.keys(newKeys).forEach(key => {
    if (newKeys[key]) {
      expandedSet.add(key)
    }
  })
  
  // 새로 확장된 노드와 축소된 노드 찾기
  const previousExpanded = props.expandedNodes
  const newExpanded = expandedSet
  
  newExpanded.forEach(key => {
    if (!previousExpanded.has(key)) {
      emit('node-expand', key)
    }
  })
  
  previousExpanded.forEach(key => {
    if (!newExpanded.has(key)) {
      emit('node-collapse', key)
    }
  })
}, { deep: true })

// MenuItem을 MenuTreeNode로 변환
const convertToTreeNode = (item: MenuItem, depth = 0): MenuTreeNode => {
  const node: MenuTreeNode = {
    key: item.id,
    label: item.title,
    leaf: !item.children || item.children.length === 0,
    icon: item.icon,
    data: item,
    favorite: props.favorites.has(item.id),
    url: item.url,
    category: item.category,
    selectable: !!item.url // URL이 있는 경우에만 선택 가능
  }

  // 최대 깊이 제한
  if (depth < props.maxDepth && item.children && item.children.length > 0) {
    node.children = item.children.map(child => convertToTreeNode(child, depth + 1))
    node.leaf = false
  }

  return node
}

// 트리 노드 계산
const treeNodes = computed<MenuTreeNode[]>(() => {
  return props.items.map(item => convertToTreeNode(item))
})

// 빈 상태 메시지
const getEmptyMessage = (): string => {
  if (props.searchQuery) {
    return `'${props.searchQuery}'와 일치하는 메뉴가 없습니다`
  }
  
  if (props.viewMode === 'favorites') {
    return '즐겨찾기로 등록된 메뉴가 없습니다'
  }
  
  if (props.selectedCategory) {
    return '이 카테고리에 메뉴가 없습니다'
  }
  
  return '표시할 메뉴가 없습니다'
}

// 검색어 하이라이팅
const highlightSearchQuery = (text: string): string => {
  if (!props.highlightSearch || !props.searchQuery.trim()) {
    return text
  }
  
  const query = props.searchQuery.trim()
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

// 정규식 특수문자 이스케이프
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 외부 URL 확인
const isExternalUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

// 이벤트 핸들러
const handleNodeSelect = (node: MenuTreeNode) => {
  if (node.data && node.selectable && node.url) {
    emit('menu-select', node.data)
    
    // 스크린 리더 안내
    screenReaderAnnouncement.value = `${node.label} 메뉴가 선택되었습니다`
  }
}

const toggleFavorite = (node: MenuTreeNode) => {
  if (node.key) {
    emit('toggle-favorite', node.key)
    
    // 즐겨찾기 상태 업데이트
    node.favorite = !node.favorite
    
    // 스크린 리더 안내
    const action = node.favorite ? '추가' : '제거'
    screenReaderAnnouncement.value = `${node.label}이(가) 즐겨찾기에서 ${action}되었습니다`
  }
}

// 키보드 이벤트 처리
const handleKeydown = (event: KeyboardEvent, node: MenuTreeNode) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (node.selectable && node.url) {
        handleNodeSelect(node)
      }
      break
      
    case 'f':
    case 'F':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        toggleFavorite(node)
      }
      break
  }
}

// 컴포넌트 마운트 시
onMounted(() => {
  // 초기 안내 메시지
  if (props.items.length > 0) {
    const menuCount = countTotalMenus(props.items)
    screenReaderAnnouncement.value = `${menuCount}개의 메뉴가 있습니다`
  }
})

// 총 메뉴 개수 계산 (재귀)
const countTotalMenus = (items: MenuItem[]): number => {
  let count = 0
  items.forEach(item => {
    count++
    if (item.children) {
      count += countTotalMenus(item.children)
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

// 메뉴 트리
.menu-tree {
  flex: 1;
  background: transparent;
  border: none;
  
  :deep(.p-tree-container) {
    background: transparent;
    border: none;
    padding: var(--space-2);
  }
  
  :deep(.p-treenode) {
    .p-treenode-content {
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius-md);
      transition: var(--transition-normal);
      margin-bottom: var(--space-1);
      
      &:hover {
        background: var(--bg-tertiary);
      }
      
      &.p-treenode-selectable {
        cursor: pointer;
      }
      
      &.p-highlight {
        background: var(--primary);
        color: white;
        
        .node-icon,
        .favorite-button,
        .external-icon {
          color: white;
        }
        
        .favorite-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
      
      &:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    }
    
    .p-tree-toggler {
      color: var(--text-secondary);
      margin-right: var(--space-2);
      
      &:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }
      
      &:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    }
  }
  
  // 중첩 레벨별 스타일링
  :deep(.p-treenode-children) {
    .p-treenode {
      margin-left: var(--space-4);
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        left: calc(-1 * var(--space-4) + var(--space-2));
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--surface-2);
      }
      
      .p-treenode-content {
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          left: calc(-1 * var(--space-4) + var(--space-2));
          top: 50%;
          width: var(--space-3);
          height: 1px;
          background: var(--surface-2);
        }
      }
      
      &:last-child::before {
        height: 50%;
      }
    }
  }
}

// 트리 노드 콘텐츠
.tree-node-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  min-width: 0;
  
  .node-icon {
    color: var(--text-secondary);
    font-size: var(--text-base);
    flex-shrink: 0;
    
    &.default-icon {
      opacity: 0.7;
    }
  }
  
  .node-label {
    flex: 1;
    color: var(--text-primary);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    
    &--leaf {
      font-weight: 400;
    }
    
    &--has-url {
      cursor: pointer;
      
      &:hover {
        color: var(--primary);
        text-decoration: underline;
      }
    }
    
    // 검색 하이라이팅
    :deep(.search-highlight) {
      background: var(--warning);
      color: var(--bg-primary);
      padding: 1px 3px;
      border-radius: 3px;
      font-weight: 600;
    }
  }
  
  .favorite-button {
    opacity: 0;
    transition: var(--transition-normal);
    color: var(--text-muted);
    flex-shrink: 0;
    
    &--active {
      opacity: 1;
      color: var(--warning);
    }
    
    &:hover {
      background: var(--bg-tertiary);
      color: var(--warning);
    }
  }
  
  .external-icon {
    color: var(--text-muted);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }
  
  // 호버 시 즐겨찾기 버튼 표시
  &:hover .favorite-button {
    opacity: 1;
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
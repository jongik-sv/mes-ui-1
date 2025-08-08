<template>
  <div class="menu-tree-wrapper">
    <!-- 빈 상태 -->
    <div v-if="!menuGroups.length" class="empty-tree" data-testid="empty-tree">
      <i class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/>
          <path d="M8 8h8M8 12h8M8 16h5"/>
        </svg>
      </i>
      <h3 class="empty-title">메뉴가 없습니다</h3>
      <p class="empty-description">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <!-- 메뉴 그룹들 (그리드 레이아웃) -->
    <div v-else class="menu-groups-grid" data-testid="menu-groups">
      <div
        v-for="group in menuGroups"
        :key="group.id"
        class="menu-group-card"
      >
        <MenuGroup
          :title="group.title"
          :items="group.items"
          :expanded="expandedGroups.has(group.id)"
          :search-query="searchQuery"
          :favorites="favorites"
          @toggle="handleGroupToggle(group.id)"
          @menu-select="handleMenuSelect"
          @favorite-toggle="handleFavoriteToggle"
        />
      </div>
    </div>

    <!-- 로딩 오버레이 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <i class="loading-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        </i>
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
import MenuGroup from './MenuGroup.vue'
import type { MenuItem, ViewMode } from '@/types/menu'

interface MenuGroupData {
  id: string
  title: string
  items: MenuItem[]
}

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
const expandedGroups = ref<Set<string>>(new Set())
const screenReaderAnnouncement = ref('')

// 메뉴를 그룹별로 분류
const menuGroups = computed<MenuGroupData[]>(() => {
  const groupMap = new Map<string, MenuItem[]>()
  
  // 카테고리별로 메뉴 분류
  const processItems = (items: MenuItem[]) => {
    items.forEach(item => {
      const category = item.category || 'default'
      if (!groupMap.has(category)) {
        groupMap.set(category, [])
      }
      groupMap.get(category)!.push(item)
    })
  }
  
  processItems(props.items)
  
  // 그룹 데이터 생성
  const groups: MenuGroupData[] = []
  groupMap.forEach((items, categoryId) => {
    const groupTitle = getCategoryTitle(categoryId)
    groups.push({
      id: categoryId,
      title: groupTitle,
      items: items
    })
  })
  
  // 그룹 정렬 (제목 기준)
  return groups.sort((a, b) => a.title.localeCompare(b.title))
})

// 카테고리 ID를 한글 제목으로 변환
const getCategoryTitle = (categoryId: string): string => {
  const categoryTitles: Record<string, string> = {
    'production': '생산관리',
    'quality': '품질관리',
    'material': '자재관리',
    'sales': '영업관리',
    'hr': '인사관리',
    'finance': '재무관리',
    'maintenance': '설비관리',
    'planning': '생산계획',
    'inventory': '재고관리',
    'default': '기타'
  }
  return categoryTitles[categoryId] || categoryId
}

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

// 이벤트 핸들러
const handleGroupToggle = (groupId: string) => {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId)
    emit('node-collapse', groupId)
  } else {
    expandedGroups.value.add(groupId)
    emit('node-expand', groupId)
  }
  
  // 스크린 리더 안내
  const group = menuGroups.value.find(g => g.id === groupId)
  if (group) {
    const action = expandedGroups.value.has(groupId) ? '확장' : '축소'
    screenReaderAnnouncement.value = `${group.title} 그룹이 ${action}되었습니다`
  }
}

const handleMenuSelect = (menu: MenuItem) => {
  emit('menu-select', menu)
  
  // 스크린 리더 안내
  screenReaderAnnouncement.value = `${menu.title} 메뉴가 선택되었습니다`
}

const handleFavoriteToggle = (menuId: string) => {
  emit('toggle-favorite', menuId)
  
  // 메뉴 제목 찾기
  const findMenuTitle = (items: MenuItem[], id: string): string | null => {
    for (const item of items) {
      if (item.id === id) {
        return item.title
      }
      if (item.children) {
        const found = findMenuTitle(item.children, id)
        if (found) return found
      }
    }
    return null
  }
  
  const menuTitle = findMenuTitle(props.items, menuId)
  if (menuTitle) {
    const action = props.favorites.has(menuId) ? '제거' : '추가'
    screenReaderAnnouncement.value = `${menuTitle}이(가) 즐겨찾기에서 ${action}되었습니다`
  }
}

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 모든 그룹을 기본적으로 확장 상태로 설정
  menuGroups.value.forEach(group => {
    expandedGroups.value.add(group.id)
  })
  
  // 초기 안내 메시지
  if (props.items.length > 0) {
    const menuCount = countTotalMenus(props.items)
    const groupCount = menuGroups.value.length
    screenReaderAnnouncement.value = `${groupCount}개 그룹에 총 ${menuCount}개의 메뉴가 있습니다`
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

// Props 변경 감지
watch(() => props.expandedNodes, (newExpandedNodes) => {
  // 외부에서 전달된 확장 상태를 내부 상태에 반영
  expandedGroups.value = new Set(newExpandedNodes)
}, { immediate: true })
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

// 메뉴 그룹들 (그리드 레이아웃)
.menu-groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
  padding: var(--space-4);
  align-items: start;
  
  // 반응형 컬럼 수 조정
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }
  
  @media (min-width: 2000px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-3);
    padding: var(--space-3);
  }
  
  .menu-group-card {
    background: var(--bg-secondary);
    border: 1px solid var(--surface-2);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    height: fit-content;
    min-height: 200px;
    max-height: 600px;
    box-shadow: var(--shadow-sm);
    transition: var(--transition-normal);
    
    &:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--primary-200);
    }
    
    // 그룹 내부 스크롤 처리
    :deep(.group-content) {
      max-height: 500px;
      overflow-y: auto;
      
      // 스크롤바 스타일링
      scrollbar-width: thin;
      scrollbar-color: var(--surface-3) transparent;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--surface-3);
        border-radius: 3px;
        
        &:hover {
          background: var(--surface-2);
        }
      }
    }
    
    // 그룹 헤더 고정
    :deep(.group-header) {
      position: sticky;
      top: 0;
      z-index: 1;
      background: var(--bg-tertiary);
      border-bottom: 1px solid var(--surface-2);
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
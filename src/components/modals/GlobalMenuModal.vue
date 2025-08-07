<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :closable="true"
    :draggable="false"
    :resizable="false"
    class="global-menu-modal"
    @hide="closeModal"
  >
    <template #header>
      <h2 class="modal-title">전체 메뉴</h2>
    </template>

    <div class="modal-content">
      <!-- 검색 및 토글 영역 -->
      <div class="modal-header-section">
        <div class="search-section">
          <MenuSearchBar
            v-model="searchQuery"
            placeholder="메뉴 검색..."
            @search="handleSearch"
          />
        </div>
        <div class="toggle-section">
          <MenuToggleButtons
            v-model="viewMode"
            @update:modelValue="handleViewModeChange"
          />
        </div>
      </div>

      <!-- 메인 콘텐츠 영역 -->
      <div class="modal-body">
        <!-- 좌측 카테고리 목록 -->
        <div class="category-section">
          <MenuCategoryList
            :categories="categories"
            :selected-category="selectedCategory"
            @category-select="handleCategorySelect"
          />
        </div>

        <!-- 우측 메뉴 트리 -->
        <div class="menu-tree-section">
          <MenuTree
            :items="filteredMenuItems"
            :search-query="searchQuery"
            :view-mode="viewMode"
            :selected-category="selectedCategory"
            :expanded-nodes="expandedNodes"
            :favorites="favorites"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
            @toggle-favorite="handleToggleFavorite"
            @menu-select="handleMenuSelect"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Dialog from 'primevue/dialog'
import MenuSearchBar from './components/MenuSearchBar.vue'
import MenuToggleButtons from './components/MenuToggleButtons.vue'
import MenuCategoryList from './components/MenuCategoryList.vue'
import MenuTree from './components/MenuTree.vue'
import type { MenuItem, Category, ViewMode } from '@/types/menu'

interface Props {
  /** 모달 표시 여부 */
  visible: boolean
  /** 메뉴 아이템 목록 */
  menuItems?: MenuItem[]
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'menu-select', menu: MenuItem): void
  (e: 'favorite-toggle', menuId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  menuItems: () => []
})

const emit = defineEmits<Emits>()

// 반응형 상태
const isVisible = ref(props.visible)
const searchQuery = ref('')
const viewMode = ref<ViewMode>('all')
const selectedCategory = ref<string | null>(null)
const expandedNodes = ref<Set<string>>(new Set())
const favorites = ref<Set<string>>(new Set())

// Props 변경 감지
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue
})

watch(isVisible, (newValue) => {
  if (newValue !== props.visible) {
    emit('update:visible', newValue)
  }
})

// 카테고리 목록 계산
const categories = computed<Category[]>(() => {
  const categoryMap = new Map<string, Category>()
  
  const processItems = (items: MenuItem[]) => {
    items.forEach(item => {
      if (item.category && !categoryMap.has(item.category)) {
        // 카테고리명을 한글로 변환 (실제로는 i18n을 사용해야 함)
        const categoryName = getCategoryName(item.category)
        categoryMap.set(item.category, {
          id: item.category,
          name: categoryName,
          count: 0
        })
      }
      
      if (item.children) {
        processItems(item.children)
      }
    })
  }
  
  processItems(props.menuItems)
  
  // 각 카테고리의 메뉴 개수 계산
  categoryMap.forEach((category, categoryId) => {
    category.count = countMenusInCategory(props.menuItems, categoryId)
  })
  
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

// 필터링된 메뉴 아이템
const filteredMenuItems = computed<MenuItem[]>(() => {
  let filtered = [...props.menuItems]
  
  // 검색 필터
  if (searchQuery.value.trim()) {
    filtered = filterBySearch(filtered, searchQuery.value.trim())
  }
  
  // 카테고리 필터
  if (selectedCategory.value) {
    filtered = filterByCategory(filtered, selectedCategory.value)
  }
  
  // 뷰 모드 필터
  if (viewMode.value === 'favorites') {
    filtered = filterByFavorites(filtered)
  }
  
  return filtered
})

// 유틸리티 함수들
const getCategoryName = (categoryId: string): string => {
  const categoryNames: Record<string, string> = {
    'production': '생산관리',
    'quality': '품질관리',
    'material': '자재관리',
    'sales': '영업관리',
    'hr': '인사관리',
    'finance': '재무관리',
    'maintenance': '설비관리'
  }
  return categoryNames[categoryId] || categoryId
}

const countMenusInCategory = (items: MenuItem[], categoryId: string): number => {
  let count = 0
  items.forEach(item => {
    if (item.category === categoryId) {
      count++
    }
    if (item.children) {
      count += countMenusInCategory(item.children, categoryId)
    }
  })
  return count
}

const filterBySearch = (items: MenuItem[], query: string): MenuItem[] => {
  const filtered: MenuItem[] = []
  
  items.forEach(item => {
    const matchesTitle = item.title.toLowerCase().includes(query.toLowerCase())
    const filteredChildren = item.children ? filterBySearch(item.children, query) : []
    
    if (matchesTitle || filteredChildren.length > 0) {
      filtered.push({
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : item.children
      })
    }
  })
  
  return filtered
}

const filterByCategory = (items: MenuItem[], categoryId: string): MenuItem[] => {
  const filtered: MenuItem[] = []
  
  items.forEach(item => {
    if (item.category === categoryId) {
      filtered.push(item)
    } else if (item.children) {
      const filteredChildren = filterByCategory(item.children, categoryId)
      if (filteredChildren.length > 0) {
        filtered.push({
          ...item,
          children: filteredChildren
        })
      }
    }
  })
  
  return filtered
}

const filterByFavorites = (items: MenuItem[]): MenuItem[] => {
  const filtered: MenuItem[] = []
  
  items.forEach(item => {
    const isFavorite = favorites.value.has(item.id)
    const filteredChildren = item.children ? filterByFavorites(item.children) : []
    
    if (isFavorite || filteredChildren.length > 0) {
      filtered.push({
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : item.children
      })
    }
  })
  
  return filtered
}

// 이벤트 핸들러들
const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleViewModeChange = (mode: ViewMode) => {
  viewMode.value = mode
}

const handleCategorySelect = (categoryId: string | null) => {
  selectedCategory.value = categoryId
}

const handleNodeExpand = (nodeId: string) => {
  expandedNodes.value.add(nodeId)
}

const handleNodeCollapse = (nodeId: string) => {
  expandedNodes.value.delete(nodeId)
}

const handleToggleFavorite = (menuId: string) => {
  if (favorites.value.has(menuId)) {
    favorites.value.delete(menuId)
  } else {
    favorites.value.add(menuId)
  }
  
  emit('favorite-toggle', menuId)
}

const handleMenuSelect = (menu: MenuItem) => {
  emit('menu-select', menu)
  closeModal()
}

const closeModal = () => {
  isVisible.value = false
  emit('update:visible', false)
}

// 키보드 이벤트 처리
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isVisible.value) {
    closeModal()
  }
}

// 컴포넌트 마운트/언마운트 시 이벤트 리스너 관리
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  
  // 초기 즐겨찾기 데이터 로드 (localStorage에서)
  loadFavorites()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  
  // 즐겨찾기 데이터 저장
  saveFavorites()
})

// 즐겨찾기 데이터 저장/로드
const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem('mes-menu-favorites')
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites) as string[]
      favorites.value = new Set(favoriteIds)
    }
  } catch (error) {
    console.warn('Failed to load favorites from localStorage:', error)
  }
}

const saveFavorites = () => {
  try {
    const favoriteIds = Array.from(favorites.value)
    localStorage.setItem('mes-menu-favorites', JSON.stringify(favoriteIds))
  } catch (error) {
    console.warn('Failed to save favorites to localStorage:', error)
  }
}

// 즐겨찾기 변경 시 저장
watch(favorites, () => {
  saveFavorites()
}, { deep: true })

// 컴포넌트 메서드 노출 (템플릿 ref용)
defineExpose({
  closeModal,
  searchQuery,
  viewMode,
  selectedCategory,
  expandedNodes,
  favorites,
  filteredMenuItems
})
</script>

<style lang="scss" scoped>
.global-menu-modal {
  :deep(.p-dialog) {
    width: 90vw;
    height: 90vh;
    max-width: 1200px;
    max-height: 800px;
    background: var(--bg-primary);
    border: 1px solid var(--surface-2);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
  }

  :deep(.p-dialog-mask) {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(4px);
  }

  :deep(.p-dialog-header) {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--surface-2);
    padding: var(--space-4) var(--space-6);

    .modal-title {
      color: var(--text-primary);
      font-size: var(--text-xl);
      font-weight: 600;
      margin: 0;
    }
  }

  :deep(.p-dialog-content) {
    padding: 0;
    height: calc(90vh - 80px); // 헤더 높이를 제외한 높이
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-primary);
  }

  .modal-header-section {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-6);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--surface-2);
    align-items: center;

    .search-section {
      min-width: 0; // flex 아이템이 축소될 수 있도록
    }

    .toggle-section {
      flex-shrink: 0;
    }
  }

  .modal-body {
    display: grid;
    grid-template-columns: 300px 1fr;
    flex: 1;
    min-height: 0;
    background: var(--bg-primary);

    .category-section {
      border-right: 1px solid var(--surface-2);
      background: var(--bg-secondary);
      overflow-y: auto;
    }

    .menu-tree-section {
      background: var(--bg-primary);
      overflow-y: auto;
      padding: var(--space-4);
    }
  }

  // 반응형 처리
  @media (max-width: 768px) {
    :deep(.p-dialog) {
      width: 95vw;
      height: 95vh;
      margin: 2.5vh 2.5vw;
    }

    .modal-header-section {
      grid-template-columns: 1fr;
      gap: var(--space-2);
      padding: var(--space-3);

      .toggle-section {
        justify-self: center;
      }
    }

    .modal-body {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;

      .category-section {
        border-right: none;
        border-bottom: 1px solid var(--surface-2);
        max-height: 150px;
      }

      .menu-tree-section {
        padding: var(--space-3);
      }
    }
  }

  // 접근성 개선
  :deep(.p-dialog-header-close) {
    color: var(--text-secondary);
    transition: var(--transition-normal);

    &:hover {
      color: var(--text-primary);
      background: var(--bg-tertiary);
    }

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
  }

  // 스크롤바 스타일링
  .category-section,
  .menu-tree-section {
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
}

// 로딩 상태 스타일
.modal-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--text-secondary);
}

// 빈 상태 스타일
.modal-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: var(--text-secondary);
  text-align: center;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: var(--space-4);
    opacity: 0.5;
  }

  .empty-title {
    font-size: var(--text-lg);
    font-weight: 500;
    margin-bottom: var(--space-2);
  }

  .empty-description {
    font-size: var(--text-sm);
    opacity: 0.7;
  }
}
</style>
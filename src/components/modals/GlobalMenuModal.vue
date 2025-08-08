<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :closable="true"
    :draggable="false"
    :resizable="false"
    :maximizable="false"
    :dismissableMask="false"
    :style="{ width: '80vw', height: '80vh' }"
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
          <InputText
            v-model="searchQuery"
            placeholder="검색할 화면명을 입력하세요"
            class="search-input"
            @input="handleSearch"
          />
          <Button
            v-if="searchQuery"
            icon="pi pi-times"
            text
            rounded
            size="small"
            class="search-clear-button"
            @click="clearSearch"
            title="검색조건 초기화"
          />
        </div>
        <div class="toggle-section">
          <div class="toggle-group">
            <label class="toggle-item">
              <span class="toggle-label">전체 보기</span>
              <ToggleButton
                v-model="showAllMenus"
                onLabel=""
                offLabel=""
                class="toggle-switch"
                @change="handleToggleChange"
              />
            </label>
            <label class="toggle-item">
              <span class="toggle-label">항목찾기</span>
              <ToggleButton
                v-model="showColumnSearch"
                onLabel=""
                offLabel=""
                class="toggle-switch"
                @change="handleToggleChange"
              />
            </label>
            <label class="toggle-item">
              <span class="toggle-label">즐겨찾기</span>
              <ToggleButton
                v-model="showFavorites"
                onLabel=""
                offLabel=""
                class="toggle-switch"
                @change="handleToggleChange"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- 메인 콘텐츠 영역 (좌측 카테고리 + 우측 트리) -->
      <div class="modal-body">
        <!-- 좌측 카테고리 사이드바 -->
        <div class="category-sidebar">
          <div class="category-list">
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-button"
              :class="{ active: selectedCategory === category.id }"
              @click="handleCategorySelect(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- 우측 메뉴 트리 영역 -->
        <div class="menu-tree-area">
          <div v-if="isLoading" class="loading-view">
            <div class="loading-content">
              <i class="pi pi-spin pi-spinner loading-icon"></i>
              <div class="loading-title">메뉴를 불러오는 중...</div>
            </div>
          </div>
          <div v-else-if="filteredMenuItems.length === 0" class="empty-view">
            <div class="empty-content">
              <i class="pi pi-search empty-icon"></i>
              <div class="empty-title">일치하는 검색 결과가 존재하지 않습니다</div>
            </div>
          </div>
          <MenuTree
            v-else
            :items="filteredMenuItems"
            :search-query="searchQuery"
            :search-mode="searchMode"
            :expanded-nodes="expandedNodes"
            :favorites="favorites"
            :loading="isLoading"
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
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ToggleButton from 'primevue/togglebutton'
import MenuTree from './components/MenuTree.vue'
import type { MenuItem, MenuCategory } from '@/types/menu'

// allmenu.json 파일에서 카테고리 정의 (JSP 구조 기반)
const menuCategories: MenuCategory[] = [
  { id: 'all', name: '전체메뉴', code: '', order: 0, active: true },
  { id: 'C10', name: '품질설계', code: 'C10', order: 1, active: false },
  { id: 'M20', name: '품질판정', code: 'M20', order: 2, active: false },
  { id: 'M17', name: '생산관제', code: 'M17', order: 3, active: false },
  { id: 'M47', name: '조업관리', code: 'M47', order: 4, active: false },
  { id: 'M42', name: '원재료관리', code: 'M42', order: 5, active: false },
  { id: 'M30', name: '부재료관리', code: 'M30', order: 6, active: false },
  { id: 'M26', name: '구내운송', code: 'M26', order: 7, active: false },
  { id: 'M77', name: '야드관리', code: 'M77', order: 8, active: false },
  { id: 'M60', name: '출하관제', code: 'M60', order: 9, active: false },
  { id: 'M80', name: '통합관제', code: 'M80', order: 10, active: false },
  { id: 'M90', name: '공통관리', code: 'M90', order: 11, active: false }
]

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
const selectedCategory = ref<string>('all')
const expandedNodes = ref<Set<string>>(new Set())
const favorites = ref<Set<string>>(new Set())
const allMenuData = ref<MenuItem[]>([])
const isLoading = ref(false)

// JSP 기반 토글 상태
const showAllMenus = ref(false)      // 전체보기 (권한 없는 메뉴도 표시)
const showColumnSearch = ref(false)  // 항목찾기 (컬럼 검색 모드)
const showFavorites = ref(false)     // 즐겨찾기만 표시

// 검색 모드 (텍스트 검색 vs 컬럼 검색)
const searchMode = computed(() => showColumnSearch.value ? 'column' : 'text')

// allmenu.json 데이터를 MenuItem 타입으로 변환
interface AllMenuJsonItem {
  id: string
  text: string
  visible: boolean
  seq?: number
  items?: AllMenuJsonItem[]
  userdata?: {
    isAuth: string
    bookmarked: string
    programId: string
    url: string
  }
}

const convertAllMenuJsonToMenuItem = (jsonData: Record<string, AllMenuJsonItem>): MenuItem[] => {
  const result: MenuItem[] = []
  
  Object.values(jsonData).forEach(item => {
    const menuItem: MenuItem = {
      id: item.id,
      text: item.text,
      level: 1, // 최상위 레벨
      categoryCode: item.id,
      bookmarked: item.userdata?.bookmarked === 'Y' || false,
      isAuth: item.userdata?.isAuth === 'Y' || true,
      hasItems: !!(item.items && item.items.length > 0),
      url: item.userdata?.url,
      userdata: item.userdata ? {
        programId: item.userdata.programId,
        bookmarked: item.userdata.bookmarked
      } : undefined
    }
    
    if (item.items && item.items.length > 0) {
      menuItem.items = convertSubItems(item.items, 2, item.id)
    }
    
    result.push(menuItem)
  })
  
  return result.sort((a, b) => {
    const aSeq = jsonData[a.id]?.seq || 0
    const bSeq = jsonData[b.id]?.seq || 0
    return aSeq - bSeq
  })
}

const convertSubItems = (items: AllMenuJsonItem[], level: number, categoryCode: string): MenuItem[] => {
  return items.map(item => {
    const menuItem: MenuItem = {
      id: item.id,
      text: item.text,
      level: level,
      categoryCode: categoryCode,
      bookmarked: item.userdata?.bookmarked === 'Y' || false,
      isAuth: item.userdata?.isAuth === 'Y' || true,
      hasItems: !!(item.items && item.items.length > 0),
      url: item.userdata?.url,
      userdata: item.userdata ? {
        programId: item.userdata.programId,
        bookmarked: item.userdata.bookmarked
      } : undefined
    }
    
    if (item.items && item.items.length > 0) {
      menuItem.items = convertSubItems(item.items, level + 1, categoryCode)
    }
    
    return menuItem
  })
}

// allmenu.json 파일 로드
const loadAllMenuData = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/sample_data/allmenu.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const jsonData = await response.json()
    allMenuData.value = convertAllMenuJsonToMenuItem(jsonData)
  } catch (error) {
    console.error('Failed to load allmenu.json:', error)
    allMenuData.value = []
  } finally {
    isLoading.value = false
  }
}

// Props 변경 감지
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue
  // 모달이 열릴 때 allmenu.json 데이터 로드
  if (newValue && allMenuData.value.length === 0) {
    loadAllMenuData()
  }
})

watch(isVisible, (newValue) => {
  if (newValue !== props.visible) {
    emit('update:visible', newValue)
  }
})

// 카테고리 목록 (JSP 구조 기반)
const categories = computed<MenuCategory[]>(() => {
  return menuCategories
})

// 필터링된 메뉴 아이템 (allmenu.json 데이터 사용)
const filteredMenuItems = computed<MenuItem[]>(() => {
  let filtered = [...allMenuData.value]
  
  // 카테고리 필터 (전체메뉴가 아닌 경우)
  if (selectedCategory.value !== 'all') {
    filtered = filterByCategory(filtered, selectedCategory.value)
  }
  
  // 권한 필터 (전체보기가 꺼져있는 경우)
  if (!showAllMenus.value) {
    filtered = filterByAuth(filtered)
  }
  
  // 즐겨찾기 필터
  if (showFavorites.value) {
    filtered = filterByFavorites(filtered)
  }
  
  // 검색 필터
  if (searchQuery.value.trim()) {
    if (searchMode.value === 'column') {
      filtered = filterByColumnSearch(filtered, searchQuery.value.trim())
    } else {
      filtered = filterByTextSearch(filtered, searchQuery.value.trim())
    }
  }
  
  return filtered
})

// JSP 기반 필터링 함수들
const filterByCategory = (items: MenuItem[], categoryCode: string): MenuItem[] => {
  return items.filter(item => item.categoryCode === categoryCode)
}

const filterByAuth = (items: MenuItem[]): MenuItem[] => {
  const filtered: MenuItem[] = []
  
  const processItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (!item.isAuth) return false
      
      if (item.items && item.items.length > 0) {
        const filteredChildren = processItems(item.items)
        return filteredChildren.length > 0
      }
      
      return true
    }).map(item => ({
      ...item,
      items: item.items ? processItems(item.items) : undefined
    }))
  }
  
  return processItems(items)
}

const filterByFavorites = (items: MenuItem[]): MenuItem[] => {
  const filtered: MenuItem[] = []
  
  const processItems = (items: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = []
    
    items.forEach(item => {
      const isFavorite = item.bookmarked || favorites.value.has(item.id)
      let filteredChildren: MenuItem[] = []
      
      if (item.items && item.items.length > 0) {
        filteredChildren = processItems(item.items)
      }
      
      if (isFavorite || filteredChildren.length > 0) {
        result.push({
          ...item,
          items: filteredChildren.length > 0 ? filteredChildren : item.items
        })
      }
    })
    
    return result
  }
  
  return processItems(items)
}

const filterByTextSearch = (items: MenuItem[], query: string): MenuItem[] => {
  const keyword = query.toUpperCase().replace(/ /g, '')
  
  const processItems = (items: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = []
    
    items.forEach(item => {
      const matchesText = item.text.toUpperCase().replace(/ /g, '').includes(keyword)
      const matchesId = item.id.toUpperCase().replace(/ /g, '').includes(keyword)
      let filteredChildren: MenuItem[] = []
      
      if (item.items && item.items.length > 0) {
        filteredChildren = processItems(item.items)
      }
      
      if (matchesText || matchesId || filteredChildren.length > 0) {
        result.push({
          ...item,
          items: filteredChildren.length > 0 ? filteredChildren : item.items
        })
      }
    })
    
    return result
  }
  
  return processItems(items)
}

const filterByColumnSearch = (items: MenuItem[], query: string): MenuItem[] => {
  const keyword = query.toUpperCase().replace(/ /g, '')
  
  const processItems = (items: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = []
    
    items.forEach(item => {
      let matchesColumn = false
      
      // 컬럼 정보가 있는 경우 컬럼 검색 수행
      if (item.column) {
        const { form, grid } = item.column
        
        if (form?.id && form.id.some(id => id.toUpperCase().replace(/ /g, '').includes(keyword))) {
          matchesColumn = true
        }
        if (form?.name && form.name.some(name => name.toUpperCase().replace(/ /g, '').includes(keyword))) {
          matchesColumn = true
        }
        if (grid?.id && grid.id.some(id => id.toUpperCase().replace(/ /g, '').includes(keyword))) {
          matchesColumn = true
        }
        if (grid?.name && grid.name.some(name => name.toUpperCase().replace(/ /g, '').includes(keyword))) {
          matchesColumn = true
        }
      }
      
      let filteredChildren: MenuItem[] = []
      if (item.items && item.items.length > 0) {
        filteredChildren = processItems(item.items)
      }
      
      if (matchesColumn || filteredChildren.length > 0) {
        result.push({
          ...item,
          items: filteredChildren.length > 0 ? filteredChildren : item.items
        })
      }
    })
    
    return result
  }
  
  return processItems(items)
}

// 이벤트 핸들러들
const handleSearch = () => {
  // 검색은 reactive하게 처리됨 (computed에서 자동 처리)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const handleToggleChange = () => {
  // 토글 변경은 reactive하게 처리됨 (computed에서 자동 처리)
}

const handleCategorySelect = (categoryId: string) => {
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
  selectedCategory,
  expandedNodes,
  favorites,
  filteredMenuItems
})
</script>

<style lang="scss" scoped>
.global-menu-modal {
  :deep(.p-dialog) {
    width: 80vw !important;
    height: 80vh !important;
    max-width: 80vw !important;
    max-height: 80vh !important;
    min-width: 80vw !important;
    min-height: 80vh !important;
    background: var(--bg-primary);
    border: none;
    border-radius: 0;
    box-shadow: none;
    position: fixed !important;
    top: 10vh !important;
    left: 10vw !important;
    transform: none !important;
    resize: none !important;
    overflow: hidden !important;
    
    // JavaScript 크기 조정 방지
    transition: none !important;
    animation: none !important;
  }

  // 모든 PrimeVue Dialog 관련 클래스에 크기 고정 적용
  :deep(.p-component),
  :deep(.p-dialog-mask .p-dialog) {
    width: 80vw !important;
    height: 80vh !important;
    max-width: 80vw !important;
    max-height: 80vh !important;
    min-width: 80vw !important;
    min-height: 80vh !important;
  }

  // PrimeVue Dialog의 내부 요소들도 크기 고정
  :deep(.p-dialog-header) {
    flex-shrink: 0 !important;
    margin: 10px;
    
    .modal-title {
      font-size: calc(var(--text-xl) + 1px);
      padding: calc(var(--space-2) * 1.5);
    }
  }

  :deep(.p-dialog-content) {
    flex: 1 !important;
    overflow: hidden !important;
    padding: 0 !important;
    height: 100% !important;
    max-height: 100% !important;
    min-height: 100% !important;
  }

  // 모든 자식 요소들의 크기 제한
  :deep(.p-dialog-header),
  :deep(.p-dialog-content),
  :deep(.p-dialog-footer) {
    box-sizing: border-box !important;
  }

  :deep(.p-dialog-mask) {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(4px);
    
    // 마스크 내부의 모든 dialog 요소 크기 고정
    .p-dialog {
      width: 80vw !important;
      height: 80vh !important;
      max-width: 80vw !important;
      max-height: 80vh !important;
      min-width: 80vw !important;
      min-height: 80vh !important;
    }
  }

  // 전역적으로 모든 dialog 관련 요소 크기 고정
  :deep(*[class*="p-dialog"]) {
    width: 80vw !important;
    height: 80vh !important;
    max-width: 80vw !important;
    max-height: 80vh !important;
    min-width: 80vw !important;
    min-height: 80vh !important;
  }

  // 중복 제거됨 - 위에서 이미 정의됨

  .modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-primary);
    flex: 1;
    min-height: 0;
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
      position: relative;
      min-width: 0;

      .search-input {
        width: 100%;
        padding-right: 2.5rem;
      }

      .search-clear-button {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
      }
    }

    .toggle-section {
      flex-shrink: 0;

      .toggle-group {
        display: flex;
        gap: var(--space-4);
        align-items: center;

        .toggle-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;

          .toggle-label {
            font-size: var(--text-sm);
            color: var(--text-secondary);
            white-space: nowrap;
          }

          .toggle-switch {
            :deep(.p-togglebutton) {
              width: 3rem;
              height: 1.5rem;
              border-radius: 0.75rem;
            }
          }
        }
      }
    }
  }

  // 카테고리 탭 영역
  .category-tabs-section {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--surface-2);
    padding: var(--space-2) var(--space-6);

    .category-tabs {
      display: flex;
      gap: var(--space-1);
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .category-tab {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        padding: var(--space-2) var(--space-4);
        background: transparent;
        border: 1px solid var(--surface-2);
        border-radius: var(--border-radius-md);
        color: var(--text-secondary);
        font-size: var(--text-sm);
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition-normal);
        white-space: nowrap;
        min-width: fit-content;

        &:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        &.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .category-count {
          font-size: var(--text-xs);
          opacity: 0.8;
        }
      }
    }
  }

  .modal-body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 200px 1fr;
    background: var(--bg-primary);
    overflow: hidden;
    height: 100%;
    width: 100%;

    // 좌측 카테고리 사이드바
    .category-sidebar {
      background: var(--bg-secondary);
      border-right: 1px solid var(--surface-2);
      overflow-y: auto;

      .category-list {
        display: flex;
        flex-direction: column;

        .category-button {
          display: block;
          width: 100%;
          padding: var(--space-3) var(--space-4);
          background: transparent;
          border: none;
          text-align: left;
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-normal);
          border-bottom: 1px solid var(--surface-2);

          &:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }

          &.active {
            background: var(--primary);
            color: white;
          }

          &:first-child {
            border-top: none;
          }
        }
      }
    }

    // 우측 메뉴 트리 영역
    .menu-tree-area {
      background: var(--bg-primary);
      overflow-y: auto;
      padding: var(--space-4);

      .loading-view {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;

        .loading-content {
          text-align: center;
          color: var(--text-secondary);

          .loading-icon {
            font-size: 2rem;
            margin-bottom: var(--space-4);
            color: var(--primary);
          }

          .loading-title {
            font-size: var(--text-lg);
            font-weight: 500;
          }
        }
      }

      .empty-view {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;

        .empty-content {
          text-align: center;
          color: var(--text-secondary);

          .empty-icon {
            font-size: 3rem;
            margin-bottom: var(--space-4);
            opacity: 0.5;
          }

          .empty-title {
            font-size: var(--text-lg);
            font-weight: 500;
          }
        }
      }

      // 스크롤바 스타일링
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
  }

  // 반응형 처리
  @media (max-width: 768px) {
    :deep(.p-dialog) {
      width: 80vw !important;
      height: 80vh !important;
      min-width: 80vw !important;
      min-height: 80vh !important;
      top: 10vh !important;
      left: 10vw !important;
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
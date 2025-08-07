<template>
  <div class="menu-category-list">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="category-loading" data-testid="category-loading">
      <div class="loading-skeleton">
        <div 
          v-for="i in 5" 
          :key="i" 
          class="skeleton-item"
        />
      </div>
    </div>

    <!-- 빈 상태 -->
    <div 
      v-else-if="!categories.length"
      class="empty-categories" 
      data-testid="empty-categories"
    >
      <i class="pi pi-folder-open empty-icon" />
      <p class="empty-text">카테고리가 없습니다</p>
    </div>

    <!-- 검색 결과 없음 -->
    <div 
      v-else-if="searchQuery && !filteredCategories.length"
      class="no-search-results" 
      data-testid="no-search-results"
    >
      <i class="pi pi-search empty-icon" />
      <p class="empty-text">검색 결과가 없습니다</p>
      <p class="empty-subtext">'{{ searchQuery }}'와 일치하는 카테고리가 없습니다</p>
    </div>

    <!-- 카테고리 목록 -->
    <div v-else class="category-content">
      <!-- 전체 보기 옵션 -->
      <div
        v-if="showAllOption"
        :class="[
          'category-item',
          'category-item--all',
          { 'category-item--selected': selectedCategory === null }
        ]"
        role="button"
        tabindex="0"
        aria-label="전체 카테고리 보기"
        data-testid="category-item-all"
        @click="selectCategory(null)"
        @keydown="handleKeydown($event, null)"
      >
        <div class="category-content">
          <i class="pi pi-list category-icon" />
          <span class="category-name">전체</span>
          <span 
            v-if="totalCount > 0" 
            class="category-count"
            :aria-label="`총 ${totalCount}개 메뉴`"
          >
            {{ totalCount }}
          </span>
        </div>
      </div>

      <!-- 실제 카테고리 목록 -->
      <Listbox
        v-model="internalSelectedCategory"
        :options="displayCategories"
        option-label="name"
        option-value="id"
        class="category-listbox"
        data-testid="category-listbox"
        @update:model-value="handleCategoryChange"
      >
        <template #option="{ option, index }">
          <div
            class="category-item-content"
            :data-testid="`category-item-${option.id}`"
            :aria-label="`${option.name} 카테고리, ${option.count}개 메뉴`"
          >
            <div class="category-main">
              <i 
                v-if="showIcons && option.icon" 
                :class="option.icon" 
                class="category-icon"
              />
              <i 
                v-else-if="showIcons" 
                class="pi pi-folder category-icon default-icon"
              />
              
              <span 
                class="category-name"
                v-html="highlightSearch ? highlightText(option.name, searchQuery) : option.name"
              />
            </div>
            
            <div class="category-meta">
              <span 
                v-if="option.count > 0" 
                class="category-count"
                :aria-label="`${option.count}개 메뉴`"
              >
                {{ option.count }}
              </span>
              
              <!-- 즐겨찾기 표시 -->
              <i 
                v-if="option.favorite"
                class="pi pi-star-fill category-favorite"
                aria-label="즐겨찾는 카테고리"
              />
            </div>
          </div>
        </template>
      </Listbox>
    </div>

    <!-- 스크린 리더를 위한 안내 -->
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
import Listbox from 'primevue/listbox'
import type { Category } from '@/types/menu'

interface Props {
  /** 카테고리 목록 */
  categories: Category[]
  /** 선택된 카테고리 ID */
  selectedCategory: string | null
  /** 검색 쿼리 */
  searchQuery?: string
  /** 검색 하이라이팅 여부 */
  highlightSearch?: boolean
  /** 아이콘 표시 여부 */
  showIcons?: boolean
  /** 전체 보기 옵션 표시 여부 */
  showAllOption?: boolean
  /** 총 메뉴 개수 (전체 보기에서 사용) */
  totalCount?: number
  /** 로딩 상태 */
  loading?: boolean
  /** 대소문자 구분 검색 */
  caseSensitive?: boolean
}

interface Emits {
  (e: 'category-select', categoryId: string | null): void
  (e: 'update:selectedCategory', categoryId: string | null): void
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  selectedCategory: null,
  searchQuery: '',
  highlightSearch: true,
  showIcons: true,
  showAllOption: true,
  totalCount: 0,
  loading: false,
  caseSensitive: false
})

const emit = defineEmits<Emits>()

// 내부 상태
const internalSelectedCategory = ref<string | null>(props.selectedCategory)
const screenReaderAnnouncement = ref('')

// Props 변경 감지
watch(() => props.selectedCategory, (newValue) => {
  internalSelectedCategory.value = newValue
})

// 필터링된 카테고리
const filteredCategories = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.categories
  }
  
  const query = props.caseSensitive 
    ? props.searchQuery.trim()
    : props.searchQuery.trim().toLowerCase()
  
  return props.categories.filter(category => {
    const name = props.caseSensitive 
      ? category.name
      : category.name.toLowerCase()
    
    return name.includes(query)
  })
})

// 표시할 카테고리 (정렬 포함)
const displayCategories = computed(() => {
  const categories = [...filteredCategories.value]
  
  // 정렬: 즐겨찾기 > 이름순
  return categories.sort((a, b) => {
    // 즐겨찾기 우선 정렬
    if (a.favorite && !b.favorite) return -1
    if (!a.favorite && b.favorite) return 1
    
    // 그 다음 이름으로 정렬
    return a.name.localeCompare(b.name, 'ko', { numeric: true })
  })
})

// 이벤트 핸들러
const selectCategory = (categoryId: string | null) => {
  internalSelectedCategory.value = categoryId
  emit('category-select', categoryId)
  emit('update:selectedCategory', categoryId)
  
  // 스크린 리더 안내
  if (categoryId === null) {
    screenReaderAnnouncement.value = '전체 카테고리가 선택되었습니다'
  } else {
    const category = props.categories.find(c => c.id === categoryId)
    if (category) {
      screenReaderAnnouncement.value = `${category.name} 카테고리가 선택되었습니다. ${category.count}개의 메뉴가 있습니다`
    }
  }
}

const handleCategoryChange = (categoryId: string | null) => {
  selectCategory(categoryId)
}

const handleKeydown = (event: KeyboardEvent, categoryId: string | null) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectCategory(categoryId)
  }
}

// 검색 하이라이팅 함수
const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const searchQuery = props.caseSensitive ? query : query.toLowerCase()
  const targetText = props.caseSensitive ? text : text.toLowerCase()
  
  const index = targetText.indexOf(searchQuery)
  if (index === -1) return text
  
  const before = text.substring(0, index)
  const match = text.substring(index, index + query.length)
  const after = text.substring(index + query.length)
  
  return `${before}<mark class="search-highlight">${match}</mark>${after}`
}

// 컴포넌트 마운트 시 초기 안내
onMounted(() => {
  if (props.categories.length > 0) {
    screenReaderAnnouncement.value = `${props.categories.length}개의 카테고리가 있습니다`
  }
})
</script>

<style lang="scss" scoped>
.menu-category-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

// 로딩 상태
.category-loading {
  padding: var(--space-4);
  
  .loading-skeleton {
    .skeleton-item {
      height: 40px;
      background: var(--surface-2);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--space-2);
      animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@keyframes skeleton-pulse {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}

// 빈 상태
.empty-categories,
.no-search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
  flex: 1;
  min-height: 200px;
  
  .empty-icon {
    font-size: 3rem;
    color: var(--text-muted);
    margin-bottom: var(--space-4);
  }
  
  .empty-text {
    color: var(--text-secondary);
    font-size: var(--text-base);
    font-weight: 500;
    margin-bottom: var(--space-2);
  }
  
  .empty-subtext {
    color: var(--text-muted);
    font-size: var(--text-sm);
    margin: 0;
  }
}

// 카테고리 콘텐츠
.category-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

// 전체 보기 아이템
.category-item--all {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--surface-2);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    background: var(--bg-tertiary);
  }
  
  &--selected {
    background: var(--primary);
    color: white;
    
    .category-icon,
    .category-count {
      color: white;
    }
  }
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  
  .category-content {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    
    .category-icon {
      color: var(--text-secondary);
      font-size: var(--text-base);
      flex-shrink: 0;
    }
    
    .category-name {
      flex: 1;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .category-count {
      background: var(--surface-3);
      color: var(--text-primary);
      font-size: var(--text-xs);
      font-weight: 600;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius-full);
      min-width: 24px;
      text-align: center;
    }
  }
}

// Listbox 스타일링
.category-listbox {
  flex: 1;
  border: none;
  background: transparent;
  
  :deep(.p-listbox-list) {
    border: none;
    background: transparent;
    padding: 0;
  }
  
  :deep(.p-listbox-item) {
    padding: 0;
    border: none;
    background: transparent;
    margin: 0;
    
    &:hover {
      background: var(--bg-tertiary);
    }
    
    &.p-highlight {
      background: var(--primary);
      color: white;
      
      .category-icon,
      .category-count,
      .category-favorite {
        color: white;
      }
      
      .category-count {
        background: rgba(255, 255, 255, 0.2);
      }
    }
    
    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: -2px;
    }
  }
}

// 카테고리 아이템 콘텐츠
.category-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  gap: var(--space-3);
  
  .category-main {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
    min-width: 0;
    
    .category-icon {
      color: var(--text-secondary);
      font-size: var(--text-base);
      flex-shrink: 0;
      
      &.default-icon {
        opacity: 0.7;
      }
    }
    
    .category-name {
      font-weight: 500;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      
      // 검색 하이라이팅
      :deep(.search-highlight) {
        background: var(--warning);
        color: var(--bg-primary);
        padding: 1px 2px;
        border-radius: 2px;
        font-weight: 600;
      }
    }
  }
  
  .category-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
    
    .category-count {
      background: var(--surface-3);
      color: var(--text-primary);
      font-size: var(--text-xs);
      font-weight: 600;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius-full);
      min-width: 24px;
      text-align: center;
      
      // 0개일 때 숨김
      &:empty {
        display: none;
      }
    }
    
    .category-favorite {
      color: var(--warning);
      font-size: var(--text-sm);
    }
  }
}

// 스크롤바 스타일링
.category-listbox {
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
  .category-item--all .category-content,
  .category-item-content {
    padding: var(--space-2) var(--space-3);
    
    .category-icon {
      font-size: var(--text-sm);
    }
    
    .category-name {
      font-size: var(--text-sm);
    }
    
    .category-count {
      font-size: 10px;
      padding: 2px var(--space-1);
      min-width: 20px;
    }
  }
  
  .empty-categories,
  .no-search-results {
    padding: var(--space-6) var(--space-3);
    min-height: 150px;
    
    .empty-icon {
      font-size: 2rem;
      margin-bottom: var(--space-3);
    }
    
    .empty-text {
      font-size: var(--text-sm);
    }
    
    .empty-subtext {
      font-size: var(--text-xs);
    }
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  .category-item--all {
    border: 1px solid var(--surface-2);
    margin-bottom: 1px;
    
    &--selected {
      border-color: var(--primary);
      outline: 2px solid var(--primary);
      outline-offset: -2px;
    }
  }
  
  :deep(.p-listbox-item) {
    border: 1px solid var(--surface-2);
    margin-bottom: 1px;
  }
  
  :deep(.p-listbox-item.p-highlight) {
    border-color: var(--primary);
    outline: 2px solid var(--primary);
    outline-offset: -2px;
  }
  
  .category-count {
    border: 1px solid var(--surface-1);
  }
}

// 모션 감소 선호 시
@media (prefers-reduced-motion: reduce) {
  .category-item--all,
  :deep(.p-listbox-item),
  .loading-skeleton .skeleton-item {
    transition: none;
    animation: none;
  }
}</style>
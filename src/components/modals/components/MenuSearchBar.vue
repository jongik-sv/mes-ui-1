<template>
  <div class="menu-search-bar">
    <div class="search-input-wrapper">
      <i class="pi pi-search search-icon" />
      <InputText
        v-model="searchValue"
        :placeholder="placeholder"
        class="search-input"
        data-testid="search-input"
        role="searchbox"
        aria-label="메뉴 검색"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <Button
        v-if="searchValue"
        icon="pi pi-times"
        text
        size="small"
        class="clear-button"
        data-testid="clear-button"
        aria-label="검색어 지우기"
        @click="clearSearch"
      />
    </div>

    <!-- 검색 제안사항 (Auto-completion) -->
    <div
      v-if="showSuggestions && filteredSuggestions.length > 0"
      class="suggestions-dropdown"
      data-testid="suggestions-list"
    >
      <ul class="suggestions-list" role="listbox">
        <li
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          :class="[
            'suggestion-item',
            { 'suggestion-item--selected': selectedSuggestionIndex === index }
          ]"
          :data-testid="`suggestion-item-${index}`"
          role="option"
          :aria-selected="selectedSuggestionIndex === index"
          @click="selectSuggestion(suggestion)"
          @mouseenter="selectedSuggestionIndex = index"
        >
          <i class="pi pi-search suggestion-icon" />
          <span class="suggestion-text">{{ suggestion }}</span>
        </li>
      </ul>
    </div>

    <!-- 검색 히스토리 -->
    <div
      v-if="props.showHistory && searchHistory.length > 0 && !searchValue && isFocused"
      class="history-dropdown"
      data-testid="search-history"
    >
      <div class="history-header">
        <span class="history-title">최근 검색</span>
        <Button
          icon="pi pi-trash"
          text
          size="small"
          class="clear-history-button"
          aria-label="검색 히스토리 지우기"
          @click="clearHistory"
        />
      </div>
      <ul class="history-list" role="listbox">
        <li
          v-for="(historyItem, index) in searchHistory"
          :key="index"
          class="history-item"
          :data-testid="`history-item-${index}`"
          role="option"
          @click="selectHistory(historyItem)"
        >
          <i class="pi pi-history history-icon" />
          <span class="history-text">{{ historyItem }}</span>
          <Button
            icon="pi pi-times"
            text
            size="small"
            class="remove-history-button"
            :aria-label="`'${historyItem}' 검색 기록 삭제`"
            @click.stop="removeFromHistory(historyItem)"
          />
        </li>
      </ul>
    </div>

    <!-- 검색 결과 안내 (Screen Reader용) -->
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ searchResultAnnouncement }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

interface Props {
  /** v-model 값 */
  modelValue: string
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 자동완성 제안사항 */
  suggestions?: string[]
  /** 자동완성 표시 여부 */
  showSuggestions?: boolean
  /** 검색 히스토리 표시 여부 */
  showHistory?: boolean
  /** 디바운싱 지연 시간 (ms) */
  debounceTime?: number
  /** 최대 히스토리 개수 */
  maxHistoryItems?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', query: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '메뉴 검색...',
  suggestions: () => [],
  showSuggestions: true,
  showHistory: true,
  debounceTime: 300,
  maxHistoryItems: 5
})

const emit = defineEmits<Emits>()

// 반응형 상태
const searchValue = ref(props.modelValue)
const isFocused = ref(false)
const selectedSuggestionIndex = ref(-1)
const searchHistory = ref<string[]>([])
const debounceTimer = ref<NodeJS.Timeout | null>(null)
const searchResultAnnouncement = ref('')

// Props 변경 감지
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

// 제안사항 표시 여부
const showSuggestions = computed(() => props.showSuggestions && isFocused.value)

// 필터링된 제안사항
const filteredSuggestions = computed(() => {
  if (!searchValue.value.trim()) return []
  
  const query = searchValue.value.toLowerCase()
  return props.suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(query) && 
      suggestion.toLowerCase() !== query
    )
    .slice(0, 5) // 최대 5개만 표시
})

// 이벤트 핸들러들
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  searchValue.value = value
  emit('update:modelValue', value)
  
  // 디바운싱 적용
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    emit('search', value)
    
    if (value.trim()) {
      // 검색 결과 안내 업데이트
      searchResultAnnouncement.value = `'${value}'에 대한 검색 중...`
    }
  }, props.debounceTime)
  
  // 제안사항 선택 인덱스 초기화
  selectedSuggestionIndex.value = -1
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        filteredSuggestions.value.length - 1
      )
      break
      
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(
        selectedSuggestionIndex.value - 1,
        -1
      )
      break
      
    case 'Enter':
      event.preventDefault()
      if (selectedSuggestionIndex.value >= 0) {
        selectSuggestion(filteredSuggestions.value[selectedSuggestionIndex.value])
      } else if (searchValue.value.trim()) {
        performSearch(searchValue.value.trim())
      }
      break
      
    case 'Escape':
      selectedSuggestionIndex.value = -1
      break
      
    case 'Tab':
      // Tab 키로 첫 번째 제안사항 자동완성
      if (selectedSuggestionIndex.value === -1 && filteredSuggestions.value.length > 0) {
        event.preventDefault()
        selectSuggestion(filteredSuggestions.value[0])
      }
      break
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  // 약간의 지연을 두어 클릭 이벤트가 먼저 처리되도록 함
  setTimeout(() => {
    isFocused.value = false
    selectedSuggestionIndex.value = -1
  }, 150)
}

const clearSearch = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  searchResultAnnouncement.value = '검색어가 지워졌습니다'
}

const selectSuggestion = (suggestion: string) => {
  searchValue.value = suggestion
  emit('update:modelValue', suggestion)
  performSearch(suggestion)
  selectedSuggestionIndex.value = -1
}

const selectHistory = (historyItem: string) => {
  searchValue.value = historyItem
  emit('update:modelValue', historyItem)
  performSearch(historyItem)
}

const performSearch = (query: string) => {
  if (query.trim()) {
    addToHistory(query.trim())
    emit('search', query.trim())
    searchResultAnnouncement.value = `'${query}' 검색 완료`
  }
}

// 검색 히스토리 관리
const addToHistory = (query: string) => {
  // 중복 제거
  const filtered = searchHistory.value.filter(item => item !== query)
  // 맨 앞에 추가
  searchHistory.value = [query, ...filtered].slice(0, props.maxHistoryItems)
  saveHistoryToStorage()
}

const removeFromHistory = (query: string) => {
  searchHistory.value = searchHistory.value.filter(item => item !== query)
  saveHistoryToStorage()
}

const clearHistory = () => {
  searchHistory.value = []
  saveHistoryToStorage()
}

const loadHistoryFromStorage = () => {
  try {
    const saved = localStorage.getItem('mes-search-history')
    if (saved) {
      searchHistory.value = JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load search history:', error)
  }
}

const saveHistoryToStorage = () => {
  try {
    localStorage.setItem('mes-search-history', JSON.stringify(searchHistory.value))
  } catch (error) {
    console.warn('Failed to save search history:', error)
  }
}

// 전역 키보드 이벤트 처리
const handleGlobalKeydown = (event: KeyboardEvent) => {
  // Ctrl+K로 검색창 포커스
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    const input = document.querySelector('[data-testid="search-input"]') as HTMLInputElement
    input?.focus()
  }
  
  // Ctrl+L로 검색창 클리어
  if (event.ctrlKey && event.key === 'l' && isFocused.value) {
    event.preventDefault()
    clearSearch()
  }
}

// 라이프사이클 훅
onMounted(() => {
  loadHistoryFromStorage()
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  document.removeEventListener('keydown', handleGlobalKeydown)
})

// 컴포넌트 메서드 노출
defineExpose({
  addToHistory,
  clearHistory,
  searchHistory
})
</script>

<style lang="scss" scoped>
.menu-search-bar {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  
  .search-icon {
    position: absolute;
    left: var(--space-3);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    pointer-events: none;
    z-index: 1;
  }
  
  .search-input {
    width: 100%;
    padding-left: calc(var(--space-3) * 2 + var(--text-sm));
    padding-right: var(--space-10);
    background: var(--bg-primary);
    border: 1px solid var(--surface-2);
    border-radius: var(--border-radius-md);
    color: var(--text-primary);
    transition: var(--transition-normal);
    
    &::placeholder {
      color: var(--text-muted);
    }
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    
    &:hover {
      border-color: var(--surface-1);
    }
  }
  
  .clear-button {
    position: absolute;
    right: var(--space-2);
    color: var(--text-secondary);
    z-index: 1;
    
    &:hover {
      color: var(--text-primary);
      background: var(--bg-tertiary);
    }
  }
}

.suggestions-dropdown,
.history-dropdown {
  position: absolute;
  top: calc(100% + var(--space-1));
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.suggestions-list,
.history-list {
  list-style: none;
  padding: var(--space-1);
  margin: 0;
}

.suggestion-item,
.history-item {
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-normal);
  gap: var(--space-2);
  
  &:hover,
  &--selected {
    background: var(--bg-tertiary);
  }
  
  .suggestion-icon,
  .history-icon {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }
  
  .suggestion-text,
  .history-text {
    color: var(--text-primary);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.history-dropdown {
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--surface-2);
    
    .history-title {
      font-size: var(--text-xs);
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .clear-history-button {
      color: var(--text-muted);
      
      &:hover {
        color: var(--text-secondary);
        background: var(--bg-tertiary);
      }
    }
  }
  
  .history-item {
    .remove-history-button {
      opacity: 0;
      transition: var(--transition-normal);
      color: var(--text-muted);
      
      &:hover {
        color: var(--error);
        background: transparent;
      }
    }
    
    &:hover .remove-history-button {
      opacity: 1;
    }
  }
}

// 스크롤바 스타일링
.suggestions-dropdown,
.history-dropdown {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--surface-3);
    border-radius: 2px;
    
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

// 키보드 단축키 힌트
.search-input-wrapper::after {
  content: 'Ctrl+K';
  position: absolute;
  right: var(--space-8);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-xs);
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  opacity: 0;
  transition: var(--transition-normal);
  pointer-events: none;
}

.search-input:not(:focus) + .clear-button:not(:hover) ~ .search-input-wrapper::after {
  opacity: 1;
}

// 반응형 디자인
@media (max-width: 768px) {
  .search-input-wrapper::after {
    display: none;
  }
  
  .suggestions-dropdown,
  .history-dropdown {
    max-height: 150px;
  }
}

// 애니메이션
.suggestions-dropdown,
.history-dropdown {
  animation: dropdown-enter 0.15s ease-out;
}

@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 고대비 모드 지원
@media (prefers-contrast: high) {
  .search-input {
    border-width: 2px;
  }
  
  .suggestion-item--selected,
  .history-item:hover {
    outline: 2px solid var(--primary);
  }
}</style>
/**
 * 메뉴 아이템 인터페이스
 */
export interface MenuItem {
  /** 고유 식별자 */
  id: string
  /** 메뉴 제목 */
  title: string
  /** 메뉴 URL (선택사항) */
  url?: string
  /** 아이콘 이름 (선택사항) */
  icon?: string
  /** 하위 메뉴 목록 */
  children?: MenuItem[]
  /** 즐겨찾기 여부 */
  favorite: boolean
  /** 카테고리 */
  category: string
  /** 메뉴 레벨 (1-5) */
  level?: number
  /** 정렬 순서 */
  order?: number
  /** 활성화 여부 */
  enabled?: boolean
  /** 권한 정보 */
  permissions?: string[]
  /** 메타데이터 */
  metadata?: Record<string, any>
}

/**
 * 카테고리 인터페이스
 */
export interface Category {
  /** 카테고리 ID */
  id: string
  /** 카테고리 이름 */
  name: string
  /** 메뉴 개수 */
  count: number
  /** 아이콘 (선택사항) */
  icon?: string
  /** 설명 (선택사항) */
  description?: string
  /** 정렬 순서 */
  order?: number
  /** 색상 (선택사항) */
  color?: string
}

/**
 * 뷰 모드 타입
 */
export type ViewMode = 'all' | 'favorites'

/**
 * 메뉴 상태 인터페이스
 */
export interface MenuState {
  /** 검색 쿼리 */
  searchQuery: string
  /** 뷰 모드 */
  viewMode: ViewMode
  /** 선택된 카테고리 */
  selectedCategory: string | null
  /** 확장된 노드들 */
  expandedNodes: Set<string>
  /** 즐겨찾기 목록 */
  favorites: Set<string>
  /** 로딩 상태 */
  loading?: boolean
  /** 에러 상태 */
  error?: string | null
}

/**
 * 메뉴 트리 노드 인터페이스 (PrimeVue Tree 호환)
 */
export interface MenuTreeNode {
  /** 노드 키 (MenuItem.id와 동일) */
  key: string
  /** 노드 라벨 (MenuItem.title과 동일) */
  label: string
  /** 하위 노드들 */
  children?: MenuTreeNode[]
  /** 리프 노드 여부 */
  leaf?: boolean
  /** 확장 가능 여부 */
  expandedIcon?: string
  /** 축소 아이콘 */
  collapsedIcon?: string
  /** 아이콘 */
  icon?: string
  /** 선택 가능 여부 */
  selectable?: boolean
  /** 데이터 */
  data?: MenuItem
  /** 스타일 클래스 */
  styleClass?: string
  /** 즐겨찾기 여부 */
  favorite?: boolean
  /** URL */
  url?: string
  /** 카테고리 */
  category?: string
}

/**
 * 메뉴 검색 옵션 인터페이스
 */
export interface MenuSearchOptions {
  /** 검색 쿼리 */
  query: string
  /** 대소문자 구분 여부 */
  caseSensitive?: boolean
  /** 정확히 일치하는지 여부 */
  exactMatch?: boolean
  /** 검색할 필드들 */
  searchFields?: Array<keyof MenuItem>
  /** 최대 결과 수 */
  maxResults?: number
  /** 검색 결과 하이라이팅 여부 */
  highlight?: boolean
}

/**
 * 메뉴 필터 옵션 인터페이스
 */
export interface MenuFilterOptions {
  /** 카테고리 필터 */
  category?: string | null
  /** 뷰 모드 */
  viewMode?: ViewMode
  /** 즐겨찾기만 보기 */
  favoritesOnly?: boolean
  /** 활성화된 메뉴만 보기 */
  enabledOnly?: boolean
  /** 권한 필터 */
  permissions?: string[]
  /** 레벨 필터 */
  levels?: number[]
}

/**
 * 메뉴 정렬 옵션 인터페이스
 */
export interface MenuSortOptions {
  /** 정렬 기준 필드 */
  field: keyof MenuItem
  /** 정렬 방향 */
  direction: 'asc' | 'desc'
  /** 보조 정렬 기준 */
  secondaryField?: keyof MenuItem
  /** 보조 정렬 방향 */
  secondaryDirection?: 'asc' | 'desc'
}

/**
 * 메뉴 이벤트 인터페이스
 */
export interface MenuEvents {
  /** 메뉴 선택 이벤트 */
  'menu-select': (menu: MenuItem) => void
  /** 노드 확장 이벤트 */
  'node-expand': (nodeId: string) => void
  /** 노드 축소 이벤트 */
  'node-collapse': (nodeId: string) => void
  /** 즐겨찾기 토글 이벤트 */
  'toggle-favorite': (nodeId: string) => void
  /** 카테고리 선택 이벤트 */
  'category-select': (categoryId: string | null) => void
  /** 검색 이벤트 */
  'search': (query: string) => void
  /** 뷰 모드 변경 이벤트 */
  'view-mode-change': (mode: ViewMode) => void
}

/**
 * 메뉴 유틸리티 함수 타입
 */
export type MenuItemTransformer = (item: MenuItem) => MenuTreeNode
export type MenuItemFilter = (item: MenuItem) => boolean
export type MenuItemComparator = (a: MenuItem, b: MenuItem) => number

/**
 * 메뉴 히스토리 인터페이스
 */
export interface MenuHistory {
  /** 최근 선택한 메뉴들 */
  recentMenus: MenuItem[]
  /** 검색 히스토리 */
  searchHistory: string[]
  /** 방문 횟수 */
  visitCount: Record<string, number>
  /** 마지막 방문 시간 */
  lastVisited: Record<string, Date>
  /** 최대 히스토리 개수 */
  maxHistorySize?: number
}

/**
 * 메뉴 권한 인터페이스
 */
export interface MenuPermission {
  /** 메뉴 ID */
  menuId: string
  /** 필요한 권한 목록 */
  requiredPermissions: string[]
  /** 역할 기반 접근 권한 */
  roles?: string[]
  /** 사용자별 접근 권한 */
  users?: string[]
  /** 그룹별 접근 권한 */
  groups?: string[]
}

/**
 * 메뉴 설정 인터페이스
 */
export interface MenuConfiguration {
  /** 최대 트리 깊이 */
  maxTreeDepth: number
  /** 기본 뷰 모드 */
  defaultViewMode: ViewMode
  /** 검색 디바운스 시간 (ms) */
  searchDebounceTime: number
  /** 자동 완성 활성화 여부 */
  enableAutoComplete: boolean
  /** 검색 히스토리 저장 여부 */
  saveSearchHistory: boolean
  /** 즐겨찾기 저장 방식 */
  favoriteStorageType: 'localStorage' | 'sessionStorage' | 'server'
  /** 최대 검색 결과 수 */
  maxSearchResults: number
  /** 카테고리 표시 여부 */
  showCategories: boolean
  /** 메뉴 아이콘 표시 여부 */
  showIcons: boolean
  /** 즐겨찾기 카운트 표시 여부 */
  showCategoryCounts: boolean
}

/**
 * 메뉴 컨텍스트 메뉴 인터페이스
 */
export interface MenuContextMenu {
  /** 메뉴 항목들 */
  items: Array<{
    /** 항목 라벨 */
    label: string
    /** 아이콘 */
    icon?: string
    /** 클릭 핸들러 */
    command?: (event: { originalEvent: Event; item: MenuItem }) => void
    /** 구분선 여부 */
    separator?: boolean
    /** 비활성화 여부 */
    disabled?: boolean
  }>
  /** 표시 위치 */
  position: { x: number; y: number }
  /** 대상 메뉴 아이템 */
  targetItem: MenuItem
}
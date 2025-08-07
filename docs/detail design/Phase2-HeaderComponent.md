# Phase 2: 헤더 컴포넌트 상세 설계 (4.2 전체 메뉴 아이콘 및 모달 시스템)

## 개요

본 문서는 MES UI 프레임워크의 4.2 전체 메뉴 아이콘 및 모달 시스템 구현을 위한 상세 설계를 다룹니다. 헤더 컴포넌트 내의 전체 메뉴 아이콘(≡) 버튼과 전체 메뉴 모달 시스템을 중심으로 구현합니다.

## 설계 목표

### 기능적 요구사항 (4.2 Task 중심)
- 전체 메뉴 아이콘(≡) 버튼 컴포넌트 작성
- 전체 메뉴 모달 다이얼로그 구현 (90vw x 90vh)
- 검색창, 전체보기/즐겨찾기 토글 기능 구현
- 좌측 카테고리, 우측 메뉴 트리 레이아웃 구현
- 접근성 가이드라인 준수 (WCAG 2.1 AA)

### 기술적 요구사항
- Vue 3 Composition API 사용
- PrimeVue 컴포넌트 활용
- TypeScript 타입 안전성 보장
- 단위 테스트 커버리지 80% 이상
- 다크 테마 지원

## 컴포넌트 구조

### 컴포넌트 계층 구조 (4.2 Task 중심)
```
HeaderComponent
├── GlobalMenuButton (전체 메뉴 아이콘)
└── GlobalMenuModal (전체 메뉴 모달)
    ├── MenuSearchBar (검색창)
    ├── MenuToggleButtons (전체보기/즐겨찾기)
    ├── MenuCategoryList (좌측 카테고리)
    └── MenuTree (우측 메뉴 트리)
```

### 파일 구조
```
src/components/
├── GlobalMenuButton.vue
├── HeaderComponent.vue (기존 파일 확장)
└── modals/
    ├── GlobalMenuModal.vue
    └── components/
        ├── MenuSearchBar.vue
        ├── MenuToggleButtons.vue
        ├── MenuCategoryList.vue
        └── MenuTree.vue
```

## 상세 컴포넌트 설계

### 1. GlobalMenuButton (전체 메뉴 버튼)

#### 기능 명세
- 햄버거 메뉴 아이콘(≡) 표시
- 클릭 시 GlobalMenuModal 열기
- 다크 테마에 적합한 스타일링
- 접근성 속성 적용

#### Props Interface
```typescript
interface GlobalMenuButtonProps {
  size?: 'small' | 'medium' | 'large'
}

interface GlobalMenuButtonEmits {
  click: []
}
```

#### 스타일 정의
```scss
.global-menu-button {
  --button-size: 40px;
  --icon-size: 20px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--button-size);
  height: var(--button-size);
  background: transparent;
  border: 1px solid var(--surface-2);
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary);
  }

  &:active {
    transform: scale(0.95);
  }

  .hamburger-icon {
    width: var(--icon-size);
    height: var(--icon-size);
  }
}
```

### 2. GlobalMenuModal (전체 메뉴 모달)

#### 기능 명세
- 90vw × 90vh 크기의 모달 다이얼로그
- ESC 키, 배경 클릭으로 닫기
- 내부 컴포넌트들의 통합 관리
- 반응형 레이아웃 적용

#### 레이아웃 구조
```
┌─────────────────────────────────────────────────────────────┐
│                         모달 헤더                          │
│  [검색창]                              [전체보기] [즐겨찾기]  │
├─────────────────────────────────────────────────────────────┤
│               │                                             │
│    카테고리    │                메뉴 트리                   │
│    목록       │                                             │
│               │                                             │
│               │                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Props Interface
```typescript
interface GlobalMenuModalProps {
  visible: boolean
}

interface GlobalMenuModalEmits {
  'update:visible': [value: boolean]
  'menu-select': [menu: MenuItem]
}

interface MenuItem {
  id: string
  title: string
  url?: string
  icon?: string
  children?: MenuItem[]
  favorite: boolean
  category: string
}
```

#### 상태 관리
```typescript
interface MenuState {
  searchQuery: string
  viewMode: 'all' | 'favorites'
  selectedCategory: string | null
  expandedNodes: Set<string>
  favorites: Set<string>
}
```

#### 스타일 정의
```scss
.global-menu-modal {
  .p-dialog-mask {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(4px);
  }

  .p-dialog {
    width: 90vw;
    height: 90vh;
    background: var(--bg-primary);
    border: 1px solid var(--surface-2);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
  }

  .modal-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 60px 1fr;
    height: 100%;
    gap: 1px;
    background: var(--surface-2);
  }

  @media (max-width: 768px) {
    .p-dialog {
      width: 95vw;
      height: 95vh;
    }

    .modal-content {
      grid-template-columns: 1fr;
      grid-template-rows: 60px auto 1fr;
    }
  }
}
```

### 3. MenuSearchBar (검색창)

#### 기능 명세
- 실시간 검색 기능
- 검색 결과 하이라이팅
- 검색어 자동완성 (선택사항)
- 검색 히스토리 관리 (선택사항)

#### Props Interface
```typescript
interface MenuSearchBarProps {
  placeholder?: string
  modelValue: string
}

interface MenuSearchBarEmits {
  'update:modelValue': [value: string]
  search: [query: string]
}
```

### 4. MenuToggleButtons (토글 버튼)

#### 기능 명세
- 전체보기/즐겨찾기 토글 버튼
- 라디오 버튼 스타일
- 선택 상태 시각적 표시

#### Props Interface
```typescript
type ViewMode = 'all' | 'favorites'

interface MenuToggleButtonsProps {
  modelValue: ViewMode
}

interface MenuToggleButtonsEmits {
  'update:modelValue': [value: ViewMode]
}
```

### 5. MenuCategoryList (카테고리 목록)

#### 기능 명세
- 좌측 카테고리 목록 표시
- 선택 시 우측 메뉴 트리 필터링
- 스크롤 가능한 목록

#### Props Interface
```typescript
interface Category {
  id: string
  name: string
  count: number
}

interface MenuCategoryListProps {
  categories: Category[]
  selectedCategory: string | null
}

interface MenuCategoryListEmits {
  'category-select': [categoryId: string | null]
}
```

### 6. MenuTree (메뉴 트리)

#### 기능 명세
- 5단계 계층형 메뉴 트리
- 노드 펼침/접힘 기능
- 즐겨찾기 토글 (★ 아이콘)
- 메뉴 선택 시 탭 생성 연동

#### Props Interface
```typescript
interface MenuTreeProps {
  items: MenuItem[]
  searchQuery: string
  viewMode: ViewMode
  selectedCategory: string | null
  expandedNodes: Set<string>
  favorites: Set<string>
}

interface MenuTreeEmits {
  'node-expand': [nodeId: string]
  'node-collapse': [nodeId: string]
  'toggle-favorite': [nodeId: string]
  'menu-select': [menu: MenuItem]
}
```

## 접근성 고려사항

### 키보드 네비게이션
- Tab 키로 포커스 이동
- Enter/Space 키로 활성화
- ESC 키로 모달 닫기
- 화살표 키로 트리 네비게이션

### ARIA 속성
```html
<button
  aria-label="전체 메뉴 열기"
  aria-expanded="false"
  aria-haspopup="dialog"
>

<dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

### 스크린 리더 지원
- 적절한 role 속성 적용
- aria-live 영역으로 검색 결과 안내
- 메뉴 계층 구조 명확히 표시

## 성능 최적화

### 가상 스크롤링
- 메뉴 아이템이 많은 경우 가상 스크롤링 적용
- 동적 높이 계산으로 정확한 스크롤바 제공

### 검색 최적화
- 디바운싱으로 검색 요청 최적화
- 검색 결과 캐싱
- 증분 검색 지원

### 렌더링 최적화
- v-show vs v-if 적절한 사용
- 컴포넌트 지연 로딩
- 메모이제이션 적용

## 테스트 전략

### 단위 테스트
- 각 컴포넌트별 독립 테스트
- 이벤트 발생 및 처리 테스트
- Props/Emits 검증

### 통합 테스트
- 모달 열기/닫기 시나리오
- 검색 및 필터링 기능
- 메뉴 선택 플로우

### 접근성 테스트
- axe-core를 사용한 자동 테스트
- 키보드 네비게이션 테스트
- 스크린 리더 호환성 테스트

## 구현 단계

### 1단계: 기본 구조
1. GlobalMenuButton 컴포넌트 구현
2. 기본 모달 구조 구현
3. 모달 열기/닫기 기능

### 2단계: 검색 및 필터
1. MenuSearchBar 구현
2. MenuToggleButtons 구현
3. 기본 검색 기능

### 3단계: 메뉴 시스템
1. MenuCategoryList 구현
2. MenuTree 구현
3. 즐겨찾기 기능

### 4단계: 최적화
1. 성능 최적화 적용
2. 접근성 개선
3. 반응형 처리 완료

## 검증 기준

### 기능 검증
- [ ] 전체 메뉴 아이콘(≡) 버튼 클릭 시 모달 열기
- [ ] 90vw x 90vh 크기의 모달 다이얼로그 표시
- [ ] 검색창에서 실시간 검색 기능 동작
- [ ] 전체보기/즐겨찾기 토글 버튼 동작
- [ ] 좌측 카테고리 선택 시 메뉴 트리 필터링
- [ ] 우측 메뉴 트리에서 5단계 계층 구조 표시
- [ ] 즐겨찾기 토글(★) 기능 동작
- [ ] ESC 키, 배경 클릭으로 모달 닫기

### 품질 검증
- [ ] TypeScript 타입 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 단위 테스트 커버리지 80% 이상
- [ ] 접근성 테스트 통과 (axe-core)
- [ ] 키보드 네비게이션 동작 확인

### 성능 검증
- [ ] 모달 열기/닫기 애니메이션 부드러움
- [ ] 검색 디바운싱 적용으로 성능 최적화
- [ ] 가상 스크롤링으로 대량 데이터 처리
- [ ] 메모리 누수 없음

이 설계 문서는 기존의 design.md, ui-requirements.md, theme-guide.md의 내용을 바탕으로 작성되었으며, MES 시스템의 특성을 고려한 사용자 친화적인 전체 메뉴 시스템을 구현하기 위한 구체적인 가이드를 제공합니다.
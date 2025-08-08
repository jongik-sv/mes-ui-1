# Portal 메뉴 개선 설계서

## 개요

기존 JSP 기반의 portalAllMenu.jsp 파일을 참고하여 Vue.js 기반의 전체메뉴 팝업을 개선합니다. JSP 버전의 레이아웃과 기능을 정확히 구현하여 사용자 경험의 일관성을 유지합니다.

## 현재 상황 분석

### 기존 Vue 컴포넌트 (GlobalMenuModal.vue)
- 모달 크기: 80vw x 80vh
- 레이아웃: 상단 검색/토글 + 하단 메뉴 트리
- 카테고리: 상단 탭 형태
- 기능: 기본적인 검색, 즐겨찾기, 뷰모드 전환

### JSP 버전 (portalAllMenu.jsp) 분석
- 모달 크기: 전체 화면 대비 더 큰 크기
- 레이아웃: 좌측 카테고리 버튼 + 우측 메뉴 트리
- 카테고리: 세로 배치된 버튼 형태
- 기능: 텍스트 검색, 컬럼 검색, 권한 기반 필터링, 즐겨찾기

## 개선 목표

1. **레이아웃 구조 변경**: JSP와 동일한 좌측 카테고리 + 우측 트리 구조
2. **모달 크기 확대**: 90vw x 90vh로 변경
3. **카테고리 시스템 개선**: 세로 배치 버튼 형태로 변경
4. **검색 기능 강화**: 텍스트 검색 + 컬럼 검색 모드 지원
5. **토글 기능 구현**: 전체보기, 항목찾기, 즐겨찾기 토글
6. **트리 구조 개선**: JSP와 동일한 3단계 구조 구현

## 레이아웃 구조 설계

### 기존 구조
```
┌─────────────────────────────────────────────────────────┐
│ 헤더: 전체 메뉴                                         │
├─────────────────────────────────────────────────────────┤
│ 검색창 + 토글 버튼들                                    │
├─────────────────────────────────────────────────────────┤
│ 카테고리 탭들                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 메뉴 트리 영역                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 개선된 구조 (JSP 기반)
```
┌─────────────────────────────────────────────────────────┐
│ 헤더: 모든 서비스                                       │
├─────────────────────────────────────────────────────────┤
│ 검색창 + 토글 버튼들 (전체보기, 항목찾기, 즐겨찾기)     │
├─────┬───────────────────────────────────────────────────┤
│전체 │                                                 │
│메뉴 │                                                 │
├─────┤              메뉴 트리 영역                      │
│품질 │                                                 │
│설계 │                                                 │
├─────┤                                                 │
│품질 │                                                 │
│판정 │                                                 │
├─────┤                                                 │
│... │                                                 │
└─────┴─────────────────────────────────────────────────────┘
```

## 컴포넌트 구조 설계

### 메인 컴포넌트: GlobalMenuModal.vue
```vue
<template>
  <Dialog class="global-menu-modal" :style="{ width: '90vw', height: '90vh' }">
    <!-- 헤더 -->
    <template #header>모든 서비스</template>
    
    <!-- 검색 및 토글 영역 -->
    <div class="search-toggle-section">
      <MenuSearchBar />
      <MenuToggleButtons />
    </div>
    
    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <!-- 좌측 카테고리 -->
      <div class="category-sidebar">
        <MenuCategoryList />
      </div>
      
      <!-- 우측 메뉴 트리 -->
      <div class="menu-tree-area">
        <MenuTree />
      </div>
    </div>
  </Dialog>
</template>
```

### 서브 컴포넌트들

#### 1. MenuCategoryList.vue
- 세로 배치된 카테고리 버튼들
- 활성 상태 표시
- 카테고리별 메뉴 개수 표시 (선택사항)

#### 2. MenuSearchBar.vue
- 검색 입력창
- 검색 초기화 버튼
- 실시간 검색 기능

#### 3. MenuToggleButtons.vue
- 전체보기 토글 (권한 기반 필터링)
- 항목찾기 토글 (컬럼 검색 모드)
- 즐겨찾기 토글

#### 4. MenuTree.vue (개선)
- 3단계 트리 구조 (모듈 > 메뉴 > 페이지)
- 확장/축소 기능
- 즐겨찾기 별표 표시
- 검색 결과 하이라이팅

## 데이터 구조 설계

### 카테고리 데이터
```typescript
interface MenuCategory {
  id: string;           // 'all', 'C10', 'M20', etc.
  name: string;         // '전체메뉴', '품질설계', '품질판정', etc.
  code: string;         // 시스템 코드
  order: number;        // 표시 순서
  active: boolean;      // 활성 상태
}

const categories: MenuCategory[] = [
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
];
```

### 메뉴 트리 데이터 (확장)
```typescript
interface MenuItem {
  id: string;
  text: string;           // 메뉴명
  level: number;          // 1: 모듈, 2: 메뉴, 3: 페이지
  parentId?: string;
  categoryCode: string;   // 카테고리 코드 (C10, M20, etc.)
  url?: string;
  icon?: string;
  bookmarked: boolean;    // 즐겨찾기 여부
  isAuth: boolean;        // 권한 여부
  hasItems: boolean;      // 하위 메뉴 존재 여부
  items?: MenuItem[];     // 하위 메뉴들
  
  // 컬럼 검색용 데이터
  column?: {
    form?: {
      id: string[];
      name: string[];
    };
    grid?: {
      id: string[];
      name: string[];
    };
  };
  
  // 메타데이터
  userdata?: {
    programId: string;
    bookmarked: 'Y' | 'N';
  };
}
```

### 검색 및 필터 상태
```typescript
interface MenuState {
  searchQuery: string;
  searchMode: 'text' | 'column';  // 텍스트 검색 vs 컬럼 검색
  selectedCategory: string;       // 선택된 카테고리 ID
  showAllMenus: boolean;          // 전체보기 토글
  showFavorites: boolean;         // 즐겨찾기 토글
  showColumnSearch: boolean;      // 항목찾기 토글
  expandedNodes: Set<string>;     // 확장된 노드들
}
```

## 기능 구현 계획

### 1단계: 레이아웃 구조 변경
- [ ] 모달 크기를 90vw x 90vh로 변경
- [ ] 좌측 카테고리 + 우측 트리 레이아웃 구현
- [ ] CSS Grid 또는 Flexbox 기반 반응형 레이아웃

### 2단계: 카테고리 시스템 구현
- [ ] MenuCategoryList 컴포넌트 생성
- [ ] 카테고리 데이터 구조 정의
- [ ] 카테고리 선택 시 메뉴 필터링 기능
- [ ] 활성 상태 시각적 표시

### 3단계: 검색 기능 강화
- [ ] 텍스트 검색 기능 (메뉴명, ID 기반)
- [ ] 컬럼 검색 기능 (form/grid 컬럼 정보 기반)
- [ ] 검색 모드 전환 기능
- [ ] 검색 결과 하이라이팅

### 4단계: 토글 기능 구현
- [ ] 전체보기 토글 (권한 기반 필터링)
- [ ] 항목찾기 토글 (컬럼 검색 모드)
- [ ] 즐겨찾기 토글
- [ ] 토글 상태에 따른 메뉴 필터링

### 5단계: 트리 구조 개선
- [ ] 3단계 트리 구조 구현
- [ ] 확장/축소 애니메이션
- [ ] 즐겨찾기 별표 표시 및 토글
- [ ] 메뉴 클릭 시 탭 생성 연동

### 6단계: 테스트 및 최적화
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 성능 최적화
- [ ] 접근성 개선

## 스타일링 가이드

### 모달 스타일
```scss
.global-menu-modal {
  :deep(.p-dialog) {
    width: 90vw !important;
    height: 90vh !important;
    max-width: none !important;
    max-height: none !important;
    top: 5vh !important;
    left: 5vw !important;
  }
}
```

### 레이아웃 스타일
```scss
.main-content {
  display: grid;
  grid-template-columns: 200px 1fr;
  height: calc(90vh - 120px); // 헤더와 검색 영역 제외
  gap: 0;
  
  .category-sidebar {
    background: var(--bg-secondary);
    border-right: 1px solid var(--surface-2);
    overflow-y: auto;
  }
  
  .menu-tree-area {
    background: var(--bg-primary);
    overflow-y: auto;
  }
}
```

### 카테고리 버튼 스타일
```scss
.category-button {
  display: block;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  text-align: left;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  &.active {
    background: var(--primary);
    color: white;
  }
}
```

## 성능 고려사항

1. **가상 스크롤링**: 대량의 메뉴 데이터 처리 시 적용
2. **지연 로딩**: 트리 노드 확장 시 하위 메뉴 동적 로딩
3. **메모이제이션**: 검색 결과 캐싱
4. **디바운싱**: 검색 입력 시 API 호출 최적화

## 접근성 고려사항

1. **키보드 네비게이션**: Tab, Enter, Arrow 키 지원
2. **스크린 리더**: ARIA 라벨 및 역할 정의
3. **포커스 관리**: 모달 열림/닫힘 시 포커스 이동
4. **색상 대비**: WCAG 2.1 AA 기준 준수

## 테스트 계획

### 단위 테스트
- [ ] 카테고리 선택 기능
- [ ] 검색 기능 (텍스트/컬럼)
- [ ] 토글 기능
- [ ] 즐겨찾기 기능
- [ ] 트리 확장/축소 기능

### 통합 테스트
- [ ] 카테고리 선택 → 메뉴 필터링
- [ ] 검색 → 결과 표시
- [ ] 메뉴 선택 → 탭 생성
- [ ] 즐겨찾기 토글 → 메뉴 필터링

### E2E 테스트
- [ ] 전체 메뉴 모달 열기/닫기
- [ ] 메뉴 검색 및 선택 플로우
- [ ] 즐겨찾기 추가/제거 플로우
- [ ] 반응형 동작 테스트

## 구현 일정

- **1일차**: 레이아웃 구조 변경 및 모달 크기 조정
- **2일차**: 카테고리 시스템 구현
- **3일차**: 검색 기능 강화
- **4일차**: 토글 기능 구현
- **5일차**: 트리 구조 개선 및 테스트

## 완료 기준

1. JSP 버전과 동일한 레이아웃 구조 구현
2. 모든 검색 및 필터링 기능 정상 동작
3. 즐겨찾기 기능 정상 동작
4. 메뉴 선택 시 탭 생성 연동 정상 동작
5. 반응형 동작 정상 동작
6. 모든 테스트 통과
7. 접근성 기준 준수

이 설계서를 바탕으로 단계별로 구현을 진행하여 JSP 버전과 동일한 사용자 경험을 제공하는 Vue.js 기반 전체메뉴 팝업을 완성합니다.
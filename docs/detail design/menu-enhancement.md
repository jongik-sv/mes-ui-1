# 전체메뉴 UI 개선 설계서

## 개요

현재 전체메뉴 UI가 허접해 보인다는 피드백에 따라, 첨부된 이미지와 같은 계층적 메뉴 구조로 개선합니다. 메뉴 그룹별로 확장/축소 기능을 제공하여 사용자 경험을 향상시킵니다.

## 현재 상태 분석

### 기존 구조
- 좌측: 카테고리 목록
- 우측: 메뉴 트리 (단순한 트리 구조)
- 검색 및 토글 기능 존재

### 문제점
- 메뉴 그룹의 시각적 구분이 명확하지 않음
- 확장/축소 상태가 직관적이지 않음
- 계층 구조가 명확하게 표현되지 않음

## 개선 목표

### 요구사항
1. 메뉴 그룹별 확장/축소 기능 (V/^ 아이콘)
2. 확장 상태가 기본값
3. 계층적 구조의 명확한 시각적 표현
4. 첨부 이미지와 유사한 레이아웃

### 기능 명세
- **확장 아이콘**: V 모양 (chevron-down)
- **축소 아이콘**: ^ 모양 (chevron-up)
- **기본 상태**: 모든 그룹 확장
- **인터랙션**: 그룹 헤더 클릭 시 토글

## 설계 상세

### 1. 데이터 구조 개선

```typescript
interface MenuGroup {
  id: string;
  title: string;
  expanded: boolean;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  isFavorite: boolean;
  children?: MenuItem[];
  level: number;
}
```

### 2. 컴포넌트 구조

```
MenuTree.vue
├── MenuGroup.vue (새로 생성)
│   ├── GroupHeader.vue
│   │   ├── 그룹 제목
│   │   └── 확장/축소 아이콘 (V/^)
│   └── GroupContent.vue
│       └── MenuItem.vue (기존 개선)
```

### 3. 시각적 개선사항

#### 그룹 헤더 스타일
- 배경색: `var(--bg-tertiary)`
- 패딩: `12px 16px`
- 폰트 가중치: 600
- 호버 효과: 배경색 변경

#### 확장/축소 아이콘
- 크기: 16px
- 색상: `var(--text-secondary)`
- 전환 애니메이션: 0.2s ease
- 회전 각도: 180도

#### 메뉴 아이템 들여쓰기
- 1단계: 16px
- 2단계: 32px
- 3단계: 48px
- 최대 5단계까지 지원

### 4. 상태 관리

```typescript
interface MenuState {
  expandedGroups: Set<string>;
  searchQuery: string;
  viewMode: 'all' | 'favorites';
  selectedCategory: string | null;
}
```

### 5. 애니메이션

#### 확장/축소 애니메이션
```css
.group-content {
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.group-content.expanded {
  max-height: 1000px; /* 충분히 큰 값 */
}

.group-content.collapsed {
  max-height: 0;
}
```

#### 아이콘 회전 애니메이션
```css
.expand-icon {
  transition: transform 0.2s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}
```

## 구현 계획

### Phase 1: 컴포넌트 구조 개선
1. MenuGroup.vue 컴포넌트 생성
2. GroupHeader.vue 컴포넌트 생성
3. 기존 MenuTree.vue 리팩토링

### Phase 2: 스타일링 개선
1. 그룹 헤더 스타일 적용
2. 확장/축소 아이콘 스타일
3. 메뉴 아이템 들여쓰기 개선

### Phase 3: 인터랙션 구현
1. 확장/축소 토글 기능
2. 애니메이션 효과 적용
3. 상태 저장/복원 기능

### Phase 4: 테스트 및 최적화
1. 단위 테스트 작성
2. 접근성 개선
3. 성능 최적화

## 기술적 고려사항

### 접근성
- ARIA 속성 추가 (`aria-expanded`, `aria-controls`)
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### 성능
- 가상 스크롤링 고려 (메뉴 항목이 많을 경우)
- 메모이제이션을 통한 불필요한 리렌더링 방지
- 지연 로딩 적용

### 반응형
- 모바일에서의 터치 인터페이스 최적화
- 작은 화면에서의 레이아웃 조정

## 예상 결과

### 사용자 경험 개선
- 직관적인 메뉴 구조 파악
- 빠른 메뉴 탐색
- 시각적으로 깔끔한 인터페이스

### 개발자 경험 개선
- 유지보수하기 쉬운 컴포넌트 구조
- 재사용 가능한 컴포넌트
- 명확한 상태 관리

## 위험 요소 및 대응

### 성능 이슈
- **위험**: 많은 메뉴 항목으로 인한 렌더링 지연
- **대응**: 가상 스크롤링 및 지연 로딩 적용

### 호환성 이슈
- **위험**: 기존 메뉴 데이터 구조와의 호환성
- **대응**: 점진적 마이그레이션 및 어댑터 패턴 사용

### 사용자 적응
- **위험**: 기존 사용자의 새로운 UI 적응 어려움
- **대응**: 점진적 롤아웃 및 사용자 가이드 제공

## 결론

이번 개선을 통해 전체메뉴 UI가 더욱 직관적이고 사용하기 쉬운 형태로 변경될 것입니다. 계층적 구조와 확장/축소 기능을 통해 사용자가 원하는 메뉴를 빠르게 찾을 수 있게 됩니다.
# Phase2-UserInfoDropdown: 사용자 정보 드롭다운 메뉴 구현 설계서

## 1. 개요

### 1.1 작업 목표
task 4.3 "사용자 정보 드롭다운 메뉴 구현"에 대한 상세 설계 및 구현 계획

### 1.2 요구사항 분석
- 아바타 + 소속명 + 사용자명 표시 컴포넌트
- 드롭다운 메뉴 (사용자 설정, 메시지함, 로그아웃) 구현  
- 사용자 상태 관리 Pinia 스토어 작성
- _요구사항: 3.4_

### 1.3 설계 참고 문서
- `.kiro/specs/mes-ui-framework/design.md` - 전체 시스템 아키텍처
- `./docs/basic design/ui-requirements.md` - UI 요구사항 명세서
- `./docs/basic design/theme-guide.md` - 테마 및 디자인 가이드

## 2. 컴포넌트 설계

### 2.1 UserInfoDropdown 컴포넌트
```vue
<UserInfoDropdown
  :user="currentUser"
  :unread-count="unreadMessageCount"
  @settings="handleUserSettings"
  @messages="handleUserMessages"  
  @logout="handleUserLogout"
/>
```

#### 2.1.1 Props
```typescript
interface Props {
  /** 사용자 정보 */
  user: UserInfo
  /** 읽지 않은 메시지 개수 */
  unreadCount?: number
  /** 드롭다운 위치 */
  placement?: 'bottom-end' | 'bottom-start'
  /** 커스텀 스타일 클래스 */
  class?: string
}
```

#### 2.1.2 Events
```typescript
interface Emits {
  (e: 'settings'): void
  (e: 'messages'): void  
  (e: 'logout'): void
  (e: 'dropdown-toggle', isOpen: boolean): void
}
```

#### 2.1.3 UI 구조
```
┌─────────────────────────────────────┐
│ [Avatar] 부서명                     │
│         사용자명               [▼]  │
└─────────────────────────────────────┘
                │
                ▼ (클릭 시 드롭다운)
        ┌─────────────────────────┐
        │ [설정] 사용자 설정      │
        │ [메시지] 메시지함 (3)   │
        │ ─────────────────────── │
        │ [로그아웃] 로그아웃     │
        └─────────────────────────┘
```

### 2.2 사용자 아바타 표시
- **이미지 우선**: 사용자 프로필 이미지가 있으면 표시
- **이니셜 폴백**: 이미지가 없으면 이름의 첫 글자로 원형 아바타 생성
- **크기**: 32px x 32px (데스크톱), 24px x 24px (모바일)
- **스타일**: 원형, 프라이머리 색상 배경

### 2.3 사용자 정보 표시
- **소속명**: 작은 글씨, 보조 텍스트 색상
- **사용자명**: 일반 글씨, 기본 텍스트 색상
- **반응형**: 모바일에서는 텍스트 숨김

### 2.4 드롭다운 메뉴 구성
1. **사용자 설정**
   - 아이콘: `pi-cog`
   - 라우팅: `/settings/profile`
   
2. **메시지함**
   - 아이콘: `pi-envelope`
   - 라우팅: `/messages`
   - 배지: 읽지 않은 메시지 개수 표시
   
3. **로그아웃**
   - 아이콘: `pi-sign-out`
   - 색상: 위험(error) 색상
   - 확인 다이얼로그 필요

## 3. Pinia 스토어 설계

### 3.1 userStore 상태 구조
```typescript
interface UserStoreState {
  // 사용자 정보
  currentUser: User | null
  isAuthenticated: boolean
  
  // UI 상태  
  loading: boolean
  error: string | null
  menuState: UserMenuState
  
  // 메시지 관련
  unreadMessageCount: number
}

interface UserMenuState {
  isOpen: boolean
  loading: boolean
  error: string | null
}
```

### 3.2 주요 Actions
- `fetchUserInfo()` - 현재 사용자 정보 조회
- `updateUserInfo()` - 사용자 정보 업데이트
- `updatePreferences()` - 사용자 설정 업데이트
- `login(credentials)` - 로그인
- `logout()` - 로그아웃
- `toggleUserMenu()` - 드롭다운 토글
- `openUserSettings()` - 설정 페이지 이동
- `openMessageBox()` - 메시지함 이동
- `fetchUnreadMessageCount()` - 읽지 않은 메시지 수 조회

### 3.3 API 연동
```typescript
// userApi.ts
export const userApi = {
  getCurrentUser: () => Promise<User>
  updateUser: (updates: Partial<User>) => Promise<User>
  login: (credentials: LoginCredentials) => Promise<{user: User, token: string}>
  logout: () => Promise<void>
  getUnreadMessageCount: () => Promise<number>
  refreshToken: () => Promise<string>
}
```

## 4. 스타일링 설계

### 4.1 기본 스타일
- **배경**: 투명 → 호버 시 `--bg-tertiary`
- **경계선**: 둥근 모서리 6px
- **전환**: 부드러운 애니메이션 (0.2s ease)
- **그림자**: 드롭다운에 `--shadow-lg` 적용

### 4.2 반응형 디자인
```scss
// 데스크톱 (1025px+)
.user-info-dropdown {
  .user-details { display: block; }
  .user-avatar { width: 32px; height: 32px; }
}

// 태블릿 (769-1024px)  
@media (max-width: 1024px) {
  .user-details .user-department { display: none; }
}

// 모바일 (≤768px)
@media (max-width: 768px) {
  .user-details { display: none; }
  .user-avatar { width: 24px; height: 24px; }
  .dropdown-menu { 
    right: -50px; 
    min-width: 180px; 
  }
}
```

### 4.3 접근성
- **ARIA 속성**: `aria-expanded`, `aria-haspopup="true"`
- **키보드 네비게이션**: Tab, Enter, Escape 키 지원
- **포커스 관리**: 드롭다운 열림/닫힘 시 포커스 위치 조정
- **스크린 리더**: role="menu", role="menuitem" 적용

## 5. 테스트 설계

### 5.1 단위 테스트 (Vitest)
```typescript
describe('UserInfoDropdown', () => {
  // 기본 렌더링 테스트
  test('사용자 정보가 올바르게 표시되는지 확인')
  test('아바타 이미지가 없을 때 이니셜 표시 확인')
  
  // 인터랙션 테스트
  test('드롭다운 토글 동작 확인')
  test('외부 클릭 시 드롭다운 닫힘 확인')
  test('키보드 네비게이션 동작 확인')
  
  // 이벤트 발생 테스트
  test('설정 클릭 시 settings 이벤트 발생 확인')
  test('메시지함 클릭 시 messages 이벤트 발생 확인')
  test('로그아웃 클릭 시 logout 이벤트 발생 확인')
  
  // 반응형 테스트
  test('모바일 화면에서 텍스트 숨김 확인')
})
```

### 5.2 userStore 테스트
```typescript
describe('userStore', () => {
  // 상태 관리 테스트
  test('사용자 정보 조회 및 설정')
  test('로그인/로그아웃 상태 변경')
  test('메뉴 열기/닫기 상태 관리')
  
  // API 연동 테스트  
  test('사용자 정보 API 호출')
  test('로그인 API 호출 및 토큰 저장')
  test('로그아웃 API 호출 및 상태 초기화')
  
  // 에러 처리 테스트
  test('API 에러 시 적절한 에러 메시지 설정')
})
```

## 6. 구현 단계

### Phase 1: 기본 구조 구현
1. UserInfoDropdown 컴포넌트 기본 틀 작성
2. 사용자 정보 표시 UI 구현
3. 기본 스타일링 적용

### Phase 2: 드롭다운 메뉴 구현  
1. 드롭다운 토글 로직 구현
2. 메뉴 아이템 구성 및 이벤트 처리
3. 외부 클릭 감지 및 닫기 로직

### Phase 3: Pinia 스토어 통합
1. userStore 생성 및 기본 상태 정의
2. API 연동 함수 구현
3. 컴포넌트와 스토어 연결

### Phase 4: 접근성 및 최적화
1. ARIA 속성 및 키보드 네비게이션 구현
2. 반응형 디자인 적용
3. 성능 최적화 및 에러 처리

### Phase 5: 테스트 및 검증
1. 단위 테스트 작성 및 실행
2. 통합 테스트 수행
3. 접근성 테스트 및 브라우저 호환성 검증

## 7. 검증 기준

### 7.1 기능 요구사항 검증
- [x] 아바타 + 소속명 + 사용자명 표시 컴포넌트
- [x] 드롭다운 메뉴 (사용자 설정, 메시지함, 로그아웃) 구현
- [x] 사용자 상태 관리 Pinia 스토어 작성

### 7.2 UI/UX 요구사항 검증
- [x] 다크 테마 적용 및 색상 일관성
- [x] 반응형 디자인 (데스크톱/태블릿/모바일)
- [x] 부드러운 애니메이션 및 전환 효과
- [x] 접근성 가이드라인 준수

### 7.3 성능 요구사항 검증
- [x] 컴포넌트 렌더링 성능 최적화
- [x] API 호출 최소화 및 캐싱
- [x] 메모리 누수 방지

## 8. 이전 단계와의 일관성 검증

### 8.1 4.1 헤더 기본 구조와의 연동
- HeaderComponent에서 UserInfoDropdown 통합 확인
- props 전달 및 이벤트 처리 일관성 확인

### 8.2 테마 시스템과의 호환성
- CSS 변수 사용 일관성
- 다크/라이트 테마 전환 지원
- 색상 팔레트 준수

### 8.3 전체 아키텍처와의 호환성
- Vue 3 Composition API 사용 일관성
- PrimeVue 컴포넌트 활용 방식
- TypeScript 타입 정의 표준 준수

이 설계서는 4.3 task의 완전한 구현을 위한 상세 가이드를 제공하며, 기존 시스템과의 일관성을 보장합니다.
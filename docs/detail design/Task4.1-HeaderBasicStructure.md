# Task 4.1: 헤더 기본 구조 및 레이아웃 구현 상세 설계

## 개요

본 문서는 MES UI 프레임워크의 헤더 컴포넌트 기본 구조 및 레이아웃 구현을 위한 상세 설계를 다룹니다. 헤더는 전체 애플리케이션의 최상단에 위치하며, 전역 네비게이션과 사용자 인터페이스의 핵심 기능을 제공합니다.

## 작업 범위

### 포함 사항
- 헤더 컴포넌트 기본 틀 작성 (60px 고정 높이)
- 좌측 영역(전체 메뉴, 회사 CI) 레이아웃 구현
- 우측 영역(사용자 정보, 연락처, 원격) 레이아웃 구현
- 헤더 컴포넌트 단위 테스트 작성
- 반응형 디자인 지원
- 접근성 가이드라인 준수

### 제외 사항
- 전체 메뉴 모달 다이얼로그 구현 (Task 4.2에서 처리)
- 사용자 드롭다운 메뉴 상세 기능 (Task 4.3에서 처리)
- 담당자 연락처 팝업 상세 기능 (Task 4.4에서 처리)

## 설계 목표

### 기능적 요구사항
- **고정 높이**: 60px 고정 높이 유지 (모바일: 56px)
- **좌측 영역**: 전체 메뉴 아이콘(≡), 회사 CI 표시
- **우측 영역**: 사용자 정보, 담당자 연락처, 원격 지원 링크
- **반응형**: 데스크톱/태블릿/모바일 화면 대응
- **접근성**: WCAG 2.1 AA 준수

### 기술적 요구사항
- Vue 3 Composition API 사용
- PrimeVue 컴포넌트 활용
- TypeScript 타입 안전성 보장
- 단위 테스트 커버리지 80% 이상
- 다크 테마 지원

## 컴포넌트 구조

### 전체 레이아웃
```
┌─────────────────────────────────────────────────────────────┐
│ [≡] [DONGKUK CM]              [사용자정보] [담당자] [원격]   │
└─────────────────────────────────────────────────────────────┘
```

### 컴포넌트 계층 구조
```
HeaderComponent (메인 컨테이너)
├── HeaderLeft
│   ├── GlobalMenuButton (전체 메뉴 아이콘)
│   └── CompanyLogo (회사 로고)
└── HeaderRight
    ├── UserInfoDropdown (사용자 정보)
    ├── ContactListButton (담당자 연락처)
    └── RemoteSupportButton (원격 지원)
```

## 상세 컴포넌트 설계

### 1. HeaderComponent (메인 컨테이너)

#### Props Interface
```typescript
interface HeaderProps {
  /** 헤더 고정 여부 */
  fixed?: boolean;
  /** 그림자 표시 여부 */
  shadow?: boolean;
  /** 회사명 */
  companyName?: string;
  /** 로고 URL */
  logoUrl?: string;
  /** 로고 크기 */
  logoSize?: 'sm' | 'md' | 'lg';
  /** 현재 사용자 정보 */
  currentUser?: UserInfo | null;
  /** 연락처 목록 */
  contacts?: ContactInfo[];
  /** 원격 지원 URL */
  remoteSupportUrl?: string;
}
```

#### 스타일 명세
```scss
.mes-header {
  height: 60px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  &--fixed {
    position: sticky;
    top: 0;
  }
  
  &--shadow {
    box-shadow: var(--shadow-sm);
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  @media (max-width: 768px) {
    height: 56px;
    padding: 0 var(--space-4);
    
    .header-left {
      gap: var(--space-3);
    }
    
    .header-right {
      gap: var(--space-1);
    }
  }
}
```

#### 구현 예시
```vue
<template>
  <header 
    class="mes-header"
    role="banner"
    :class="{ 
      'mes-header--fixed': fixed, 
      'mes-header--shadow': shadow 
    }"
  >
    <div class="header-left">
      <GlobalMenuButton
        :is-open="globalMenuOpen"
        @click="handleGlobalMenuClick"
      />
      <CompanyLogo 
        :company-name="companyName"
        :logo-url="logoUrl"
        :size="logoSize"
      />
    </div>
    
    <div class="header-right">
      <UserInfoDropdown
        v-if="currentUser"
        :user="currentUser"
        @settings="handleUserSettings"
        @messages="handleUserMessages"
        @logout="handleUserLogout"
      />
      <ContactListButton
        :contacts="contacts"
        @open="handleContactOpen"
        @close="handleContactClose"
      />
      <RemoteSupportButton
        :url="remoteSupportUrl"
        @click="handleRemoteSupportClick"
      />
    </div>
  </header>
</template>
```

### 2. GlobalMenuButton (전체 메뉴 버튼)

#### 기능 명세
- 햄버거 메뉴 아이콘 (≡) 표시
- 클릭 시 이벤트 발생 (모달 열기는 상위 컴포넌트에서 처리)
- 키보드 접근성 지원 (Enter, Space)
- 스크린 리더 지원

#### Props Interface
```typescript
interface GlobalMenuButtonProps {
  /** 메뉴 열림 상태 */
  isOpen?: boolean;
  /** 접근성 라벨 */
  ariaLabel?: string;
}
```

#### 구현 예시
```vue
<template>
  <Button
    icon="pi pi-bars"
    text
    rounded
    size="large"
    :aria-label="ariaLabel"
    :aria-expanded="isOpen"
    @click="handleClick"
    class="global-menu-btn"
    data-testid="global-menu-button"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button';

interface Props {
  isOpen?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  ariaLabel: '전체 메뉴'
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit('click');
};
</script>

<style lang="scss" scoped>
.global-menu-btn {
  color: var(--text-primary);
  transition: var(--transition-normal);
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary);
  }
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
</style>
```

### 3. CompanyLogo (회사 로고)

#### 기능 명세
- 회사명 "DONGKUK CM" 텍스트 표시
- 선택적으로 로고 이미지 지원
- 반응형 크기 조정
- 클릭 불가능한 장식 요소

#### Props Interface
```typescript
interface CompanyLogoProps {
  /** 회사명 */
  companyName?: string;
  /** 로고 이미지 URL (선택적) */
  logoUrl?: string;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
}
```

#### 구현 예시
```vue
<template>
  <div class="company-logo" data-testid="company-logo">
    <img 
      v-if="logoUrl" 
      :src="logoUrl" 
      :alt="companyName"
      class="logo-image"
    />
    <span 
      v-else
      class="logo-text"
      :class="`logo-text--${size}`"
    >
      {{ companyName }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_COMPANY_NAME } from '@/constants/header';

interface Props {
  companyName?: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  companyName: DEFAULT_COMPANY_NAME,
  size: 'md'
});
</script>

<style lang="scss" scoped>
.company-logo {
  display: flex;
  align-items: center;
  
  .logo-image {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
  
  .logo-text {
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    
    &--sm { font-size: var(--text-sm); }
    &--md { font-size: var(--text-lg); }
    &--lg { font-size: var(--text-xl); }
  }
  
  @media (max-width: 768px) {
    .logo-text {
      font-size: var(--text-base);
    }
  }
}
</style>
```

### 4. UserInfoDropdown (사용자 정보)

#### 기능 명세
- 사용자 아바타, 소속, 이름 표시
- 기본 드롭다운 구조 (상세 기능은 Task 4.3에서 구현)
- 키보드 네비게이션 지원
- 외부 클릭 감지

#### Props Interface
```typescript
interface UserInfo {
  id: string;
  name: string;
  department: string;
  avatar?: string;
  email?: string;
}

interface UserInfoDropdownProps {
  /** 사용자 정보 */
  user: UserInfo;
}
```

#### 구현 예시
```vue
<template>
  <div class="user-info-dropdown" ref="dropdownRef" data-testid="user-info-dropdown">
    <Button
      @click="toggleDropdown"
      class="user-info-trigger"
      text
      :aria-expanded="isOpen"
      aria-haspopup="true"
      data-testid="user-info-button"
    >
      <div class="user-avatar">
        <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
        <span v-else class="avatar-initial">{{ getInitial(user.name) }}</span>
      </div>
      <div class="user-details">
        <div class="user-department">{{ user.department }}</div>
        <div class="user-name">{{ user.name }}</div>
      </div>
      <i class="pi pi-chevron-down" :class="{ 'rotate-180': isOpen }" />
    </Button>
    
    <!-- 기본 드롭다운 메뉴 (상세 기능은 Task 4.3에서 구현) -->
    <div 
      v-if="isOpen" 
      class="dropdown-menu"
      role="menu"
      data-testid="user-dropdown-menu"
    >
      <Button text class="dropdown-item" @click="handleSettings" role="menuitem">
        <i class="pi pi-cog" />
        사용자 설정
      </Button>
      <Button text class="dropdown-item" @click="handleMessages" role="menuitem">
        <i class="pi pi-envelope" />
        메시지함
      </Button>
      <Divider />
      <Button text class="dropdown-item dropdown-item--danger" @click="handleLogout" role="menuitem">
        <i class="pi pi-sign-out" />
        로그아웃
      </Button>
    </div>
  </div>
</template>
```

### 5. ContactListButton (담당자 연락처)

#### 기능 명세
- "담당자" 버튼 표시
- 기본 팝오버 구조 (상세 기능은 Task 4.4에서 구현)
- 기본 연락처 데이터 표시

#### Props Interface
```typescript
interface ContactInfo {
  department: string;
  name: string;
  phone: string;
  email?: string;
}

interface ContactListButtonProps {
  /** 연락처 목록 */
  contacts?: ContactInfo[];
}
```

### 6. RemoteSupportButton (원격 지원)

#### 기능 명세
- "원격" 버튼 표시
- 클릭 시 외부 링크 새 창으로 열기
- URL: http://www.ezh.kr/notice.html

#### Props Interface
```typescript
interface RemoteSupportButtonProps {
  /** 원격 지원 URL */
  url?: string;
  /** 새 창으로 열기 여부 */
  openInNewTab?: boolean;
}
```

#### 구현 예시
```vue
<template>
  <Button
    @click="openRemoteSupport"
    icon="pi pi-external-link"
    text
    rounded
    label="원격"
    class="remote-support-btn"
    data-testid="remote-support-button"
    :aria-label="`원격 지원 페이지 열기 (새 창)`"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { DEFAULT_REMOTE_SUPPORT_URL } from '@/constants/header';

interface Props {
  url?: string;
  openInNewTab?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  url: DEFAULT_REMOTE_SUPPORT_URL,
  openInNewTab: true
});

const emit = defineEmits<{
  click: [url: string];
}>();

const openRemoteSupport = () => {
  emit('click', props.url);
  
  if (props.openInNewTab) {
    window.open(props.url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = props.url;
  }
};
</script>
```

## 타입 정의

### 공통 타입 (src/types/header.ts)
```typescript
export interface UserInfo {
  id: string;
  name: string;
  department: string;
  avatar?: string;
  email?: string;
}

export interface ContactInfo {
  department: string;
  name: string;
  phone: string;
  email?: string;
}

export interface HeaderProps {
  fixed?: boolean;
  shadow?: boolean;
  companyName?: string;
  logoUrl?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  currentUser?: UserInfo | null;
  contacts?: ContactInfo[];
  remoteSupportUrl?: string;
}

export interface HeaderEvents {
  'global-menu-click': [];
  'user-settings': [];
  'user-messages': [];
  'user-logout': [];
  'contact-open': [];
  'contact-close': [];
  'remote-support-click': [url: string];
}
```

### 상수 정의 (src/constants/header.ts)
```typescript
import type { UserInfo, ContactInfo } from '@/types/header';

export const DEFAULT_COMPANY_NAME = 'DONGKUK CM';
export const DEFAULT_REMOTE_SUPPORT_URL = 'http://www.ezh.kr/notice.html';

export const DEFAULT_USER: UserInfo = {
  id: '1',
  name: '장종익',
  department: '냉연생산SM팀',
  email: 'jang@dongkuk.com'
};

export const DEFAULT_CONTACTS: ContactInfo[] = [
  {
    department: 'MES 담당자',
    name: '김철수',
    phone: '010-1234-5678',
    email: 'kim@dongkuk.com'
  },
  {
    department: 'APS 담당자',
    name: '이영희',
    phone: '010-2345-6789',
    email: 'lee@dongkuk.com'
  },
  {
    department: '기타 담당자',
    name: '박민수',
    phone: '010-3456-7890',
    email: 'park@dongkuk.com'
  }
];
```

## 테스트 전략

### 단위 테스트 계획

#### 1. HeaderComponent 테스트
```typescript
// src/components/__tests__/HeaderComponent.test.ts
describe('HeaderComponent', () => {
  it('should render with correct structure', () => {
    const wrapper = mount(HeaderComponent);
    expect(wrapper.find('.mes-header')).toBeTruthy();
    expect(wrapper.find('.header-left')).toBeTruthy();
    expect(wrapper.find('.header-right')).toBeTruthy();
  });
  
  it('should have 60px fixed height', () => {
    const wrapper = mount(HeaderComponent);
    const header = wrapper.find('.mes-header');
    expect(header.classes()).toContain('mes-header');
    expect(header.exists()).toBe(true);
  });
  
  it('should display company logo', () => {
    const wrapper = mount(HeaderComponent);
    expect(wrapper.find('[data-testid="company-logo"]')).toBeTruthy();
    expect(wrapper.text()).toContain('DONGKUK CM');
  });
  
  it('should render all header sections', () => {
    const wrapper = mount(HeaderComponent);
    expect(wrapper.find('[data-testid="global-menu-button"]')).toBeTruthy();
    expect(wrapper.find('[data-testid="user-info-dropdown"]')).toBeTruthy();
    expect(wrapper.find('[data-testid="contact-list-button"]')).toBeTruthy();
    expect(wrapper.find('[data-testid="remote-support-button"]')).toBeTruthy();
  });
  
  it('should handle global menu click', async () => {
    const wrapper = mount(HeaderComponent);
    const globalMenuButton = wrapper.find('[data-testid="global-menu-button"]');
    
    await globalMenuButton.trigger('click');
    expect(wrapper.emitted('global-menu-click')).toBeTruthy();
  });
});
```

#### 2. GlobalMenuButton 테스트
```typescript
describe('GlobalMenuButton', () => {
  it('should render button with correct attributes', () => {
    const wrapper = mount(GlobalMenuButton, {
      props: { ariaLabel: '전체 메뉴' }
    });
    
    const button = wrapper.find('[data-testid="global-menu-button"]');
    expect(button.exists()).toBe(true);
    expect(button.attributes('aria-label')).toBe('전체 메뉴');
  });

  it('should emit click event when clicked', async () => {
    const wrapper = mount(GlobalMenuButton);
    const button = wrapper.find('[data-testid="global-menu-button"]');
    
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('should have correct aria-expanded attribute', () => {
    const wrapper = mount(GlobalMenuButton, {
      props: { isOpen: true }
    });
    
    const button = wrapper.find('[data-testid="global-menu-button"]');
    expect(button.attributes('aria-expanded')).toBe('true');
  });
});
```

#### 3. UserInfoDropdown 테스트
```typescript
describe('UserInfoDropdown', () => {
  const mockUser = {
    id: '1',
    name: '장종익',
    department: '냉연생산SM팀',
    email: 'jang@dongkuk.com'
  };

  it('should display user information', () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    expect(wrapper.text()).toContain('장종익');
    expect(wrapper.text()).toContain('냉연생산SM팀');
  });

  it('should show user avatar initial when no avatar provided', () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    const avatarInitial = wrapper.find('.avatar-initial');
    expect(avatarInitial.exists()).toBe(true);
    expect(avatarInitial.text()).toBe('장');
  });

  it('should toggle dropdown when clicked', async () => {
    const wrapper = mount(UserInfoDropdown, {
      props: { user: mockUser }
    });
    
    const trigger = wrapper.find('[data-testid="user-info-button"]');
    
    // 초기 상태: 드롭다운 닫힘
    expect(wrapper.find('[data-testid="user-dropdown-menu"]').exists()).toBe(false);
    
    // 클릭 후: 드롭다운 열림
    await trigger.trigger('click');
    await nextTick();
    
    expect(wrapper.find('[data-testid="user-dropdown-menu"]').exists()).toBe(true);
  });
});
```

### 통합 테스트 계획
- 헤더 컴포넌트와 MainLayout 통합 테스트
- 반응형 레이아웃 동작 테스트
- 키보드 네비게이션 테스트
- 접근성 테스트 (axe-core)

## 성능 최적화

### 최적화 전략
1. **컴포넌트 분리**: 각 서브 컴포넌트를 독립적으로 분리하여 재사용성 향상
2. **메모이제이션**: 사용자 정보 계산 결과 캐싱
3. **이벤트 최적화**: 디바운싱을 통한 리사이즈 이벤트 최적화
4. **번들 최적화**: 트리 쉐이킹을 통한 불필요한 코드 제거

### 성능 메트릭
- 초기 렌더링 시간: < 100ms
- 드롭다운 열기 시간: < 50ms
- 메모리 사용량: < 5MB

## 접근성 고려사항

### WCAG 2.1 AA 준수
1. **키보드 네비게이션**: Tab, Enter, Space, Escape 키 지원
2. **스크린 리더**: ARIA 라벨 및 역할 정의
3. **색상 대비**: 4.5:1 이상 대비율 확보
4. **포커스 관리**: 시각적 포커스 인디케이터 제공

### ARIA 속성 활용
```html
<!-- 전체 메뉴 버튼 -->
<button 
  aria-label="전체 메뉴"
  aria-expanded="false"
  aria-controls="global-menu-dialog"
>

<!-- 사용자 드롭다운 -->
<button
  aria-haspopup="true"
  aria-expanded="false"
  aria-controls="user-dropdown-menu"
>

<!-- 드롭다운 메뉴 -->
<div 
  role="menu"
  aria-labelledby="user-info-button"
>
  <button role="menuitem">사용자 설정</button>
</div>
```

## 구현 순서

### Phase 1: 기본 구조 (1일)
1. HeaderComponent 기본 틀 생성
2. 좌측/우측 영역 레이아웃 구현
3. 기본 스타일링 적용

### Phase 2: 개별 컴포넌트 (2일)
1. GlobalMenuButton 구현
2. CompanyLogo 구현
3. UserInfoDropdown 기본 구조 구현
4. ContactListButton 기본 구조 구현
5. RemoteSupportButton 구현

### Phase 3: 통합 및 테스트 (1일)
1. 컴포넌트 통합
2. 이벤트 핸들링 구현
3. 단위 테스트 작성
4. 접근성 테스트

### Phase 4: 최적화 및 리팩토링 (1일)
1. 타입 정의 분리
2. 상수 분리
3. 코드 리팩토링
4. 성능 최적화

## 검증 기준

### 기능 검증
- [ ] 60px 고정 높이 헤더 렌더링
- [ ] 좌측 영역 컴포넌트 정상 표시
- [ ] 우측 영역 컴포넌트 정상 표시
- [ ] 전체 메뉴 버튼 클릭 이벤트 발생
- [ ] 사용자 드롭다운 기본 동작
- [ ] 담당자 연락처 버튼 표시
- [ ] 원격 지원 링크 새 창 열기

### 품질 검증
- [ ] TypeScript 타입 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 단위 테스트 커버리지 80% 이상
- [ ] 접근성 테스트 통과
- [ ] 반응형 디자인 동작 확인

### 성능 검증
- [ ] 초기 렌더링 100ms 이내
- [ ] 메모리 사용량 5MB 이내
- [ ] 번들 크기 최적화 확인

## 다음 단계 연계

### Task 4.2 연계사항
- GlobalMenuButton 클릭 이벤트를 통한 모달 다이얼로그 연동
- 전체 메뉴 모달의 상태 관리 연동

### Task 4.3 연계사항
- UserInfoDropdown의 상세 기능 구현
- 사용자 상태 관리 스토어 연동

### Task 4.4 연계사항
- ContactListButton의 상세 팝업 기능 구현
- 연락처 데이터 관리 시스템 연동

이 설계 문서를 바탕으로 헤더 컴포넌트의 기본 구조를 체계적으로 구현하여 안정적이고 확장 가능한 인터페이스를 제공할 수 있습니다.
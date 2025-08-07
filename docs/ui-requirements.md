# MES UI 프레임워크 요구사항 명세서

## 1. 프로젝트 개요

### 1.1 프로젝트 목적
- 기존 MES 시스템 재개발을 위한 UI 프레임워크 개발
- 현대적이고 사용자 친화적인 인터페이스 제공
- 멀티 디바이스 지원 및 반응형 웹 구현

### 1.2 개발 일정
- **전체 기간**: 3개월
- **개발 우선순위**: 레이아웃 → 헤더 → 툴바 → 메뉴 → 탭

### 1.3 기술 아키텍처
- **기본 방식**: 멀티페이지 (SPA 방식도 염두)
- **브라우저 지원**: Chrome, Edge
- **성능 목표**: 페이지 로딩 3초 이내, 탭 전환 2초 이내
- **동시 사용자**: 100명 (전체 1000명)

---

## 2. 전체 레이아웃 구조

### 2.1 화면 구성
```
┌─────────────────────────────────────────────────────────────┐
│                        헤더 영역                           │
│ [메뉴] [회사CI]                    [사용자정보] [전화번호] [원격] │
├──┬──────────────────────────────────────────────────────────┤
│툴│                    메인 콘텐츠 영역                      │
│바│  ┌─────────────────────────────────────────────────────┐ │
│ │  │      탭 바 (홈, 메뉴1, 메뉴2, ...)              │ │
│아│  ├─────────────────────────────────────────────────────┤ │
│이│  │                                                 │ │
│콘│  │                화면 컨텐츠                      │ │
│ │  │                                                 │ │
│ │  │                                                 │ │
│ │  │                                                 │ │
│ │  └─────────────────────────────────────────────────────┘ │
└──┴──────────────────────────────────────────────────────────┘
```

### 2.2 반응형 동작
- **데스크톱**: 툴바 항상 표시
- **태블릿/모바일**: 툴바 → 햄버거 메뉴로 변환
- **탭 오버플로우**: 좌우 스크롤 처리
- **콘텐츠 오버플로우**: 세로/가로 스크롤 처리

---

## 3. 헤더 영역 상세

### 3.1 구성 요소
```
┌─────────────────────────────────────────────────────────────┐
│ [≡] [회사CI]              [사용자정보] [담당자번호] [원격요청] │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 전체 메뉴 아이콘 (≡)
- **위치**: 헤더 좌측 최상단
- **기능**: 클릭 시 전체 메뉴 모달 창 표시
- **모달 구성**:
  - 상단: 검색창, 전체보기 토글, 즐겨찾기 토글
  - 좌측: 대단위 업무명 목록
  - 우측: 선택된 업무의 세부 메뉴 (3단 구조)
  - 즐겨찾기: 메뉴명 옆 별표(★) 표시

### 3.3 회사 CI
- **위치**: 헤더 좌측 (전체 메뉴 옆)
- **기능**: 클릭 불가 (장식 요소)
- **크기**: 고정 크기

### 3.4 사용자 정보 영역
- **구성**: 아바타 + 소속명 + 사용자명
- **기능**: 
  - 클릭 시 드롭다운 메뉴
  - 사용자 설정, 로그아웃 기능
  - 메시지함 기능

### 3.5 담당자 전화번호
- **기능**: 클릭 시 담당자 연락처 목록 표시
- **구성**: MES/APS/기타 부서별 담당자 정보

### 3.6 원격요청
- **기능**: 클릭 시 외부 링크 연결
- **URL**: http://www.ezh.kr/notice.html
- **동작**: 새 창으로 열기

---

## 4. 툴바 영역 상세

### 4.1 구성 및 동작
- **위치**: 화면 좌측 세로 배치
- **너비**: 고정 너비 (약 60-80px)
- **아이콘 수**: 대단위 업무별 아이콘
- **호버 효과**: 90도 회전 애니메이션 + 한글명 표시

### 4.2 토글 기능
- **클릭 동작**: 메뉴 트리 펼침/접힘
- **시각적 표시**: 선택된 아이콘 하이라이트
- **상태 유지**: 마지막 선택 상태 기억

### 4.3 반응형 처리
- **데스크톱**: 항상 표시
- **모바일/태블릿**: 햄버거 메뉴로 변환

---

## 5. 메뉴 트리 영역

### 5.1 구조 변경
- **기존**: 아코디언 메뉴
- **신규**: 트리 메뉴 (5단계 구조)
  1. 대단위그룹 (툴바)
  2. 대분류
  3. 중분류  
  4. 소분류
  5. 상세메뉴 (필요 시)

### 5.2 트리 메뉴 기능
- **펼침/접힘**: 각 노드별 개별 제어
- **전체 제어**: 전체 펼침/접힘 버튼
- **탭 연동**: 최종 메뉴 클릭 시 탭 생성
- **중복 처리**: 같은 메뉴 클릭 시 기존 탭 활성화

### 5.3 메뉴 선택 동작
- **중간 노드**: 펼침/접힘만 수행
- **최종 노드**: 새 탭 생성 또는 기존 탭 활성화

---

## 6. 탭 시스템

### 6.1 탭 구성
```
┌─────┬─────┬─────┬─────┬─────┐ ← → 
│ 홈  │메뉴1│메뉴2│메뉴3│ ... │
└─────┴─────┴─────┴─────┴─────┘
```

### 6.2 홈 탭
- **고정 탭**: 닫기 불가
- **내용**: 
  - 카드 형태 대시보드
  - 주요 지표 표시
  - 자주 사용하는 메뉴
  - 최근 사용 메뉴
  - MES 공지사항

### 6.3 일반 탭
- **닫기 버튼**: 각 탭에 X 버튼 제공
- **드래그앤드롭**: 탭 순서 변경 가능
- **제목**: 메뉴명 그대로 사용
- **자동 스크롤**: 활성 탭이 보이도록 자동 조정

### 6.4 탭 오버플로우 처리
- **스크롤 방식**: 좌우 화살표 버튼
- **모바일**: 스와이프 제스처 지원

---

## 7. 메인 콘텐츠 영역

### 7.1 구성
- **위치**: 툴바 우측 전체 영역
- **내용**: 선택된 탭의 페이지 표시
- **스크롤**: 필요 시 세로/가로 스크롤

### 7.2 콘텐츠 로딩 방식
- **멀티페이지**: 각 탭별 독립 페이지
- **상태 유지**: iframe 또는 DOM 캐싱 방식
- **성능**: 비활성 탭은 숨김 처리

---

## 8. 반응형 디자인

### 8.1 지원 디바이스
- **주 대상**: 데스크톱, 랩톱
- **부 대상**: 태블릿, 모바일
- **접근법**: 데스크톱 우선, 모바일 고려

### 8.2 브레이크포인트
- **모바일**: ~768px
- **태블릿**: 769px~1024px  
- **데스크톱**: 1025px~
- **대형**: 1920px~

### 8.3 반응형 동작
| 화면 크기 | 툴바 | 탭 바 | 메뉴 트리 |
|----------|------|-------|-----------|
| 데스크톱 | 고정 표시 | 수평 배치 | 사이드바 |
| 태블릿 | 햄버거 메뉴 | 수평 스크롤 | 오버레이 |
| 모바일 | 햄버거 메뉴 | 수평 스크롤 | 전체 화면 |

---

## 9. 기술 요구사항

### 9.1 브라우저 지원
- **지원**: Chrome, Edge (최신 버전)
- **미지원**: Internet Explorer
- **제약**: 브라우저 버전 제약 최소화

### 9.2 성능 요구사항
- **페이지 로딩**: 3초 이내
- **탭 전환**: 2초 이내
- **대용량 데이터**: 별도 기준 없음 (최적화 권장)

### 9.3 보안 및 제약사항
- **CDN**: 사용 금지
- **포트**: 특정 포트만 사용 (추후 확정)
- **연동**: EAI 시스템 연동 필요

---

## 10. 테마 및 디자인 시스템

### 10.1 디자인 방향
- **현 시스템**: 구형 스타일로 전면 변경 필요
- **목표**: 최신 트렌드, 세련된 형태
- **테마**: 다크 모드 지원 필수

### 10.2 폰트 시스템
- **한글**: 저작권 문제 없는 고가독성 폰트
- **영문/숫자**: 동일 조건
- **특수**: 바코드 폰트 포함
- **체계**: 보편적 타이포그래피 가이드라인

### 10.3 아이콘 시스템
- **스타일**: 세련된 형태
- **일관성**: 통일된 디자인 언어
- **확장성**: 추가 아이콘 대응 가능

---

## 11. 컴포넌트 상세 명세

### 11.1 헤더 컴포넌트
```typescript
interface HeaderComponent {
  globalMenu: GlobalMenuButton;
  logo: CompanyLogo;
  userInfo: UserInfoDropdown;
  phoneBook: ContactList;
  remoteRequest: ExternalLink;
}
```

### 11.2 툴바 컴포넌트
```typescript
interface ToolbarComponent {
  icons: ToolbarIcon[];
  activeIcon: string;
  collapsed: boolean;
  hoverAnimation: boolean;
}

interface ToolbarIcon {
  id: string;
  icon: ReactNode;
  label: string;
  tooltip: string;
  active: boolean;
}
```

### 11.3 메뉴 트리 컴포넌트
```typescript
interface MenuTreeComponent {
  nodes: TreeNode[];
  expandedNodes: string[];
  selectedNode: string;
  onNodeClick: (nodeId: string) => void;
  onNodeExpand: (nodeId: string) => void;
}

interface TreeNode {
  id: string;
  label: string;
  level: number;
  children?: TreeNode[];
  isLeaf: boolean;
  url?: string;
}
```

### 11.4 탭 시스템 컴포넌트
```typescript
interface TabSystemComponent {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabReorder: (fromIndex: number, toIndex: number) => void;
}

interface Tab {
  id: string;
  title: string;
  url: string;
  closable: boolean;
  active: boolean;
}
```

### 11.5 콘텐츠 영역 컴포넌트
```typescript
interface ContentAreaComponent {
  activeTabId: string;
  tabContents: Map<string, HTMLElement>;
  loading: boolean;
  error?: string;
}
```

---

## 부록 A. 화면 저장/복원 방안

### A.1 요구사항
사용자가 탭을 전환할 때 모든 화면 상태가 그대로 유지되어야 함:
- 입력 폼 데이터 (텍스트, 선택값, 체크박스 등)
- 테이블 상태 (정렬, 필터, 페이지, 선택행 등)
- 화면 표시 상태 (스크롤, 접힘/펼침, 서브탭 등)
- 모달창, 팝업 상태

### A.2 구현 방안

#### 방안 1: iframe 방식 ⭐ **추천**
```html
<div class="tab-content">
  <iframe src="/mes/production" style="display: block;"></iframe>
  <iframe src="/mes/quality" style="display: none;"></iframe>
</div>
```

**장점:**
- 각 페이지가 완전히 독립적
- 브라우저가 자동으로 상태 유지
- 기존 JSP 방식과 가장 유사
- 개발 복잡도 낮음
- 메모리 관리 자동

**단점:**
- 초기 로딩 시간 증가
- 탭 간 데이터 공유 어려움
- postMessage 통신 필요

#### 방안 2: DOM 캐싱 방식
```javascript
const tabCache = new Map();

function switchTab(tabId) {
  // 현재 탭 DOM 저장
  const currentContent = document.querySelector('.content-area').innerHTML;
  tabCache.set(currentTabId, currentContent);
  
  // 새 탭 DOM 복원
  const cachedContent = tabCache.get(tabId);
  if (cachedContent) {
    document.querySelector('.content-area').innerHTML = cachedContent;
  } else {
    loadTabContent(tabId);
  }
}
```

**장점:**
- 빠른 탭 전환
- 상태 완벽 보존
- 메모리 효율적

**단점:**
- 이벤트 리스너 재연결 필요
- 복잡한 상태 관리
- 메모리 누수 위험

#### 방안 3: 숨김 처리 방식
```html
<div class="content-area">
  <div id="tab1" style="display: block;">...</div>
  <div id="tab2" style="display: none;">...</div>
</div>
```

**장점:**
- 구현 단순
- 상태 자동 유지
- 빠른 전환

**단점:**
- 메모리 사용량 증가
- 모든 탭이 DOM에 상주
- 성능 저하 가능

### A.3 선택 기준

#### 멀티페이지 환경에서의 최적 방안: **iframe 방식**

**선택 이유:**
1. **안정성**: 각 페이지가 독립적으로 동작
2. **호환성**: 기존 JSP 시스템과 호환
3. **유지보수**: 페이지별 독립 개발 가능
4. **메모리**: 브라우저가 자동 관리
5. **보안**: 페이지 간 격리

**구현 가이드:**
```javascript
class TabManager {
  constructor() {
    this.tabs = new Map();
    this.activeTab = null;
  }
  
  createTab(id, title, url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    this.tabs.set(id, {
      id, title, url, iframe,
      created: new Date()
    });
    
    document.querySelector('.content-area').appendChild(iframe);
  }
  
  switchTab(id) {
    // 이전 탭 숨김
    if (this.activeTab) {
      this.tabs.get(this.activeTab).iframe.style.display = 'none';
    }
    
    // 새 탭 표시
    this.tabs.get(id).iframe.style.display = 'block';
    this.activeTab = id;
  }
  
  closeTab(id) {
    const tab = this.tabs.get(id);
    if (tab) {
      tab.iframe.remove();
      this.tabs.delete(id);
    }
  }
}
```

---

## 부록 B. 추천 테마 스타일

### B.1 테마 선택 기준

#### 왜 다크 테마인가?
1. **눈의 피로 감소**: 장시간 업무에 적합
2. **데이터 가독성**: 차트, 그래프가 더 명확
3. **집중력 향상**: 산만함 최소화
4. **모던한 느낌**: 전문적이고 세련된 이미지
5. **배터리 절약**: 특히 OLED 화면에서 유리

### B.2 색상 체계

#### Primary Palette (주색상)
```css
:root {
  /* 배경색 */
  --bg-primary: #0f172a;      /* 메인 배경 - 진한 슬레이트 */
  --bg-secondary: #1e293b;    /* 카드/패널 배경 */
  --bg-tertiary: #334155;     /* 호버 상태 */
  
  /* 표면색 */
  --surface-1: #475569;       /* 버튼, 입력필드 */
  --surface-2: #64748b;       /* 구분선, 테두리 */
  
  /* 텍스트색 */
  --text-primary: #f8fafc;    /* 주 텍스트 */
  --text-secondary: #cbd5e1;  /* 보조 텍스트 */
  --text-muted: #94a3b8;      /* 비활성 텍스트 */
}
```

#### Accent Colors (강조색)
```css
:root {
  /* 브랜드 색상 */
  --primary: #3b82f6;         /* 주 브랜드 - 블루 */
  --primary-hover: #2563eb;   /* 호버 상태 */
  --primary-light: #93c5fd;   /* 연한 톤 */
  
  /* 보조 색상 */
  --secondary: #64748b;       /* 보조 브랜드 - 그레이 */
  --accent: #f59e0b;          /* 강조색 - 오렌지 */
  
  /* 상태 색상 */
  --success: #10b981;         /* 성공 - 그린 */
  --warning: #f59e0b;         /* 경고 - 앰버 */
  --error: #ef4444;           /* 에러 - 레드 */
  --info: #06b6d4;            /* 정보 - 시안 */
}
```

### B.3 타이포그래피

#### 폰트 스택
```css
:root {
  /* 본문 폰트 */
  --font-sans: 'Pretendard', 'Noto Sans KR', 'Malgun Gothic', 
               -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  
  /* 모노스페이스 (코드, 데이터) */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  
  /* 바코드 폰트 */
  --font-barcode: 'Libre Barcode 39', 'Code 39', monospace;
}
```

#### 폰트 크기 체계
```css
:root {
  --text-xs: 0.75rem;     /* 12px - 캡션 */
  --text-sm: 0.875rem;    /* 14px - 작은 텍스트 */
  --text-base: 1rem;      /* 16px - 기본 텍스트 */
  --text-lg: 1.125rem;    /* 18px - 큰 텍스트 */
  --text-xl: 1.25rem;     /* 20px - 소제목 */
  --text-2xl: 1.5rem;     /* 24px - 제목 */
  --text-3xl: 1.875rem;   /* 30px - 큰 제목 */
}
```

### B.4 컴포넌트 스타일

#### 버튼 스타일
```css
.btn-primary {
  background: var(--primary);
  color: var(--text-primary);
  border: 1px solid var(--primary);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
```

#### 카드 스타일
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

#### 입력 필드 스타일
```css
.input {
  background: var(--surface-1);
  border: 1px solid var(--surface-2);
  border-radius: 0.375rem;
  color: var(--text-primary);
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}
```

### B.5 테마 변형

#### Light Theme 지원
```css
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
}
```

#### 테마 전환 기능
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(this.currentTheme);
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
}
```

### B.6 아이콘 시스템

#### 추천 아이콘 라이브러리
1. **Lucide React**: 깔끔하고 일관된 스타일
2. **Heroicons**: Tailwind CSS와 완벽 호환
3. **Tabler Icons**: 산업용 UI에 적합

#### 아이콘 사용 가이드
```css
.icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-width: 2;
  transition: all 0.2s ease;
}

.icon-lg {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}
```

### B.7 애니메이션 및 전환

#### 기본 전환 효과
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### 호버 및 포커스 효과
```css
.interactive {
  transition: var(--transition-normal);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

## 결론

본 명세서는 MES UI 프레임워크 개발을 위한 종합적인 가이드라인을 제공합니다. 멀티페이지 기반의 안정적인 아키텍처와 현대적인 다크 테마를 통해 사용자 경험을 극대화하고, 체계적인 개발 프로세스를 통해 성공적인 프로젝트 완성을 목표로 합니다.

각 컴포넌트의 상세 구현과 화면 저장/복원 방안, 그리고 일관된 디자인 시스템을 통해 확장 가능하고 유지보수가 용이한 UI 프레임워크를 구축할 수 있을 것입니다.
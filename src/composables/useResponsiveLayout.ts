import { ref, computed, onMounted, onUnmounted, readonly, type ComputedRef, type Ref } from 'vue';

// 디바운스 유틸리티 함수
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'large';
export type MenuTreeMode = 'sidebar' | 'overlay' | 'fullscreen';

export interface ScreenSize {
  width: number;
  height: number;
}

export interface LayoutState {
  toolbarVisible: boolean;
  menuTreeMode: MenuTreeMode;
  headerCompact: boolean;
}

export interface UseResponsiveLayoutReturn {
  screenSize: ComputedRef<ScreenSize>;
  currentBreakpoint: ComputedRef<Breakpoint>;
  layoutState: ComputedRef<LayoutState>;
  mobileMenuOpen: Ref<boolean>;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export function useResponsiveLayout(): UseResponsiveLayoutReturn {
  // 상태
  const screenSize = ref<ScreenSize>({ width: 0, height: 0 });
  const mobileMenuOpen = ref(false);
  
  // 브레이크포인트 계산
  const currentBreakpoint = computed<Breakpoint>(() => {
    const width = screenSize.value.width;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    if (width <= 1439) return 'desktop';
    return 'large';
  });
  
  // 레이아웃 상태 계산
  const layoutState = computed<LayoutState>(() => ({
    toolbarVisible: currentBreakpoint.value === 'desktop' || currentBreakpoint.value === 'large',
    menuTreeMode: currentBreakpoint.value === 'mobile' ? 'fullscreen' : 
                  currentBreakpoint.value === 'tablet' ? 'overlay' : 'sidebar',
    headerCompact: currentBreakpoint.value === 'mobile'
  }));
  
  // 화면 크기 업데이트
  const updateScreenSize = () => {
    screenSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };
  
  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };
  
  // 디바운스된 리사이즈 핸들러
  const debouncedUpdateScreenSize = debounce(updateScreenSize, 150);
  
  // 이벤트 리스너 등록
  onMounted(() => {
    updateScreenSize();
    window.addEventListener('resize', debouncedUpdateScreenSize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', debouncedUpdateScreenSize);
  });
  
  return {
    screenSize: computed(() => screenSize.value),
    currentBreakpoint,
    layoutState,
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  };
}
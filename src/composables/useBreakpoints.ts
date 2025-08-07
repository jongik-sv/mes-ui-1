import { ref, computed, onMounted, onUnmounted } from 'vue';

export interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const breakpoints: BreakpointConfig = {
  xs: 0,      // 0px and up
  sm: 640,    // 640px and up  
  md: 768,    // 768px and up
  lg: 1024,   // 1024px and up
  xl: 1280,   // 1280px and up
  '2xl': 1536 // 1536px and up
};

export function useBreakpoints() {
  const windowWidth = ref(0);

  const updateWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });

  // Computed breakpoint checks
  const isXs = computed(() => windowWidth.value >= breakpoints.xs && windowWidth.value < breakpoints.sm);
  const isSm = computed(() => windowWidth.value >= breakpoints.sm && windowWidth.value < breakpoints.md);
  const isMd = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg);
  const isLg = computed(() => windowWidth.value >= breakpoints.lg && windowWidth.value < breakpoints.xl);
  const isXl = computed(() => windowWidth.value >= breakpoints.xl && windowWidth.value < breakpoints['2xl']);
  const is2xl = computed(() => windowWidth.value >= breakpoints['2xl']);

  // Convenience computed properties
  const isMobile = computed(() => windowWidth.value < breakpoints.md); // < 768px
  const isTablet = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg); // 768px - 1023px
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg); // >= 1024px

  // Greater than or equal to breakpoint
  const smAndUp = computed(() => windowWidth.value >= breakpoints.sm);
  const mdAndUp = computed(() => windowWidth.value >= breakpoints.md);
  const lgAndUp = computed(() => windowWidth.value >= breakpoints.lg);
  const xlAndUp = computed(() => windowWidth.value >= breakpoints.xl);

  // Less than breakpoint
  const smAndDown = computed(() => windowWidth.value < breakpoints.md);
  const mdAndDown = computed(() => windowWidth.value < breakpoints.lg);
  const lgAndDown = computed(() => windowWidth.value < breakpoints.xl);
  const xlAndDown = computed(() => windowWidth.value < breakpoints['2xl']);

  return {
    // Current window width
    windowWidth,
    
    // Exact breakpoint matches
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    
    // Device categories
    isMobile,
    isTablet,
    isDesktop,
    
    // Greater than or equal to
    smAndUp,
    mdAndUp,
    lgAndUp,
    xlAndUp,
    
    // Less than
    smAndDown,
    mdAndDown,
    lgAndDown,
    xlAndDown,
    
    // Breakpoint values
    breakpoints
  };
}
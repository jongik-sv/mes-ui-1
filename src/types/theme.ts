/**
 * 테마 관련 타입 정의
 */

export type ThemeName = 'light' | 'dark'
export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeColors {
  // Background Colors
  'bg-primary': string
  'bg-secondary': string
  'bg-tertiary': string
  
  // Surface Colors
  'surface-1': string
  'surface-2': string
  'surface-3': string
  
  // Text Colors
  'text-primary': string
  'text-secondary': string
  'text-tertiary': string
  'text-muted': string
  'text-inverse': string
  
  // Brand Colors
  primary: string
  'primary-hover': string
  'primary-light': string
  'primary-dark': string
  
  secondary: string
  'secondary-hover': string
  accent: string
  
  // Status Colors
  success: string
  'success-light': string
  warning: string
  'warning-light': string
  error: string
  'error-light': string
  info: string
  'info-light': string
}

export interface ThemeTypography {
  // Font Families
  'font-sans': string
  'font-mono': string
  'font-barcode': string
  
  // Font Sizes
  'text-xs': string
  'text-sm': string
  'text-base': string
  'text-lg': string
  'text-xl': string
  'text-2xl': string
  'text-3xl': string
  'text-4xl': string
  
  // Line Heights
  'leading-none': number
  'leading-tight': number
  'leading-snug': number
  'leading-normal': number
  'leading-relaxed': number
  'leading-loose': number
  
  // Font Weights
  'font-thin': number
  'font-light': number
  'font-normal': number
  'font-medium': number
  'font-semibold': number
  'font-bold': number
  'font-extrabold': number
  'font-black': number
}

export interface ThemeSpacing {
  // Base Unit
  'space-unit': string
  
  // Spacing Scale
  'space-0': string
  'space-1': string
  'space-2': string
  'space-3': string
  'space-4': string
  'space-5': string
  'space-6': string
  'space-8': string
  'space-10': string
  'space-12': string
  'space-16': string
  'space-20': string
  'space-24': string
  
  // Semantic Spacing
  'gap-xs': string
  'gap-sm': string
  'gap-md': string
  'gap-lg': string
  'gap-xl': string
  
  // Component Spacing
  'padding-xs': string
  'padding-sm': string
  'padding-md': string
  'padding-lg': string
  'padding-xl': string
  
  'margin-xs': string
  'margin-sm': string
  'margin-md': string
  'margin-lg': string
  'margin-xl': string
}

export interface ThemeLayout {
  // Component Dimensions
  'header-height': string
  'toolbar-width': string
  'menu-tree-width': string
  'tab-height': string
  'sidebar-width': string
  
  // Border Radius
  'radius-none': string
  'radius-sm': string
  'radius-md': string
  'radius-lg': string
  'radius-xl': string
  'radius-2xl': string
  'radius-full': string
  
  // Shadow System
  'shadow-xs': string
  'shadow-sm': string
  'shadow-md': string
  'shadow-lg': string
  'shadow-xl': string
  'shadow-2xl': string
  'shadow-inner': string
  
  // Colored Shadows
  'shadow-primary': string
  'shadow-success': string
  'shadow-warning': string
  'shadow-error': string
}

export interface ThemeAnimations {
  // Transition Durations
  'transition-fast': string
  'transition-normal': string
  'transition-slow': string
  'transition-slower': string
  
  // Easing Functions
  'ease-linear': string
  'ease-in': string
  'ease-out': string
  'ease-in-out': string
  'ease-bounce': string
  'ease-elastic': string
  
  // Common Transitions
  'transition-colors': string
  'transition-opacity': string
  'transition-transform': string
  'transition-all': string
}

export interface ThemeConfig {
  name: ThemeName
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  layout: ThemeLayout
  animations: ThemeAnimations
}

export interface UseThemeReturn {
  // 상태
  currentTheme: Ref<ThemeName>
  themeMode: Ref<ThemeMode>
  isSystemDark: Ref<boolean>
  
  // 메서드
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  
  // 유틸리티
  isDark: ComputedRef<boolean>
  isLight: ComputedRef<boolean>
  themeClasses: ComputedRef<string[]>
}

// CSS 변수 키 타입
export type CSSVariableKey = keyof (ThemeColors & ThemeTypography & ThemeSpacing & ThemeLayout & ThemeAnimations)

// 테마 변경 이벤트
export interface ThemeChangeEvent {
  from: ThemeName
  to: ThemeName
  mode: ThemeMode
}

// 테마 설정 옵션
export interface ThemeOptions {
  storageKey?: string
  defaultTheme?: ThemeMode
  enableSystemTheme?: boolean
  enableTransitions?: boolean
}

import type { Ref, ComputedRef } from 'vue'
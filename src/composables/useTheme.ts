import { ref, computed, watch, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { ThemeName, ThemeMode, UseThemeReturn, ThemeOptions } from '@/types/theme'

// 기본 설정
const DEFAULT_OPTIONS: Required<ThemeOptions> = {
    storageKey: 'mes-theme-mode',
    defaultTheme: 'dark',
    enableSystemTheme: true,
    enableTransitions: true,
}

// 전역 상태 (싱글톤 패턴)
let themeInstance: UseThemeReturn | null = null

/**
 * 테마 관리 컴포저블
 * 다크/라이트 테마 전환, 시스템 테마 감지, 상태 영속화 기능 제공
 */
export function useTheme(options: Partial<ThemeOptions> = {}): UseThemeReturn {
    const config = { ...DEFAULT_OPTIONS, ...options }

    // 반응형 상태
    const themeMode = ref<ThemeMode>(config.defaultTheme)
    const isSystemDark = ref<boolean>(false)

    // 미디어 쿼리 객체
    let mediaQuery: MediaQueryList | null = null
    let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null

    /**
     * 현재 적용된 테마 계산
     */
    const currentTheme = computed<ThemeName>(() => {
        if (themeMode.value === 'auto') {
            return isSystemDark.value ? 'dark' : 'light'
        }
        return themeMode.value as ThemeName
    })

    /**
     * 다크 테마 여부
     */
    const isDark = computed<boolean>(() => currentTheme.value === 'dark')

    /**
     * 라이트 테마 여부
     */
    const isLight = computed<boolean>(() => currentTheme.value === 'light')

    /**
     * 테마 관련 CSS 클래스
     */
    const themeClasses = computed<string[]>(() => {
        const theme = currentTheme.value
        return [
            `theme-${theme}`,
            theme,
            themeMode.value === 'auto' ? 'theme-auto' : `theme-${themeMode.value}`,
        ]
    })

    /**
     * localStorage에서 테마 설정 로드
     */
    const loadThemeFromStorage = (): ThemeMode => {
        try {
            const stored = localStorage.getItem(config.storageKey)
            if (stored && ['light', 'dark', 'auto'].includes(stored)) {
                return stored as ThemeMode
            }
        } catch (error) {
            console.warn('Failed to load theme from localStorage:', error)
        }
        return config.defaultTheme
    }

    /**
     * localStorage에 테마 설정 저장
     */
    const saveThemeToStorage = (theme: ThemeMode): void => {
        try {
            localStorage.setItem(config.storageKey, theme)
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error)
        }
    }

    /**
     * 시스템 테마 상태 업데이트
     */
    const updateSystemTheme = (): void => {
        if (!config.enableSystemTheme || typeof window === 'undefined') {
            return
        }

        try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            isSystemDark.value = mediaQuery.matches
        } catch (error) {
            console.warn('Failed to update system theme:', error)
            isSystemDark.value = false
        }
    }

    /**
     * 시스템 테마 감지 초기화
     */
    const initSystemThemeDetection = (): void => {
        if (!config.enableSystemTheme || typeof window === 'undefined') {
            return
        }

        try {
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            isSystemDark.value = mediaQuery.matches

            // 시스템 테마 변경 감지
            mediaQueryListener = (e: MediaQueryListEvent) => {
                isSystemDark.value = e.matches
            }

            // 이벤트 리스너 등록 (구형 브라우저 호환성 고려)
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', mediaQueryListener)
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(mediaQueryListener)
            }
        } catch (error) {
            console.warn('Failed to initialize system theme detection:', error)
            isSystemDark.value = false
        }
    }

    /**
     * 시스템 테마 감지 정리
     */
    const cleanupSystemThemeDetection = (): void => {
        if (mediaQuery && mediaQueryListener) {
            try {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener('change', mediaQueryListener)
                } else if (mediaQuery.removeListener) {
                    mediaQuery.removeListener(mediaQueryListener)
                }
            } catch (error) {
                console.warn('Failed to cleanup system theme detection:', error)
            }
        }
        mediaQuery = null
        mediaQueryListener = null
    }

    /**
     * DOM에 테마 적용
     */
    const applyThemeToDOM = (theme: ThemeName): void => {
        if (typeof document === 'undefined') {
            return
        }

        try {
            const root = document.documentElement

            // data-theme 속성 설정
            root.setAttribute('data-theme', theme)

            // 기존 테마 클래스 제거
            root.classList.remove('theme-light', 'theme-dark', 'light', 'dark')

            // 새 테마 클래스 추가
            root.classList.add(`theme-${theme}`, theme)

            // 테마 전환 애니메이션 클래스 추가 (선택적)
            if (config.enableTransitions) {
                root.classList.add('theme-transitioning')

                // 애니메이션 완료 후 클래스 제거
                setTimeout(() => {
                    root.classList.remove('theme-transitioning')
                }, 500)
            }
        } catch (error) {
            console.warn('Failed to apply theme to DOM:', error)
        }
    }

    /**
     * 테마 설정
     */
    const setTheme = (theme: ThemeMode): void => {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Using default theme.`)
            theme = config.defaultTheme
        }

        themeMode.value = theme
        saveThemeToStorage(theme)

        // auto 모드로 전환할 때 시스템 테마 상태 업데이트
        if (theme === 'auto') {
            updateSystemTheme()
        }
    }

    /**
     * 테마 토글 (라이트 ↔ 다크)
     */
    const toggleTheme = (): void => {
        if (themeMode.value === 'auto') {
            // auto 모드에서는 현재 시스템 테마의 반대로 설정
            setTheme(isSystemDark.value ? 'light' : 'dark')
        } else {
            // 라이트 ↔ 다크 토글
            setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
        }
    }

    /**
     * 초기화
     */
    const initialize = (): void => {
        // 시스템 테마 감지 초기화
        initSystemThemeDetection()

        // 저장된 테마 설정 로드
        const savedTheme = loadThemeFromStorage()
        themeMode.value = savedTheme

        // 초기 테마 적용
        applyThemeToDOM(currentTheme.value)
    }

    // currentTheme 변경 시 DOM 업데이트
    watch(
        currentTheme,
        (newTheme) => {
            applyThemeToDOM(newTheme)
        },
        { immediate: false }
    )

    // Vue 컴포넌트 컨텍스트에서만 라이프사이클 훅 사용
    const instance = getCurrentInstance()
    if (instance) {
        // 컴포넌트 마운트 시 초기화
        onMounted(() => {
            initialize()
        })

        // 컴포넌트 언마운트 시 정리
        onUnmounted(() => {
            cleanupSystemThemeDetection()
        })
    } else {
        // 컴포넌트 외부에서 호출된 경우 즉시 초기화
        initialize()
    }

    // 인스턴스 생성
    const themeReturn: UseThemeReturn = {
        // 상태
        currentTheme,
        themeMode,
        isSystemDark,

        // 메서드
        setTheme,
        toggleTheme,

        // 유틸리티
        isDark,
        isLight,
        themeClasses,
    }

    // 싱글톤 패턴은 테스트에서 문제가 되므로 제거
    return themeReturn
}

/**
 * 테마 인스턴스 리셋 (테스트용)
 */
export function resetThemeInstance(): void {
    themeInstance = null
}

/**
 * 테마 변경 이벤트 발생
 */
export function emitThemeChangeEvent(from: ThemeName, to: ThemeName, mode: ThemeMode): void {
    if (typeof window === 'undefined') {
        return
    }

    try {
        const event = new CustomEvent('theme-change', {
            detail: { from, to, mode },
        })
        window.dispatchEvent(event)
    } catch (error) {
        console.warn('Failed to emit theme change event:', error)
    }
}

/**
 * CSS 변수 값 가져오기
 */
export function getCSSVariable(name: string): string {
    if (typeof document === 'undefined') {
        return ''
    }

    try {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(`--${name}`)
            .trim()
    } catch (error) {
        console.warn(`Failed to get CSS variable --${name}:`, error)
        return ''
    }
}

/**
 * CSS 변수 값 설정
 */
export function setCSSVariable(name: string, value: string): void {
    if (typeof document === 'undefined') {
        return
    }

    try {
        document.documentElement.style.setProperty(`--${name}`, value)
    } catch (error) {
        console.warn(`Failed to set CSS variable --${name}:`, error)
    }
}

/**
 * 테마 관련 유틸리티 함수들
 */
export const themeUtils = {
    getCSSVariable,
    setCSSVariable,
    emitThemeChangeEvent,
    resetThemeInstance,
}

export default useTheme
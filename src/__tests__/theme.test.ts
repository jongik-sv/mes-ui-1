import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@stores/theme'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with dark theme', () => {
    const themeStore = useThemeStore()
    expect(themeStore.currentTheme).toBe('dark')
    expect(themeStore.isDark).toBe(true)
    expect(themeStore.isLight).toBe(false)
  })

  it('should toggle theme correctly', () => {
    const themeStore = useThemeStore()
    
    // 초기 상태: dark
    expect(themeStore.currentTheme).toBe('dark')
    
    // light로 토글
    themeStore.toggleTheme()
    expect(themeStore.currentTheme).toBe('light')
    expect(themeStore.isLight).toBe(true)
    
    // 다시 dark로 토글
    themeStore.toggleTheme()
    expect(themeStore.currentTheme).toBe('dark')
    expect(themeStore.isDark).toBe(true)
  })

  it('should set theme correctly', () => {
    const themeStore = useThemeStore()
    
    themeStore.setTheme('light')
    expect(themeStore.currentTheme).toBe('light')
    
    themeStore.setTheme('dark')
    expect(themeStore.currentTheme).toBe('dark')
  })
})
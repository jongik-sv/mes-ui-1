import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // 상태
  const currentTheme = ref<Theme>('dark')
  
  // 게터
  const isDark = computed(() => currentTheme.value === 'dark')
  const isLight = computed(() => currentTheme.value === 'light')
  
  // 액션
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('mes-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }
  
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('mes-theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const theme = savedTheme || systemTheme
    setTheme(theme)
  }
  
  return {
    currentTheme,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    initTheme
  }
})
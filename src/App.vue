<template>
  <div id="app" :data-theme="currentTheme">
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useThemeStore } from '@stores/theme'

  const themeStore = useThemeStore()
  const currentTheme = computed(() => themeStore.currentTheme)
</script>

<style lang="scss">
  #app {
    min-height: 100vh;
    width: 100%;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
</style>
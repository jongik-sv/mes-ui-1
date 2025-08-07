<template>
  <div class="home-view">
    <h1>MES UI Framework</h1>
    <p>Vue.js 3 + PrimeVue 기반 MES UI 프레임워크 개발 환경이 성공적으로 구축되었습니다.</p>
    
    <div class="demo-section">
      <h2>테마 시스템 테스트</h2>
      <Button 
        :label="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
        @click="toggleTheme"
        class="theme-toggle-btn"
      />
    </div>
    
    <div class="demo-section">
      <h2>기본 컴포넌트 테스트</h2>
      <div class="component-demo">
        <Button label="Primary Button" />
        <Button label="Secondary Button" severity="secondary" />
        <InputText v-model="testInput" placeholder="테스트 입력" />
      </div>
    </div>
    
    <div class="demo-section">
      <h2>색상 시스템 테스트</h2>
      <div class="color-palette">
        <div class="color-item bg-primary">Primary</div>
        <div class="color-item bg-secondary">Secondary</div>
        <div class="color-item" style="background-color: var(--accent)">Accent</div>
        <div class="color-item" style="background-color: var(--success)">Success</div>
        <div class="color-item" style="background-color: var(--warning)">Warning</div>
        <div class="color-item" style="background-color: var(--error)">Error</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useThemeStore } from '@stores/theme'
  import Button from 'primevue/button'
  import InputText from 'primevue/inputtext'

  const themeStore = useThemeStore()
  const testInput = ref('')
  
  const isDark = computed(() => themeStore.isDark)
  const toggleTheme = () => themeStore.toggleTheme()
  
  // 컴포넌트 마운트 시 테마 초기화
  themeStore.initTheme()
</script>

<style lang="scss" scoped>
  .home-view {
    padding: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .demo-section {
    margin-bottom: var(--space-8);
    padding: var(--space-6);
    @include card;
  }
  
  .theme-toggle-btn {
    @include button-primary;
  }
  
  .component-demo {
    @include flex-start;
    gap: var(--gap-md);
    flex-wrap: wrap;
  }
  
  .color-palette {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--gap-md);
  }
  
  .color-item {
    padding: var(--space-4);
    border-radius: 0.375rem;
    color: white;
    font-weight: 500;
    text-align: center;
    min-height: 60px;
    @include flex-center;
  }
</style>
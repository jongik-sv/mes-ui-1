<template>
  <MainLayout>
    <template #header>
      <HeaderComponent
        @global-menu-click="handleGlobalMenuClick"
        @user-settings="handleUserSettings"
        @user-messages="handleUserMessages"
        @user-logout="handleUserLogout"
        @contact-open="handleContactOpen"
        @contact-close="handleContactClose"
        @remote-support-click="handleRemoteSupportClick"
      />
    </template>
    
    <template #main>
      <div class="home-view">
        <h1>MES UI Framework</h1>
        <p>Vue.js 3 + PrimeVue 기반 MES UI 프레임워크 개발 환경이 성공적으로 구축되었습니다.</p>
        
        <div class="demo-section">
          <h2>헤더 컴포넌트 테스트</h2>
          <p>상단 헤더에서 다음 기능들을 테스트할 수 있습니다:</p>
          <ul>
            <li>전체 메뉴 버튼 (≡) - 클릭하여 전체 메뉴 모달 열기</li>
            <li>사용자 정보 드롭다운 - 설정, 메시지함, 로그아웃</li>
            <li>담당자 연락처 - 부서별 연락처 정보</li>
            <li>원격 지원 - 외부 링크 새 창 열기</li>
          </ul>
        </div>
        
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
  </MainLayout>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useThemeStore } from '@stores/theme'
  import Button from 'primevue/button'
  import InputText from 'primevue/inputtext'
  import MainLayout from '@/layouts/MainLayout.vue'
  import HeaderComponent from '@/components/HeaderComponent.vue'

  const themeStore = useThemeStore()
  const testInput = ref('')
  
  const isDark = computed(() => themeStore.isDark)
  const toggleTheme = () => themeStore.toggleTheme()
  
  // 컴포넌트 마운트 시 테마 초기화
  themeStore.initTheme()
  
  // 헤더 이벤트 핸들러들
  const handleGlobalMenuClick = () => {
    console.log('전체 메뉴 클릭됨')
    // TODO: 전체 메뉴 모달 열기 로직 구현
  }
  
  const handleUserSettings = () => {
    console.log('사용자 설정 클릭됨')
    // TODO: 사용자 설정 페이지로 이동
  }
  
  const handleUserMessages = () => {
    console.log('메시지함 클릭됨')
    // TODO: 메시지함 페이지로 이동
  }
  
  const handleUserLogout = () => {
    console.log('로그아웃 클릭됨')
    // TODO: 로그아웃 처리
  }
  
  const handleContactOpen = () => {
    console.log('연락처 목록 열림')
  }
  
  const handleContactClose = () => {
    console.log('연락처 목록 닫힘')
  }
  
  const handleRemoteSupportClick = (url: string) => {
    console.log('원격 지원 클릭됨:', url)
  }
</script>

<style lang="scss" scoped>
  @use '@styles/mixins' as *;
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
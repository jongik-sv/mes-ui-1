<template>
  <MainLayout>
    <!-- Header 슬롯에 실제 HeaderComponent 사용 -->
    <template #header>
      <HeaderComponent
        :menu-items="menuItems"
        @menu-select="handleMenuSelect"
        @favorite-toggle="handleFavoriteToggle"
        @menu-tree-toggle="handleMenuTreeToggle"
        @global-menu-click="handleGlobalMenuClick"
        @user-settings="handleUserSettings"
        @user-messages="handleUserMessages"
        @user-logout="handleUserLogout"
        @contact-open="handleContactOpen"
        @contact-close="handleContactClose"
        @remote-support-click="handleRemoteSupportClick"
      />
    </template>

    <!-- Main 슬롯에 홈 대시보드 콘텐츠 -->
    <template #main>
      <div class="home-dashboard">
        <div class="dashboard-header">
          <h1 class="dashboard-title">MES 시스템 대시보드</h1>
          <p class="dashboard-subtitle">현재 시스템 상태와 주요 지표를 확인하세요</p>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <div class="card-header">
              <h3>생산 현황</h3>
              <i class="pi pi-chart-line"></i>
            </div>
            <div class="card-content">
              <div class="metric-value">1,234</div>
              <div class="metric-label">완료 제품</div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h3>품질 지표</h3>
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="card-content">
              <div class="metric-value">98.5%</div>
              <div class="metric-label">합격률</div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h3>설비 가동률</h3>
              <i class="pi pi-cog"></i>
            </div>
            <div class="card-content">
              <div class="metric-value">92.1%</div>
              <div class="metric-label">평균 가동률</div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header">
              <h3>재고 현황</h3>
              <i class="pi pi-box"></i>
            </div>
            <div class="card-content">
              <div class="metric-value">856</div>
              <div class="metric-label">재고 품목</div>
            </div>
          </div>
        </div>

        <div class="quick-access">
          <h2>빠른 접근</h2>
          <div class="quick-access-grid">
            <button class="quick-access-btn" @click="navigateTo('/production')">
              <i class="pi pi-play-circle"></i>
              <span>생산 관리</span>
            </button>
            <button class="quick-access-btn" @click="navigateTo('/quality')">
              <i class="pi pi-shield"></i>
              <span>품질 관리</span>
            </button>
            <button class="quick-access-btn" @click="navigateTo('/equipment')">
              <i class="pi pi-wrench"></i>
              <span>설비 관리</span>
            </button>
            <button class="quick-access-btn" @click="navigateTo('/inventory')">
              <i class="pi pi-database"></i>
              <span>재고 관리</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import type { MenuItem } from '@/types/menu'
import { useUserStore } from '@/stores/userStore'

// Router
const router = useRouter()

// Stores
const userStore = useUserStore()

// Reactive data
const menuItems = ref<MenuItem[]>([
  {
    id: '1',
    title: '생산 관리',
    icon: 'pi pi-play-circle',
    category: 'production',
    favorite: false,
    children: [
      { id: '1-1', title: '생산 계획', url: '/production/plan', icon: 'pi pi-calendar', category: 'production', favorite: false },
      { id: '1-2', title: '생산 실적', url: '/production/result', icon: 'pi pi-chart-bar', category: 'production', favorite: false }
    ]
  },
  {
    id: '2', 
    title: '품질 관리',
    icon: 'pi pi-shield',
    category: 'quality',
    favorite: false,
    children: [
      { id: '2-1', title: '검사 현황', url: '/quality/inspection', icon: 'pi pi-search', category: 'quality', favorite: false },
      { id: '2-2', title: '불량 분석', url: '/quality/defect', icon: 'pi pi-exclamation-triangle', category: 'quality', favorite: false }
    ]
  }
])

// Methods
const navigateTo = (path: string) => {
  router.push(path)
}

const handleMenuSelect = (menu: MenuItem) => {
  console.log('Menu selected:', menu)
  if (menu.url) {
    navigateTo(menu.url)
  }
}

const handleFavoriteToggle = (menuId: string) => {
  console.log('Toggle favorite:', menuId)
  // 즐겨찾기 토글 로직
}

const handleMenuTreeToggle = (isOpen: boolean) => {
  console.log('Menu tree toggled:', isOpen)
  // 메뉴트리 토글 로직 - 사이드 네비게이션 토글
}

const handleGlobalMenuClick = () => {
  console.log('Global menu clicked')
}

const handleUserSettings = () => {
  navigateTo('/settings/profile')
}

const handleUserMessages = () => {
  navigateTo('/messages')
}

const handleUserLogout = () => {
  userStore.handleLogout()
}

const handleContactOpen = () => {
  console.log('Contact list opened')
}

const handleContactClose = () => {
  console.log('Contact list closed')
}

const handleRemoteSupportClick = (url: string) => {
  console.log('Remote support clicked:', url)
  window.open(url, '_blank')
}

// Lifecycle
onMounted(() => {
  // 사용자 정보 초기화
  if (!userStore.currentUser) {
    userStore.fetchUserInfo().catch(console.error)
  }
})
</script>

<style lang="scss" scoped>
.home-dashboard {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: var(--space-8);
  text-align: center;

  .dashboard-title {
    font-size: var(--text-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .dashboard-subtitle {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin: 0;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.dashboard-card {
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  border-radius: var(--border-radius-lg);
  padding: var(--space-6);
  transition: var(--transition-normal);

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    i {
      font-size: var(--text-xl);
      color: var(--primary);
    }
  }

  .card-content {
    text-align: center;

    .metric-value {
      font-size: var(--text-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary);
      margin-bottom: var(--space-2);
    }

    .metric-label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }
  }
}

.quick-access {
  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}

.quick-access-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-secondary);
  border: 1px solid var(--surface-2);
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-normal);

  &:hover {
    border-color: var(--primary);
    background: var(--bg-tertiary);
    transform: translateY(-2px);
  }

  i {
    font-size: var(--text-2xl);
    color: var(--primary);
  }

  span {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
  }
}

// 반응형
@media (max-width: 768px) {
  .home-dashboard {
    padding: var(--space-4);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .quick-access-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }

  .quick-access-btn {
    padding: var(--space-3);
    
    i {
      font-size: var(--text-xl);
    }
    
    span {
      font-size: var(--text-sm);
    }
  }
}
</style>
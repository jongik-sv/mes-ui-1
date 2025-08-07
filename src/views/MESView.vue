<template>
  <MainLayout>
    <template #header>
      <div class="mes-header">
        <div class="header-left">
          <button class="menu-toggle-btn">
            <span class="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div class="company-logo">DONGKUK CM</div>
        </div>
        <div class="header-right">
          <div class="user-info">관리자 (admin)</div>
        </div>
      </div>
    </template>
    
    <template #toolbar>
      <div class="mes-toolbar">
        <div class="toolbar-item">
          <div class="toolbar-icon">📊</div>
          <span class="toolbar-label">대시보드</span>
        </div>
        <div class="toolbar-item">
          <div class="toolbar-icon">🏭</div>
          <span class="toolbar-label">생산관리</span>
        </div>
        <div class="toolbar-item">
          <div class="toolbar-icon">📦</div>
          <span class="toolbar-label">자재관리</span>
        </div>
        <div class="toolbar-item">
          <div class="toolbar-icon">🔧</div>
          <span class="toolbar-label">설비관리</span>
        </div>
      </div>
    </template>
    
    <template #main>
      <div class="mes-content">
        <h1>MES 시스템 대시보드</h1>
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>생산 현황</h3>
            <p class="metric">오늘 생산량: <strong>1,234 EA</strong></p>
            <p class="metric">목표 달성률: <strong>87%</strong></p>
          </div>
          
          <div class="dashboard-card">
            <h3>설비 상태</h3>
            <p class="metric">가동 중: <strong>12대</strong></p>
            <p class="metric">점검 중: <strong>2대</strong></p>
          </div>
          
          <div class="dashboard-card">
            <h3>품질 지표</h3>
            <p class="metric">불량률: <strong>0.8%</strong></p>
            <p class="metric">수율: <strong>99.2%</strong></p>
          </div>
          
          <div class="dashboard-card">
            <h3>작업 진척도</h3>
            <p class="metric">완료: <strong>45건</strong></p>
            <p class="metric">진행 중: <strong>12건</strong></p>
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'

// MES 메인 뷰 컴포넌트 - MainLayout 사용
</script>

<style lang="scss" scoped>
@use '@styles/mixins' as *;

.mes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 var(--space-4);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  
  &:hover {
    background: var(--surface-1);
  }
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  span {
    width: 18px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 1px;
    transition: all 0.2s ease;
  }
}

.company-logo {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--primary);
}

.user-info {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.mes-toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--surface-1);
    transform: translateY(-2px);
  }
}

.toolbar-icon {
  font-size: var(--icon-xl);
  margin-bottom: var(--space-1);
}

.toolbar-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-align: center;
  white-space: nowrap;
}

.mes-content {
  padding: var(--space-6);
  height: 100%;
  overflow-y: auto;
  
  h1 {
    margin-bottom: var(--space-6);
    color: var(--text-primary);
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.dashboard-card {
  @include card;
  padding: var(--space-6);
  
  h3 {
    margin-bottom: var(--space-4);
    color: var(--text-primary);
    font-size: var(--text-lg);
  }
  
  .metric {
    margin-bottom: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    
    strong {
      color: var(--primary);
      font-weight: 600;
    }
  }
}
</style>
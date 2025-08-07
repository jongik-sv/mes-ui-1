<template>
  <div class="typography-demo p-6">
    <div class="mb-8">
      <h1 class="mes-heading-1 mb-4">타이포그래피 및 아이콘 시스템 데모</h1>
      <p class="mes-body text-text-secondary">
        MES UI 프레임워크의 타이포그래피 시스템과 아이콘 시스템을 확인할 수 있는 데모 페이지입니다.
      </p>
    </div>

    <!-- 타이포그래피 섹션 -->
    <section class="mb-12">
      <h2 class="mes-heading-2 mb-6">타이포그래피 시스템</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 제목 스타일 -->
        <div class="space-y-4">
          <h3 class="mes-heading-3 mb-4">제목 스타일</h3>
          <div class="space-y-3">
            <div>
              <h1 class="mes-heading-1">Heading 1 - 큰 제목</h1>
              <code class="text-xs text-text-muted">.mes-heading-1</code>
            </div>
            <div>
              <h2 class="mes-heading-2">Heading 2 - 중간 제목</h2>
              <code class="text-xs text-text-muted">.mes-heading-2</code>
            </div>
            <div>
              <h3 class="mes-heading-3">Heading 3 - 작은 제목</h3>
              <code class="text-xs text-text-muted">.mes-heading-3</code>
            </div>
          </div>
        </div>

        <!-- 본문 스타일 -->
        <div class="space-y-4">
          <h3 class="mes-heading-3 mb-4">본문 스타일</h3>
          <div class="space-y-3">
            <div>
              <p class="mes-body">기본 본문 텍스트입니다. 일반적인 내용에 사용됩니다.</p>
              <code class="text-xs text-text-muted">.mes-body</code>
            </div>
            <div>
              <p class="mes-body-sm">작은 본문 텍스트입니다. 부가 설명에 사용됩니다.</p>
              <code class="text-xs text-text-muted">.mes-body-sm</code>
            </div>
            <div>
              <p class="mes-caption">캡션 텍스트입니다. 이미지 설명이나 작은 정보에 사용됩니다.</p>
              <code class="text-xs text-text-muted">.mes-caption</code>
            </div>
            <div>
              <label class="mes-label">라벨 텍스트</label>
              <code class="text-xs text-text-muted block">.mes-label</code>
            </div>
          </div>
        </div>
      </div>

      <!-- 특수 폰트 -->
      <div class="mt-8">
        <h3 class="mes-heading-3 mb-4">특수 폰트</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="mes-data-text">데이터 텍스트: 12345.67</p>
            <code class="text-xs text-text-muted">.mes-data-text (JetBrains Mono)</code>
          </div>
          <div>
            <p class="mes-barcode-text">123456789</p>
            <code class="text-xs text-text-muted">.mes-barcode-text (Libre Barcode 39)</code>
          </div>
        </div>
      </div>
    </section>

    <!-- 아이콘 섹션 -->
    <section class="mb-12">
      <h2 class="mes-heading-2 mb-6">아이콘 시스템</h2>
      
      <!-- 아이콘 크기 -->
      <div class="mb-8">
        <h3 class="mes-heading-3 mb-4">아이콘 크기</h3>
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2">
            <MesIcon name="home" size="xs" />
            <span class="text-sm">xs (12px)</span>
          </div>
          <div class="flex items-center gap-2">
            <MesIcon name="home" size="sm" />
            <span class="text-sm">sm (16px)</span>
          </div>
          <div class="flex items-center gap-2">
            <MesIcon name="home" size="md" />
            <span class="text-sm">md (20px)</span>
          </div>
          <div class="flex items-center gap-2">
            <MesIcon name="home" size="lg" />
            <span class="text-sm">lg (24px)</span>
          </div>
          <div class="flex items-center gap-2">
            <MesIcon name="home" size="xl" />
            <span class="text-sm">xl (32px)</span>
          </div>
          <div class="flex items-center gap-2">
            <MesIcon name="home" size="2xl" />
            <span class="text-sm">2xl (40px)</span>
          </div>
        </div>
      </div>

      <!-- 비즈니스 아이콘 -->
      <div class="mb-8">
        <h3 class="mes-heading-3 mb-4">비즈니스 아이콘</h3>
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
          <div v-for="icon in businessIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 border border-surface-2 rounded-lg">
            <MesIcon :name="icon" size="lg" />
            <span class="text-xs text-center">{{ icon }}</span>
          </div>
        </div>
      </div>

      <!-- 네비게이션 아이콘 -->
      <div class="mb-8">
        <h3 class="mes-heading-3 mb-4">네비게이션 아이콘</h3>
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div v-for="icon in navigationIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 border border-surface-2 rounded-lg">
            <MesIcon :name="icon" size="lg" />
            <span class="text-xs text-center">{{ icon }}</span>
          </div>
        </div>
      </div>

      <!-- 액션 아이콘 -->
      <div class="mb-8">
        <h3 class="mes-heading-3 mb-4">액션 아이콘</h3>
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div v-for="icon in actionIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 border border-surface-2 rounded-lg">
            <MesIcon :name="icon" size="lg" />
            <span class="text-xs text-center">{{ icon }}</span>
          </div>
        </div>
      </div>

      <!-- 상태 아이콘 -->
      <div class="mb-8">
        <h3 class="mes-heading-3 mb-4">상태 아이콘</h3>
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4">
          <div v-for="icon in statusIcons" :key="icon" class="flex flex-col items-center gap-2 p-3 border border-surface-2 rounded-lg">
            <MesIcon :name="icon" size="lg" />
            <span class="text-xs text-center">{{ icon }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 사용 예시 -->
    <section class="mb-12">
      <h2 class="mes-heading-2 mb-6">사용 예시</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 버튼 예시 -->
        <div class="space-y-4">
          <h3 class="mes-heading-3">버튼과 아이콘</h3>
          <div class="space-y-3">
            <button class="mes-button mes-button--primary flex items-center gap-2">
              <MesIcon name="add" size="sm" />
              <span class="mes-button-text">새로 만들기</span>
            </button>
            <button class="mes-button mes-button--secondary flex items-center gap-2">
              <MesIcon name="edit" size="sm" />
              <span class="mes-button-text">수정하기</span>
            </button>
            <button class="mes-button mes-button--danger flex items-center gap-2">
              <MesIcon name="delete" size="sm" />
              <span class="mes-button-text">삭제하기</span>
            </button>
          </div>
        </div>

        <!-- 상태 표시 예시 -->
        <div class="space-y-4">
          <h3 class="mes-heading-3">상태 표시</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <MesIcon name="success" size="sm" class="text-success" />
              <span class="mes-body">작업이 성공적으로 완료되었습니다.</span>
            </div>
            <div class="flex items-center gap-2">
              <MesIcon name="warning" size="sm" class="text-warning" />
              <span class="mes-body">주의가 필요한 상황입니다.</span>
            </div>
            <div class="flex items-center gap-2">
              <MesIcon name="error" size="sm" class="text-error" />
              <span class="mes-body">오류가 발생했습니다.</span>
            </div>
            <div class="flex items-center gap-2">
              <MesIcon name="info" size="sm" class="text-info" />
              <span class="mes-body">추가 정보를 확인하세요.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useIcons } from '@/composables/useIcons'

const { getIconsByCategory } = useIcons()
const iconCategories = getIconsByCategory()

const businessIcons = iconCategories.business
const navigationIcons = iconCategories.navigation
const actionIcons = iconCategories.action
const statusIcons = iconCategories.status
</script>

<style scoped>
.typography-demo {
  max-width: 1200px;
  margin: 0 auto;
}

/* 상태별 색상 클래스 */
.text-success {
  color: var(--success);
}

.text-warning {
  color: var(--warning);
}

.text-error {
  color: var(--error);
}

.text-info {
  color: var(--info);
}
</style>
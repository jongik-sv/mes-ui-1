<template>
  <div class="company-logo" data-testid="company-logo">
    <img 
      v-if="logoUrl" 
      :src="logoUrl" 
      :alt="companyName"
      class="logo-image"
    />
    <span 
      v-else
      class="logo-text"
      :class="`logo-text--${size}`"
    >
      {{ companyName }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_COMPANY_NAME } from '@/constants/header';

interface Props {
  /** 회사명 */
  companyName?: string;
  /** 로고 이미지 URL (선택적) */
  logoUrl?: string;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  companyName: DEFAULT_COMPANY_NAME,
  size: 'md'
});
</script>

<style lang="scss" scoped>
.company-logo {
  display: flex;
  align-items: center;
  
  .logo-image {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
  
  .logo-text {
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    
    &--sm { 
      font-size: var(--text-sm); 
    }
    
    &--md { 
      font-size: var(--text-lg); 
    }
    
    &--lg { 
      font-size: var(--text-xl); 
    }
  }
  
  @media (max-width: 768px) {
    .logo-text {
      font-size: var(--text-base);
    }
  }
}
</style>
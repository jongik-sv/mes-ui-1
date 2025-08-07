<template>
  <Button
    @click="openRemoteSupport"
    icon="pi pi-external-link"
    text
    rounded
    label="원격"
    class="remote-support-btn"
    data-testid="remote-support-button"
    :aria-label="`원격 지원 페이지 열기 (새 창)`"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { DEFAULT_REMOTE_SUPPORT_URL } from '@/constants/header';

interface Props {
  /** 원격 지원 URL */
  url?: string;
  /** 새 창으로 열기 여부 */
  openInNewTab?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  url: DEFAULT_REMOTE_SUPPORT_URL,
  openInNewTab: true
});

const emit = defineEmits<{
  click: [url: string];
}>();

const openRemoteSupport = () => {
  emit('click', props.url);
  
  if (props.openInNewTab) {
    window.open(props.url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = props.url;
  }
};
</script>

<style lang="scss" scoped>
.remote-support-btn {
  color: var(--text-primary);
  transition: var(--transition-normal);
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--primary);
  }
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
</style>
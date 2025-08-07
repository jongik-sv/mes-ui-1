<template>
  <div class="remote-support">
    <Button
      @click="openRemoteSupport"
      icon="pi pi-external-link"
      text
      rounded
      label="원격"
      class="remote-btn"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

const openRemoteSupport = () => {
  window.open('http://www.ezh.kr/notice.html', '_blank');
};
</script>

<style lang="scss" scoped>
.remote-btn {
  color: var(--text-primary, #f8fafc);
  
  &:hover {
    background: var(--bg-tertiary, #334155);
  }
}
</style>
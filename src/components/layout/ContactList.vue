<template>
  <div class="contact-list">
    <Button
      @click="toggleContactList"
      icon="pi pi-phone"
      text
      rounded
      label="담당자"
      class="contact-btn"
    />
    
    <!-- 연락처 드롭다운 (구현 예정) -->
    <div v-if="showContactList" class="contact-dropdown">
      <!-- TODO: 연락처 목록 구현 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

const showContactList = ref(false);

const toggleContactList = () => {
  showContactList.value = !showContactList.value;
};
</script>

<style lang="scss" scoped>
.contact-list {
  position: relative;
}

.contact-btn {
  color: var(--text-primary, #f8fafc);
  
  &:hover {
    background: var(--bg-tertiary, #334155);
  }
}

.contact-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: var(--space-2, 0.5rem);
  background: var(--bg-secondary, #1e293b);
  border: 1px solid var(--surface-2, #64748b);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
  z-index: 50;
  min-width: 250px;
}
</style>
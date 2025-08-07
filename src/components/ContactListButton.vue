<template>
  <div class="contact-list-button" ref="buttonRef" data-testid="contact-list-button">
    <Button
      @click="toggleContactList"
      icon="pi pi-phone"
      text
      rounded
      label="담당자"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      class="contact-btn"
      data-testid="contact-button"
    />
    
    <div 
      v-if="isOpen" 
      class="contact-popover"
      role="dialog"
      aria-labelledby="contact-title"
      data-testid="contact-popover"
    >
      <div class="contact-header">
        <h3 id="contact-title" class="contact-title">담당자 연락처</h3>
        <Button
          icon="pi pi-times"
          text
          rounded
          size="small"
          @click="closeContactList"
          aria-label="닫기"
          class="close-btn"
        />
      </div>
      
      <div class="contact-list">
        <div 
          v-for="contact in contacts" 
          :key="contact.department"
          class="contact-item"
        >
          <div class="contact-department">{{ contact.department }}</div>
          <div class="contact-details">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-phone">
              <i class="pi pi-phone" />
              <a :href="`tel:${contact.phone}`">{{ contact.phone }}</a>
            </div>
            <div v-if="contact.email" class="contact-email">
              <i class="pi pi-envelope" />
              <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Button from 'primevue/button';
import type { ContactInfo } from '@/types/header';
import { DEFAULT_CONTACTS } from '@/constants/header';

interface Props {
  /** 연락처 목록 */
  contacts?: ContactInfo[];
}

const props = withDefaults(defineProps<Props>(), {
  contacts: () => DEFAULT_CONTACTS
});

const emit = defineEmits<{
  open: [];
  close: [];
}>();

const isOpen = ref(false);
const buttonRef = ref<HTMLElement>();

const toggleContactList = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    emit('open');
  } else {
    emit('close');
  }
};

const closeContactList = () => {
  isOpen.value = false;
  emit('close');
};

// 외부 클릭 감지
const handleClickOutside = (event: Event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target as Node)) {
    closeContactList();
  }
};

// ESC 키 감지
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeContactList();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
.contact-list-button {
  position: relative;
  
  .contact-btn {
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
  
  .contact-popover {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--space-2);
    background: var(--bg-secondary);
    border: 1px solid var(--surface-2);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    width: 280px;
    z-index: 1000;
    
    .contact-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-4) var(--space-2);
      border-bottom: 1px solid var(--surface-2);
      
      .contact-title {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }
      
      .close-btn {
        color: var(--text-secondary);
        
        &:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }
      }
    }
    
    .contact-list {
      padding: var(--space-2);
      max-height: 300px;
      overflow-y: auto;
      
      .contact-item {
        padding: var(--space-3);
        border-radius: 0.375rem;
        transition: var(--transition-normal);
        
        &:hover {
          background: var(--bg-tertiary);
        }
        
        &:not(:last-child) {
          margin-bottom: var(--space-2);
        }
        
        .contact-department {
          font-weight: 600;
          color: var(--text-primary);
          font-size: var(--text-sm);
          margin-bottom: var(--space-1);
        }
        
        .contact-details {
          .contact-name {
            font-size: var(--text-sm);
            color: var(--text-secondary);
            margin-bottom: var(--space-1);
          }
          
          .contact-phone,
          .contact-email {
            display: flex;
            align-items: center;
            gap: var(--gap-sm);
            font-size: var(--text-xs);
            color: var(--text-secondary);
            margin-bottom: var(--space-1);
            
            &:last-child {
              margin-bottom: 0;
            }
            
            i {
              font-size: var(--text-xs);
              color: var(--primary);
            }
            
            a {
              color: var(--text-secondary);
              text-decoration: none;
              transition: var(--transition-normal);
              
              &:hover {
                color: var(--primary);
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .contact-popover {
      right: -50px;
      width: 260px;
    }
  }
}
</style>
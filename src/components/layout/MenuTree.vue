<template>
  <div class="menu-tree" :class="mode">
    <div class="tree-controls">
      <Button 
        icon="pi pi-plus"
        text
        size="small"
        @click="expandAll"
        label="전체 펼침"
      />
      <Button 
        icon="pi pi-minus"
        text
        size="small"
        @click="collapseAll"
        label="전체 접기"
      />
    </div>
    
    <Tree
      :value="nodes"
      :expandedKeys="expandedKeys"
      :selectionKeys="selectionKeys"
      selectionMode="single"
      @node-expand="onNodeExpand"
      @node-collapse="onNodeCollapse"
      @node-select="onNodeSelect"
    >
      <template #default="{ node }">
        <div class="tree-node-header">
          <i 
            v-if="node.icon" 
            :class="node.icon"
            class="node-icon"
          />
          <span>{{ node.label }}</span>
          <Button
            v-if="!node.leaf"
            :icon="node.isFavorite ? 'pi pi-star-fill' : 'pi pi-star'"
            text
            rounded
            size="small"
            @click.stop="toggleFavorite(node)"
            class="favorite-btn"
          />
        </div>
      </template>
    </Tree>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Tree from 'primevue/tree';

interface Props {
  nodes: any[];
  mode: 'sidebar' | 'overlay' | 'fullscreen';
}

defineProps<Props>();
defineEmits(['menu-select']);

const expandedKeys = ref({});
const selectionKeys = ref({});

const onNodeExpand = (node: any) => {
  expandedKeys.value[node.key] = true;
};

const onNodeCollapse = (node: any) => {
  delete expandedKeys.value[node.key];
};

const onNodeSelect = (node: any) => {
  if (node.leaf && node.url) {
    // emit('menu-select', node);
  }
};

const expandAll = () => {
  // TODO: 전체 펼침 구현
};

const collapseAll = () => {
  expandedKeys.value = {};
};

const toggleFavorite = (node: any) => {
  // TODO: 즐겨찾기 토글 구현
};
</script>

<style lang="scss" scoped>
.menu-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &.sidebar {
    width: var(--menu-tree-width, 280px);
  }
  
  &.overlay {
    width: 100%;
  }
  
  &.fullscreen {
    width: 100%;
    height: 100%;
  }
}

.tree-controls {
  display: flex;
  gap: var(--space-2, 0.5rem);
  margin-bottom: var(--space-4, 1rem);
  padding: var(--space-2, 0.5rem);
  border-bottom: 1px solid var(--surface-2, #64748b);
}

.tree-node-header {
  display: flex;
  align-items: center;
  gap: var(--space-2, 0.5rem);
  width: 100%;
}

.node-icon {
  color: var(--text-secondary, #e2e8f0);
}

.favorite-btn {
  margin-left: auto;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
}
</style>
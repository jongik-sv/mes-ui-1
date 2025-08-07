import { ref, computed } from 'vue';

export interface ToolbarIcon {
  id: string;
  label: string;
  iconName: string;
}

export function useToolbar() {
  // 상태
  const activeIcon = ref<string>('home');
  const selectedCategory = ref<string | null>(null);
  
  // 툴바 아이콘 데이터
  const toolbarIcons: ToolbarIcon[] = [
    { id: 'home', label: '홈', iconName: 'pi pi-home' },
    { id: 'production', label: '생산', iconName: 'pi pi-cog' },
    { id: 'quality', label: '품질', iconName: 'pi pi-shield' },
    { id: 'equipment', label: '설비', iconName: 'pi pi-wrench' },
    { id: 'inventory', label: '재고', iconName: 'pi pi-box' },
    { id: 'planning', label: '계획', iconName: 'pi pi-calendar' },
    { id: 'reporting', label: '보고서', iconName: 'pi pi-chart-bar' }
  ];
  
  // 선택된 카테고리의 메뉴들 (임시 데이터)
  const selectedCategoryMenus = computed(() => {
    if (!selectedCategory.value) return [];
    
    // TODO: 실제 메뉴 데이터로 교체
    return [
      {
        key: '1',
        label: `${selectedCategory.value} 메뉴 1`,
        leaf: true,
        url: '/menu1'
      },
      {
        key: '2',
        label: `${selectedCategory.value} 메뉴 2`,
        leaf: true,
        url: '/menu2'
      }
    ];
  });
  
  // 아이콘 클릭 핸들러
  const handleIconClick = (icon: ToolbarIcon) => {
    activeIcon.value = icon.id;
    selectedCategory.value = icon.id;
  };
  
  return {
    toolbarIcons,
    activeIcon,
    selectedCategory,
    selectedCategoryMenus,
    handleIconClick
  };
}
import type { 
  BusinessIconName, 
  NavigationIconName, 
  ActionIconName, 
  StatusIconName,
  MesIconName,
  IconMapping 
} from '@/types/icons'

// MES 특화 아이콘 매핑
const businessIcons: IconMapping = {
  home: 'Home',
  production: 'Factory',
  quality: 'ShieldCheck',
  equipment: 'Settings',
  inventory: 'Package',
  planning: 'Calendar',
  reporting: 'BarChart3',
  maintenance: 'Wrench',
  logistics: 'Truck'
}

const navigationIcons: IconMapping = {
  menu: 'Menu',
  search: 'Search',
  expand: 'ChevronDown',
  collapse: 'ChevronUp',
  close: 'X',
  back: 'ArrowLeft',
  forward: 'ArrowRight',
  refresh: 'RefreshCw'
}

const actionIcons: IconMapping = {
  add: 'Plus',
  edit: 'Pencil',
  delete: 'Trash2',
  save: 'Save',
  copy: 'Copy',
  download: 'Download',
  upload: 'Upload',
  print: 'Printer'
}

const statusIcons: IconMapping = {
  success: 'CheckCircle',
  warning: 'AlertTriangle',
  error: 'XCircle',
  info: 'Info',
  loading: 'Loader2',
  online: 'Wifi',
  offline: 'WifiOff'
}

// 전체 아이콘 매핑 통합
const allIcons: IconMapping = {
  ...businessIcons,
  ...navigationIcons,
  ...actionIcons,
  ...statusIcons
}

export function useIcons() {
  /**
   * 일반적인 아이콘 이름을 Lucide 아이콘 이름으로 변환
   */
  const getIcon = (name: string): string => {
    return allIcons[name] || 'HelpCircle'
  }

  /**
   * 비즈니스 아이콘 매핑
   */
  const getBusinessIcon = (name: BusinessIconName): string => {
    return businessIcons[name] || 'HelpCircle'
  }

  /**
   * 네비게이션 아이콘 매핑
   */
  const getNavigationIcon = (name: NavigationIconName): string => {
    return navigationIcons[name] || 'HelpCircle'
  }

  /**
   * 액션 아이콘 매핑
   */
  const getActionIcon = (name: ActionIconName): string => {
    return actionIcons[name] || 'HelpCircle'
  }

  /**
   * 상태 아이콘 매핑
   */
  const getStatusIcon = (name: StatusIconName): string => {
    return statusIcons[name] || 'HelpCircle'
  }

  /**
   * 아이콘 검색 기능
   */
  const searchIcons = (query: string): string[] => {
    const lowerQuery = query.toLowerCase()
    return Object.keys(allIcons).filter(key => 
      key.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 모든 사용 가능한 아이콘 목록 반환
   */
  const getAllIcons = (): string[] => {
    return Object.keys(allIcons)
  }

  /**
   * 아이콘 카테고리별 목록 반환
   */
  const getIconsByCategory = () => {
    return {
      business: Object.keys(businessIcons),
      navigation: Object.keys(navigationIcons),
      action: Object.keys(actionIcons),
      status: Object.keys(statusIcons)
    }
  }

  /**
   * 아이콘이 존재하는지 확인
   */
  const hasIcon = (name: string): boolean => {
    return name in allIcons
  }

  return {
    getIcon,
    getBusinessIcon,
    getNavigationIcon,
    getActionIcon,
    getStatusIcon,
    searchIcons,
    getAllIcons,
    getIconsByCategory,
    hasIcon
  }
}
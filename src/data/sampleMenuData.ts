import type { MenuItem } from '@/types/menu'

export const sampleMenuData: MenuItem[] = [
  // 생산관리 그룹
  {
    id: 'production-1',
    title: '생산계획',
    category: 'production',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'production-1-1',
        title: '일일생산계획',
        category: 'production',
        level: 2,
        isFavorite: false,
        url: '/production/daily-plan',
        icon: 'pi pi-calendar'
      },
      {
        id: 'production-1-2',
        title: '주간생산계획',
        category: 'production',
        level: 2,
        isFavorite: true,
        url: '/production/weekly-plan',
        icon: 'pi pi-calendar-plus'
      },
      {
        id: 'production-1-3',
        title: '월간생산계획',
        category: 'production',
        level: 2,
        isFavorite: false,
        url: '/production/monthly-plan',
        icon: 'pi pi-calendar-times'
      }
    ]
  },
  {
    id: 'production-2',
    title: '생산실적',
    category: 'production',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'production-2-1',
        title: '일일생산실적',
        category: 'production',
        level: 2,
        isFavorite: false,
        url: '/production/daily-result',
        icon: 'pi pi-chart-bar'
      },
      {
        id: 'production-2-2',
        title: '주간생산실적',
        category: 'production',
        level: 2,
        isFavorite: false,
        url: '/production/weekly-result',
        icon: 'pi pi-chart-line'
      }
    ]
  },
  {
    id: 'production-3',
    title: '작업지시',
    category: 'production',
    level: 1,
    isFavorite: true,
    children: [
      {
        id: 'production-3-1',
        title: '작업지시서발행',
        category: 'production',
        level: 2,
        isFavorite: false,
        url: '/production/work-order',
        icon: 'pi pi-file-edit'
      },
      {
        id: 'production-3-2',
        title: '작업지시현황',
        category: 'production',
        level: 2,
        isFavorite: false,
        url: '/production/work-status',
        icon: 'pi pi-list'
      }
    ]
  },

  // 품질관리 그룹
  {
    id: 'quality-1',
    title: '품질검사',
    category: 'quality',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'quality-1-1',
        title: '입고검사',
        category: 'quality',
        level: 2,
        isFavorite: false,
        url: '/quality/incoming-inspection',
        icon: 'pi pi-check-circle'
      },
      {
        id: 'quality-1-2',
        title: '공정검사',
        category: 'quality',
        level: 2,
        isFavorite: false,
        url: '/quality/process-inspection',
        icon: 'pi pi-cog'
      },
      {
        id: 'quality-1-3',
        title: '출하검사',
        category: 'quality',
        level: 2,
        isFavorite: true,
        url: '/quality/outgoing-inspection',
        icon: 'pi pi-send'
      }
    ]
  },
  {
    id: 'quality-2',
    title: '품질분석',
    category: 'quality',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'quality-2-1',
        title: '불량분석',
        category: 'quality',
        level: 2,
        isFavorite: false,
        url: '/quality/defect-analysis',
        icon: 'pi pi-exclamation-triangle'
      },
      {
        id: 'quality-2-2',
        title: '품질통계',
        category: 'quality',
        level: 2,
        isFavorite: false,
        url: '/quality/statistics',
        icon: 'pi pi-chart-pie'
      }
    ]
  },

  // 자재관리 그룹
  {
    id: 'material-1',
    title: '자재입고',
    category: 'material',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'material-1-1',
        title: '입고등록',
        category: 'material',
        level: 2,
        isFavorite: false,
        url: '/material/receiving',
        icon: 'pi pi-plus-circle'
      },
      {
        id: 'material-1-2',
        title: '입고현황',
        category: 'material',
        level: 2,
        isFavorite: false,
        url: '/material/receiving-status',
        icon: 'pi pi-list'
      }
    ]
  },
  {
    id: 'material-2',
    title: '재고관리',
    category: 'material',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'material-2-1',
        title: '재고현황',
        category: 'material',
        level: 2,
        isFavorite: true,
        url: '/material/inventory-status',
        icon: 'pi pi-box'
      },
      {
        id: 'material-2-2',
        title: '재고조정',
        category: 'material',
        level: 2,
        isFavorite: false,
        url: '/material/inventory-adjustment',
        icon: 'pi pi-pencil'
      },
      {
        id: 'material-2-3',
        title: '안전재고관리',
        category: 'material',
        level: 2,
        isFavorite: false,
        url: '/material/safety-stock',
        icon: 'pi pi-shield'
      }
    ]
  },

  // 설비관리 그룹
  {
    id: 'maintenance-1',
    title: '설비점검',
    category: 'maintenance',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'maintenance-1-1',
        title: '일상점검',
        category: 'maintenance',
        level: 2,
        isFavorite: false,
        url: '/maintenance/daily-check',
        icon: 'pi pi-eye'
      },
      {
        id: 'maintenance-1-2',
        title: '정기점검',
        category: 'maintenance',
        level: 2,
        isFavorite: false,
        url: '/maintenance/periodic-check',
        icon: 'pi pi-calendar'
      }
    ]
  },
  {
    id: 'maintenance-2',
    title: '설비수리',
    category: 'maintenance',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'maintenance-2-1',
        title: '수리요청',
        category: 'maintenance',
        level: 2,
        isFavorite: false,
        url: '/maintenance/repair-request',
        icon: 'pi pi-wrench'
      },
      {
        id: 'maintenance-2-2',
        title: '수리현황',
        category: 'maintenance',
        level: 2,
        isFavorite: false,
        url: '/maintenance/repair-status',
        icon: 'pi pi-cog'
      }
    ]
  },

  // 영업관리 그룹
  {
    id: 'sales-1',
    title: '주문관리',
    category: 'sales',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'sales-1-1',
        title: '주문등록',
        category: 'sales',
        level: 2,
        isFavorite: false,
        url: '/sales/order-registration',
        icon: 'pi pi-plus'
      },
      {
        id: 'sales-1-2',
        title: '주문현황',
        category: 'sales',
        level: 2,
        isFavorite: false,
        url: '/sales/order-status',
        icon: 'pi pi-list'
      }
    ]
  },
  {
    id: 'sales-2',
    title: '출하관리',
    category: 'sales',
    level: 1,
    isFavorite: false,
    children: [
      {
        id: 'sales-2-1',
        title: '출하계획',
        category: 'sales',
        level: 2,
        isFavorite: false,
        url: '/sales/shipping-plan',
        icon: 'pi pi-calendar'
      },
      {
        id: 'sales-2-2',
        title: '출하실적',
        category: 'sales',
        level: 2,
        isFavorite: false,
        url: '/sales/shipping-result',
        icon: 'pi pi-truck'
      }
    ]
  }
]
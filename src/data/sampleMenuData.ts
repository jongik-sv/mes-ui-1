import type { MenuItem, MenuCategory } from '@/types/menu'

// JSP 파일의 카테고리 구조에 맞는 카테고리 정의
export const menuCategories: MenuCategory[] = [
  { id: 'all', name: '전체메뉴', code: '', order: 0, active: true },
  { id: 'C10', name: '품질설계', code: 'C10', order: 1, active: false },
  { id: 'M20', name: '품질판정', code: 'M20', order: 2, active: false },
  { id: 'M17', name: '생산관제', code: 'M17', order: 3, active: false },
  { id: 'M47', name: '조업관리', code: 'M47', order: 4, active: false },
  { id: 'M42', name: '원재료관리', code: 'M42', order: 5, active: false },
  { id: 'M30', name: '부재료관리', code: 'M30', order: 6, active: false },
  { id: 'M26', name: '구내운송', code: 'M26', order: 7, active: false },
  { id: 'M77', name: '야드관리', code: 'M77', order: 8, active: false },
  { id: 'M60', name: '출하관제', code: 'M60', order: 9, active: false },
  { id: 'M80', name: '통합관제', code: 'M80', order: 10, active: false },
  { id: 'M90', name: '공통관리', code: 'M90', order: 11, active: false }
]

// JSP 구조에 맞는 메뉴 데이터 (3단계 구조: 모듈 > 메뉴 > 페이지)
export const sampleMenuData: MenuItem[] = [
  // 품질설계 (C10)
  {
    id: 'C10',
    text: '품질설계',
    level: 1,
    categoryCode: 'C10',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'C10-M01',
        text: '품질기준관리',
        level: 2,
        categoryCode: 'C10',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'C10-M01-P01',
            text: '품질기준등록',
            level: 3,
            categoryCode: 'C10',
            url: '/quality-design/standard-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'C10001', bookmarked: 'N' }
          },
          {
            id: 'C10-M01-P02',
            text: '품질기준조회',
            level: 3,
            categoryCode: 'C10',
            url: '/quality-design/standard-inquiry',
            bookmarked: true,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'C10002', bookmarked: 'Y' }
          }
        ]
      },
      {
        id: 'C10-M02',
        text: '검사항목관리',
        level: 2,
        categoryCode: 'C10',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'C10-M02-P01',
            text: '검사항목등록',
            level: 3,
            categoryCode: 'C10',
            url: '/quality-design/inspection-item-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'C10003', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 품질판정 (M20)
  {
    id: 'M20',
    text: '품질판정',
    level: 1,
    categoryCode: 'M20',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M20-M01',
        text: '입고검사',
        level: 2,
        categoryCode: 'M20',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M20-M01-P01',
            text: '입고검사등록',
            level: 3,
            categoryCode: 'M20',
            url: '/quality-judgment/incoming-inspection-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M20001', bookmarked: 'N' }
          },
          {
            id: 'M20-M01-P02',
            text: '입고검사현황',
            level: 3,
            categoryCode: 'M20',
            url: '/quality-judgment/incoming-inspection-status',
            bookmarked: true,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M20002', bookmarked: 'Y' }
          }
        ]
      },
      {
        id: 'M20-M02',
        text: '공정검사',
        level: 2,
        categoryCode: 'M20',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M20-M02-P01',
            text: '공정검사등록',
            level: 3,
            categoryCode: 'M20',
            url: '/quality-judgment/process-inspection-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M20003', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 생산관제 (M17)
  {
    id: 'M17',
    text: '생산관제',
    level: 1,
    categoryCode: 'M17',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M17-M01',
        text: '생산계획',
        level: 2,
        categoryCode: 'M17',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M17-M01-P01',
            text: '일일생산계획',
            level: 3,
            categoryCode: 'M17',
            url: '/production-control/daily-plan',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M17001', bookmarked: 'N' }
          },
          {
            id: 'M17-M01-P02',
            text: '주간생산계획',
            level: 3,
            categoryCode: 'M17',
            url: '/production-control/weekly-plan',
            bookmarked: true,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M17002', bookmarked: 'Y' }
          }
        ]
      },
      {
        id: 'M17-M02',
        text: '생산실적',
        level: 2,
        categoryCode: 'M17',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M17-M02-P01',
            text: '생산실적등록',
            level: 3,
            categoryCode: 'M17',
            url: '/production-control/result-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M17003', bookmarked: 'N' }
          },
          {
            id: 'M17-M02-P02',
            text: '생산실적현황',
            level: 3,
            categoryCode: 'M17',
            url: '/production-control/result-status',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M17004', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 조업관리 (M47)
  {
    id: 'M47',
    text: '조업관리',
    level: 1,
    categoryCode: 'M47',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M47-M01',
        text: '작업지시',
        level: 2,
        categoryCode: 'M47',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M47-M01-P01',
            text: '작업지시서발행',
            level: 3,
            categoryCode: 'M47',
            url: '/operation-management/work-order-issue',
            bookmarked: true,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M47001', bookmarked: 'Y' }
          },
          {
            id: 'M47-M01-P02',
            text: '작업지시현황',
            level: 3,
            categoryCode: 'M47',
            url: '/operation-management/work-order-status',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M47002', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 원재료관리 (M42)
  {
    id: 'M42',
    text: '원재료관리',
    level: 1,
    categoryCode: 'M42',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M42-M01',
        text: '원재료입고',
        level: 2,
        categoryCode: 'M42',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M42-M01-P01',
            text: '원재료입고등록',
            level: 3,
            categoryCode: 'M42',
            url: '/raw-material/receiving-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M42001', bookmarked: 'N' }
          },
          {
            id: 'M42-M01-P02',
            text: '원재료입고현황',
            level: 3,
            categoryCode: 'M42',
            url: '/raw-material/receiving-status',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M42002', bookmarked: 'N' }
          }
        ]
      },
      {
        id: 'M42-M02',
        text: '원재료재고',
        level: 2,
        categoryCode: 'M42',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M42-M02-P01',
            text: '원재료재고현황',
            level: 3,
            categoryCode: 'M42',
            url: '/raw-material/inventory-status',
            bookmarked: true,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M42003', bookmarked: 'Y' }
          }
        ]
      }
    ]
  },

  // 부재료관리 (M30)
  {
    id: 'M30',
    text: '부재료관리',
    level: 1,
    categoryCode: 'M30',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M30-M01',
        text: '부재료입고',
        level: 2,
        categoryCode: 'M30',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M30-M01-P01',
            text: '부재료입고등록',
            level: 3,
            categoryCode: 'M30',
            url: '/sub-material/receiving-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M30001', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 구내운송 (M26)
  {
    id: 'M26',
    text: '구내운송',
    level: 1,
    categoryCode: 'M26',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M26-M01',
        text: '운송계획',
        level: 2,
        categoryCode: 'M26',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M26-M01-P01',
            text: '운송계획등록',
            level: 3,
            categoryCode: 'M26',
            url: '/internal-transport/plan-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M26001', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 야드관리 (M77)
  {
    id: 'M77',
    text: '야드관리',
    level: 1,
    categoryCode: 'M77',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M77-M01',
        text: '야드현황',
        level: 2,
        categoryCode: 'M77',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M77-M01-P01',
            text: '야드재고현황',
            level: 3,
            categoryCode: 'M77',
            url: '/yard-management/inventory-status',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M77001', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 출하관제 (M60)
  {
    id: 'M60',
    text: '출하관제',
    level: 1,
    categoryCode: 'M60',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M60-M01',
        text: '출하계획',
        level: 2,
        categoryCode: 'M60',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M60-M01-P01',
            text: '출하계획등록',
            level: 3,
            categoryCode: 'M60',
            url: '/shipping-control/plan-registration',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M60001', bookmarked: 'N' }
          },
          {
            id: 'M60-M01-P02',
            text: '출하계획현황',
            level: 3,
            categoryCode: 'M60',
            url: '/shipping-control/plan-status',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M60002', bookmarked: 'N' }
          }
        ]
      }
    ]
  },

  // 통합관제 (M80)
  {
    id: 'M80',
    text: '통합관제',
    level: 1,
    categoryCode: 'M80',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M80-M01',
        text: '통합모니터링',
        level: 2,
        categoryCode: 'M80',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M80-M01-P01',
            text: '실시간모니터링',
            level: 3,
            categoryCode: 'M80',
            url: '/integrated-control/realtime-monitoring',
            bookmarked: true,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M80001', bookmarked: 'Y' }
          }
        ]
      }
    ]
  },

  // 공통관리 (M90)
  {
    id: 'M90',
    text: '공통관리',
    level: 1,
    categoryCode: 'M90',
    bookmarked: false,
    isAuth: true,
    hasItems: true,
    items: [
      {
        id: 'M90-M01',
        text: '시스템관리',
        level: 2,
        categoryCode: 'M90',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M90-M01-P01',
            text: '사용자관리',
            level: 3,
            categoryCode: 'M90',
            url: '/common-management/user-management',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M90001', bookmarked: 'N' }
          },
          {
            id: 'M90-M01-P02',
            text: '권한관리',
            level: 3,
            categoryCode: 'M90',
            url: '/common-management/authority-management',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M90002', bookmarked: 'N' }
          }
        ]
      },
      {
        id: 'M90-M02',
        text: '코드관리',
        level: 2,
        categoryCode: 'M90',
        bookmarked: false,
        isAuth: true,
        hasItems: true,
        items: [
          {
            id: 'M90-M02-P01',
            text: '공통코드관리',
            level: 3,
            categoryCode: 'M90',
            url: '/common-management/common-code',
            bookmarked: false,
            isAuth: true,
            hasItems: false,
            userdata: { programId: 'M90003', bookmarked: 'N' }
          }
        ]
      }
    ]
  }
]
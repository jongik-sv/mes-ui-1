import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@views/HomeView.vue'),
    meta: {
      title: 'MES UI Framework'
    }
  },
  {
    path: '/mes',
    name: 'MES',
    component: () => import('@views/MESView.vue'),
    meta: {
      title: 'MES 시스템',
      requiresAuth: true
    }
  },
  {
    path: '/typography-demo',
    name: 'TypographyDemo',
    component: () => import('@views/TypographyDemo.vue'),
    meta: {
      title: '타이포그래피 및 아이콘 데모'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 라우터 가드
router.beforeEach((to, _from, next) => {
  // 페이지 타이틀 설정
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  
  // 인증이 필요한 페이지 체크 (추후 구현)
  if (to.meta?.requiresAuth) {
    // TODO: 인증 체크 로직 구현
    console.log('Authentication check required for:', to.path)
  }
  
  next()
})

export default router
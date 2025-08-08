import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from './router'
import App from './App.vue'

// MES UI 컴포넌트
import MesIcon from './components/ui/MesIcon.vue'

// 전역 스타일 import
import './styles/global.scss'
import './styles/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

// Pinia 상태 관리
app.use(createPinia())

// Vue Router
app.use(router)

// PrimeVue UI 라이브러리
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})

// MES UI 컴포넌트 전역 등록
app.component('MesIcon', MesIcon)

app.mount('#app')
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import router from './router'
import App from './App.vue'

// MES UI 컴포넌트
import MesIcon from './components/ui/MesIcon.vue'

// 전역 스타일 import
import './styles/global.scss'
import './styles/main.css'
import 'primevue/resources/themes/aura-dark-blue/theme.css'
import 'primevue/resources/primevue.min.css'
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
    preset: 'aura',
    options: {
      darkModeSelector: '[data-theme="dark"]'
    }
  }
})

// MES UI 컴포넌트 전역 등록
app.component('MesIcon', MesIcon)

app.mount('#app')
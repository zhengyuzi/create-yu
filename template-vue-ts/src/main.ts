import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'virtual:svg-icons-register'
import 'virtual:uno.css'

createApp(App).use(router).mount('#app')

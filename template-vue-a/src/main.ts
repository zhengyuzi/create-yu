import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'virtual:uno.css'

// https://unocss.dev/guide/style-reset
import '@unocss/reset/tailwind-compat.css'

createApp(App).use(router).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

// Axios defaults
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'
axios.defaults.withCredentials = true

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/views/home.vue'

const routes = [{ path: '/', component: Home }]

export default createRouter({
  history: createWebHistory(),
  routes
})

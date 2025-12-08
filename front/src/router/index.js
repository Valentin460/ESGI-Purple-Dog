import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
  },
  {
    path: '/profile/userProfile',
    name: 'UserProfile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/auth/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/Categories.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

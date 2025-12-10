import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
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
    component: () => import('../views/RegisterParticular.vue')
  },
  {
    path: '/auth/register/particulier',
    name: 'RegisterParticulier',
    component: () => import('../views/RegisterParticular.vue')
  },
  {
    path: '/auth/register/professionnel',
    name: 'RegisterProfessionnel',
    component: () => import('../views/RegisterProfessional.vue')
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
  },
  {
    path: '/pro/cgv',
    name: 'AcceptCGVProfessional',
    component: () => import('../views/acceptCgvProfessional.vue')
  },
  {
    path: '/pro/mandat',
    name: 'CaApportProfessional',
    component: () => import('../views/caApportProfessional.vue')
  },
  {
    path: '/pro/newsletter',
    name: 'NewsletterProfessional',
    component: () => import('../views/NewsletterProfessional.vue')
  },
  {
    path: '/pro/rgpd',
    name: 'RgpdProfessional',
    component: () => import('../views/RgpdProfessional.vue')
  },
  {
    path: '/newsletter',
    name: 'NewsletterParticular',
    component: () => import('../views/NewsletterParticular.vue')
  },
  {
    path: '/rgpd',
    name: 'RgpdParticular',
    component: () => import('../views/RgpdParticular.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

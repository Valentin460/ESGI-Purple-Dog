import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
import PublierObjet from '../components/PublierObjet.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PublierObjet,
      meta: {
        title: 'Publier un objet - Purple Dog'
      }
    },
    {
      path: '/publier',
      name: 'publier-objet',
      component: PublierObjet,
      meta: {
        title: 'Publier un objet - Purple Dog'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        title: 'Mon Profil'
      }
    },
    {
      path: '/profil',
      redirect: '/profile'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Purple Dog'
  next()
})

export default router

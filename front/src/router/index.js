import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
import FeedbackView from '../views/FeedbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackView,
      meta: {
        title: 'Donnez votre avis'
      }
    },
    {
      path: '/avis',
      redirect: '/feedback'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Purple Dog'
  next()
})

export default router

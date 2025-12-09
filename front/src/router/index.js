import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
//import PublierObjet from '../components/PublierObjet.vue'
//import MesObjets from '../components/MesObjets.vue'
import ProcessusAchat from '../components/ProcessusAchat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/achat-test',
      name: 'achat-test',
      component: ProcessusAchat,
      meta: {
        title: 'Test Processus d\'achat'
      }
    },
    {
      path: '/achat/:id',
      name: 'processus-achat',
      component: ProcessusAchat,
      meta: {
        title: 'Processus d\'achat'
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

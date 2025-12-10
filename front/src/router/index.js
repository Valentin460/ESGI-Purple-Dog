import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
import PublierObjet from '../components/PublierObjet.vue'
import MesObjets from '../components/MesObjets.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticleDetailClientView from '../views/ArticleDetailClientView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/publier',
      name: 'publier-objet',
      component: PublierObjet,
      meta: {
        title: 'Publier un objet'
      }
    },
    {
      path: '/mes-objets',
      name: 'mes-objets',
      component: MesObjets,
      meta: {
        title: 'Mes objets en vente'
      }
    },
    {
      path: '/objet/:id',
      name: 'article-detail',
      component: ArticleDetailView,
      meta: {
        title: 'Détails de l\'objet'
      }
    },
    {
      path: '/annonce/:id',
      name: 'article-detail-client',
      component: ArticleDetailClientView,
      meta: {
        title: 'Détails de l\'annonce'
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

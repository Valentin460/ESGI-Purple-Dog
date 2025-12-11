import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import PublierObjet from '../components/PublierObjet.vue'
import MesObjets from '../components/MesObjets.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticleDetailClientView from '../views/ArticleDetailClientView.vue'
import FeedbackView from '../views/FeedbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Purple Dog - Collection d\'Exception'
      }
    },
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

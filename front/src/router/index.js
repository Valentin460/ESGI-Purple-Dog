import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
import PublierObjet from '../components/PublierObjet.vue'
import MesObjets from '../components/MesObjets.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticleDetailClientView from '../views/ArticleDetailClientView.vue'
import RechercheView from '../views/RechercheView.vue'
import FeedbackView from '../views/FeedbackView.vue'
import AuctionWon from '../views/AuctionWon.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PublierObjet,
      meta: {
        title: 'Publier un objet - Purple Dog',
      },
    },
    {
      path: '/publier',
      name: 'publier-objet',
      component: PublierObjet,
      meta: {
        title: 'Publier un objet',
      },
    },
    {
      path: '/recherche',
      name: 'recherche',
      component: RechercheView,
      meta: {
        title: 'Rechercher un objet'
      }
    },
    {
      path: '/mes-objets',
      name: 'mes-objets',
      component: MesObjets,
      meta: {
        title: 'Mes objets en vente',
      },
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
        title: 'Mon Profil',
      },
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
    },
    {
      path: '/auction-won/:id',
      name: 'AuctionWon',
      component: AuctionWon
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: PaymentSuccess
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: {
        title: 'Dashboard Admin - Purple Dog'
      }
    },
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
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Purple Dog'
  next()
})

export default router

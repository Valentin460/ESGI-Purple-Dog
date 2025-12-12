<template>
  <div class="bg-gray-50 min-h-screen">
    <section class="max-w-6xl mx-auto px-6 py-12">
      <div class="text-center space-y-4 mb-12">
        <p class="text-sm uppercase tracking-[0.2em] text-indigo-600">Forfaits</p>
        <h1 class="text-4xl font-bold text-slate-900">Choisissez votre formule</h1>
        <p class="text-slate-600 text-lg max-w-2xl mx-auto">
          Des solutions adaptées à vos besoins, que vous soyez particulier ou professionnel
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        <!-- Forfait Particulier -->
        <div class="rounded-2xl bg-white border-2 border-slate-200 shadow-lg p-8 space-y-6">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-wide text-indigo-600">Pour les particuliers</p>
            <h2 class="text-3xl font-bold text-slate-900">Gratuit</h2>
            <p class="text-slate-600 text-sm">Accès complet à la plateforme sans frais</p>
          </div>

          <div class="py-4">
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-bold text-slate-900">0€</span>
              <span class="text-slate-600">/mois</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Mise en vente illimitée de vos objets</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Accès au réseau d'acheteurs vérifiés</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Estimation par des experts partenaires</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Suivi transparent des enchères</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Paiement sécurisé et assurance transport</p>
            </div>
          </div>

          <RouterLink to="/auth/register/particulier" class="block w-full px-5 py-3 rounded-lg bg-slate-100 text-slate-900 font-semibold text-center shadow-sm hover:bg-slate-200 transition">
            Créer un compte particulier
          </RouterLink>
        </div>

        <!-- Forfait Professionnel -->
        <div class="rounded-2xl bg-white border-2 border-indigo-500 shadow-xl p-8 space-y-6 relative">
          <div class="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
            Recommandé
          </div>

          <div class="space-y-2">
            <p class="text-xs uppercase tracking-wide text-indigo-600">Pour les professionnels</p>
            <h2 class="text-3xl font-bold text-slate-900">Premium</h2>
            <p class="text-slate-600 text-sm">Accès illimité à la plateforme</p>
          </div>

          <div class="py-4 space-y-2">
            <div class="flex items-baseline gap-1">
              <span class="text-5xl font-bold text-slate-900">49€</span>
              <span class="text-slate-600">/mois</span>
            </div>
            <div class="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
              1er mois gratuit
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700"><strong>Tout le forfait Particulier, plus :</strong></p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Compte professionnel avec SIRET</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Mise en avant prioritaire de vos objets</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Tableau de bord analytics avancé</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Support prioritaire 24/7</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Gestion d'équipe et sous-comptes</p>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-slate-700">Facturation automatisée</p>
            </div>
          </div>

          <RouterLink to="/auth/register/professionnel" class="block w-full px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-center shadow hover:bg-indigo-700 transition">
            Commencer l'essai gratuit
          </RouterLink>
        </div>
      </div>

      <!-- FAQ / Informations complémentaires -->
      <div class="mt-16 max-w-3xl mx-auto">
        <div class="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 space-y-6">
          <h3 class="text-2xl font-bold text-slate-900">Questions fréquentes</h3>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-slate-900 mb-1">Comment fonctionne l'essai gratuit ?</h4>
              <p class="text-sm text-slate-600">Les professionnels bénéficient d'un mois gratuit pour tester toutes les fonctionnalités. Aucune carte bancaire n'est requise pour commencer.</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-slate-900 mb-1">Puis-je changer de forfait ?</h4>
              <p class="text-sm text-slate-600">Oui, vous pouvez passer d'un compte particulier à professionnel à tout moment depuis votre tableau de bord.</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-slate-900 mb-1">Comment résilier mon abonnement professionnel ?</h4>
              <p class="text-sm text-slate-600">Vous pouvez annuler votre abonnement à tout moment depuis vos paramètres. Aucune pénalité, aucun engagement.</p>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200">
            <p class="text-sm text-slate-600">
              Des questions ? <RouterLink to="/contact" class="text-indigo-600 hover:text-indigo-700 font-semibold">Contactez notre équipe</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'PricingPage'
})
</script>

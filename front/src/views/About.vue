<template>
  <div class="bg-gray-50 min-h-screen">
    <section class="max-w-6xl mx-auto px-6 py-12">
      <p class="text-sm uppercase tracking-[0.2em] text-indigo-600">Qui sommes-nous ?</p>
      <h1 class="text-4xl font-bold text-slate-900 leading-tight mt-2">Purple Dog, la place de marché de confiance pour vos objets de valeur</h1>
      <p class="text-slate-600 text-lg leading-relaxed mt-4 max-w-3xl">
        Nous aidons les particuliers et professionnels à vendre mieux : des estimations claires, un réseau d'acheteurs vérifiés, et un accompagnement complet jusqu'à l'adjudication.
      </p>
    </section>

    <section class="max-w-6xl mx-auto px-6 pb-12 grid gap-8 lg:grid-cols-3">
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-3">
        <p class="text-xs uppercase tracking-wide text-indigo-600">Expertise</p>
        <h2 class="text-xl font-semibold text-slate-900">Un réseau d'experts vérifiés</h2>
        <p class="text-sm text-slate-600">Commissaires-priseurs, gemmologues, horlogers et restaurateurs partenaires pour chaque typologie d'objet.</p>
      </div>
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-3">
        <p class="text-xs uppercase tracking-wide text-indigo-600">Transparence</p>
        <h2 class="text-xl font-semibold text-slate-900">Suivi clair et sécurisé</h2>
        <p class="text-sm text-slate-600">Dossiers d'authenticité, reporting des offres, paiements protégés et assurance transport dédiée.</p>
      </div>
      <div class="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-3">
        <p class="text-xs uppercase tracking-wide text-indigo-600">Performance</p>
        <h2 class="text-xl font-semibold text-slate-900">Vendre vite et bien</h2>
        <p class="text-sm text-slate-600">Mise en avant sous 72h, enchères en ligne, acheteurs premium ciblés et délais moyens de vente réduits.</p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-6 pb-12 grid gap-10 lg:grid-cols-2 items-center">
      <div class="space-y-4">
        <p class="text-sm uppercase tracking-[0.2em] text-indigo-600">Notre mission</p>
        <h2 class="text-3xl font-bold text-slate-900 leading-tight">Créer un circuit de vente fiable, rapide et valorisant</h2>
        <p class="text-slate-600 text-base leading-relaxed">
          Purple Dog rassemble experts, vendeurs et acheteurs dans un environnement sécurisé. Nous orchestrons l'estimation, la mise en avant, la négociation et le paiement pour que chaque transaction soit simple et transparente.
        </p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-slate-800 shadow-sm">
            <p class="text-sm font-semibold">Accompagnement humain</p>
            <p class="text-sm text-slate-600">Un référent dédié suit votre dossier de A à Z.</p>
          </div>
          <div class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-slate-800 shadow-sm">
            <p class="text-sm font-semibold">Sélection rigoureuse</p>
            <p class="text-sm text-slate-600">Objets vérifiés, provenance documentée, acheteurs filtrés.</p>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-linear-to-br from-indigo-100 via-white to-emerald-50 border border-indigo-50 shadow-lg p-8 space-y-6">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-slate-900">500+</p>
            <p class="text-xs text-slate-600">Vendeurs accompagnés</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">92%</p>
            <p class="text-xs text-slate-600">Taux de succès</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">14 jours</p>
            <p class="text-xs text-slate-600">Délai moyen</p>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p class="text-xs uppercase tracking-wide text-indigo-600">Témoignage</p>
          <p class="text-sm text-slate-800">“Purple Dog a sécurisé la vente de ma collection en un temps record, avec une communication impeccable.”</p>
          <p class="text-xs text-slate-500 mt-2">— Marc, collectionneur</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/contact" class="px-5 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">Parler à un expert</RouterLink>
          <RouterLink to="/categories" class="px-5 py-3 rounded-lg border border-slate-200 text-slate-800 font-semibold bg-white shadow-sm hover:border-indigo-200 transition">Explorer les catégories</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'AboutPage'
})
</script>

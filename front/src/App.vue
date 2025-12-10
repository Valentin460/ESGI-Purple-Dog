<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="grow bg-white">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
</style>
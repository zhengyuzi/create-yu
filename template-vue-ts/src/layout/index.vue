<script setup lang="ts">
import Footer from './footer.vue'
import Header from './header.vue'
</script>

<template>
  <div class="">
    <!-- Header -->
    <Header />

    <!-- content -->
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>

    <!-- Footer -->
    <Footer />
  </div>
</template>

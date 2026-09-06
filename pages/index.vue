<template>
  <div id="home-page" class="page-wrapper home-page">
    <site-hero :title="title" :subtitle="subtitle" :image="featureImage">
      <button
        v-if="$siteConfig.newsletter.on"
        class="button is-primary"
        @click="$eventBus.emit('modal-triggered', 'newsletter-modal')"
      >
        Subscribe To Newsletter
      </button>
    </site-hero>
    <main-section theme="one-column">
      <template #default>
        <!-- All Posts -->
        <posts-grid />
      </template>
      <template #sidebar> Nothing here </template>
    </main-section>
    <news-letter-form-modal />
  </div>
</template>

<script setup>
const { $siteConfig } = useNuxtApp()
const pageStore = usePageStore()
const { title, subtitle, featureImage } = storeToRefs(pageStore)

await pageStore.set({ slug: 'home' })

useHead({ title: `Home | ${$siteConfig.siteName}` })
</script>

<style>
.home-page .under-subtitle {
  border-top: none;
}
</style>

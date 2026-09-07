<template>
  <div id="home-page" class="page-wrapper home-page">
    <site-hero
      :title="$siteConfig.siteName"
      :subtitle="$siteConfig.tagline"
      :image="$siteConfig.featureImage"
    >
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

usePageMeta({
  title: $siteConfig.siteName,
  subtitle: $siteConfig.tagline,
  image: $siteConfig.featureImage,
})
</script>

<style>
.home-page .under-subtitle {
  border-top: none;
}
</style>

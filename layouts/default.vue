<template>
  <div
    :class="`site-layout-width-${$siteConfig.layout.width} posts-theme-${$siteConfig.posts.theme}`"
  >
    <site-nav />
    <slot />
    <news-letter-slide-out v-if="$siteConfig.newsletter.on" />
    <site-footer></site-footer>
  </div>
</template>

<script setup>
import 'animate.css/animate.min.css'
import {
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  watch,
} from 'vue'

const { $siteConfig, $cms, $eventBus } = useNuxtApp()
const pageStore = usePageStore()
const route = useRoute()
const img = useImage()

const origin = useRuntimeConfig().public.siteUrl || useRequestURL().origin
const fullUrl = computed(() => `${origin}${route.fullPath}`)

useHead({
  title: () => `${pageStore.title} | ${$siteConfig.siteName}`,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: () => pageStore.subtitle,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: () => pageStore.subtitle,
    },
    { hid: 'og:title', property: 'og:title', content: () => pageStore.title },
    {
      hid: 'og:image',
      property: 'og:image',
      content: () =>
        pageStore.featureImage ? `${origin}${img(pageStore.featureImage)}` : '',
    },
    { hid: 'og:url', property: 'og:url', content: fullUrl },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'og:site_name',
      name: 'og:site_name',
      content: $siteConfig.siteName,
    },
  ],
})

watch(
  () => route.fullPath,
  () => $eventBus.emit('route-changed', route),
)

onBeforeMount(() => $cms.lifeCycleHooks.beforeMount())
onMounted(() => $cms.lifeCycleHooks.mounted())
onBeforeUpdate(() => $cms.lifeCycleHooks.beforeUpdate())
onUpdated(() => $cms.lifeCycleHooks.updated())
onBeforeUnmount(() => $cms.lifeCycleHooks.beforeUnmount())
onUnmounted(() => $cms.lifeCycleHooks.unmounted())
</script>

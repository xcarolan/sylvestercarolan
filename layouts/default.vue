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

const { $cms, $eventBus } = useNuxtApp()
const route = useRoute()

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

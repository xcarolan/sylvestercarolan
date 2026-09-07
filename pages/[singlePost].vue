<template>
  <div id="post-page" class="page-wrapper post-page">
    <site-hero :title="title" :subtitle="subtitle" :image="featureImage">
      <span
        v-if="author && $siteConfig.posts.displayAuthor"
        class="author-wrapper"
      >
        <strong>Author:</strong> {{ author }}
      </span>
      <span v-if="date" class="date-wrapper">
        <strong>Published on:</strong> {{ date }}
      </span>
    </site-hero>
    <main-section :one-column-constrained="true">
      <template #default>
        <div class="post-wrapper">
          <markdown-content :markdown="content" />
          <div class="other-posts">
            <h6 class="subtitle is-size-4">Related Posts</h6>
            <!-- Related Posts -->
            <posts-grid :number="3" :category="category" :exclude="slug" />
          </div>
          <disqus-comments :identifier="route.params.singlePost" />
        </div>
      </template>
      <template #sidebar>
        <post-sidebar />
      </template>
    </main-section>
  </div>
</template>
<script setup>
import { getFormattedDate } from '~/helper'

const route = useRoute()
const { $siteConfig } = useNuxtApp()
const pageStore = usePageStore()
const { title, subtitle, featureImage, author, category, slug, content } =
  storeToRefs(pageStore)

function loadPost() {
  const targetSlug = route.params.singlePost
  return pageStore.set({
    resource: 'post',
    slug: targetSlug,
    isStale: () => route.params.singlePost !== targetSlug,
  })
}

await useAsyncData(() => `post-${route.params.singlePost}`, loadPost)
// Navigating between two posts reuses this same route component, so
// script setup doesn't re-run — an explicit watcher is what actually
// refetches on subsequent client-side navigations.
watch(() => route.params.singlePost, loadPost)

const date = computed(() => getFormattedDate(pageStore.date))
</script>
<style scoped lang="scss">
.edit-post {
  margin-bottom: 20px;
}
</style>

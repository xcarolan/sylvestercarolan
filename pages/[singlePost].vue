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
const { $siteConfig, $cms } = useNuxtApp()

// A page-local useAsyncData ref (not a shared global store mutated as a
// side effect) so Nuxt's own out-of-order-response protection actually
// applies, and so another page's prefetched payload/data can never bleed
// into this one — each is isolated by its own key.
const { data: post } = await useAsyncData(
  () => `post-${route.params.singlePost}`,
  () => $cms.post.getOne(route.params.singlePost),
)

const title = computed(() => post.value?.title || '')
const subtitle = computed(() => post.value?.subtitle || '')
const featureImage = computed(() => post.value?.featureImage || '')
const author = computed(() => post.value?.author || '')
const category = computed(() => post.value?.category || [])
const slug = computed(() => post.value?.slug || '')
const content = computed(() => post.value?.content || '')
const date = computed(() => getFormattedDate(post.value?.date))

usePageMeta({ title, subtitle, image: featureImage })
</script>
<style scoped lang="scss">
.edit-post {
  margin-bottom: 20px;
}
</style>

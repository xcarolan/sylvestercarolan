<template>
  <div id="category-page" class="page-wrapper category-page">
    <site-hero :title="name" :subtitle="content" :image="image" />
    <main-section theme="sidebar-right">
      <template #default>
        <!-- Posts in Category -->
        <posts-grid :category="[name]" :per-row="2" />
      </template>
      <template #sidebar>
        <h3 class="subtitle">All Categories</h3>
        <div class="panel">
          <nuxt-link
            v-for="cat in allCats"
            :key="cat.slug"
            :to="`/categories/${cat.slug}`"
            :class="{
              'panel-block': true,
              'is-active': cat.slug === route.params.single,
            }"
          >
            {{ cat.name }}
          </nuxt-link>
        </div>
      </template>
    </main-section>
  </div>
</template>
<script setup>
const route = useRoute()
const { $cms } = useNuxtApp()
const pageStore = usePageStore()
const { name, content, image } = storeToRefs(pageStore)

function loadCategory() {
  const targetSlug = route.params.single
  return pageStore.set({
    resource: 'category',
    slug: targetSlug,
    isStale: () => route.params.single !== targetSlug,
  })
}

await useAsyncData(() => `category-${route.params.single}`, loadCategory)
// Navigating between two categories reuses this same route component, so
// script setup doesn't re-run — an explicit watcher is what actually
// refetches on subsequent client-side navigations.
watch(() => route.params.single, loadCategory)

const { data: allCats } = await useAsyncData('all-categories', () =>
  $cms.category.getAll(),
)
</script>

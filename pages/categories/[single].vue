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

await useAsyncData(
  () => `category-${route.params.single}`,
  () => pageStore.set({ resource: 'category', slug: route.params.single }),
  { watch: [() => route.params.single] },
)

const { data: allCats } = await useAsyncData('all-categories', () =>
  $cms.category.getAll(),
)
</script>

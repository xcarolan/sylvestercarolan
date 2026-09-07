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

// A page-local useAsyncData ref (not a shared global store mutated as a
// side effect) so Nuxt's own out-of-order-response protection actually
// applies, and so another page's prefetched payload/data can never bleed
// into this one — each is isolated by its own key.
const { data: category } = await useAsyncData(
  () => `category-${route.params.single}`,
  () => $cms.category.getOne(route.params.single),
)

const name = computed(() => category.value?.name || '')
const content = computed(() => category.value?.content || '')
const image = computed(() => category.value?.image || '')

usePageMeta({ title: name, subtitle: content, image })

const { data: allCats } = await useAsyncData('all-categories', () =>
  $cms.category.getAll(),
)
</script>

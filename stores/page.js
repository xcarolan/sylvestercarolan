import { defineStore } from 'pinia'
import isString from 'lodash.isstring'

export const usePageStore = defineStore('page', {
  state: () => ({
    pageType: '',
    title: '',
    subtitle: '',
    featureImage: '',
    content: '',
    author: '',
    date: '',
    // Category resource fields (category frontmatter uses name/image rather
    // than title/featureImage) - declared up front so storeToRefs() in
    // category pages tracks them reactively from the start.
    name: '',
    image: '',
    // Post resource fields
    category: [],
    slug: '',
    underSubtitle: '',
  }),
  actions: {
    // isStale is checked right before applying the fetched data, so that
    // a slow-resolving fetch for a page the user has since navigated away
    // from (e.g. clicking from one post straight to another, both served
    // by the same reused route component) can't clobber newer state with
    // stale content — Nuxt's own out-of-order protection only covers a
    // useAsyncData return value, not a side effect like this $patch.
    async set({ resource, slug, isStale }) {
      const { $cms, $siteConfig } = useNuxtApp()
      if (!resource) {
        if (isStale && isStale()) return false
        this.$patch({
          title: $siteConfig.siteName,
          subtitle: $siteConfig.tagline,
          featureImage: $siteConfig.featureImage,
        })
        return true
      }
      const theResource = isString(resource) ? $cms[resource] : resource
      const fetched = await theResource.getOne(slug)
      if (isStale && isStale()) return false
      const data = Object.assign(fetched, {
        pageType: theResource.slug,
        slug,
      })
      this.$patch(data)
      return true
    },
  },
})

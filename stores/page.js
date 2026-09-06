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
    async set({ resource, slug }) {
      const { $cms, $siteConfig } = useNuxtApp()
      if (!resource) {
        this.$patch({
          title: $siteConfig.siteName,
          subtitle: $siteConfig.tagline,
          featureImage: $siteConfig.featureImage,
        })
        return
      }
      const theResource = isString(resource) ? $cms[resource] : resource
      const fetched = await theResource.getOne(slug)
      const data = Object.assign(fetched, {
        pageType: theResource.slug,
        slug,
      })
      this.$patch(data)
    },
  },
})

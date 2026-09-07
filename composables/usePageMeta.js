// Each page calls this directly with its own title/subtitle/image, rather
// than a shared global store the layout reads from — per-page useHead()
// calls are properly isolated by Nuxt/unhead per page instance, unlike a
// side-effect-mutated global store, which is fragile against out-of-order
// async resolution, link prefetching, and any other mechanism that can run
// a different page's data-loading logic while this one is displayed.
export function usePageMeta({ title, subtitle, image }) {
  const { $siteConfig } = useNuxtApp()
  const route = useRoute()
  const img = useImage()
  const origin = useRuntimeConfig().public.siteUrl || useRequestURL().origin
  const fullUrl = computed(() => `${origin}${route.fullPath}`)

  useHead({
    title: () => `${unref(title) || ''} | ${$siteConfig.siteName}`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: () => unref(subtitle) || '',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: () => unref(subtitle) || '',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: () => unref(title) || '',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: () => {
          const value = unref(image)
          if (!value) return ''
          return /^https?:\/\//.test(value) ? value : `${origin}${img(value)}`
        },
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
}

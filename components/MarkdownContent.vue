<template>
  <div class="content" v-html="content"></div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import deflist from 'markdown-it-deflist'
import sub from 'markdown-it-sub'
import sup from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'

const props = defineProps({
  tag: { type: String, default: 'article' },
  markdown: { type: String, required: true },
})

const img = useImage()
const RESPONSIVE_WIDTHS = [640, 960, 1280, 1800]

const content = computed(() => {
  const md = new MarkdownIt({
    linkify: true,
    typographer: true,
  })
    .use(deflist)
    .use(sub)
    .use(sup)
    .use(footnote)
  let html = md.render(props.markdown)

  html = useResponsiveImages(html)
  html = wrapTable(html)
  html = html.replace(/<table>/g, '<table class="table is-striped">')

  return `<div class="content">${html}</div>`
})

function useResponsiveImages(html) {
  const images = html.match(/<img(.*?)>/g)
  if (images) {
    images.forEach((image) => {
      const origImage = image
        .match(/src="([^"]*)"/g)[0]
        .replace('src="', '')
        .replace('"', '')
      if (origImage.startsWith('http') || origImage.endsWith('.gif')) {
        return
      }
      const src = img(origImage, {
        width: RESPONSIVE_WIDTHS[RESPONSIVE_WIDTHS.length - 1],
      })
      const srcset = RESPONSIVE_WIDTHS.map(
        (width) => `${img(origImage, { width })} ${width}w`,
      ).join(', ')
      const replace = `src="${src}" srcset="${srcset}"`
      html = html.replace(image, image.replace(/src="([^"]*)"/g, replace))
    })
  }
  return html
}

function wrapTable(html) {
  html = html.replace(/<table/g, `<div class="table-wrapper"><table`)
  html = html.replace(/<\/table>/g, `</table></div>`)
  return html
}
</script>

<style scoped></style>

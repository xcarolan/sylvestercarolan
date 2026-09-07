<template>
  <div v-if="$siteConfig.disqus.on" class="comments-wrapper section">
    <a
      v-if="$siteConfig.disqus.loadingStrategy === 'button' && !displayed"
      class="button is-fullwidth is-outlined is-large"
      @click="displayed = true"
    >
      Load Comments
    </a>
    <intersection-observer
      v-if="$siteConfig.disqus.loadingStrategy === 'lazy'"
      @view="displayed = true"
    />
    <div
      v-if="
        $siteConfig.disqus.siteShortName &&
        (displayed || $siteConfig.disqus.loadingStrategy === 'onload')
      "
      ref="disqusThread"
      class="disqus-embed"
    >
      <div id="disqus_thread"></div>
    </div>

    <!-- Warning to Provide Disqus Site Short Name -->
    <div
      v-if="$siteConfig.disqus.on && !$siteConfig.disqus.siteShortName"
      class="notification is-danger"
    >
      Disqus site short name is required!
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  identifier: { type: String, required: true },
})

const { $siteConfig } = useNuxtApp()
const route = useRoute()
const displayed = ref(false)

function loadDisqus() {
  if (import.meta.server) return
  const shortname = $siteConfig.disqus.siteShortName
  if (!shortname) return

  window.disqus_config = function () {
    this.page.identifier = props.identifier
    this.page.url = window.location.origin + route.fullPath
  }

  if (window.DISQUS) {
    window.DISQUS.reset({ reload: true, config: window.disqus_config })
    return
  }

  const script = document.createElement('script')
  script.src = `https://${shortname}.disqus.com/embed.js`
  script.setAttribute('data-timestamp', String(+new Date()))
  document.body.appendChild(script)
}

watch(displayed, (isDisplayed) => {
  if (isDisplayed) loadDisqus()
})

onMounted(() => {
  if ($siteConfig.disqus.loadingStrategy === 'onload') loadDisqus()
})

watch(
  () => props.identifier,
  () => {
    if (displayed.value) loadDisqus()
  },
)
</script>

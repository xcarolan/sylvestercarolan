import SiteConfig from '~/config/_siteConfig'
import CMS from '~/cms/netlify/cms'

// During SSR/prerender, neither Nitro's relative-URL $fetch shortcut (which
// only reaches registered server routes) nor an absolute same-origin $fetch
// (nuxt generate's prerender crawler doesn't bind a real socket) can reach
// plain static files under public/ - both 404 on our build-time-generated
// content/*.json. Reading it straight off disk sidesteps the whole class of
// issue and works identically in dev and during `nuxt generate`. The dynamic
// imports keep node:fs/node:path out of the client bundle entirely - this
// whole branch is dead-code-eliminated there since import.meta.server is
// statically false on the client.
async function createServerFetcher() {
  const { readFile } = await import('node:fs/promises')
  const { join } = await import('node:path')
  // Plugin files get bundled/copied by Nuxt (into .nuxt in dev, .output in
  // production), so import.meta.url here points at the bundled copy, not the
  // source file - it can't be used to locate the project root. `nuxt dev`
  // and `nuxt generate` are always invoked from the project root via the npm
  // scripts, so process.cwd() is the reliable anchor instead.
  const rootDir = process.cwd()
  return async (path) => {
    const filePath = join(rootDir, 'public', path)
    return JSON.parse(await readFile(filePath, 'utf-8'))
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.provide('siteConfig', SiteConfig)
  const fetcher = import.meta.server ? await createServerFetcher() : $fetch
  nuxtApp.provide('cms', new CMS(fetcher))
})

// Content JSON under /api is served as plain static files from public/api
// (see cms/netlify/build/*), generated at build time with a fixed number of
// pages. ResourceGrid.vue deliberately probes one page past the last one to
// detect the end of pagination and expects that request to fail.
//
// Without this catch-all, an unmatched /api/** request falls through past
// Nitro's static file handler to Nuxt's page-render pipeline, which tries to
// resolve the path against the Vue Router and logs a misleading
// "[Vue Router warn]: No match found" for what is actually an expected,
// already-handled 404.
export default defineEventHandler(() => {
  throw createError({ statusCode: 404, statusMessage: 'Not found' })
})

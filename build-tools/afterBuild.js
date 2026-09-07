import CMS from '../cms/netlify/cms.js'

const cms = new CMS()
const { default: runAfter } = await import(
  `../cms/${cms.slug}/hooks/afterBuild.js`
)
runAfter()

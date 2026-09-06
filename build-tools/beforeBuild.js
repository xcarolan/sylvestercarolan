import CMS from '../cms/netlify/cms.js'

const cms = new CMS()
const { default: runBefore } = await import(
  `../cms/${cms.slug}/hooks/beforeBuild.js`
)
runBefore()

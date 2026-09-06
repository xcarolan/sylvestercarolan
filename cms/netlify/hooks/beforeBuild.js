import generatePostApi from '../build/generate-post-api.js'
import generateCategoryApi from '../build/generate-category-api.js'
import copyStaticToDist from '../build/copy-static-to-dist.js'

export default () => {
  generatePostApi()
  generateCategoryApi()
  copyStaticToDist()
}

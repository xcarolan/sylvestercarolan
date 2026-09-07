import Post from './post.js'
import Category from './category.js'
import LifeCycleHooks from './hooks/lifeCycle.js'
class CMS {
  constructor(fetcher = false) {
    this.name = 'Netlify'
    this.slug = 'netlify'
    this.post = new Post(fetcher)
    this.category = new Category(fetcher)
    this.lifeCycleHooks = LifeCycleHooks
  }
}
export default CMS

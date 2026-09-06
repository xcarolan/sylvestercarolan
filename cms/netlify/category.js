import { getMixins } from './mixins.js'

class Category {
  constructor(fetcher) {
    this.slug = 'category'
    this.slugPlural = 'categories'
    this.pretty = 'Category'
    this.plural = 'Categories'
    this.fetcher = fetcher
  }
}

// Mixins
Object.assign(Category.prototype, getMixins)
export default Category

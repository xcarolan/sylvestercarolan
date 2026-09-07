import { getMixins } from './mixins.js'

class Post {
  constructor(fetcher) {
    this.slug = 'post'
    this.slugPlural = 'posts'
    this.pretty = 'Post'
    this.plural = 'Posts'
    this.fetcher = fetcher
    this.editUrl = '/admin/#/collections/posts/entries'
  }
  getEditUrl(slug) {
    return `${this.editUrl}/${slug}`
  }
}

// Mixins
Object.assign(Post.prototype, getMixins)

export default Post

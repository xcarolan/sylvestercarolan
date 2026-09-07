import chunk from 'lodash.chunk'
import { flattenResource } from './helper.js'

/**
 * Get a single resource by slug, from the already-generated JSON API
 * @type {{getOne(*): function}}
 */
export const getOneMixin = {
  async getOne(slug) {
    const resources = await this.getAll()
    return resources.find((resource) => resource.slug === slug) || {}
  },
}

/**
 * Get n number of resources (can be filtered)
 * @type {{getByNumber(*=, *=, *=): Promise}}
 */
export const getByNumberMixin = {
  async getByNumber(number, filter = false, firstTime = true) {
    if (!filter) {
      filter = (resource) => {
        return resource
      }
    }
    if (firstTime) {
      this.reset()
    }
    this.gottenPage++
    const resources = await this.getByPage(this.gottenPage)
    const filtered = resources.filter(filter)
    let numbered = chunk(filtered, number)[0]
    numbered = numbered ? flattenResource(numbered) : []
    numbered = flattenResource(numbered)
    if (numbered.length < number) {
      try {
        const more = await this.getByNumber(
          number - numbered.length,
          filter,
          false,
        )
        numbered = numbered.concat(more)
      } catch {
        return numbered
      }
    }
    return numbered
  },
}

/**
 * Get resources by paginated page
 * @type {{gottenPage: number, reset(): void, getByPage(*, *=): Promise}}
 */
export const getByPageMixin = {
  gottenPage: 0,
  async getByPage(page, filter = false) {
    if (!filter) {
      filter = (resource) => {
        return resource
      }
    }
    let categories = await this.fetcher(
      `/api/${this.slugPlural}/page-${page}.json`,
    )
    categories = flattenResource(categories)
    return categories.filter(filter)
  },
  reset() {
    this.gottenPage = 0
  },
}

/**
 * Get all resources
 * @type {{getAll(): Promise}}
 */
export const getAllMixin = {
  async getAll() {
    const resources = await this.fetcher(`/api/${this.slugPlural}.json`)
    return flattenResource(resources)
  },
}

/**
 * Bundle all the getter mixins for quicker composition
 */
let getMixinChain = Object.assign({}, getOneMixin)
getMixinChain = Object.assign(getMixinChain, getOneMixin)
getMixinChain = Object.assign(getMixinChain, getByNumberMixin)
getMixinChain = Object.assign(getMixinChain, getByPageMixin)
getMixinChain = Object.assign(getMixinChain, getAllMixin)
export const getMixins = getMixinChain

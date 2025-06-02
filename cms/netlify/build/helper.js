import fs from 'fs'
import rimraf from 'rimraf'
import chunk from 'lodash.chunk'
import matter from 'gray-matter'
import { flattenResource } from '../helper'

export function compareDates(a, b) {
  const aParsed = Date.parse(a.data.date)
  const bParsed = Date.parse(b.data.date)
  if (aParsed < bParsed) {
    return -1
  }
  if (aParsed > bParsed) {
    return 1
  }
  return 0
}
export function createPagination(numPages, items, dir) {
  const paginationDir = dir
  if (fs.existsSync(paginationDir)) {
    rimraf.sync(paginationDir) // Delete all previous pagination endpoints
  }
  fs.mkdirSync(paginationDir)
  const paginated = chunk(items, numPages)
  let currentPage = 0
  for (let i = 0; i < paginated.length; i++) {
    currentPage = i + 1
    const chunkWriteStream = fs.createWriteStream(
      `${dir}/page-${currentPage}.json`,
      'UTF-8'
    )
    chunkWriteStream.write(JSON.stringify(paginated[i]))
    chunkWriteStream.end()
  }
  return paginated.length
}
export function createMeta(newMeta, file) {
  let meta = {}
  if (fs.existsSync(file)) {
    meta = require(file)
  }
  const combined = Object.assign(meta, newMeta)
  const chunkWriteStream = fs.createWriteStream(file, 'UTF-8')
  chunkWriteStream.write(JSON.stringify(combined))
  chunkWriteStream.end()
}
export function createAll(fromDir, toFile, apiDir) {
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true })
  }

  return new Promise(async (resolve, reject) => {
    try {
      const files = await fs.promises.readdir(fromDir)
      const contents = await Promise.all(files.map(async file => {
        const content = await fs.promises.readFile(`${fromDir}/${file}`, 'utf8')
        const parsed = matter(content)
        if (!parsed.data) parsed.data = {}  // Initialize if undefined
        parsed.data.slug = file.replace(/.md$/, '')
        return parsed
      }))
      
      const sorted = contents.sort(compareDates).reverse()
      const flattened = flattenResource(sorted)
      await fs.promises.writeFile(toFile, JSON.stringify(flattened))
      resolve(flattened)
    } catch (err) {
      reject(err)
    }
  })
}

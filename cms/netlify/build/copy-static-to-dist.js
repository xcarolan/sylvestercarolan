import { fileURLToPath } from 'url'
import path from 'path'
import ncpPkg from 'ncp'

const ncp = ncpPkg.ncp
ncp.limit = 16

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default () => {
  ncp(`${__dirname}/../public`, `${__dirname}/../../../public`, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Netlify admin generated in dist')
  })
}

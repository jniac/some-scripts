import path from 'path'
import fs from 'fs/promises'

/**
 * @typedef {object} Options
 * @property {boolean} ignoreDotFiles
 * @property {RegExp} filter
 * @property {(entry: string) => boolean} exclude
 * @property {number} maxDepth The max recursive depth (defaults to Infinity).
 * 
 * @param {string} dir
 * @param {Options?} options
 * @param {State?} state
 * @returns {Generator<{ filepath: string, stat: Awaited<ReturnType<typeof fs.stat>> }>}
 */
export async function* walk(dir, options) {
  const {
    ignoreDotFiles = true,
    filter,
    exclude,
    maxDepth = Infinity,
  } = options ?? {}
  let currentDepth = 0
  const directories = [dir]
  while (directories.length > 0) {
    if (currentDepth === maxDepth) {
      break
    }
    const dir = directories.shift()
    for (const entry of await fs.readdir(dir)) {
      const filepath = path.join(dir, entry)
      const stat = await fs.stat(filepath)
      if (ignoreDotFiles && entry.startsWith('.')) {
        continue
      }
      if (filter && filter.test(filepath) === false) {
        continue
      }
      if (exclude && exclude(filepath)) {
        continue
      }
      if (stat.isDirectory()) {
        if (currentDepth < maxDepth) {
          directories.push(filepath)
        }
      } else {
        yield { filepath, stat }
      }
    }
    currentDepth++
  }
}

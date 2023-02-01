import path from 'path'
import fs from 'fs/promises'

/**
 * @typedef {object} Options
 * @property {boolean} ignoreDotFiles
 * @property {RegExp} filter
 * @property {(entry: string) => boolean} exclude
 *
 * @param {string} dir
 * @param {Options?} options
 * @returns {Generator<{ filepath: string, stat: Awaited<ReturnType<typeof fs.stat>> }>}
 */
export async function* walk(dir, options) {
  const {
    ignoreDotFiles = true,
    filter,
    exclude,
  } = options ?? {}
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
      yield* walk(filepath, options)
    } else {
      yield { filepath, stat }
    }
  }
}

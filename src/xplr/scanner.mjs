import fs from 'fs/promises'
import path from 'path'

import { getFileType } from './file-types.mjs'

export const defaultIgnoredDirs = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.turbo',
  'coverage',
  '.cache',
  '.pnpm-store',
]

function toPosixPath(filepath) {
  return filepath.split(path.sep).join('/')
}

function createNameRegex(value) {
  if (!value) {
    return null
  }

  const match = String(value).match(/^\/(.+)\/([dgimsuvy]*)$/)
  if (match) {
    return new RegExp(match[1], match[2])
  }

  return new RegExp(String(value), 'i')
}

function readPositiveInteger(value, fallback) {
  const number = Number.parseInt(value, 10)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

/**
 * @param {object} options
 * @param {string} options.rootDir
 * @param {string=} options.name
 * @param {'all' | 'image' | 'video' | 'text' | 'other'=} options.type
 * @param {number|string=} options.maxFiles
 * @param {number|string=} options.maxDepth
 */
export async function scanFiles(options) {
  const rootDir = path.resolve(options.rootDir)
  const typeFilter = options.type && options.type !== 'all' ? options.type : null
  const nameRegex = createNameRegex(options.name)
  const maxFiles = readPositiveInteger(options.maxFiles, 10000)
  const maxDepth = options.maxDepth === undefined
    ? Infinity
    : readPositiveInteger(options.maxDepth, Infinity)
  const ignoredDirs = new Set(defaultIgnoredDirs)

  const files = []
  const directories = [{ dir: rootDir, depth: 0 }]
  let truncated = false
  let visitedDirs = 0

  while (directories.length > 0) {
    const { dir, depth } = directories.shift()
    visitedDirs += 1

    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      continue
    }

    entries.sort((a, b) => a.name.localeCompare(b.name))

    for (const entry of entries) {
      const filepath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name) && depth < maxDepth) {
          directories.push({ dir: filepath, depth: depth + 1 })
        }
        continue
      }

      if (!entry.isFile()) {
        continue
      }

      const relativePath = toPosixPath(path.relative(rootDir, filepath))
      if (nameRegex && !nameRegex.test(entry.name) && !nameRegex.test(relativePath)) {
        continue
      }

      const fileType = getFileType(filepath)
      if (typeFilter && fileType !== typeFilter) {
        continue
      }

      let stat
      try {
        stat = await fs.stat(filepath)
      } catch {
        continue
      }

      files.push({
        path: filepath,
        relativePath,
        name: entry.name,
        ext: path.extname(entry.name).toLowerCase(),
        type: fileType,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      })

      if (files.length >= maxFiles) {
        truncated = true
        directories.length = 0
        break
      }
    }
  }

  return {
    root: rootDir,
    files,
    count: files.length,
    truncated,
    maxFiles,
    ignoredDirs: [...ignoredDirs],
    visitedDirs,
  }
}

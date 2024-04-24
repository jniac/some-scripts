import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'

import { getOption } from '../options.mjs'
import { removeDiacritics } from '../utils/diacritics.mjs'
import { walk } from '../utils/walk.mjs'

const dir = process.argv[2]
const quality = getOption('quality', 80)
const noSuffix = getOption('no-suffix', false)
const noSubDir = getOption('no-subdir', false)
const background = '#808080'

const outdir = noSubDir
  ? dir
  : path.join(dir, 'jpg')

if ((await fs.pathExists(outdir)) === false) {
  await fs.mkdir(outdir)
  console.log(`created dir ${chalk.yellow(outdir)}`)
}

const safeName = str => {
  return removeDiacritics(str)
    .replace(/[\s\\/&$’'"`]+/g, '-')
    .replace(/-+/g, '-')
}

const exclude = entry => entry === outdir
const maxDepth = getOption('recursive', false) ? Infinity : 1
for await (const { filepath, stat } of walk(dir, { exclude, maxDepth })) {
  const { ext, name, dir: subdir, base } = path.parse(filepath.substring(dir.length + 1))
  let finalName = safeName(name)
  if (!noSuffix) {
    finalName = `${finalName}-q${quality}`
  }
  finalName = `${finalName}.jpg`
  const relativeOut = path.join(subdir, finalName)
  const out = path.join(outdir, relativeOut)
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      if (noSubDir) {
        console.log(`skip ${chalk.yellow(base)} ${chalk.dim('(--no-subdir -> jpg are ignored)')}`)
        continue
      } else {
        break
      }
    case '.png':
    case '.svg':
      break
    default:
      // Skip file.
      continue
  }
  if (await fs.pathExists(out)) {
    const outstat = await fs.stat(out)
    if (outstat) {
      if (stat.mtime < outstat.mtime) {
        console.log(`skip ${chalk.yellow(base)} ${chalk.dim('(file is older)')}`)
        continue
      }
      await fs.remove(out)
    }
  }
  await fs.ensureDir(path.dirname(out))
  await sharp(filepath)
    .flatten({ background })
    .jpeg({ quality })
    .toFile(out)
  console.log(`exported ${chalk.yellow(relativeOut)}`)
}

import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { removeDiacritics } from '../utils/diacritics.mjs'
import { walk } from '../utils/walk.mjs'

const rawArgs = hideBin(process.argv)
const dir = rawArgs[0]

const argv = yargs(rawArgs.slice(1))
  .option('quality', {
    alias: 'q',
    type: 'number',
    default: 80,
    describe: 'JPEG quality (1–100)',
  })
  .option('suffix', {
    type: 'boolean',
    default: true,
    describe: 'Omit quality suffix from output filename',
  })
  .option('subdir', {
    type: 'boolean',
    default: true,
    describe: 'Output to same directory instead of a jpg/ subfolder',
  })
  .option('recursive', {
    alias: 'r',
    type: 'boolean',
    default: false,
    describe: 'Process subdirectories recursively',
  })
  .help()
  .argv

const {
  quality,
  subdir = true,
  suffix = true,
} = argv
const background = '#808080'

const outdir = subdir
  ? path.join(dir, 'jpg')
  : dir

if ((await fs.pathExists(outdir)) === false) {
  await fs.mkdir(outdir)
  console.log(`created dir ${chalk.yellow(outdir)}`)
}

const safeName = str => {
  return removeDiacritics(str)
    .replace(/[\s\\/&$''"`]+/g, '-')
    .replace(/-+/g, '-')
}

const exclude = entry => entry === outdir
const maxDepth = argv.recursive ? Infinity : 1
for await (const { filepath, stat } of walk(dir, { exclude, maxDepth })) {
  const { ext, name, dir: subdir, base } = path.parse(filepath.substring(dir.length + 1))
  let finalName = safeName(name)
  if (suffix) {
    finalName = `${finalName}-q${quality}`
  }
  finalName = `${finalName}.jpg`
  const relativeOut = path.join(subdir, finalName)
  const out = path.join(outdir, relativeOut)
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      if (subdir !== true) {
        console.log(`skip ${chalk.yellow(base)} ${chalk.dim('(--no-subdir -> jpg are ignored)')}`)
        continue
      } else {
        break
      }
    case '.png':
    case '.svg':
      break
    default:
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

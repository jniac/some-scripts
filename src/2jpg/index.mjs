import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import { walk } from '../utils/walk.mjs'
import { removeDiacritics } from '../utils/diacritics.mjs'
import chalk from 'chalk'

const dir = process.argv[2]
const outdir = path.join(dir, 'jpg')
const quality = 60
const background = '#808080'

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
for await (const { filepath, stat } of walk(dir, { exclude })) {
  const { ext, name, dir: subdir, base } = path.parse(filepath.substring(dir.length + 1))
  const relativeOut = path.join(subdir, `${safeName(name)}.jpg`)
  const out = path.join(outdir, relativeOut)
  switch(ext) {
    case '.jpg':
    case '.jpeg':
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
        console.log(`skip ${chalk.yellow(base)} (file is older)`)
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

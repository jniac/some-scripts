import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import { walk } from '../utils/walk.mjs'
import chalk from 'chalk'

const dir = process.argv[2]
const outdir = path.join(dir, 'jpg')

if ((await fs.pathExists(outdir)) === false) {
  await fs.mkdir(outdir)
  console.log(`created ${chalk.yellow(outdir)}`)
}

const safeName = str => str.replace(/\s+/g, '-')

const exclude = entry => entry === outdir
for await (const { filepath, stat } of walk(dir, { exclude })) {
  const filename = filepath.substring(dir.length + 1)
  const outfilename = safeName(filename)
  const outfilepath = path.join(outdir, outfilename)
  const ext = path.extname(filename)
  switch(ext) {
    case '.jpg':
    case '.jpeg':
    case '.png':
      break;
    default:
      continue;
  }
  if (await fs.pathExists(outfilepath)) {
    const outstat = await fs.stat(outfilepath)
    if (outstat) {
      if (stat.mtime < outstat.mtime) {
        console.log(`skip ${chalk.yellow(filename)} (file is older)`)
        continue
      }
      await fs.remove(outfilepath)
    }
  }
  await fs.ensureDir(path.dirname(outfilepath))
  await sharp(filepath)
    .jpeg({ quality: 60 })
    .toFile(outfilepath)
  console.log(`exported ${chalk.yellow(outfilename)}`)
}

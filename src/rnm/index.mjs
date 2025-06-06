import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const rawArgs = hideBin(process.argv)

const args = rawArgs.slice(1)

const argv = yargs(args)
  .option('dry-run', {
    type: 'boolean',
    describe: 'Dry run only',
  })
  .option('match', {
    alias: 'm',
    type: 'string',
    describe: 'Pattern to match files',
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    describe: 'Name of the file to create',
  })
  .option('offset', {
    alias: 'o',
    type: 'number',
    describe: 'Offset for the index in the new file name',
    default: 0,
  })
  .help()
  .argv

function formatWithIndex(template, index) {
  return template.replace(/%0(\d+)d/, (_, width) => {
    return String(index).padStart(Number(width), '0')
  })
}

const files = await fg(argv['match'] ?? '*')
const offset = argv['offset'] ?? 0

files.sort((a, b) => {
  return fs.statSync(a).ctimeMs - fs.statSync(b).ctimeMs
})

if (files.length === 0) {
  console.error('No files found matching the pattern.')
  process.exit(1)
}

let name = argv['name'] ?? 'file-%04d'
if (/%0\d+d/.test(name) === false) {
  name += '-%04d'
}

console.log(`Found ${files.length} files matching the pattern.`)

const indexes = {}
for (let i = 0; i < files.length; i++) {
  const file = files[i]
  const chunks = file.split('/')
  const fileName = chunks.pop()
  const ext = path.extname(fileName)
  const fileDir = path.join(...chunks)

  const index = indexes[fileDir] ?? 0
  indexes[fileDir] = index + 1

  const newFileName = name ? formatWithIndex(name, index + offset) : file

  let newFile = path.join(fileDir, newFileName)
  if (path.extname(newFile) === '')
    newFile += ext // append the original extension if the new name has no extension

  if (argv['dry-run']) {
    console.log(`Would rename: ${file} -> ${newFile}`)
  } else {
    try {
      await fs.promises.rename(file, newFile)
      console.log(`Renamed: ${file} -> ${newFile}`)
    } catch (error) {
      console.error(`Error renaming ${file}:`, error)
    }
  }
}


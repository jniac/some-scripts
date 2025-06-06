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

console.log(`Found ${files.length} files matching the pattern.`)

for (let i = 0; i < files.length; i++) {
  const file = files[i]
  const chunks = file.split('/')
  const fileName = chunks.pop() // consume the last part as the file name
  const newFileName = argv['name'] ? formatWithIndex(argv['name'], i + offset) : file
  const newFile = path.join(...chunks, newFileName)

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


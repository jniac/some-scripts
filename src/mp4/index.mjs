import chalk from 'chalk'
import fs from 'fs/promises'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const rawArgs = hideBin(process.argv)

const args = rawArgs.slice(1)

const argv = yargs(args)
  .option('help', {
    type: 'boolean',
    describe: 'Show help information',
  })
  .argv

const filename = argv._[1]
const fileSource = `${filename}.mov`

const fileSourceExists = await fileExists(path.resolve(fileSource))

if (!fileSourceExists) {
  console.error(chalk.red(`Source file "${fileSource}" does not exist.`))
  process.exit(1)
}

const ffmpegCommmand = `ffmpeg -i ${fileSource} -c:v libx264 -crf 20 -preset slow -an ${filename}.mp4`

const { exec } = await import('child_process')

exec(ffmpegCommmand, (error, stdout, stderr) => {
  if (error) {
    console.error(chalk.red(`Error executing ffmpeg: ${error.message}`))
    return
  }
  if (stderr) {
    console.error(chalk.yellow(`ffmpeg stderr: ${stderr}`))
  }
  console.log(chalk.green(`Successfully converted "${fileSource}" to "${filename}.mp4"`))
})
import chalk from 'chalk'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { openBrowser, startServer } from './server.mjs'

const rawArgs = hideBin(process.argv)
const cwd = rawArgs[0] ?? process.cwd()
const args = rawArgs.slice(2)

const argv = yargs(args)
  .usage('jnc xplr [dir]')
  .option('host', {
    type: 'string',
    default: '127.0.0.1',
    describe: 'Host used by the local explorer',
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    default: 5173,
    describe: 'Port used by the local explorer',
  })
  .option('open', {
    type: 'boolean',
    default: true,
    describe: 'Open the local explorer in the browser',
  })
  .option('max-files', {
    type: 'number',
    default: 10000,
    describe: 'Default maximum number of files to list',
  })
  .help()
  .argv

const rootDir = path.resolve(cwd, String(argv._[0] ?? '.'))

const { url, server } = await startServer({
  host: argv.host,
  port: argv.port,
  rootDir,
  maxFiles: argv.maxFiles,
})

console.log(chalk.cyan(`xplr serving ${rootDir}`))
console.log(chalk.green(url))

if (argv.open) {
  openBrowser(url)
}

await new Promise(resolve => {
  const close = () => {
    server.close(resolve)
  }
  process.once('SIGINT', close)
  process.once('SIGTERM', close)
})

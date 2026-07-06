import chalk from 'chalk'

const packageJson = { version: '1.0.0' }

const command = process.argv[3]

const availableCommands = {
  '2jpg': {
    description: 'A command to quickly export jpg from the current folder.',
    program: () => import('./2jpg/index.mjs'),
  },
  'rnm': {
    description: 'A command to rename files in the current folder.',
    program: () => import('./rnm/index.mjs'),
  },
  'mp4': {
    description: 'A command to quickly export mp4 from the current folder.',
    program: () => import('./mp4/index.mjs'),
  },
  'xplr': {
    description: 'A local file explorer server.',
    program: () => import('./xplr/index.mjs'),
  }
}

if (command in availableCommands) {
  availableCommands[command].program()
} else {
  const root = `(${process.argv[0]})`
  const commands = Object.keys(availableCommands).map(s => `\n  - ${chalk.yellow(s)} ${chalk.dim(availableCommands[s].description)}`)
  console.log(`\nHello, ${chalk.cyan.underline.bold('some-scripts')}(${packageJson.version}) here! ${chalk.dim(root)} \nAvailable commands are:${commands}\n`)
}

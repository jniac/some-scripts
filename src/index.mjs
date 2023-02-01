import chalk from 'chalk'
const command = process.argv[3]

const availableCommands = {
  '2jpg': {
    description: 'A command to quickly export jpg from the current folder.',
    program: () => import('./2jpg/index.mjs'),
  },
}

if (command in availableCommands) {
  availableCommands[command]()
} else {
  const root = `(${process.argv[0]})`
  const commands = Object.keys(availableCommands).map(s => `\n  - ${chalk.yellow(s)} ${chalk.dim(availableCommands[s].description)}`)
  console.log(`Hello, ${chalk.cyan.bold('some-scripts')} here ${chalk.dim(root)} \nAvailable commands are:${commands}`)
}

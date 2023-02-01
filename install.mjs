import fs from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
const asyncExec = promisify(exec)

const name = process.argv[2] ?? 'jnc'
const str = `node ${process.cwd()}/src/index.mjs "$(pwd)" "$@"`
const file = `/usr/local/bin/${name}`

await fs.writeFile(file, str)

await asyncExec(`chmod +x ${file}`)

console.log(`Installed the following file ${file}\nYou can use the command "${name}".`)

const command = process.argv[3]

switch(command) {
  case '2jpg': {
    import('./2jpg/index.mjs')
    break
  }
}

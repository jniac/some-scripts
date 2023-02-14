export const findArg = (name) => {
  const args = process.argv.slice(3)
  for (const [index, arg] of args.entries()) {
    if (arg === name) {
      return args[index + 1]
    }
  }
}
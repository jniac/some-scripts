const args = process.argv
  .slice(3)
  .map(str => str.split('='))
  .flat()

const optionsShortNames = {
  quality: 'q',
  recursive: 'r',
}

const optionsShortNamesReverse = Object.fromEntries(
  Object.entries(optionsShortNames).map(a => a.reverse())
)

/**
 * A dictionnary of options passed to the app via standard cli-flags
 * https://oclif.io/blog/2019/02/20/cli-flags-explained
 * @type {Record<string, string>}
 */
const options = {}

const getOptionValue = index => {
  const value = args[index]
  if (value !== undefined) {
    if (value.startsWith('-')) {
      // The value is another options name! Returns null
      return null
    }
    return value
  }
  return null
}

for (const [index, arg] of args.entries()) {
  if (arg.startsWith('--')) {
    const name = arg.substring(2)
    options[name] = getOptionValue(index + 1) ?? 'true'
  } else if (arg.startsWith('-')) {
    for (const [charIndex, char] of [...arg.substring(1)].entries()) {
      const name = optionsShortNamesReverse[char]
      options[name] = getOptionValue(index + 1 + charIndex) ?? 'true'
    }
  }
}

/**
 * Check for a value into the options. If the value exists the value is parsed
 * according to the type of the default value then returned. If the value does not
 * exist, the default value is returned.
 *
 * @template {string | boolean | number} T
 * @param {string} name
 * @param {T} defaultValue
 * @returns {T}
 */
const getOption = (name, defaultValue) => {
  if (name in options === false) {
    return defaultValue
  }
  const value = options[name]
  const lowercase = value.toLowerCase()
  switch (typeof defaultValue) {
    case 'boolean': {
      return lowercase === 'true' || lowercase === '1'
    }
    case 'string': {
      return value
    }
    case 'number': {
      return Number.parseFloat(value)
    }
    default: {
      throw new Error(
        `Unhandled type! (${defaultValue} "${typeof defaultValue}")`
      )
    }
  }
}

export { options, getOption }

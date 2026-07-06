import path from 'path'

const imageExtensions = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.heic',
  '.heif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.tif',
  '.tiff',
  '.webp',
])

const videoExtensions = new Set([
  '.avi',
  '.m4v',
  '.mkv',
  '.mov',
  '.mp4',
  '.mpeg',
  '.mpg',
  '.webm',
  '.wmv',
])

const textExtensions = new Set([
  '.c',
  '.config',
  '.css',
  '.csv',
  '.env',
  '.gitignore',
  '.go',
  '.graphql',
  '.h',
  '.html',
  '.ini',
  '.java',
  '.js',
  '.json',
  '.jsx',
  '.log',
  '.md',
  '.mjs',
  '.py',
  '.rb',
  '.rs',
  '.sh',
  '.sql',
  '.svg',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
])

const textFilenames = new Set([
  '.env',
  '.env.local',
  '.gitignore',
  'Dockerfile',
  'Makefile',
])

export function getFileType(filepath) {
  const base = path.basename(filepath)
  if (textFilenames.has(base)) {
    return 'text'
  }

  const ext = path.extname(filepath).toLowerCase()
  if (imageExtensions.has(ext)) {
    return 'image'
  }
  if (videoExtensions.has(ext)) {
    return 'video'
  }
  if (textExtensions.has(ext)) {
    return 'text'
  }
  return 'other'
}

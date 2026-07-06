import { spawn } from 'child_process'
import express from 'express'
import fs from 'fs'
import path from 'path'
import process from 'process'

import { defaultIgnoredDirs, scanFiles } from './scanner.mjs'

function getAppDistDir() {
  return path.resolve(import.meta.dirname, '../../apps/xplr/dist')
}

function sendIndex(res, distDir) {
  res.sendFile(path.join(distDir, 'index.html'))
}

export function openBrowser(url) {
  const platformCommands = {
    darwin: ['open', [url]],
    win32: ['cmd', ['/c', 'start', '', url]],
    linux: ['xdg-open', [url]],
  }

  const command = platformCommands[process.platform]
  if (!command) {
    return
  }

  const child = spawn(command[0], command[1], {
    detached: true,
    stdio: 'ignore',
  })
  child.unref()
}

export async function startServer(options) {
  const {
    host = '127.0.0.1',
    port = 5173,
    rootDir,
    maxFiles = 10000,
  } = options
  const distDir = getAppDistDir()
  const app = express()

  app.get('/api/meta', (req, res) => {
    res.json({
      root: rootDir,
      maxFiles,
      ignoredDirs: defaultIgnoredDirs,
      hasStaticBuild: fs.existsSync(path.join(distDir, 'index.html')),
    })
  })

  app.get('/api/files', async (req, res) => {
    try {
      const result = await scanFiles({
        rootDir,
        name: req.query.name,
        type: req.query.type,
        maxFiles: req.query.maxFiles ?? maxFiles,
        maxDepth: req.query.maxDepth,
      })
      res.json(result)
    } catch (error) {
      if (error instanceof SyntaxError) {
        res.status(400).json({ error: error.message })
        return
      }
      res.status(500).json({ error: error.message })
    }
  })

  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    app.use(express.static(distDir, {
      fallthrough: true,
      index: false,
    }))
    app.use((req, res) => sendIndex(res, distDir))
  } else {
    app.use((req, res) => {
      res.status(503).send([
        '<!doctype html>',
        '<title>xplr build missing</title>',
        '<h1>xplr build missing</h1>',
        '<p>Run <code>pnpm --filter @some-scripts/xplr build</code> before starting <code>jnc xplr</code>.</p>',
      ].join(''))
    })
  }

  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(port, host, () => resolve(instance))
    instance.on('error', reject)
  })

  return {
    app,
    server,
    url: `http://${host}:${server.address().port}/`,
  }
}

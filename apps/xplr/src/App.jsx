import {
  AlertTriangle,
  ExternalLink,
  File,
  FileImage,
  FileText,
  Film,
  FolderOpen,
  FolderTree,
  Gauge,
  Grid2X2,
  List,
  Loader2,
  Maximize2,
  Search,
  Server,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const fileTypes = [
  { label: 'All', value: 'all' },
  { label: 'Images', value: 'image', icon: FileImage },
  { label: 'Videos', value: 'video', icon: Film },
  { label: 'Text', value: 'text', icon: FileText },
]

const languageByExtension = {
  '.css': 'css',
  '.csv': 'csv',
  '.html': 'html',
  '.java': 'java',
  '.js': 'javascript',
  '.json': 'json',
  '.jsx': 'jsx',
  '.md': 'markdown',
  '.mjs': 'javascript',
  '.py': 'python',
  '.rb': 'ruby',
  '.rs': 'rust',
  '.sh': 'bash',
  '.sql': 'sql',
  '.svg': 'xml',
  '.toml': 'toml',
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.txt': 'text',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
}

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`
}

function formatDate(ms) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ms))
}

function FileTypeIcon({ type }) {
  const className = 'text-slate-500 dark:text-slate-400'
  if (type === 'image') {
    return <FileImage size={17} className={className} />
  }
  if (type === 'video') {
    return <Film size={17} className={className} />
  }
  if (type === 'text') {
    return <FileText size={17} className={className} />
  }
  return <File size={17} className={className} />
}

function getMediaUrl(file) {
  return `/media/${file.relativePath.split('/').map(encodeURIComponent).join('/')}`
}

function getTextUrl(file, maxBytes = 200000) {
  const params = new URLSearchParams({
    path: file.relativePath,
    maxBytes: String(maxBytes),
  })
  return `/api/text?${params}`
}

function canPreview(file) {
  return file.type === 'image' || file.type === 'video' || file.type === 'text'
}

function getLanguage(file) {
  if (file.name === '.gitignore') {
    return 'gitignore'
  }
  if (file.name.startsWith('.env')) {
    return 'dotenv'
  }
  return languageByExtension[file.ext] ?? 'text'
}

function revealInSystem(file) {
  return fetch('/api/reveal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: file.relativePath }),
  })
}

function stopPropagation(event) {
  event.stopPropagation()
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="truncate text-lg font-semibold text-slate-950 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

function MediaPreview({ file, compact = false }) {
  if (file.type === 'image') {
    return (
      <img
        src={getMediaUrl(file)}
        alt={file.name}
        loading="lazy"
        className={[
          'w-full bg-slate-100 object-cover dark:bg-slate-950',
          compact ? 'max-h-72' : 'max-h-[82vh]',
        ].join(' ')}
      />
    )
  }

  if (file.type === 'video') {
    return (
      <video
        src={getMediaUrl(file)}
        muted={compact}
        controls={!compact}
        preload="metadata"
        className={[
          'w-full bg-black object-contain',
          compact ? 'max-h-72' : 'max-h-[82vh]',
        ].join(' ')}
      />
    )
  }

  if (file.type === 'text') {
    return <TextPreview file={file} />
  }

  return (
    <div className="flex h-32 items-center justify-center bg-slate-100 dark:bg-slate-950">
      <FileTypeIcon type={file.type} />
    </div>
  )
}

function TextPreview({ file }) {
  const [state, setState] = useState({ loading: true, content: '', error: null })

  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, content: '', error: null })
    fetch(getTextUrl(file, 6000), { signal: controller.signal })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to read file')
        }
        return data
      })
      .then(data => {
        const preview = data.content.split(/\r?\n/).slice(0, 16).join('\n')
        setState({ loading: false, content: preview, error: null })
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState({ loading: false, content: '', error: error.message })
        }
      })
    return () => controller.abort()
  }, [file.relativePath])

  if (state.loading) {
    return (
      <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <Loader2 size={18} className="animate-spin" />
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex h-40 items-center justify-center bg-slate-100 px-4 text-center text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        {state.error}
      </div>
    )
  }

  return (
    <pre className="max-h-72 overflow-hidden whitespace-pre-wrap bg-slate-100 p-3 font-mono text-[11px] leading-5 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
      {state.content || ' '}
    </pre>
  )
}

function ListView({ files, onOpenFile }) {
  return (
    <div className="max-h-[calc(100vh-270px)] min-h-[420px] overflow-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="w-10 px-4 py-3 font-medium" />
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 text-right font-medium">Size</th>
            <th className="px-4 py-3 text-right font-medium">Modified</th>
            <th className="w-12 px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {files.map(file => (
            <tr key={file.relativePath} className="hover:bg-slate-50 dark:hover:bg-slate-950">
              <td className="px-4 py-3">
                <FileTypeIcon type={file.type} />
              </td>
              <td className="max-w-0 px-4 py-3">
                <p className="truncate font-medium text-slate-800 dark:text-slate-100">{file.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{file.relativePath}</p>
              </td>
              <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{file.type}</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">
                {formatSize(file.size)}
              </td>
              <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                {formatDate(file.mtimeMs)}
              </td>
              <td className="px-4 py-3 text-right">
                {canPreview(file) ? (
                  <button
                    type="button"
                    onClick={() => onOpenFile(file)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    title="Open preview"
                  >
                    <Maximize2 size={15} />
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TileView({ files, onOpenFile }) {
  return (
    <div className="max-h-[calc(100vh-270px)] min-h-[420px] overflow-auto p-4">
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
        {files.map(file => (
          <article
            key={file.relativePath}
            className="mb-4 break-inside-avoid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            {canPreview(file) ? (
              <button
                type="button"
                onClick={() => onOpenFile(file)}
                className="group block w-full text-left"
                title="Open preview"
              >
                <div className="relative">
                  <MediaPreview file={file} compact />
                  <span className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md bg-black/55 text-white opacity-0 transition group-hover:opacity-100">
                    <Maximize2 size={15} />
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex h-28 items-center justify-center bg-slate-100 dark:bg-slate-900">
                <FileTypeIcon type={file.type} />
              </div>
            )}
            <div className="space-y-1 p-3">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{file.name}</p>
              <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{file.relativePath}</p>
              <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="capitalize">{file.type}</span>
                <span className="tabular-nums">{formatSize(file.size)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function OverlayActions({ file, onClose }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <a
        href={getMediaUrl(file)}
        target="_blank"
        rel="noreferrer"
        className="flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
        title="Open file in a new tab"
        onClick={stopPropagation}
      >
        <ExternalLink size={17} />
      </a>
      <button
        type="button"
        onClick={event => {
          stopPropagation(event)
          revealInSystem(file)
        }}
        className="flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
        title="Reveal in Finder or Explorer"
      >
        <FolderOpen size={17} />
      </button>
      <button
        type="button"
        onClick={event => {
          stopPropagation(event)
          onClose()
        }}
        className="flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
        title="Close preview"
      >
        <X size={20} />
      </button>
    </div>
  )
}

function MediaOverlay({ file, onClose }) {
  useEffect(() => {
    if (!file) {
      return undefined
    }
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [file, onClose])

  if (!file) {
    return null
  }

  return (
    <div
      data-testid="media-overlay-backdrop"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-white"
      onClick={onClose}
    >
      <div
        className="flex min-h-14 items-center justify-between gap-4 border-b border-white/10 px-4"
        onClick={stopPropagation}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="truncate text-xs text-slate-400">{file.relativePath}</p>
        </div>
        <OverlayActions file={file} onClose={onClose} />
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <div
          data-testid="media-overlay-content"
          className="flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-lg bg-black"
          onClick={stopPropagation}
        >
          <MediaPreview file={file} />
        </div>
      </div>
    </div>
  )
}

function TextOverlay({ file, onClose }) {
  const [state, setState] = useState({ loading: true, content: '', truncated: false, error: null })

  useEffect(() => {
    if (!file) {
      return undefined
    }
    const controller = new AbortController()
    setState({ loading: true, content: '', truncated: false, error: null })
    fetch(getTextUrl(file), { signal: controller.signal })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to read file')
        }
        return data
      })
      .then(data => {
        setState({ loading: false, content: data.content, truncated: data.truncated, error: null })
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          setState({ loading: false, content: '', truncated: false, error: error.message })
        }
      })

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      controller.abort()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [file, onClose])

  if (!file) {
    return null
  }

  return (
    <div
      data-testid="text-overlay-backdrop"
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-white"
      onClick={onClose}
    >
      <div
        className="flex min-h-14 items-center justify-between gap-4 border-b border-white/10 px-4"
        onClick={stopPropagation}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="truncate text-xs text-slate-400">{file.relativePath}</p>
        </div>
        <OverlayActions file={file} onClose={onClose} />
      </div>
      <div className="min-h-0 flex-1 p-4">
        <div
          data-testid="text-overlay-content"
          className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-950"
          onClick={stopPropagation}
        >
          {state.loading ? (
            <div className="flex flex-1 items-center justify-center text-slate-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : state.error ? (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-slate-300">
              {state.error}
            </div>
          ) : (
            <>
              {state.truncated ? (
                <div className="border-b border-white/10 bg-amber-500/10 px-4 py-2 text-xs text-amber-100">
                  File is larger than the preview limit.
                </div>
              ) : null}
              <div className="min-h-0 flex-1 overflow-auto">
                <SyntaxHighlighter
                  language={getLanguage(file)}
                  style={oneDark}
                  showLineNumbers
                  customStyle={{
                    minHeight: '100%',
                    margin: 0,
                    background: 'transparent',
                    fontSize: 12,
                  }}
                  codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
                >
                  {state.content}
                </SyntaxHighlighter>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function App() {
  const [meta, setMeta] = useState(null)
  const [nameFilter, setNameFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [isolatedFile, setIsolatedFile] = useState(null)
  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/meta')
      .then(response => response.json())
      .then(data => {
        if (!cancelled) {
          setMeta(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMeta({ root: '.', maxFiles: 10000, ignoredDirs: [] })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams({
        type: typeFilter,
      })
      if (nameFilter.trim()) {
        params.set('name', nameFilter.trim())
      }
      if (meta?.maxFiles) {
        params.set('maxFiles', String(meta.maxFiles))
      }

      setLoading(true)
      setError(null)
      fetch(`/api/files?${params}`, { signal: controller.signal })
        .then(async response => {
          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error ?? 'Scan failed')
          }
          return data
        })
        .then(data => {
          setScan(data)
        })
        .catch(fetchError => {
          if (fetchError.name !== 'AbortError') {
            setError(fetchError.message)
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false)
          }
        })
    }, 180)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [meta?.maxFiles, nameFilter, typeFilter])

  const ignoredFolders = meta?.ignoredDirs ?? []
  const files = scan?.files ?? []
  const root = scan?.root ?? meta?.root ?? '.'
  const resultLabel = useMemo(() => {
    if (loading && !scan) {
      return 'Scanning'
    }
    return `${scan?.count ?? 0} files`
  }, [loading, scan])
  const isolatedMedia = isolatedFile && isolatedFile.type !== 'text' ? isolatedFile : null
  const isolatedText = isolatedFile?.type === 'text' ? isolatedFile : null

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <FolderTree size={21} />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-normal">xplr</h1>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{root}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Server size={16} />
            <span>Local session</span>
          </div>
        </header>

        <section className="grid gap-3 py-5 md:grid-cols-3">
          <Stat icon={Gauge} label="Limit" value={`${meta?.maxFiles ?? 10000} files`} />
          <Stat icon={SlidersHorizontal} label="Default ignores" value={ignoredFolders.length} />
          <Stat icon={Search} label="Results" value={resultLabel} />
        </section>

        <section className="grid flex-1 gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Name filter
                </span>
                <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={nameFilter}
                    onChange={event => setNameFilter(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    placeholder="regexp or text"
                  />
                </div>
              </label>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {fileTypes.map(({ label, value, icon: Icon }) => {
                    const selected = typeFilter === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTypeFilter(value)}
                        className={[
                          'flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition',
                          selected
                            ? 'border-cyan-600 bg-cyan-50 text-cyan-800 dark:border-cyan-500 dark:bg-cyan-950 dark:text-cyan-100'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900',
                        ].join(' ')}
                      >
                        {Icon ? <Icon size={15} /> : null}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Ignored folders
                </p>
                <div className="flex flex-wrap gap-2">
                  {ignoredFolders.map(folder => (
                    <span
                      key={folder}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {folder}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Files</h2>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="flex rounded-md border border-slate-300 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-950">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={[
                      'flex size-8 items-center justify-center rounded text-slate-500 transition dark:text-slate-400',
                      viewMode === 'list'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                        : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
                    ].join(' ')}
                    title="List view"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('tiles')}
                    className={[
                      'flex size-8 items-center justify-center rounded text-slate-500 transition dark:text-slate-400',
                      viewMode === 'tiles'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                        : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
                    ].join(' ')}
                    title="Tile view"
                  >
                    <Grid2X2 size={16} />
                  </button>
                </div>
                <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {loading ? <Loader2 size={13} className="animate-spin" /> : null}
                  {scan?.truncated ? `Limited to ${scan.maxFiles}` : `${files.length} listed`}
                </span>
              </div>
            </div>

            {error ? (
              <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
                <div className="max-w-sm">
                  <AlertTriangle className="mx-auto mb-3 text-amber-500" size={32} />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{error}</p>
                </div>
              </div>
            ) : files.length === 0 && !loading ? (
              <div className="flex min-h-[420px] items-center justify-center p-8 text-center">
                <div className="max-w-sm">
                  <FolderTree className="mx-auto mb-3 text-slate-400" size={32} />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    No files found
                  </p>
                </div>
              </div>
            ) : (
              viewMode === 'list'
                ? <ListView files={files} onOpenFile={setIsolatedFile} />
                : <TileView files={files} onOpenFile={setIsolatedFile} />
            )}
          </section>
        </section>
      </div>
      <MediaOverlay file={isolatedMedia} onClose={() => setIsolatedFile(null)} />
      <TextOverlay file={isolatedText} onClose={() => setIsolatedFile(null)} />
    </main>
  )
}

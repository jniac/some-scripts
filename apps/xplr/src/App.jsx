import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  File,
  FileImage,
  FileText,
  Film,
  FolderTree,
  Gauge,
  Loader2,
  Search,
  Server,
  SlidersHorizontal,
} from 'lucide-react'

const fileTypes = [
  { label: 'All', value: 'all' },
  { label: 'Images', value: 'image', icon: FileImage },
  { label: 'Videos', value: 'video', icon: Film },
  { label: 'Text', value: 'text', icon: FileText },
]

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

export function App() {
  const [meta, setMeta] = useState(null)
  const [nameFilter, setNameFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
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
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Files</h2>
              <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                {loading ? <Loader2 size={13} className="animate-spin" /> : null}
                {scan?.truncated ? `Limited to ${scan.maxFiles}` : `${files.length} listed`}
              </span>
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
              <div className="max-h-[calc(100vh-270px)] min-h-[420px] overflow-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="w-10 px-4 py-3 font-medium" />
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 text-right font-medium">Size</th>
                      <th className="px-4 py-3 text-right font-medium">Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {files.map(file => (
                      <tr key={file.relativePath} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                        <td className="px-4 py-3">
                          <FileTypeIcon type={file.type} />
                        </td>
                        <td className="max-w-0 px-4 py-3">
                          <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                            {file.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {file.relativePath}
                          </p>
                        </td>
                        <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">
                          {file.type}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">
                          {formatSize(file.size)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                          {formatDate(file.mtimeMs)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type ApiStatus = 'loading' | 'ok' | 'error'

const statusClasses: Record<ApiStatus, string> = {
  loading: 'text-slate-600',
  ok: 'text-green-700',
  error: 'text-red-700',
}

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading')
  const [apiMessage, setApiMessage] = useState('checking...')

  useEffect(() => {
    let isMounted = true

    const checkApi = async () => {
      try {
        const apiHealthUrl = `${API_BASE_URL.replace(/\/$/, '')}/health`
        const response = await fetch(apiHealthUrl)
        if (!response.ok) {
          throw new Error('API request failed')
        }

        const data = (await response.json()) as { status?: string }

        if (isMounted) {
          setApiStatus('ok')
          setApiMessage(data.status ?? 'ok')
        }
      } catch {
        if (isMounted) {
          setApiStatus('error')
          setApiMessage('unavailable')
        }
      }
    }

    void checkApi()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen grid place-items-center">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Nameweaver</h1>
        <p className="mt-3 text-slate-700">
          API status:{' '}
          <strong className={statusClasses[apiStatus]}>{apiMessage}</strong>
        </p>
      </section>
    </main>
  )
}

export default App

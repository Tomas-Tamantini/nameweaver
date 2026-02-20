import { useEffect, useState } from 'react'

import './App.css'

const API_URL = 'http://localhost:8000'

type ApiStatus = 'loading' | 'ok' | 'error'

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading')
  const [apiMessage, setApiMessage] = useState('checking...')

  useEffect(() => {
    let isMounted = true

    const checkApi = async () => {
      try {
        const api_health_url = `${API_URL}/health`
        const response = await fetch(api_health_url)
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
    <main className="app">
      <h1>Nameweaver</h1>
      <p>
        API status:{' '}
        <strong className={`status status-${apiStatus}`}>{apiMessage}</strong>
      </p>
    </main>
  )
}

export default App

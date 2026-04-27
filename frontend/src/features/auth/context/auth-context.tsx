import {
  login as authLogin,
  register as authRegister,
} from '@/features/auth/services/auth-service'
import { clearTokens, getTokens, setTokens } from '@/lib/auth/token-store'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const tokens = getTokens()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ isAuthenticated: !!tokens, isLoading: false })

    const handleLogout = () => {
      setState({ isAuthenticated: false, isLoading: false })
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const tokens = await authLogin(username, password)
    setTokens(tokens)
    setState({ isAuthenticated: true, isLoading: false })
  }, [])

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await authRegister(username, email, password)
      const tokens = await authLogin(username, password)
      setTokens(tokens)
      setState({ isAuthenticated: true, isLoading: false })
    },
    [],
  )

  const logout = useCallback(() => {
    clearTokens()
    setState({ isAuthenticated: false, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

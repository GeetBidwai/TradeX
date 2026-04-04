import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  clearStoredAuth,
  getStoredAuth,
  getUserProfileByIdentifier,
  loginUser,
  registerUser,
  setStoredAuth,
} from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuth())
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    setStoredAuth(authState)
  }, [authState])

  const login = async (credentials) => {
    setAuthLoading(true)

    try {
      const response = await loginUser({
        username: credentials.username,
        password: credentials.password,
      })
      const profile = await getUserProfileByIdentifier(credentials.username)
      const nextState = {
        token: response.data.access,
        refreshToken: response.data.refresh || '',
        role: profile?.role || credentials.role || '',
        user: profile,
      }

      setAuthState(nextState)
      return nextState
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (formData) => {
    setAuthLoading(true)

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      })
      return response.data
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    clearStoredAuth()
    setAuthState({
      token: '',
      refreshToken: '',
      role: '',
      user: null,
    })
  }

  const value = useMemo(
    () => ({
      ...authState,
      authLoading,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
      register,
    }),
    [authLoading, authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

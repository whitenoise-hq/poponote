import { useState, useCallback, createContext, useContext } from 'react'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export { AuthContext }
import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

// Crear el contexto
export const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing user:', e)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
  try {
    console.log('🔐 Intentando login con:', email)
    
    const response = await api.post('/api/auth/login', { email, password })
    
    console.log('📦 Respuesta completa:', response)
    console.log('📦 Data recibida:', response.data)
    
    const { access_token, user: userData } = response.data
    
    console.log('🔑 Token:', access_token)
    console.log('👤 Usuario:', userData)
    
    if (!access_token) {
      console.error('❌ No se recibió token')
      return { success: false, error: 'No se recibió token de autenticación' }
    }
    
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    
    console.log('✅ Login exitoso, usuario guardado')
    return { success: true }
  } catch (error) {
    console.error('❌ Error en login:', error)
    console.error('❌ Response error:', error.response)
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Error al iniciar sesión' 
    }
  }
}

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
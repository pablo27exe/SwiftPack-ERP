import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

const RegisterPage = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.post('/api/auth/register', {
        nombre,
        email,
        password,
        telefono
      })
      
      setSuccess('Registro exitoso. Redirigiendo al login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page page-form">
      <div className="section-header">
        <h1>Crear cuenta</h1>
        <p>Regístrate para comenzar a usar SwiftPack</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="input-group full-width">
          <span>Nombre completo *</span>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Juan Pérez" 
            required 
          />
        </label>

        <label className="input-group full-width">
          <span>Correo electrónico *</span>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="usuario@ejemplo.com" 
            required 
          />
        </label>

        <label className="input-group full-width">
          <span>Contraseña *</span>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="********" 
            required 
            minLength={6}
          />
        </label>

        <label className="input-group full-width">
          <span>Teléfono (opcional)</span>
          <input 
            type="tel" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            placeholder="555-1234" 
          />
        </label>

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="form-footer">
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
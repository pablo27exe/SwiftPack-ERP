import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <section className="page page-form">
      <div className="section-header">
        <h1>Iniciar sesión</h1>
        <p>Accede al panel para administración o seguimiento de envíos.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="input-group full-width">
          <span>Correo electrónico</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="usuario@empresa.com" />
        </label>
        <label className="input-group full-width">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="********" />
        </label>
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      <div className="form-footer">
        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
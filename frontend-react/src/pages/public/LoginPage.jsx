import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
 
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: '#f5f7fa',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(17,81,156,0.08)',
    padding: '2.5rem 2.25rem',
    width: '100%',
    maxWidth: '420px',
  },
  accentBar: {
    height: '3px',
    borderRadius: '99px',
    background: 'linear-gradient(90deg, #11519c 0%, #2e89c6 50%, #ef5a07 100%)',
    marginBottom: '2rem',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1.75rem',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: '#11519c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#11519c',
    letterSpacing: '-0.01em',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#0f1c2e',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  subheading: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 2rem',
  },
  fieldGroup: {
    marginBottom: '1.1rem',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px',
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '16px',
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    padding: '10px 14px 10px 40px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#111827',
    background: '#f9fafb',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    outline: 'none',
    appearance: 'none',
  },
  inputFocused: {
    borderColor: '#2e89c6',
    boxShadow: '0 0 0 3px rgba(46,137,198,0.15)',
    background: '#fff',
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    background: '#11519c',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.2s, transform 0.1s',
    letterSpacing: '-0.01em',
  },
  submitBtnHover: { background: '#2e89c6' },
  submitBtnDisabled: { background: '#9ca3af', cursor: 'not-allowed' },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#991b1b',
    marginTop: '1rem',
  },
  divider: {
    height: '1px',
    background: '#f3f4f6',
    margin: '1.5rem 0',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6b7280',
  },
  footerLink: {
    color: '#2e89c6',
    textDecoration: 'none',
    fontWeight: '600',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
}
 
const ICON_SVG = {
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  package: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  alertCircle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}
 
const InputField = ({ label, icon, ...inputProps }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        <span style={styles.inputIcon}>{icon}</span>
        <input
          {...inputProps}
          style={{ ...styles.input, ...(focused ? styles.inputFocused : {}) }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  )
}
 
const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
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
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .login-card { animation: fadeUp 0.4s ease both; }
      `}</style>
 
      <div style={styles.page}>
        <div style={styles.card} className="login-card">

 
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>{ICON_SVG.package}</div>
            <span style={styles.brandName}>SwiftPack</span>
          </div>
 
          <div style={styles.accentBar} />
 
          <h1 style={styles.heading}>Iniciar sesión</h1>
          <p style={styles.subheading}>Accede al panel para administración o seguimiento de envíos.</p>
 
          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Correo electrónico"
              icon={ICON_SVG.mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@empresa.com"
              required
              autoComplete="email"
            />
            <InputField
              label="Contraseña"
              icon={ICON_SVG.lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
 
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : btnHover ? styles.submitBtnHover : {}),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  {ICON_SVG.arrowRight}
                </>
              )}
            </button>
          </form>
 
          {error && (
            <div style={styles.errorBox}>
              {ICON_SVG.alertCircle}
              <span>{error}</span>
            </div>
          )}
 
          <div style={styles.divider} />
 
          <div style={styles.footer}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={styles.footerLink}>
              Regístrate aquí
            </Link>
          
          </div>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <Link 
              to="/" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#11519c'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Volver al inicio
            </Link>
          </div>
 
        </div>
      </div>
    </>
  )
}
 
export default LoginPage
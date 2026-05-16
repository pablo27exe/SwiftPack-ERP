import { Link, Outlet, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/cotizar', label: 'Cotizar envío' },
  { to: '/registro-envio', label: 'Registrar envío' },
  { to: '/rastrear', label: 'Rastrear envío' },
]

const PublicLayout = () => {
  const location = useLocation()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <Link to="/" className="brand-title">SwiftPack ERP</Link>
          <p className="brand-subtitle">Cotiza, registra y rastrea envíos B2C/B2B sin complicaciones.</p>
        </div>

        <nav className="app-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="app-container">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>SwiftPack ERP</p>
      </footer>
    </div>
  )
}

export default PublicLayout

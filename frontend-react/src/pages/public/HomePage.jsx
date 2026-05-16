import { Link } from 'react-router-dom'

const HomePage = () => {
  const clientServices = [
    { title: 'Cotizar Envío', desc: 'Cálculo de costos express y estándar.', href: '/cotizar', icon: '💰' },
    { title: 'Registrar Envío', desc: 'Genera nuevas guías de transporte.', href: '/registro-envio', icon: '📝' },
    { title: 'Rastrear Guía', desc: 'Seguimiento público en tiempo real.', href: '/rastrear', icon: '📍' },
  ]

  const crmServices = [
    { title: 'Historial', desc: 'Mis envíos anteriores y estados.', href: '/historial', icon: '📋' },
    { title: 'Direcciones', desc: 'Gestionar puntos frecuentes.', href: '/direcciones', icon: '🏠' },
  ]

  return (
  <section className="page page-home">
    <div className="hero-panel">
      <div>
        <h2>Dashboard de Logística SwiftPack</h2>
        <p>Bienvenido al centro de control. Gestiona tus envíos y consulta rutas desde un solo lugar.</p>
      </div>
      <div className="hero-actions">
        <Link to="/rutas-repartidor" className="button-primary">🚀 Ver Rutas de Repartidor</Link>
      </div>
    </div>

    <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>Servicios al Cliente</h3>
    <div className="cards-grid">
      {clientServices.map((s) => (
        <article key={s.href} className="feature-card">
          <span style={{ fontSize: '2rem' }}>{s.icon}</span>
          <h2>{s.title}</h2>
          <p>{s.desc}</p>
          <Link to={s.href} className="button-link">Abrir módulo</Link>
        </article>
      ))}
    </div>

    <h3 style={{ marginTop: '2rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>Gestión y CRM</h3>
    <div className="cards-grid">
      {crmServices.map((s) => (
        <article key={s.href} className="feature-card">
          <span style={{ fontSize: '2rem' }}>{s.icon}</span>
          <h2>{s.title}</h2>
          <p>{s.desc}</p>
          <Link to={s.href} className="button-link">Administrar</Link>
        </article>
      ))}
    </div>
  </section>
  )
}

export default HomePage

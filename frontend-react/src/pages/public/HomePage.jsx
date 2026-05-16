import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  // Servicios públicos (no requieren login)
  const publicServices = [
    { title: 'Cotizar Envío', desc: 'Cálculo de costos express y estándar.', href: '/cotizar', icon: '💰' },
    { title: 'Registrar Envío', desc: 'Genera nuevas guías de transporte.', href: '/registro-envio', icon: '📝' },
    { title: 'Rastrear Guía', desc: 'Seguimiento público en tiempo real.', href: '/rastrear', icon: '📍' },
  ]

  // Servicios protegidos (requieren login)
  const protectedServices = [
    { title: 'Mis Envíos', desc: 'Historial de envíos anteriores y estados.', href: '/cliente/envios', icon: '📋' },
    { title: 'Direcciones', desc: 'Gestionar puntos frecuentes.', href: '/cliente/direcciones', icon: '🏠' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero panel */}
      <div className="bg-gradient-to-r from-swift-primary to-swift-primary-light text-white p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">SwiftPack Logística</h1>
        <p className="text-lg mb-4">Soluciones rápidas y confiables para tus envíos</p>
        <Link to="/cotizar" className="bg-swift-accent text-white px-6 py-2 rounded-lg hover:bg-swift-accent-light transition inline-block">
          Cotizar ahora
        </Link>
      </div>

      {/* Servicios Públicos */}
      <h2 className="text-2xl font-bold mb-4">Servicios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {publicServices.map((s) => (
          <div key={s.href} className="bg-white rounded-lg shadow p-6 text-center border border-gray-200 hover:shadow-lg transition">
            <span className="text-4xl">{s.icon}</span>
            <h3 className="text-xl font-semibold mt-2 mb-2">{s.title}</h3>
            <p className="text-gray-600 mb-4">{s.desc}</p>
            <Link to={s.href} className="text-swift-primary hover:text-swift-accent font-medium">
              {s.title === 'Cotizar Envío' ? 'Cotizar' : s.title === 'Registrar Envío' ? 'Registrar' : 'Rastrear'}
            </Link>
          </div>
        ))}
      </div>

      {/* Servicios Protegidos (solo si está autenticado) */}
      <h2 className="text-2xl font-bold mb-4">Mi Cuenta</h2>
      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protectedServices.map((s) => (
            <div key={s.href} className="bg-white rounded-lg shadow p-6 text-center border border-gray-200 hover:shadow-lg transition">
              <span className="text-4xl">{s.icon}</span>
              <h3 className="text-xl font-semibold mt-2 mb-2">{s.title}</h3>
              <p className="text-gray-600 mb-4">{s.desc}</p>
              <Link to={s.href} className="text-swift-primary hover:text-swift-accent font-medium">
                Administrar
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            🔒 Inicia sesión para acceder a tu historial de envíos y direcciones frecuentes.
          </p>
          <Link to="/login" className="bg-swift-primary text-white px-6 py-2 rounded-lg hover:bg-swift-primary-light transition inline-block">
            Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  )
}

export default HomePage
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const HomePage = () => {
  const { isAuthenticated, user } = useAuth()

  // Servicios generales (cualquier rol autenticado)
  const generalServices = [
    { title: 'Cotizar Envío', desc: 'Cálculo de costos express y estándar.', href: '/cotizar', icon: '💰' },
    { title: 'Registrar Envío', desc: 'Genera nuevas guías de transporte.', href: '/registro-envio', icon: '📝' },
    { title: 'Rastrear Guía', desc: 'Seguimiento en tiempo real.', href: '/rastrear', icon: '📍' },
  ]

  // Servicios solo para clientes
  const clientServices = [
    { title: 'Mis Envíos', desc: 'Historial de envíos anteriores y estados.', href: '/cliente/envios', icon: '📋' },
    { title: 'Direcciones', desc: 'Gestionar puntos frecuentes.', href: '/cliente/direcciones', icon: '🏠' },
  ]

  // Servicios solo para admin/operador
  const adminServices = [
    { title: 'Panel Admin', desc: 'Gestión completa del sistema.', href: '/admin/dashboard', icon: '⚙️' },
    { title: 'Gestión de Envíos', desc: 'Administrar todos los envíos.', href: '/admin/envios', icon: '📦' },
    { title: 'Gestión de Clientes', desc: 'Administrar clientes.', href: '/admin/clientes', icon: '👥' },
    { title: 'Gestión de Tarifas', desc: 'Configurar precios y tarifas.', href: '/admin/tarifas', icon: '💰' },
    { title: 'Recursos Humanos', desc: 'Gestionar empleados.', href: '/admin/rh', icon: '👔' },
    { title: 'Reportes', desc: 'Exportar datos y estadísticas.', href: '/admin/reportes', icon: '📊' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero panel con gradiente azul SwiftPack */}
      <div className="bg-gradient-to-r from-[#11519c] to-[#2e89c6] text-white p-8 rounded-lg mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">SwiftPack Logística</h1>
        <p className="text-lg mb-4">Soluciones rápidas y confiables para tus envíos</p>
        {!isAuthenticated && (
          <Link 
            to="/login" 
            className="bg-[#ef5a07] text-white px-6 py-2 rounded-lg hover:bg-[#fd8106] transition inline-block font-semibold"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>

      {isAuthenticated ? (
        <>
          {/* Servicios Generales (todos los roles) */}
          <h2 className="text-2xl font-bold mb-4 text-[#11519c]">Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {generalServices.map((s) => (
              <div 
                key={s.href} 
                className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-4xl">{s.icon}</span>
                <h3 className="text-xl font-semibold mt-2 mb-2 text-[#11519c]">{s.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{s.desc}</p>
                <Link 
                  to={s.href} 
                  className="text-[#11519c] hover:text-[#ef5a07] font-medium transition"
                >
                  Acceder →
                </Link>
              </div>
            ))}
          </div>

          {/* Servicios de Cliente (solo para rol 'cliente') */}
          {user?.rol === 'cliente' && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-[#11519c]">Mi Cuenta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {clientServices.map((s) => (
                  <div 
                    key={s.href} 
                    className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-4xl">{s.icon}</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2 text-[#11519c]">{s.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{s.desc}</p>
                    <Link 
                      to={s.href} 
                      className="text-[#11519c] hover:text-[#ef5a07] font-medium transition"
                    >
                      Administrar →
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Servicios de Admin (solo para roles 'admin' o 'operador') */}
          {(user?.rol === 'admin' || user?.rol === 'operador') && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-[#11519c]">Panel de Administración</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminServices.map((s) => (
                  <div 
                    key={s.href} 
                    className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-4xl">{s.icon}</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2 text-[#11519c]">{s.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{s.desc}</p>
                    <Link 
                      to={s.href} 
                      className="text-[#11519c] hover:text-[#ef5a07] font-medium transition"
                    >
                      Acceder →
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-600 mb-4 text-lg">
            🔒 Para acceder a todos los servicios, por favor inicia sesión.
          </p>
          <Link 
            to="/login" 
            className="bg-[#11519c] text-white px-8 py-3 rounded-lg hover:bg-[#2e89c6] transition inline-block text-lg font-semibold"
          >
            Iniciar Sesión
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[#ef5a07] hover:text-[#fd8106] hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default HomePage
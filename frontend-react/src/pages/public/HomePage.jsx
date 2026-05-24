import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CircularGallery } from '../../components/ui'

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

  // Items para la galería circular (solo para no autenticados)
  const galleryItems = [
    { image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop', text: 'Flota propia' },
    { image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop', text: 'Almacenes' },
    { image: 'https://imgs.search.brave.com/OEDscU2PlTTJCA-7KqVQmj-HqvHxWBDbzLJe4fMsZh4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saDYu/Z29vZ2xldXNlcmNv/bnRlbnQuY29tL2d5/QWNfUTE4MDdWOXhf/VmZINkxNdzcyS1Mx/Zmx0U3Y5dmM2X1BO/dE4xZ0FiTTNVZXFI/TmlXekVzNnNPTFQw/SDdBZko5UF9YakJm/X2tuT3RzUWppbTIy/Y3hYVnpQZnJhWlJh/WmR0OER3U3h1bldB/UXpXU19uc3BuVGJx/ejZKS1dRSk5oeUpq/QlRIUFo4Y1NmMUcz/TmpfUQ', text: 'Entregas seguras' },
    { image: 'https://imgs.search.brave.com/BZC5wuePl237YZF9TGI_n04s4PYzaOPlGb8HMZYWKNc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dWJpY2Fsby5jb20u/bXgvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMDEvcmFzdHJl/by1zYXRlbGl0YWwt/MzAweDIwMC5wbmc', text: 'Rastreo en vivo' },
    { image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop', text: 'Soporte 24/7' },
    { image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=600&fit=crop', text: 'Envíos internacionales' },
    { image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop', text: 'Logística' },
    { image: 'https://imgs.search.brave.com/mOO-SO1v156bjP18U4wAb0-Zj6Nt9nZboIEx3ZHi2F4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zbW93/bC5uZXQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjQvMDcvZGln/aXRhbC10ZWNobm9s/b2d5LWVkdWNhdGlv/bi5qcGc', text: 'Tecnología' },
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

      {/* Galería Circular 3D - SOLO para usuarios NO autenticados (marketing) */}
      {!isAuthenticated && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#11519c] text-center">Conoce SwiftPack</h2>
          <div style={{ height: '520px', position: 'relative' }}>
            <CircularGallery 
              bend={1.2}
              textColor="#000000"
              borderRadius={0.08}
              scrollSpeed={1.8}
              scrollEase={0.04}
              items={galleryItems}
            />
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/register" 
              className="bg-[#ef5a07] text-white px-8 py-3 rounded-lg hover:bg-[#fd8106] transition inline-block text-lg font-semibold"
            >
              Comienza ahora
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              Regístrate gratis y comienza a usar todos nuestros servicios
            </p>
          </div>
        </div>
      )}

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
            🔒 ¿Ya tienes cuenta? Inicia sesión para acceder a todos los servicios.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/login" 
              className="bg-[#11519c] text-white px-8 py-3 rounded-lg hover:bg-[#2e89c6] transition inline-block text-lg font-semibold"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-[#11519c] text-[#11519c] px-8 py-3 rounded-lg hover:bg-[#11519c] hover:text-white transition inline-block text-lg font-semibold"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
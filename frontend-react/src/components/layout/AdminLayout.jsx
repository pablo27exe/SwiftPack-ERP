import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Si no es admin ni operador, mostrar mensaje
  if (user?.rol !== 'admin' && user?.rol !== 'operador') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h1>
          <p className="mb-4">No tienes permisos para acceder al panel de administración.</p>
          <Link to="/" className="text-[#11519c] hover:underline">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Botón de hamburguesa (solo visible en móvil) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 p-2 bg-[#11519c] text-white rounded-lg md:hidden shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-[#11519c] text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-[#2e89c6]">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">SwiftPack Admin</h1>
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-1">{user?.nombre}</p>
          <p className="text-xs text-blue-300 mt-0.5 capitalize">{user?.rol}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/envios" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span>📦</span>
            <span>Gestión de envíos</span>
          </Link>
          <Link 
            to="/admin/clientes" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span>👥</span>
            <span>Gestión de clientes</span>
          </Link>
          <Link 
            to="/admin/tarifas" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span>💰</span>
            <span>Configurar tarifas</span>
          </Link>
          <Link 
            to="/admin/rh" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span>👔</span>
            <span>Recursos Humanos</span>
          </Link>
          <Link 
            to="/admin/reportes" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <span>📈</span>
            <span>Reportes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#2e89c6]">
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#ef5a07] transition-colors w-full"
          >
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
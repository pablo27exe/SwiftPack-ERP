import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Azul SwiftPack */}
      <aside className="w-64 bg-[#2e89c6] text-white flex flex-col">
        <div className="p-4 border-b border-[#2e89c6]">
          <h1 className="text-xl font-bold">SwiftPack Admin</h1>
          <p className="text-sm text-blue-200 mt-1">{user?.nombre}</p>
          <p className="text-xs text-blue-300 mt-0.5 capitalize">{user?.rol}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/envios" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
          >
            <span>📦</span>
            <span>Gestión de envíos</span>
          </Link>
          <Link 
            to="/admin/clientes" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
          >
            <span>👥</span>
            <span>Gestión de clientes</span>
          </Link>
          <Link 
            to="/admin/tarifas" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
          >
            <span>💰</span>
            <span>Configurar tarifas</span>
          </Link>
          <Link 
            to="/admin/rh" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
          >
            <span>👔</span>
            <span>Recursos Humanos</span>
          </Link>
          <Link 
            to="/admin/reportes" 
            className="flex items-center space-x-3 p-2 rounded hover:bg-[#2e89c6] transition-colors"
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
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
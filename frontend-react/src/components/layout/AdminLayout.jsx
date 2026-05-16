import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Si no es admin, mostrar mensaje
  if (user?.rol !== 'admin' && user?.rol !== 'operador') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h1>
          <p className="mb-4">No tienes permisos para acceder al panel de administración.</p>
          <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">SwiftPack Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.nombre}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition">
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/envios" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition">
            <span>📦</span>
            <span>Gestión de envíos</span>
          </Link>
          <Link to="/admin/clientes" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition">
            <span>👥</span>
            <span>Gestión de clientes</span>
          </Link>
          <Link to="/admin/tarifas" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition">
            <span>💰</span>
            <span>Configurar tarifas</span>
          </Link>
          <Link to="/admin/rh" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition">
            <span>👔</span>
            <span>Recursos Humanos</span>
          </Link>
          <Link to="/admin/reportes" className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition">
            <span>📈</span>
            <span>Reportes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition w-full">
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
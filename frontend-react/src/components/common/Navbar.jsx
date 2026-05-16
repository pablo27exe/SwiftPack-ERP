import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            SwiftPack 🚚
          </Link>

          {/* Links centrales */}
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-blue-200">Inicio</Link>
            <Link to="/cotizar" className="hover:text-blue-200">Cotizar</Link>
            <Link to="/rastrear" className="hover:text-blue-200">Rastrear</Link>
          </div>

          {/* User section */}
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {user?.nombre} ({user?.rol})
                </span>
                {user?.rol === 'admin' && (
                  <Link to="/admin/dashboard" className="hover:text-blue-200">
                    Admin
                  </Link>
                )}
                {user?.rol === 'cliente' && (
                  <Link to="/cliente/dashboard" className="hover:text-blue-200">
                    Mi Cuenta
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-green-500 px-4 py-1 rounded hover:bg-green-600">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
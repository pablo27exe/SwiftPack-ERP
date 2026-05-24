import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnvio } from '../../context/EnvioContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardCliente = () => {
  const { user, logout } = useAuth();
  const { envios, obtenerEnvios, loading } = useEnvio();
  const [ultimosEnvios, setUltimosEnvios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerEnvios();
    setUltimosEnvios(data.slice(0, 5));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con botón de cierre de sesión */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#11519c]">¡Bienvenido, {user?.nombre}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <span>🚪</span>
          Cerrar sesión
        </button>
      </div>

      {/* Stats cards con colores SwiftPack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-[#11519c]">Total de envíos</h3>
          <p className="text-3xl font-bold text-[#11519c]">{envios.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
          <h3 className="text-lg font-semibold text-green-700">Envíos entregados</h3>
          <p className="text-3xl font-bold text-green-600">
            {envios.filter(e => e.estado === 'entregado').length}
          </p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg shadow border border-orange-100">
          <h3 className="text-lg font-semibold text-[#ef5a07]">En tránsito</h3>
          <p className="text-3xl font-bold text-[#ef5a07]">
            {envios.filter(e => e.estado === 'en_transito').length}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link 
          to="/cotizar" 
          className="bg-[#11519c] text-white p-4 rounded-lg text-center hover:bg-[#2e89c6] transition shadow-md"
        >
          📦 Cotizar nuevo envío
        </Link>
        <Link 
          to="/cliente/envios" 
          className="bg-[#ef5a07] text-white p-4 rounded-lg text-center hover:bg-[#fd8106] transition shadow-md"
        >
          📋 Ver historial de envíos
        </Link>
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#11519c]">Últimos envíos</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {ultimosEnvios.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No tienes envíos recientes</p>
          ) : (
            ultimosEnvios.map((envio) => (
              <div key={envio.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Guía: <span className="font-mono text-[#11519c]">{envio.numero_guia}</span></p>
                  <p className="text-sm text-gray-500">
                    {envio.origen} → {envio.destino}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    envio.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                    envio.estado === 'en_transito' ? 'bg-orange-100 text-[#ef5a07]' :
                    'bg-blue-100 text-[#11519c]'
                  }`}>
                    {envio.estado === 'en_transito' ? 'En tránsito' : envio.estado}
                  </span>
                  <Link 
                    to={`/rastrear/${envio.numero_guia}`} 
                    className="text-[#11519c] hover:text-[#ef5a07] text-sm font-medium transition"
                  >
                    Rastrear →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;
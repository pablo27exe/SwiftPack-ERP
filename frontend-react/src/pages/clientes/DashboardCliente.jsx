import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnvio } from '../../context/EnvioContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DashboardCliente = () => {
  const { user } = useAuth();
  const { envios, obtenerEnvios, loading } = useEnvio();
  const [ultimosEnvios, setUltimosEnvios] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const data = await obtenerEnvios();
    setUltimosEnvios(data.slice(0, 5));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">¡Bienvenido, {user?.nombre}!</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total de envíos</h3>
          <p className="text-3xl font-bold text-blue-600">{envios.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Envíos entregados</h3>
          <p className="text-3xl font-bold text-green-600">
            {envios.filter(e => e.estado === 'entregado').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">En tránsito</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {envios.filter(e => e.estado === 'en_transito').length}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/cotizar" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
          📦 Cotizar nuevo envío
        </Link>
        <Link to="/cliente/envios" className="bg-gray-600 text-white p-4 rounded-lg text-center hover:bg-gray-700">
          📋 Ver historial de envíos
        </Link>
      </div>

      {/* Recent shipments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Últimos envíos</h2>
        </div>
        <div className="divide-y">
          {ultimosEnvios.length === 0 ? (
            <p className="p-6 text-gray-500">No tienes envíos recientes</p>
          ) : (
            ultimosEnvios.map((envio) => (
              <div key={envio.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">Guía: {envio.numero_guia}</p>
                  <p className="text-sm text-gray-500">
                    {envio.origen} → {envio.destino}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-sm ${
                    envio.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                    envio.estado === 'en_transito' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {envio.estado}
                  </span>
                  <Link to={`/rastrear/${envio.numero_guia}`} className="ml-4 text-blue-600 text-sm">
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
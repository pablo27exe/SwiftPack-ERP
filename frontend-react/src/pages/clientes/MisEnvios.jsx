import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEnvio } from '../../context/EnvioContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MisEnvios = () => {
  const { envios, obtenerEnvios, loading } = useEnvio();
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    obtenerEnvios();
  }, []);

  const enviosFiltrados = filtro === 'todos' 
    ? envios 
    : envios.filter(e => e.estado === filtro);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis envíos</h1>

      {/* Filtros */}
      <div className="flex space-x-2 mb-6">
        {['todos', 'pendiente', 'en_transito', 'entregado'].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded ${
              filtro === estado 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {estado === 'todos' ? 'Todos' : 
             estado === 'en_transito' ? 'En tránsito' :
             estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabla de envíos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guía</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen → Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enviosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay envíos
                </td>
              </tr>
            ) : (
              enviosFiltrados.map((envio) => (
                <tr key={envio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{envio.numero_guia}</td>
                  <td className="px-6 py-4">{envio.origen} → {envio.destino}</td>
                  <td className="px-6 py-4 text-sm">{new Date(envio.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      envio.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                      envio.estado === 'en_transito' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {envio.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/rastrear/${envio.numero_guia}`} className="text-blue-600 hover:underline">
                      Rastrear
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MisEnvios;
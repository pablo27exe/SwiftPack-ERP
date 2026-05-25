import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const GestionEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filtro, setFiltro] = useState({ estado: '', busqueda: '' });

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      const response = await api.get('/api/admin/envios');
      setEnvios(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar envíos' });
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/api/admin/envios/${id}/estado`, { estado: nuevoEstado });
      setAlert({ type: 'success', message: 'Estado actualizado' });
      cargarEnvios();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar' });
    }
  };

  const eliminarEnvio = async (id) => {
    if (!confirm('¿Eliminar este envío?')) return;
    try {
      await api.delete(`/api/admin/envios/${id}`);
      setAlert({ type: 'success', message: 'Envío eliminado' });
      cargarEnvios();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar' });
    }
  };

  // Función para obtener el nombre del cliente (prioriza remitente_nombre)
  const obtenerNombreCliente = (envio) => {
    return envio.remitente_nombre || envio.cliente_nombre || 'N/A';
  };

  const enviosFiltrados = envios.filter(e => {
    if (filtro.estado && e.estado !== filtro.estado) return false;
    if (filtro.busqueda) {
      const busquedaLower = filtro.busqueda.toLowerCase();
      const coincideGuia = e.numero_guia?.toLowerCase().includes(busquedaLower);
      const coincideCliente = obtenerNombreCliente(e).toLowerCase().includes(busquedaLower);
      if (!coincideGuia && !coincideCliente) return false;
    }
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#11519c]">Gestión de envíos</h1>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por guía o cliente..."
          value={filtro.busqueda}
          onChange={(e) => setFiltro({ ...filtro, busqueda: e.target.value })}
          className="px-3 py-2 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-[#11519c]"
        />
        <select
          value={filtro.estado}
          onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_transito">En tránsito</option>
          <option value="entregado">Entregado</option>
        </select>
        <button 
          onClick={cargarEnvios} 
          className="bg-[#11519c] text-white px-4 py-2 rounded hover:bg-[#2e89c6] transition"
        >
          Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guía</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen → Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enviosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay envíos registrados
                </td>
              </tr>
            ) : (
              enviosFiltrados.map((envio) => (
                <tr key={envio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-[#11519c]">{envio.numero_guia}</td>
                  <td className="px-6 py-4">{obtenerNombreCliente(envio)}</td>
                  <td className="px-6 py-4 text-sm">{envio.origen} → {envio.destino}</td>
                  <td className="px-6 py-4">
                    <select
                      value={envio.estado}
                      onChange={(e) => actualizarEstado(envio.id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border cursor-pointer ${
                        envio.estado === 'entregado' ? 'bg-green-100 text-green-700 border-green-300' :
                        envio.estado === 'en_transito' ? 'bg-orange-100 text-[#ef5a07] border-orange-300' : 
                        'bg-yellow-100 text-yellow-700 border-yellow-300'
                      }`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_transito">En tránsito</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => eliminarEnvio(envio.id)} 
                      className="text-red-600 hover:text-red-800 hover:underline transition"
                    >
                      Eliminar
                    </button>
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

export default GestionEnvios;
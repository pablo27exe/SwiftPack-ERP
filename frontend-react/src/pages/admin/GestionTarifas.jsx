import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const GestionTarifas = () => {
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ tipo_servicio: 'estandar', origen_zona: '', destino_zona: '', costo_base: 0, costo_por_kg: 0 });

  useEffect(() => {
    cargarTarifas();
  }, []);

  const cargarTarifas = async () => {
    try {
      const response = await api.get('/admin/tarifas');
      setTarifas(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar tarifas' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/admin/tarifas/${editando}`, formData);
        setAlert({ type: 'success', message: 'Tarifa actualizada' });
      } else {
        await api.post('/admin/tarifas', formData);
        setAlert({ type: 'success', message: 'Tarifa creada' });
      }
      setEditando(null);
      setFormData({ tipo_servicio: 'estandar', origen_zona: '', destino_zona: '', costo_base: 0, costo_por_kg: 0 });
      cargarTarifas();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar' });
    }
  };

  const eliminarTarifa = async (id) => {
    if (!confirm('¿Eliminar esta tarifa?')) return;
    try {
      await api.delete(`/admin/tarifas/${id}`);
      setAlert({ type: 'success', message: 'Tarifa eliminada' });
      cargarTarifas();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuración de tarifas</h1>
        <button onClick={() => { setEditando(null); setFormData({ tipo_servicio: 'estandar', origen_zona: '', destino_zona: '', costo_base: 0, costo_por_kg: 0 }); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nueva tarifa
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Formulario */}
      {(editando !== null || document.activeElement?.type !== 'button') && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editando ? 'Editar' : 'Nueva'} tarifa</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="tipo_servicio" value={formData.tipo_servicio} onChange={handleChange} className="px-3 py-2 border rounded">
              <option value="estandar">Estándar</option>
              <option value="express">Express</option>
              <option value="programado">Programado</option>
            </select>
            <input type="text" name="origen_zona" placeholder="Zona origen" value={formData.origen_zona} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <input type="text" name="destino_zona" placeholder="Zona destino" value={formData.destino_zona} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <input type="number" name="costo_base" placeholder="Costo base" value={formData.costo_base} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <input type="number" name="costo_por_kg" placeholder="Costo por kg" value={formData.costo_por_kg} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <div className="flex space-x-2 md:col-span-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
              <button type="button" onClick={() => setEditando(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo base</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Por kg</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tarifas.map((tarifa) => (
              <tr key={tarifa.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 capitalize">{tarifa.tipo_servicio}</td>
                <td className="px-6 py-4">{tarifa.origen_zona}</td>
                <td className="px-6 py-4">{tarifa.destino_zona}</td>
                <td className="px-6 py-4">${tarifa.costo_base}</td>
                <td className="px-6 py-4">${tarifa.costo_por_kg}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => { setEditando(tarifa.id); setFormData(tarifa); }} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => eliminarTarifa(tarifa.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionTarifas;
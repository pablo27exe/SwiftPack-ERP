import { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DireccionesFrecuentes = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    alias: '',
    calle: '',
    ciudad: '',
    codigo_postal: '',
    es_remitente: false,
    es_destinatario: false
  });

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const cargarDirecciones = async () => {
    setLoading(true);
    try {
      const response = await api.get('/clientes/direcciones');
      setDirecciones(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar direcciones' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editandoId) {
        await api.put(`/clientes/direcciones/${editandoId}`, formData);
        setAlert({ type: 'success', message: 'Dirección actualizada' });
      } else {
        await api.post('/clientes/direcciones', formData);
        setAlert({ type: 'success', message: 'Dirección guardada' });
      }
      setFormData({ alias: '', calle: '', ciudad: '', codigo_postal: '', es_remitente: false, es_destinatario: false });
      setMostrarForm(false);
      setEditandoId(null);
      cargarDirecciones();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar dirección' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dir) => {
    setFormData(dir);
    setEditandoId(dir.id);
    setMostrarForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta dirección?')) return;
    setLoading(true);
    try {
      await api.delete(`/clientes/direcciones/${id}`);
      setAlert({ type: 'success', message: 'Dirección eliminada' });
      cargarDirecciones();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Direcciones frecuentes</h1>
        <button
          onClick={() => { setMostrarForm(true); setEditandoId(null); setFormData({ alias: '', calle: '', ciudad: '', codigo_postal: '', es_remitente: false, es_destinatario: false }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva dirección
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Formulario */}
      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editandoId ? 'Editar' : 'Nueva'} dirección</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="alias"
              placeholder="Alias (ej. Casa, Oficina)"
              value={formData.alias}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="calle"
              placeholder="Calle y número"
              value={formData.calle}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="codigo_postal"
              placeholder="Código postal"
              value={formData.codigo_postal}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="checkbox" name="es_remitente" checked={formData.es_remitente} onChange={handleChange} className="mr-2" />
                Usar como remitente
              </label>
              <label className="flex items-center">
                <input type="checkbox" name="es_destinatario" checked={formData.es_destinatario} onChange={handleChange} className="mr-2" />
                Usar como destinatario
              </label>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
              <button type="button" onClick={() => { setMostrarForm(false); setEditandoId(null); }} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de direcciones */}
      <div className="bg-white rounded-lg shadow divide-y">
        {direcciones.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No tienes direcciones guardadas</p>
        ) : (
          direcciones.map((dir) => (
            <div key={dir.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{dir.alias}</h3>
                <p className="text-gray-600">{dir.calle}</p>
                <p className="text-gray-500 text-sm">{dir.ciudad}, CP {dir.codigo_postal}</p>
                <div className="flex space-x-2 mt-1">
                  {dir.es_remitente && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Remitente</span>}
                  {dir.es_destinatario && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Destinatario</span>}
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(dir)} className="text-blue-600 hover:underline">Editar</button>
                <button onClick={() => handleDelete(dir.id)} className="text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DireccionesFrecuentes;
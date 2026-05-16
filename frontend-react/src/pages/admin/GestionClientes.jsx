import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', rol: 'cliente' });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await api.get('/admin/clientes');
      setClientes(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar clientes' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/admin/clientes/${editando}`, formData);
        setAlert({ type: 'success', message: 'Cliente actualizado' });
      } else {
        await api.post('/admin/clientes', formData);
        setAlert({ type: 'success', message: 'Cliente creado' });
      }
      setMostrarForm(false);
      setEditando(null);
      setFormData({ nombre: '', email: '', telefono: '', rol: 'cliente' });
      cargarClientes();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar' });
    }
  };

  const eliminarCliente = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await api.delete(`/admin/clientes/${id}`);
      setAlert({ type: 'success', message: 'Cliente eliminado' });
      cargarClientes();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de clientes</h1>
        <button onClick={() => { setMostrarForm(true); setEditando(null); setFormData({ nombre: '', email: '', telefono: '', rol: 'cliente' }); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo cliente
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editando ? 'Editar' : 'Nuevo'} cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
            <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
            <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            <select name="rol" value={formData.rol} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
              <button type="button" onClick={() => setMostrarForm(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{cliente.nombre}</td>
                <td className="px-6 py-4">{cliente.email}</td>
                <td className="px-6 py-4">{cliente.telefono}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${cliente.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {cliente.rol}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => { setEditando(cliente.id); setFormData(cliente); setMostrarForm(true); }} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => eliminarCliente(cliente.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionClientes;
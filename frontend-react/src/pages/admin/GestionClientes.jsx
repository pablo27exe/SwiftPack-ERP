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
      const response = await api.get('/api/admin/clientes');  // ← Corregido
      setClientes(response.data);
    } catch (error) {
      console.error('Error:', error);
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
        await api.put(`/api/admin/clientes/${editando}`, formData);  // ← Corregido
        setAlert({ type: 'success', message: 'Cliente actualizado' });
      } else {
        await api.post('/api/admin/clientes', formData);  // ← Corregido
        setAlert({ type: 'success', message: 'Cliente creado' });
      }
      setMostrarForm(false);
      setEditando(null);
      setFormData({ nombre: '', email: '', telefono: '', rol: 'cliente' });
      cargarClientes();
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: 'Error al guardar' });
    }
  };

  const eliminarCliente = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await api.delete(`/api/admin/clientes/${id}`);  // ← Corregido
      setAlert({ type: 'success', message: 'Cliente eliminado' });
      cargarClientes();
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: 'Error al eliminar' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#11519c]">Gestión de clientes</h1>
        <button 
          onClick={() => { setMostrarForm(true); setEditando(null); setFormData({ nombre: '', email: '', telefono: '', rol: 'cliente' }); }} 
          className="bg-[#11519c] text-white px-4 py-2 rounded hover:bg-[#2e89c6] transition"
        >
          + Nuevo cliente
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#11519c]">{editando ? 'Editar' : 'Nuevo'} cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <input 
              type="text" name="nombre" placeholder="Nombre completo" 
              value={formData.nombre} onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
              required 
            />
            <input 
              type="email" name="email" placeholder="Correo electrónico" 
              value={formData.email} onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
              required 
            />
            <input 
              type="tel" name="telefono" placeholder="Teléfono" 
              value={formData.telefono} onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
            />
            <select 
              name="rol" value={formData.rol} onChange={handleChange} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            <div className="flex space-x-2">
              <button type="submit" className="bg-[#ef5a07] text-white px-4 py-2 rounded hover:bg-[#fd8106] transition">
                Guardar
              </button>
              <button 
                type="button" onClick={() => setMostrarForm(false)} 
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cliente.nombre}</td>
                  <td className="px-6 py-4">{cliente.email}</td>
                  <td className="px-6 py-4">{cliente.telefono || 'N/A'}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      onClick={() => { setEditando(cliente.id); setFormData(cliente); setMostrarForm(true); }} 
                      className="text-[#11519c] hover:text-[#ef5a07] transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarCliente(cliente.id)} 
                      className="text-red-600 hover:text-red-800 transition"
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

export default GestionClientes;
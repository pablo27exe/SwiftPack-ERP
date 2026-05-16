import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const GestionRH = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', puesto: '', telefono: '', fecha_contratacion: '', salario: 0 });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/admin/empleados');
      setEmpleados(response.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar empleados' });
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
        await api.put(`/admin/empleados/${editando}`, formData);
        setAlert({ type: 'success', message: 'Empleado actualizado' });
      } else {
        await api.post('/admin/empleados', formData);
        setAlert({ type: 'success', message: 'Empleado registrado' });
      }
      setMostrarForm(false);
      setEditando(null);
      setFormData({ nombre: '', email: '', puesto: '', telefono: '', fecha_contratacion: '', salario: 0 });
      cargarEmpleados();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar' });
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!confirm('¿Eliminar este empleado?')) return;
    try {
      await api.delete(`/admin/empleados/${id}`);
      setAlert({ type: 'success', message: 'Empleado eliminado' });
      cargarEmpleados();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar' });
    }
  };

  const registrarAsistencia = async (id, tipo) => {
    try {
      await api.post(`/admin/empleados/${id}/asistencia`, { tipo });
      setAlert({ type: 'success', message: 'Asistencia registrada' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al registrar' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Recursos Humanos</h1>
        <button onClick={() => { setMostrarForm(true); setEditando(null); setFormData({ nombre: '', email: '', puesto: '', telefono: '', fecha_contratacion: '', salario: 0 }); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo empleado
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editando ? 'Editar' : 'Nuevo'} empleado</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <input type="text" name="puesto" placeholder="Puesto" value={formData.puesto} onChange={handleChange} className="px-3 py-2 border rounded" required />
            <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className="px-3 py-2 border rounded" />
            <input type="date" name="fecha_contratacion" value={formData.fecha_contratacion} onChange={handleChange} className="px-3 py-2 border rounded" />
            <input type="number" name="salario" placeholder="Salario" value={formData.salario} onChange={handleChange} className="px-3 py-2 border rounded" />
            <div className="flex space-x-2 md:col-span-2">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puesto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asistencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {empleados.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{emp.nombre}</td>
                <td className="px-6 py-4">{emp.puesto}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    <button onClick={() => registrarAsistencia(emp.id, 'entrada')} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Entrada</button>
                    <button onClick={() => registrarAsistencia(emp.id, 'salida')} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Salida</button>
                  </div>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => { setEditando(emp.id); setFormData(emp); setMostrarForm(true); }} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => eliminarEmpleado(emp.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionRH;
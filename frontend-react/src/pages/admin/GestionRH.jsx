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
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    puesto: '', 
    telefono: '', 
    fecha_contratacion: '', 
    salario: 0 
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // Función para mostrar alert con auto-cierre
  const mostrarAlerta = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const cargarEmpleados = async () => {
    try {
      const response = await api.get('/api/admin/empleados');  // ← Corregido
      setEmpleados(response.data);
    } catch (error) {
      mostrarAlerta('error', 'Error al cargar empleados');
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
        await api.put(`/api/admin/empleados/${editando}`, formData);  // ← Corregido
        mostrarAlerta('success', 'Empleado actualizado');
      } else {
        await api.post('/api/admin/empleados', formData);  // ← Corregido
        mostrarAlerta('success', 'Empleado registrado');
      }
      setMostrarForm(false);
      setEditando(null);
      setFormData({ nombre: '', email: '', puesto: '', telefono: '', fecha_contratacion: '', salario: 0 });
      cargarEmpleados();
    } catch (error) {
      mostrarAlerta('error', 'Error al guardar');
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!confirm('¿Eliminar este empleado?')) return;
    try {
      await api.delete(`/api/admin/empleados/${id}`);  // ← Corregido
      mostrarAlerta('success', 'Empleado eliminado');
      cargarEmpleados();
    } catch (error) {
      mostrarAlerta('error', 'Error al eliminar');
    }
  };

  const registrarAsistencia = async (id, tipo) => {
    try {
      await api.post(`/api/admin/empleados/${id}/asistencia`, { tipo });
      mostrarAlerta('success', `Asistencia de ${tipo} registrada`);
    } catch (error) {
      mostrarAlerta('error', 'Error al registrar asistencia');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#11519c]">Gestión de Recursos Humanos</h1>
        <button 
          onClick={() => { setMostrarForm(true); setEditando(null); setFormData({ nombre: '', email: '', puesto: '', telefono: '', fecha_contratacion: '', salario: 0 }); }} 
          className="bg-[#11519c] text-white px-4 py-2 rounded hover:bg-[#2e89c6] transition"
        >
          + Nuevo empleado
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#11519c]">{editando ? 'Editar' : 'Nuevo'} empleado</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" name="nombre" placeholder="Nombre completo" 
              value={formData.nombre} onChange={handleChange} 
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
              required 
            />
            <input 
              type="email" name="email" placeholder="Email" 
              value={formData.email} onChange={handleChange} 
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
              required 
            />
            <input 
              type="text" name="puesto" placeholder="Puesto" 
              value={formData.puesto} onChange={handleChange} 
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
              required 
            />
            <input 
              type="tel" name="telefono" placeholder="Teléfono" 
              value={formData.telefono} onChange={handleChange} 
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
            />
            <input 
              type="date" name="fecha_contratacion" 
              value={formData.fecha_contratacion} onChange={handleChange} 
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
            />
            <input 
              type="number" name="salario" placeholder="Salario" 
              value={formData.salario} onChange={handleChange} 
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
            />
            <div className="flex space-x-2 md:col-span-2">
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
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
            {empleados.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No hay empleados registrados
                </td>
              </tr>
            ) : (
              empleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{emp.nombre}</td>
                  <td className="px-6 py-4">{emp.puesto}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => registrarAsistencia(emp.id, 'entrada')} 
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition"
                      >
                        Entrada
                      </button>
                      <button 
                        onClick={() => registrarAsistencia(emp.id, 'salida')} 
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition"
                      >
                        Salida
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      onClick={() => { setEditando(emp.id); setFormData(emp); setMostrarForm(true); }} 
                      className="text-[#11519c] hover:text-[#ef5a07] transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => eliminarEmpleado(emp.id)} 
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

export default GestionRH;
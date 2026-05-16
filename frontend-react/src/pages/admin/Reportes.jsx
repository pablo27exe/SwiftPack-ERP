import { useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', tipo: 'envios' });

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const generarReporte = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reportes', { params: filtros });
      setReporte(response.data);
      setAlert({ type: 'success', message: 'Reporte generado' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al generar reporte' });
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (!reporte?.datos) return;
    const headers = Object.keys(reporte.datos[0] || {}).join(',');
    const rows = reporte.datos.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${filtros.tipo}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select name="tipo" value={filtros.tipo} onChange={handleChange} className="px-3 py-2 border rounded">
            <option value="envios">Reporte de envíos</option>
            <option value="clientes">Reporte de clientes</option>
            <option value="ingresos">Reporte de ingresos</option>
            <option value="entregas">Reporte de entregas</option>
          </select>
          <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleChange} className="px-3 py-2 border rounded" placeholder="Fecha inicio" />
          <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleChange} className="px-3 py-2 border rounded" placeholder="Fecha fin" />
          <button onClick={generarReporte} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Generar reporte</button>
        </div>
      </div>

      {/* Resultados */}
      {reporte && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{reporte.titulo}</h2>
            <button onClick={exportarCSV} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Exportar CSV</button>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">Periodo: {reporte.fecha_inicio} al {reporte.fecha_fin}</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {reporte.columnas?.map((col, idx) => (
                      <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reporte.datos?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-2 text-sm">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reporte.resumen && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="font-semibold">Resumen:</p>
                <p>{reporte.resumen}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
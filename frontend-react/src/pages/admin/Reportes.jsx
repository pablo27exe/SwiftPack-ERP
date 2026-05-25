import { useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', tipo: 'envios' });

  // Función para mostrar alert con auto-cierre
  const mostrarAlerta = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const generarReporte = async () => {
    setLoading(true);
    try {
      // Determinar el endpoint según el tipo de reporte
      let endpoint = '';
      switch (filtros.tipo) {
        case 'envios':
          endpoint = '/api/admin/reportes/envios';
          break;
        case 'clientes':
          endpoint = '/api/admin/reportes/clientes';
          break;
        case 'ingresos':
          endpoint = '/api/admin/reportes/ingresos';
          break;
        default:
          endpoint = '/api/admin/reportes/envios';
      }

      // Para reportes que no son CSV, necesitamos manejar la respuesta
      const response = await api.get(endpoint, {
        params: {
          fecha_desde: filtros.fecha_inicio,
          fecha_hasta: filtros.fecha_fin
        },
        responseType: filtros.tipo === 'envios' || filtros.tipo === 'clientes' || filtros.tipo === 'ingresos' ? 'blob' : 'json'
      });

      // Si es un archivo CSV (blob), descargarlo directamente
      if (response.data instanceof Blob) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_${filtros.tipo}_${new Date().toISOString().slice(0, 19)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        mostrarAlerta('success', 'Reporte descargado correctamente');
        setReporte(null);
      } else {
        // Si es JSON, mostrar en tabla
        setReporte(response.data);
        mostrarAlerta('success', 'Reporte generado');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarAlerta('error', 'Error al generar reporte');
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
    a.download = `reporte_${filtros.tipo}_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    mostrarAlerta('success', 'CSV exportado');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#11519c]">Reportes</h1>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            name="tipo" 
            value={filtros.tipo} 
            onChange={handleChange} 
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]"
          >
            <option value="envios">Reporte de envíos (CSV)</option>
            <option value="clientes">Reporte de clientes (CSV)</option>
            <option value="ingresos">Reporte de ingresos (CSV)</option>
          </select>
          <input 
            type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleChange} 
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
            placeholder="Fecha inicio" 
          />
          <input 
            type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleChange} 
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#11519c]" 
            placeholder="Fecha fin" 
          />
          <button 
            onClick={generarReporte} 
            className="bg-[#11519c] text-white px-4 py-2 rounded hover:bg-[#2e89c6] transition"
          >
            Generar reporte
          </button>
        </div>
      </div>

      {/* Resultados (solo para reportes que no son CSV directos) */}
      {reporte && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#11519c]">{reporte.titulo || 'Resultados'}</h2>
            {reporte.datos && (
              <button 
                onClick={exportarCSV} 
                className="bg-[#ef5a07] text-white px-3 py-1 rounded text-sm hover:bg-[#fd8106] transition"
              >
                Exportar CSV
              </button>
            )}
          </div>
          <div className="p-4">
            {reporte.fecha_inicio && (
              <p className="text-gray-600 mb-4">Periodo: {reporte.fecha_inicio} al {reporte.fecha_fin}</p>
            )}
            {reporte.datos && reporte.datos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(reporte.datos[0]).map((col, idx) => (
                        <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reporte.datos.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-2 text-sm">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay datos para mostrar</p>
            )}
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
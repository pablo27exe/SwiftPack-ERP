import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarKPIs();
  }, []);

  const cargarKPIs = async () => {
    try {
      const response = await api.get('/admin/kpis');
      setKpis(response.data);
    } catch (error) {
      console.error('Error cargando KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { title: 'Total envíos', value: kpis?.total_envios || 0, color: 'bg-blue-500', icon: '📦' },
    { title: 'En tránsito', value: kpis?.envios_transito || 0, color: 'bg-yellow-500', icon: '🚚' },
    { title: 'Entregados', value: kpis?.envios_entregados || 0, color: 'bg-green-500', icon: '✅' },
    { title: 'Clientes activos', value: kpis?.total_clientes || 0, color: 'bg-purple-500', icon: '👥' },
    { title: 'Ingresos hoy', value: `$${kpis?.ingresos_hoy || 0}`, color: 'bg-indigo-500', icon: '💰' },
    { title: 'Repartidores activos', value: kpis?.repartidores_activos || 0, color: 'bg-orange-500', icon: '🛵' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Administración</h1>

      {/* KPIs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white w-12 h-12 rounded-full flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">📦 Ver todos los envíos</button>
            <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">👥 Gestionar clientes</button>
            <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">💰 Configurar tarifas</button>
            <button className="w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">👤 Gestionar usuarios</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Envíos recientes</h2>
          <div className="space-y-2">
            {kpis?.ultimos_envios?.slice(0, 5).map((envio) => (
              <div key={envio.id} className="flex justify-between items-center text-sm">
                <span className="font-mono">{envio.numero_guia}</span>
                <span>{envio.origen} → {envio.destino}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  envio.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{envio.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
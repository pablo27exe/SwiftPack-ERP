import { useState, useEffect } from 'react';

const HistorialEnviosPage = () => {
  const [envios, setEnvios] = useState([]);
  const [filtro, setFiltro] = useState('');

  // Simulación de carga de datos (Mocking)
  useEffect(() => {
    const mockData = [
      { id: 1, guia: 'SP-100234', fecha: '2026-04-10', destino: 'Ciudad de México', estado: 'Entregado', monto: 150.00 },
      { id: 2, guia: 'SP-100567', fecha: '2026-04-12', destino: 'Guadalajara', estado: 'En tránsito', monto: 220.50 },
      { id: 3, guia: 'SP-100890', fecha: '2026-04-14', destino: 'Monterrey', estado: 'Pendiente', monto: 180.00 },
    ];
    setEnvios(mockData);
  }, []);

  const enviosFiltrados = envios.filter(e => 
    e.guia.toLowerCase().includes(filtro.toLowerCase()) || 
    e.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <section className="page">
      <div className="section-header">
        <h1>Historial de Envíos</h1>
        <p>Consulta y gestiona tus envíos anteriores.</p>
      </div>

      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Buscar por guía o estado..." 
          className="full-width"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Guía</th>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th style={{ padding: '12px' }}>Destino</th>
              <th style={{ padding: '12px' }}>Estado</th>
              <th style={{ padding: '12px' }}>Monto</th>
              <th style={{ padding: '12px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {enviosFiltrados.map(envio => (
              <tr key={envio.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}><strong>{envio.guia}</strong></td>
                <td style={{ padding: '12px' }}>{envio.fecha}</td>
                <td style={{ padding: '12px' }}>{envio.destino}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${envio.estado.toLowerCase().replace(' ', '-')}`} 
                        style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', background: '#e0e0e0' }}>
                    {envio.estado}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>${envio.monto.toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  <button className="button-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HistorialEnviosPage;
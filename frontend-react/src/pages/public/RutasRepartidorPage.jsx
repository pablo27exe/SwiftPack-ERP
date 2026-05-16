import { useState } from 'react';

const RutasRepartidorPage = () => {
  const [entregas, setEntregas] = useState([
    { id: 101, guia: 'SP-9901', cliente: 'Juan Pérez', direccion: 'Calle Falsa 123', estado: 'Pendiente' },
    { id: 102, guia: 'SP-9902', cliente: 'María López', direccion: 'Av. Siempre Viva 742', estado: 'Pendiente' },
  ]);

  const [seleccionada, setSeleccionada] = useState(null);
  const [evidencia, setEvidencia] = useState(null);

  const actualizarEstado = (id, nuevoEstado) => {
    setEntregas(entregas.map(e => e.id === id ? { ...e, estado: nuevoEstado } : e));
    setSeleccionada(null);
    alert(`Estado actualizado a: ${nuevoEstado}`);
  };

  return (
    <section className="page mobile-friendly">
      <div className="section-header">
        <h1>Rutas Asignadas</h1>
        <p>Panel de control para repartidores</p>
      </div>

      {!seleccionada ? (
        <div className="list-rutas">
          {entregas.map(entrega => (
            <div key={entrega.id} className="card-entrega" onClick={() => setSeleccionada(entrega)} 
                 style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Guía: {entrega.guia}</strong>
                <span style={{ color: '#007bff' }}>{entrega.estado}</span>
              </div>
              <p style={{ margin: '8px 0' }}>{entrega.cliente}</p>
              <small>{entrega.direccion}</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="detalle-entrega" style={{ background: '#f4f4f4', padding: '1.5rem', borderRadius: '12px' }}>
          <button onClick={() => setSeleccionada(null)} className="button-secondary" style={{ marginBottom: '1rem' }}>Volver</button>
          <h2>{seleccionada.guia}</h2>
          <p><strong>Cliente:</strong> {seleccionada.cliente}</p>
          <p><strong>Dirección:</strong> {seleccionada.direccion}</p>
          
          <div className="acciones-repartidor" style={{ marginTop: '2rem' }}>
            <h3>Registrar Entrega</h3>
            <label className="input-group full-width">
              <span>Subir Foto Evidencia (Simulado)</span>
              <input type="file" onChange={(e) => setEvidencia(e.target.files[0])} />
            </label>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={() => actualizarEstado(seleccionada.id, 'Entregado')} 
                className="button-primary"
                style={{ flex: 1, backgroundColor: '#28a745' }}
              >
                Entregado
              </button>
              <button 
                onClick={() => actualizarEstado(seleccionada.id, 'Intento Fallido')} 
                className="button-secondary"
                style={{ flex: 1 }}
              >
                No encontrado
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-friendly { max-width: 500px; margin: 0 auto; }
        .card-entrega:hover { border-color: #007bff !important; background: #f0f7ff; }
      `}} />
    </section>
  );
};

export default RutasRepartidorPage;
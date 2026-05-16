import { useState } from 'react';

const DireccionesPage = () => {
  const [direcciones, setDirecciones] = useState([
    { id: 1, alias: 'Casa', direccion: 'Av. Reforma 123, Ciudad de México' },
    { id: 2, alias: 'Oficina', direccion: 'Insurgentes Sur 456, Ciudad de México' },
  ]);

  const [nueva, setNueva] = useState({ alias: '', direccion: '' });

  const agregarDireccion = (e) => {
    e.preventDefault();
    if (!nueva.alias || !nueva.direccion) return;
    setDirecciones([...direcciones, { ...nueva, id: Date.now() }]);
    setNueva({ alias: '', direccion: '' });
  };

  return (
    <section className="page">
      <div className="section-header">
        <h1>Direcciones Frecuentes</h1>
        <p>Gestiona tus puntos de recolección y entrega habituales.</p>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <form className="form-card" onSubmit={agregarDireccion} style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Agregar Nueva Dirección</h3>
          <label className="input-group full-width">
            <span>Alias (Ej. Mi local)</span>
            <input value={nueva.alias} onChange={e => setNueva({...nueva, alias: e.target.value})} placeholder="Nombre corto" />
          </label>
          <label className="input-group full-width">
            <span>Dirección Completa</span>
            <input value={nueva.direccion} onChange={e => setNueva({...nueva, direccion: e.target.value})} placeholder="Calle, Número, C.P." />
          </label>
          <button type="submit" className="button-primary" style={{ marginTop: '1rem' }}>Guardar Dirección</button>
        </form>

        <div className="list-container">
          <h3>Tus Direcciones</h3>
          {direcciones.map(dir => (
            <div key={dir.id} className="card-item" style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{dir.alias}</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>{dir.direccion}</p>
              </div>
              <button 
                onClick={() => setDirecciones(direcciones.filter(d => d.id !== dir.id))}
                style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DireccionesPage;
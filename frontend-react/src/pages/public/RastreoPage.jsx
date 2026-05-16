import { useState } from 'react'

const createMockTracking = (guia) => {
  if (!guia) return null
  const now = new Date()
  const events = [
    {
      status: 'Preparado',
      location: 'Centro de clasificación',
      time: new Date(now.getTime() - 4 * 60 * 60 * 1000).toLocaleString('es-MX'),
      responsable: 'Operador de bodega',
    },
    {
      status: 'En tránsito',
      location: 'Ruta nacional',
      time: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString('es-MX'),
      responsable: 'Transportista',
    },
    {
      status: 'Entrega en proceso',
      location: 'Sucursal destino',
      time: now.toLocaleString('es-MX'),
      responsable: 'Repartidor',
    },
  ]

  return {
    guia,
    estado: 'En tránsito',
    ubicacionActual: 'Sucursal destino',
    historial: events,
  }
}

const RastreoPage = () => {
  const [guia, setGuia] = useState('')
  const [tracking, setTracking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!guia.trim()) {
      setError('Ingresa el número de guía para continuar.')
      setTracking(null)
      return
    }

    setError('')
    setLoading(true)
    setTracking(null)

    setTimeout(() => {
      setTracking(createMockTracking(guia.trim()))
      setLoading(false)
    }, 400)
  }

  return (
    <section className="page page-form">
      <div className="section-header">
        <h1>Rastrear envío</h1>
        <p>Consulta el estado de tu envío sin necesidad de iniciar sesión.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="input-group full-width">
          <span>Número de guía</span>
          <input value={guia} onChange={(event) => setGuia(event.target.value)} placeholder="Ej. SP12345678" />
        </label>
        <button type="submit" className="button-primary">Buscar envío</button>
      </form>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="info-box">Consultando estado...</div>}
      {tracking && (
        <div className="tracking-panel">
          <div className="result-card">
            <h2>Estado actual</h2>
            <p><strong>Guía:</strong> {tracking.guia}</p>
            <p><strong>Estado:</strong> {tracking.estado}</p>
            <p><strong>Ubicación:</strong> {tracking.ubicacionActual}</p>
          </div>

          <div className="history-card">
            <h2>Historial</h2>
            <ul>
              {tracking.historial.map((item, index) => (
                <li key={index} className="history-item">
                  <p><strong>{item.status}</strong></p>
                  <p>{item.location}</p>
                  <p>{item.time}</p>
                  <p>{item.responsable}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

export default RastreoPage

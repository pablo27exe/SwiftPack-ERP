import { useMemo, useState } from 'react'

const serviceRates = {
  Express: 1.4,
  Estándar: 1,
  Programado: 0.9,
}

const formatMoney = (value) => new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
}).format(value)

const CotizacionPage = () => {
  const [data, setData] = useState({
    origen: '',
    destino: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    tipo: 'Estándar',
  })

  const volumetricWeight = useMemo(() => {
    const largo = parseFloat(data.largo)
    const ancho = parseFloat(data.ancho)
    const alto = parseFloat(data.alto)

    if (!largo || !ancho || !alto) return 0
    return Math.max((largo * ancho * alto) / 5000, 0)
  }, [data.largo, data.ancho, data.alto])

  const pesoReal = Number(data.peso) || 0
  const pesoFacturable = Math.max(pesoReal, volumetricWeight)
  const costoEstimado = pesoFacturable
    ? Math.ceil(pesoFacturable * 1200 * serviceRates[data.tipo])
    : 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className="page page-form">
      <div className="section-header">
        <h1>Cotizar envío</h1>
        <p>Ingresa origen, destino y datos del paquete para obtener el costo en menos de 5 segundos.</p>
      </div>

      <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
        <label className="input-group">
          <span>Origen</span>
          <input name="origen" value={data.origen} onChange={handleChange} placeholder="Ciudad o dirección" />
        </label>
        <label className="input-group">
          <span>Destino</span>
          <input name="destino" value={data.destino} onChange={handleChange} placeholder="Ciudad o dirección" />
        </label>
        <label className="input-group">
          <span>Peso real (kg)</span>
          <input name="peso" type="number" step="0.1" value={data.peso} onChange={handleChange} placeholder="Ej. 2.5" />
        </label>
        <label className="input-group">
          <span>Largo (cm)</span>
          <input name="largo" type="number" step="1" value={data.largo} onChange={handleChange} placeholder="Ej. 40" />
        </label>
        <label className="input-group">
          <span>Ancho (cm)</span>
          <input name="ancho" type="number" step="1" value={data.ancho} onChange={handleChange} placeholder="Ej. 30" />
        </label>
        <label className="input-group">
          <span>Alto (cm)</span>
          <input name="alto" type="number" step="1" value={data.alto} onChange={handleChange} placeholder="Ej. 25" />
        </label>
        <label className="input-group full-width">
          <span>Tipo de servicio</span>
          <select name="tipo" value={data.tipo} onChange={handleChange}>
            {Object.keys(serviceRates).map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </label>
      </form>

      <div className="quote-result">
        <div className="result-card">
          <h2>Costo estimado</h2>
          <strong>{costoEstimado ? formatMoney(costoEstimado) : 'Completa los datos'}</strong>
          <p>La cotización se actualiza de inmediato y muestra el peso facturable.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <span>Peso real</span>
            <strong>{pesoReal ? `${pesoReal.toFixed(1)} kg` : '---'}</strong>
          </div>
          <div className="metric-card">
            <span>Peso volumétrico</span>
            <strong>{volumetricWeight ? `${volumetricWeight.toFixed(1)} kg` : '---'}</strong>
          </div>
          <div className="metric-card">
            <span>Peso facturable</span>
            <strong>{pesoFacturable ? `${pesoFacturable.toFixed(1)} kg` : '---'}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CotizacionPage

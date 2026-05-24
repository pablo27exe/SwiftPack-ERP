import { useMemo, useState } from 'react'

// ─── Shared design tokens ────────────────────────────────────────────────────
const C = {
  blue:       '#11519c',
  blueMid:    '#2e89c6',
  orange:     '#ef5a07',
  bg:         '#f5f7fa',
  white:      '#ffffff',
  border:     '#e5e7eb',
  borderFocus:'#2e89c6',
  text:       '#111827',
  textMuted:  '#6b7280',
  textLabel:  '#374151',
}

const radius = { md: '10px', lg: '16px', pill: '99px' }

const serviceRates = {
  Express:    1.4,
  Estándar:   1,
  Programado: 0.9,
}

const formatMoney = (value) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  packageLg: (p = {}) => (
    <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  mapPin: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  weight: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.9-2.54L19.4 9.46A2 2 0 0 0 17.48 8Z" />
    </svg>
  ),
  ruler: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
    </svg>
  ),
  truck: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  ),
  calculator: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
    </svg>
  ),
  info: (p = {}) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  ),
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const InputField = ({ label, icon: IconComp, ...props }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: C.textLabel, marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {IconComp && (
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', pointerEvents: 'none' }}>
            <IconComp />
          </span>
        )}
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: `10px 14px 10px ${IconComp ? '40px' : '14px'}`,
            border: `1px solid ${focused ? C.borderFocus : C.border}`,
            borderRadius: radius.md, fontSize: '14px', color: C.text,
            background: focused ? C.white : '#f9fafb', boxSizing: 'border-box',
            outline: 'none', transition: 'all 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(46,137,198,0.15)' : 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  )
}

const SelectField = ({ label, icon: IconComp, children, ...props }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: C.textLabel, marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {IconComp && (
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
            <IconComp />
          </span>
        )}
        <select
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: `10px 14px 10px ${IconComp ? '40px' : '14px'}`,
            border: `1px solid ${focused ? C.borderFocus : C.border}`,
            borderRadius: radius.md, fontSize: '14px', color: C.text,
            background: focused ? C.white : '#f9fafb', boxSizing: 'border-box',
            outline: 'none', transition: 'all 0.2s', appearance: 'none', cursor: 'pointer',
            boxShadow: focused ? '0 0 0 3px rgba(46,137,198,0.15)' : 'none',
            fontFamily: 'inherit',
          }}
        >
          {children}
        </select>
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </div>
    </div>
  )
}

const MetricCard = ({ label, value, highlight }) => (
  <div style={{
    background: highlight ? `linear-gradient(135deg, ${C.blue} 0%, ${C.blueMid} 100%)` : '#f9fafb',
    border: highlight ? 'none' : `1px solid ${C.border}`,
    borderRadius: radius.md, padding: '1rem 1.25rem',
  }}>
    <p style={{ fontSize: '11px', fontWeight: '500', color: highlight ? 'rgba(255,255,255,0.75)' : C.textMuted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    <p style={{ fontSize: '20px', fontWeight: '700', color: highlight ? C.white : C.text, margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
  </div>
)

const SectionTitle = ({ icon: IconComp, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '1.25rem' }}>
    <span style={{ color: C.blueMid, display: 'flex' }}><IconComp /></span>
    <span style={{ fontSize: '12px', fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{children}</span>
    <div style={{ flex: 1, height: '0.5px', background: C.border }} />
  </div>
)

// ─── Main component ──────────────────────────────────────────────────────────
const CotizacionPage = () => {
  const [data, setData] = useState({
    origen: '', destino: '', peso: '',
    largo: '', ancho: '', alto: '',
    tipo: 'Estándar',
  })

  const volumetricWeight = useMemo(() => {
    const l = parseFloat(data.largo)
    const a = parseFloat(data.ancho)
    const h = parseFloat(data.alto)
    if (!l || !a || !h) return 0
    return Math.max((l * a * h) / 5000, 0)
  }, [data.largo, data.ancho, data.alto])

  const pesoReal      = Number(data.peso) || 0
  const pesoFacturable = Math.max(pesoReal, volumetricWeight)
  const costoEstimado  = pesoFacturable
    ? Math.ceil(pesoFacturable * 1200 * serviceRates[data.tipo])
    : 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const hasResult = pesoFacturable > 0 && data.origen && data.destino

  return (
    <>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } } .cotiz-card { animation: fadeUp 0.4s ease both; }`}</style>

      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div className="cotiz-card" style={{ width: '100%', maxWidth: '600px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.packageLg />
            </div>
            <span style={{ fontSize: '15px', fontWeight: '600', color: C.blue, letterSpacing: '-0.01em' }}>SwiftPack</span>
          </div>

          <div style={{ height: '3px', borderRadius: radius.pill, background: `linear-gradient(90deg, ${C.blue} 0%, ${C.blueMid} 50%, ${C.orange} 100%)`, marginBottom: '2rem' }} />

          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#0f1c2e', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Cotizar envío</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, margin: '0 0 2rem' }}>
            Ingresa origen, destino y datos del paquete para obtener el costo en menos de 5 segundos.
          </p>

          {/* Form card */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 24px rgba(17,81,156,0.06)', marginBottom: '1.25rem' }}>
            <form onSubmit={(e) => e.preventDefault()}>

              <SectionTitle icon={Icon.mapPin}>Ruta</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Origen" icon={Icon.mapPin} name="origen" value={data.origen} onChange={handleChange} placeholder="Ciudad o dirección" />
                <InputField label="Destino" icon={Icon.mapPin} name="destino" value={data.destino} onChange={handleChange} placeholder="Ciudad o dirección" />
              </div>

              <SectionTitle icon={Icon.weight}>Peso y dimensiones</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Peso (kg)" icon={Icon.weight} name="peso" type="number" step="0.1" min="0" value={data.peso} onChange={handleChange} placeholder="2.5" />
                <InputField label="Largo (cm)" icon={Icon.ruler} name="largo" type="number" step="1" min="0" value={data.largo} onChange={handleChange} placeholder="40" />
                <InputField label="Ancho (cm)" icon={Icon.ruler} name="ancho" type="number" step="1" min="0" value={data.ancho} onChange={handleChange} placeholder="30" />
                <InputField label="Alto (cm)"  icon={Icon.ruler} name="alto"  type="number" step="1" min="0" value={data.alto}  onChange={handleChange} placeholder="25" />
              </div>

              <SectionTitle icon={Icon.truck}>Servicio</SectionTitle>
              <SelectField label="Tipo de servicio" icon={Icon.truck} name="tipo" value={data.tipo} onChange={handleChange}>
                {Object.entries(serviceRates).map(([svc, rate]) => (
                  <option key={svc} value={svc}>{svc} — ×{rate}</option>
                ))}
              </SelectField>

            </form>
          </div>

          {/* Results card */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 24px rgba(17,81,156,0.06)' }}>
            <SectionTitle icon={Icon.calculator}>Resultado</SectionTitle>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
              <MetricCard label="Peso real"       value={pesoReal      ? `${pesoReal.toFixed(1)} kg`       : '—'} />
              <MetricCard label="Peso volumétrico" value={volumetricWeight ? `${volumetricWeight.toFixed(1)} kg` : '—'} />
              <MetricCard label="Peso facturable"  value={pesoFacturable  ? `${pesoFacturable.toFixed(1)} kg`  : '—'} />
            </div>

            <div style={{
              background: hasResult ? `linear-gradient(135deg, ${C.blue} 0%, ${C.blueMid} 100%)` : '#f9fafb',
              border: hasResult ? 'none' : `1px solid ${C.border}`,
              borderRadius: radius.md, padding: '1.5rem 1.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.3s',
            }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: '600', color: hasResult ? 'rgba(255,255,255,0.7)' : C.textMuted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Costo estimado</p>
                <p style={{ fontSize: '32px', fontWeight: '700', color: hasResult ? C.white : '#d1d5db', margin: 0, letterSpacing: '-0.03em' }}>
                  {hasResult ? formatMoney(costoEstimado) : 'Completa los datos'}
                </p>
              </div>
              {hasResult && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', color: C.white, padding: '4px 10px', borderRadius: radius.pill, fontWeight: '500' }}>
                    {data.tipo}
                  </span>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0', maxWidth: '120px', lineHeight: 1.4 }}>
                    {data.origen} → {data.destino}
                  </p>
                </div>
              )}
            </div>

            {!hasResult && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: C.textMuted, margin: '12px 0 0' }}>
                <Icon.info /> Completa origen, destino y al menos el peso para ver el costo.
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default CotizacionPage
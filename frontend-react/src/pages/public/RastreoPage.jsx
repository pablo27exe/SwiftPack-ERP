import { useState } from 'react'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  blue:        '#11519c',
  blueMid:     '#2e89c6',
  orange:      '#ef5a07',
  bg:          '#f5f7fa',
  white:       '#ffffff',
  border:      '#e5e7eb',
  borderFocus: '#2e89c6',
  text:        '#111827',
  textMuted:   '#6b7280',
  textLabel:   '#374151',
  error:       '#991b1b',
  errorBg:     '#fef2f2',
  errorBorder: '#fecaca',
}

const radius = { md: '10px', lg: '16px', pill: '99px' }

// ─── Mock data ───────────────────────────────────────────────────────────────
const createMockTracking = (guia) => {
  if (!guia) return null
  const now = new Date()
  return {
    guia,
    estado: 'En tránsito',
    ubicacionActual: 'Sucursal destino',
    historial: [
      { status: 'Preparado',          location: 'Centro de clasificación', time: new Date(now - 4 * 3600000).toLocaleString('es-MX'), responsable: 'Operador de bodega', done: true },
      { status: 'En tránsito',        location: 'Ruta nacional',           time: new Date(now - 2 * 3600000).toLocaleString('es-MX'), responsable: 'Transportista',     done: true },
      { status: 'Entrega en proceso', location: 'Sucursal destino',        time: now.toLocaleString('es-MX'),                         responsable: 'Repartidor',        done: false, active: true },
      { status: 'Entregado',          location: '',                         time: '',                                                   responsable: '',                  done: false, pending: true },
    ],
  }
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  packageLg: (p = {}) => (
    <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  search: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  hash: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  ),
  mapPin: (p = {}) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  user: (p = {}) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  clock: (p = {}) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (p = {}) => (
    <svg {...p} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  alertCircle: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  spinner: (p = {}) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  truck: (p = {}) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  ),
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const StatusBadge = ({ estado }) => {
  const map = {
    'En tránsito':        { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
    'Entrega en proceso': { bg: '#fff7ed', color: '#c2410c', dot: C.orange   },
    'Entregado':          { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e'  },
    'Preparado':          { bg: '#f8fafc', color: '#475569', dot: '#94a3b8'  },
  }
  const s = map[estado] || map['Preparado']
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: s.bg, color: s.color, fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: radius.pill }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {estado}
    </span>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
const RastreoPage = () => {
  const [guia, setGuia]       = useState('')
  const [tracking, setTracking] = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

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
    }, 600)
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .rastreo-card    { animation: fadeUp 0.4s ease both; }
        .tracking-result { animation: slideIn 0.35s ease both; }
        .spin-icon       { animation: spin 0.8s linear infinite; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div className="rastreo-card" style={{ width: '100%', maxWidth: '560px' }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.packageLg />
            </div>
            <span style={{ fontSize: '15px', fontWeight: '600', color: C.blue, letterSpacing: '-0.01em' }}>SwiftPack</span>
          </div>

          {/* Accent */}
          <div style={{ height: '3px', borderRadius: radius.pill, background: `linear-gradient(90deg, ${C.blue} 0%, ${C.blueMid} 50%, ${C.orange} 100%)`, marginBottom: '2rem' }} />

          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#0f1c2e', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Rastrear envío</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, margin: '0 0 2rem' }}>
            Consulta el estado de tu envío sin necesidad de iniciar sesión.
          </p>

          {/* Search card */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 24px rgba(17,81,156,0.06)', marginBottom: '1.25rem' }}>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: C.textLabel, marginBottom: '6px' }}>
                Número de guía
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', pointerEvents: 'none' }}>
                    <Icon.hash />
                  </span>
                  <input
                    value={guia}
                    onChange={(e) => setGuia(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Ej. SP12345678"
                    style={{
                      width: '100%', padding: '10px 14px 10px 40px',
                      border: `1px solid ${focused ? C.borderFocus : C.border}`,
                      borderRadius: radius.md, fontSize: '14px', color: C.text,
                      background: focused ? C.white : '#f9fafb', boxSizing: 'border-box',
                      outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit',
                      boxShadow: focused ? '0 0 0 3px rgba(46,137,198,0.15)' : 'none',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    padding: '10px 20px', background: loading ? '#9ca3af' : btnHover ? C.blueMid : C.blue,
                    color: C.white, border: 'none', borderRadius: radius.md,
                    fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '7px',
                    transition: 'background 0.2s', whiteSpace: 'nowrap', letterSpacing: '-0.01em',
                  }}
                >
                  {loading
                    ? <><Icon.spinner className="spin-icon" style={{ animation: 'spin 0.8s linear infinite' }} /> Buscando…</>
                    : <><Icon.search /> Buscar</>
                  }
                </button>
              </div>
            </form>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: C.errorBg, border: `1px solid ${C.errorBorder}`, borderRadius: radius.md, padding: '10px 14px', fontSize: '13px', color: C.error, marginTop: '1rem' }}>
                <Icon.alertCircle />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results */}
          {tracking && (
            <div className="tracking-result" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 24px rgba(17,81,156,0.06)' }}>

              {/* Summary row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Guía</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: C.text, margin: 0, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{tracking.guia}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Estado</p>
                  <StatusBadge estado={tracking.estado} />
                </div>
              </div>

              {/* Location pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f7ff', border: `1px solid #bfdbfe`, borderRadius: radius.md, padding: '10px 14px', marginBottom: '2rem' }}>
                <span style={{ color: C.blueMid, display: 'flex' }}><Icon.truck /></span>
                <div>
                  <p style={{ fontSize: '11px', color: C.blueMid, fontWeight: '600', margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ubicación actual</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1e40af', margin: 0 }}>{tracking.ubicacionActual}</p>
                </div>
              </div>

              {/* Timeline */}
              <p style={{ fontSize: '12px', fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1.25rem' }}>Historial de eventos</p>
              <div style={{ position: 'relative' }}>
                {tracking.historial.map((item, i) => {
                  const isLast = i === tracking.historial.length - 1
                  return (
                    <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
                      {/* Line */}
                      {!isLast && (
                        <div style={{ position: 'absolute', left: '16px', top: '32px', bottom: 0, width: '1px', background: item.done ? C.blueMid : C.border, zIndex: 0 }} />
                      )}
                      {/* Dot */}
                      <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', background: item.active ? C.orange : item.done ? C.blueMid : '#f1f5f9', border: `2px solid ${item.active ? C.orange : item.done ? C.blueMid : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, marginTop: '2px' }}>
                        {item.done
                          ? <Icon.check style={{ color: C.white }} />
                          : item.active
                            ? <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.white, display: 'block' }} />
                            : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.border, display: 'block' }} />
                        }
                      </div>
                      {/* Content */}
                      <div style={{ paddingBottom: isLast ? 0 : '1.5rem', flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: item.pending ? '#9ca3af' : C.text, margin: '4px 0 6px' }}>{item.status}</p>
                        {!item.pending && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {item.location && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.textMuted }}>
                                <Icon.mapPin /> {item.location}
                              </span>
                            )}
                            {item.responsable && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.textMuted }}>
                                <Icon.user /> {item.responsable}
                              </span>
                            )}
                            {item.time && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.textMuted }}>
                                <Icon.clock /> {item.time}
                              </span>
                            )}
                          </div>
                        )}
                        {item.pending && (
                          <p style={{ fontSize: '12px', color: '#d1d5db', margin: 0 }}>Pendiente</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default RastreoPage
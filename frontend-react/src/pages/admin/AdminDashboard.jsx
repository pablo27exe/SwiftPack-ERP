import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Alert from '../../components/common/Alert'

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  blue:         '#11519c',
  blueMid:      '#2e89c6',
  blueTint:     '#eff6ff',
  orange:       '#ef5a07',
  orangeLight:  '#fd8106',
  orangeTint:   '#fff4ed',
  bg:           '#f5f7fa',
  white:        '#ffffff',
  border:       '#e5e7eb',
  text:         '#0f1c2e',
  textMuted:    '#6b7280',
  textLabel:    '#374151',
  green:        '#15803d',
  greenTint:    '#f0fdf4',
  greenBorder:  '#86efac',
  yellow:       '#b45309',
  yellowTint:   '#fffbeb',
  yellowBorder: '#fde68a',
  purple:       '#6d28d9',
  purpleTint:   '#f5f3ff',
}

const radius = { sm: '8px', md: '10px', lg: '16px', pill: '99px' }
const shadow = '0 1px 3px rgba(0,0,0,0.05), 0 4px 24px rgba(17,81,156,0.07)'

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  package: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  truck: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  ),
  checkCircle: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  users: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  dollarSign: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  bike: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18.5" cy="17.5" r="3.5" /><circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  ),
  packageLg: (p = {}) => (
    <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  arrowRight: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  settings: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  user: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  refreshCw: (p = {}) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
    </svg>
  ),
}

// ─── KPI card config ─────────────────────────────────────────────────────────
const getStats = (kpis) => [
  { title: 'Total envíos', value: kpis?.total_envios ?? 0, IconComp: Icon.package, iconBg: C.blue, accent: C.blue, tint: C.blueTint },
  { title: 'En tránsito', value: kpis?.envios_transito ?? 0, IconComp: Icon.truck, iconBg: C.yellow, accent: C.yellow, tint: C.yellowTint },
  { title: 'Entregados', value: kpis?.envios_entregados ?? 0, IconComp: Icon.checkCircle, iconBg: C.green, accent: C.green, tint: C.greenTint },
  { title: 'Clientes activos', value: kpis?.total_clientes ?? 0, IconComp: Icon.users, iconBg: C.purple, accent: C.purple, tint: C.purpleTint },
  { title: 'Ingresos hoy', value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(kpis?.ingresos_hoy ?? 0), IconComp: Icon.dollarSign, iconBg: C.orange, accent: C.orange, tint: C.orangeTint },
  { title: 'Repartidores activos', value: kpis?.repartidores_activos ?? 0, IconComp: Icon.bike, iconBg: C.blueMid, accent: C.blueMid, tint: C.blueTint },
]

const QUICK_ACTIONS = [
  { label: 'Ver todos los envíos',  IconComp: Icon.package,    accent: C.blue,   path: '/admin/envios' },
  { label: 'Gestionar clientes',    IconComp: Icon.users,      accent: C.purple, path: '/admin/clientes' },
  { label: 'Configurar tarifas',    IconComp: Icon.settings,   accent: C.orange, path: '/admin/tarifas' },
  { label: 'Gestionar usuarios',    IconComp: Icon.user,       accent: C.green,  path: '/admin/rh' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────
const KpiCard = ({ title, value, IconComp, iconBg, accent, tint, idx }) => {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.white,
        border: `1px solid ${hover ? accent + '40' : C.border}`,
        borderRadius: radius.lg,
        padding: '1.5rem',
        boxShadow: hover ? `0 4px 20px ${accent}20` : shadow,
        transition: 'all 0.25s',
        transform: hover ? 'translateY(-2px)' : 'none',
        animationDelay: `${idx * 60}ms`,
      }}
      className="kpi-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>
            {title}
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: C.text, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: radius.md, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconComp style={{ width: '20px', height: '20px', color: C.white }} />
        </div>
      </div>
      <div style={{ marginTop: '1rem', height: '3px', borderRadius: radius.pill, background: tint, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: hover ? '100%' : '60%', background: accent, borderRadius: radius.pill, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

// QuickAction con navegación
const QuickAction = ({ label, IconComp, accent, path }) => {
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px',
        background: hover ? accent + '0d' : '#f9fafb',
        border: `1px solid ${hover ? accent + '30' : C.border}`,
        borderRadius: radius.md, cursor: 'pointer',
        transition: 'all 0.2s', gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '30px', height: '30px', borderRadius: radius.sm, background: hover ? accent : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
          <IconComp style={{ width: '15px', height: '15px', color: hover ? C.white : C.textMuted }} />
        </span>
        <span style={{ fontSize: '14px', fontWeight: '500', color: hover ? accent : C.textLabel }}>
          {label}
        </span>
      </div>
      <Icon.arrowRight style={{ width: '14px', height: '14px', color: hover ? accent : '#d1d5db', transition: 'all 0.2s', transform: hover ? 'translateX(2px)' : 'none' }} />
    </button>
  )
}

const EstadoBadge = ({ estado }) => {
  const map = {
    entregado:  { bg: C.greenTint,  color: C.green,  label: 'Entregado'  },
    transito:   { bg: C.yellowTint, color: C.yellow, label: 'En tránsito' },
    'en tránsito': { bg: C.yellowTint, color: C.yellow, label: 'En tránsito' },
    pendiente:  { bg: C.blueTint,   color: C.blue,   label: 'Pendiente'   },
  }
  const s = map[estado?.toLowerCase()] || { bg: '#f3f4f6', color: C.textMuted, label: estado }
  return (
    <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: radius.pill, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [alert, setAlert] = useState(null)

  const mostrarAlerta = (type, message) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const cargarKPIs = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const response = await api.get('/api/admin/kpis')
      setKpis(response.data)
    } catch (error) {
      console.error('Error cargando KPIs:', error)
      mostrarAlerta('error', 'Error al cargar los indicadores')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { cargarKPIs() }, [])

  if (loading) return <LoadingSpinner />

  const stats = getStats(kpis)

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .kpi-card   { animation: fadeUp 0.4s ease both; }
        .dash-panel { animation: fadeUp 0.45s ease both; }
        .spin-btn   { animation: spin 0.7s linear infinite; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, padding: '2rem 2rem 3rem' }}>

        {/* Alert */}
        {alert && <Alert type={alert.type} message={alert.message} />}

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.packageLg />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: C.text, margin: 0, letterSpacing: '-0.02em' }}>Dashboard de administración</h1>
              <p style={{ fontSize: '13px', color: C.textMuted, margin: 0 }}>SwiftPack — Panel de control</p>
            </div>
          </div>
          <button
            onClick={() => cargarKPIs(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.md, fontSize: '13px', fontWeight: '500', color: C.textLabel, cursor: 'pointer' }}
          >
            <Icon.refreshCw style={{ width: '14px', height: '14px', ...(refreshing ? { animation: 'spin 0.7s linear infinite' } : {}) }} />
            Actualizar
          </button>
        </div>

        {/* Accent */}
        <div style={{ height: '3px', borderRadius: radius.pill, background: `linear-gradient(90deg, ${C.blue} 0%, ${C.blueMid} 50%, ${C.orange} 100%)`, marginBottom: '2rem' }} />

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {stats.map((s, idx) => <KpiCard key={idx} idx={idx} {...s} />)}
        </div>

        {/* Bottom panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>

          {/* Quick actions */}
          <div className="dash-panel" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '1.5rem', boxShadow: shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: C.text, margin: 0 }}>Acciones rápidas</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_ACTIONS.map((a) => <QuickAction key={a.label} {...a} />)}
            </div>
          </div>

          {/* Recent shipments */}
          <div className="dash-panel" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '1.5rem', boxShadow: shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: C.text, margin: 0 }}>Envíos recientes</h2>
              <span style={{ fontSize: '11px', fontWeight: '600', color: C.blueMid, background: C.blueTint, padding: '3px 8px', borderRadius: radius.pill }}>
                Últimos {kpis?.ultimos_envios?.length ?? 0}
              </span>
            </div>

            {kpis?.ultimos_envios?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {kpis.ultimos_envios.slice(0, 5).map((envio, i) => (
                  <div
                    key={envio.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 12px', borderRadius: radius.md,
                      background: i % 2 === 0 ? '#fafafa' : C.white,
                      border: `1px solid ${C.border}`,
                      gap: '10px', flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'monospace', color: C.blue, letterSpacing: '0.02em', flexShrink: 0 }}>
                      {envio.numero_guia}
                    </span>
                    <span style={{ fontSize: '12px', color: C.textMuted, flex: 1, textAlign: 'center', minWidth: '80px' }}>
                      {envio.origen} → {envio.destino}
                    </span>
                    <EstadoBadge estado={envio.estado} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: C.textMuted, fontSize: '13px' }}>
                <Icon.package style={{ width: '28px', height: '28px', margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                Sin envíos recientes
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default AdminDashboard
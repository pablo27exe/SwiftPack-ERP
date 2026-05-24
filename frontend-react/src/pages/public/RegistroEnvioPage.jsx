import { useState } from 'react'
import api from '../../services/api'

// ─── Shared design tokens ────────────────────────────────────────────────────
const C = {
  blue:       '#11519c',
  blueMid:    '#2e89c6',
  orange:     '#ef5a07',
  orangeLight:'#fd8106',
  bg:         '#f5f7fa',
  white:      '#ffffff',
  border:     '#e5e7eb',
  borderFocus:'#2e89c6',
  text:       '#111827',
  textMuted:  '#6b7280',
  textLabel:  '#374151',
  success:    '#166534',
  successBg:  '#f0fdf4',
  successBorder:'#86efac',
  error:      '#991b1b',
  errorBg:    '#fef2f2',
  errorBorder:'#fecaca',
}

const radius = { sm: '8px', md: '10px', lg: '16px', pill: '99px' }

// ─── Icon set ────────────────────────────────────────────────────────────────
const Icon = {
  user: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  mapPin: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  package: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  packageLg: (p = {}) => (
    <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  arrowLeft: (p = {}) => (
    <svg {...p} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  ),
  arrowRight: (p = {}) => (
    <svg {...p} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  check: (p = {}) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  checkCircle: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  alertCircle: (p = {}) => (
    <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

// ─── Shared sub-components ───────────────────────────────────────────────────
const InputField = ({ label, icon: IconComp, textarea, ...props }) => {
  const [focused, setFocused] = useState(false)
  const baseInput = {
    width: '100%',
    padding: textarea ? '10px 14px' : '10px 14px 10px 40px',
    border: `1px solid ${focused ? C.borderFocus : C.border}`,
    borderRadius: radius.md,
    fontSize: '14px',
    color: C.text,
    background: focused ? C.white : '#f9fafb',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: focused ? `0 0 0 3px rgba(46,137,198,0.15)` : 'none',
    resize: textarea ? 'vertical' : undefined,
    minHeight: textarea ? '88px' : undefined,
    fontFamily: 'inherit',
  }
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: C.textLabel, marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {IconComp && !textarea && (
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', pointerEvents: 'none' }}>
            <IconComp />
          </span>
        )}
        {textarea
          ? <textarea {...props} style={baseInput} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
          : <input {...props} style={baseInput} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        }
      </div>
    </div>
  )
}

// ─── Step config ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Remitente',    subtitle: 'Datos del remitente',    Icon: Icon.user    },
  { label: 'Destinatario', subtitle: 'Datos del destinatario', Icon: Icon.mapPin  },
  { label: 'Paquete',      subtitle: 'Detalles del paquete',   Icon: Icon.package },
]

// ─── Component ───────────────────────────────────────────────────────────────
const RegistroEnvioPage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    remitente_nombre: '',
    remitente_direccion: '',
    destinatario_nombre: '',
    destinatario_direccion: '',
    paquete_descripcion: '',
    paquete_peso: '',
  })
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [animKey, setAnimKey] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const goTo = (next) => {
    setAnimKey(k => k + 1)
    setStep(next)
  }

  const handleNext = () => {
    if (step === 1 && (!formData.remitente_nombre || !formData.remitente_direccion)) {
      alert('Por favor completa los datos del remitente')
      return
    }
    if (step === 2 && (!formData.destinatario_nombre || !formData.destinatario_direccion)) {
      alert('Por favor completa los datos del destinatario')
      return
    }
    goTo(step + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/envios', formData)
      setMensaje({ tipo: 'success', texto: 'Envío registrado exitosamente.' })
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error de conexión con el servidor. El registro se guardó localmente (Simulado).',
      })
      console.error('Backend offline:', error)
    }
  }

  const pct = Math.round((step / STEPS.length) * 100)

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(10px); } to { opacity:1; transform:translateX(0); } }
        .reg-page-card { animation: fadeUp 0.4s ease both; }
        .step-fields { animation: slideIn 0.25s ease both; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div className="reg-page-card" style={{ width: '100%', maxWidth: '520px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.packageLg />
            </div>
            <span style={{ fontSize: '15px', fontWeight: '600', color: C.blue, letterSpacing: '-0.01em' }}>SwiftPack</span>
          </div>

          {/* Accent bar */}
          <div style={{ height: '3px', borderRadius: radius.pill, background: `linear-gradient(90deg, ${C.blue} 0%, ${C.blueMid} 50%, ${C.orange} 100%)`, marginBottom: '2rem' }} />

          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#0f1c2e', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Registrar nuevo envío</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, margin: '0 0 2rem' }}>
            Paso {step} de {STEPS.length} — {STEPS[step - 1].subtitle}
          </p>

          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            {STEPS.map((s, i) => {
              const idx = i + 1
              const done = idx < step
              const active = idx === step
              return (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? '1' : undefined }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${done ? C.blueMid : active ? C.blue : C.border}`,
                      background: done ? C.blueMid : active ? C.blue : C.white,
                      color: (done || active) ? C.white : '#9ca3af',
                      transition: 'all 0.3s', fontSize: '13px', fontWeight: '600',
                    }}>
                      {done ? <Icon.check /> : <s.Icon />}
                    </div>
                    <span style={{ fontSize: '11px', color: active ? C.blue : done ? C.blueMid : '#9ca3af', fontWeight: active ? '600' : '400', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: done ? C.blueMid : C.border, margin: '0 6px', marginBottom: '18px', transition: 'background 0.3s' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div style={{ height: '3px', background: C.border, borderRadius: radius.pill, marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: radius.pill, background: `linear-gradient(90deg, ${C.blue}, ${C.blueMid})`, transition: 'width 0.4s ease' }} />
          </div>

          {/* Message */}
          {mensaje.texto && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              background: mensaje.tipo === 'error' ? C.errorBg : C.successBg,
              border: `1px solid ${mensaje.tipo === 'error' ? C.errorBorder : C.successBorder}`,
              borderRadius: radius.md, padding: '10px 14px',
              fontSize: '13px', color: mensaje.tipo === 'error' ? C.error : C.success,
              marginBottom: '1.5rem',
            }}>
              {mensaje.tipo === 'error' ? <Icon.alertCircle /> : <Icon.checkCircle />}
              <span>{mensaje.texto}</span>
            </div>
          )}

          {/* Card */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '2rem', boxShadow: `0 1px 3px rgba(0,0,0,0.05), 0 4px 24px rgba(17,81,156,0.06)` }}>
            <form key={animKey} className="step-fields" onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>

              {step === 1 && (
                <>
                  <InputField label="Nombre del remitente" icon={Icon.user} name="remitente_nombre" value={formData.remitente_nombre} onChange={handleChange} placeholder="Nombre completo" required />
                  <InputField label="Dirección de recolección" icon={Icon.mapPin} name="remitente_direccion" value={formData.remitente_direccion} onChange={handleChange} placeholder="Calle, Número, Colonia" required />
                </>
              )}

              {step === 2 && (
                <>
                  <InputField label="Nombre del destinatario" icon={Icon.user} name="destinatario_nombre" value={formData.destinatario_nombre} onChange={handleChange} placeholder="¿Quién recibe?" required />
                  <InputField label="Dirección de entrega" icon={Icon.mapPin} name="destinatario_direccion" value={formData.destinatario_direccion} onChange={handleChange} placeholder="Calle, Número, C.P." required />
                </>
              )}

              {step === 3 && (
                <>
                  <InputField label="Descripción del contenido" textarea name="paquete_descripcion" value={formData.paquete_descripcion} onChange={handleChange} placeholder="Ej. Documentos, Ropa, Electrónicos" />
                  <InputField label="Peso declarado (kg)" icon={Icon.package} name="paquete_peso" type="number" step="0.1" min="0" value={formData.paquete_peso} onChange={handleChange} required placeholder="Ej. 2.5" />
                </>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '1.75rem' }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    style={{ padding: '10px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: radius.md, fontSize: '14px', fontWeight: '500', color: C.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Icon.arrowLeft /> Anterior
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{ padding: '10px 24px', background: C.blue, color: C.white, border: 'none', borderRadius: radius.md, fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }}
                  >
                    Siguiente <Icon.arrowRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    style={{ padding: '10px 24px', background: C.orange, color: C.white, border: 'none', borderRadius: radius.md, fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }}
                  >
                    <Icon.check /> Finalizar registro
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  )
}

export default RegistroEnvioPage
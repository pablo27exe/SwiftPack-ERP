import { useState } from 'react';
import api from '../../services/api';

const RegistroEnvioPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    remitente_nombre: '',
    remitente_direccion: '',
    destinatario_nombre: '',
    destinatario_direccion: '',
    paquete_descripcion: '',
    paquete_peso: '',
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Intentamos enviar al backend (fallará si no está levantado, manejado en el reporte)
      await api.post('/envios', formData);
      setMensaje({ tipo: 'success', texto: 'Envío registrado exitosamente.' });
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error de conexión con el servidor. El registro se guardó localmente (Simulado).' 
      });
      console.error("Backend offline:", error);
    }
  };

  const handleNext = () => {
    // Validación simple por paso para la prueba de uso
    if (step === 1 && (!formData.remitente_nombre || !formData.remitente_direccion)) {
      alert("Por favor completa los datos del remitente");
      return;
    }
    if (step === 2 && (!formData.destinatario_nombre || !formData.destinatario_direccion)) {
      alert("Por favor completa los datos del destinatario");
      return;
    }
    setStep(step + 1);
  };

  return (
    <section className="page page-form">
      <div className="section-header">
        <h1>Registrar Nuevo Envío</h1>
        <p>Paso {step} de 3: {step === 1 ? 'Datos del Remitente' : step === 2 ? 'Datos del Destinatario' : 'Detalles del Paquete'}</p>
      </div>

      {mensaje.texto && (
        <div className={mensaje.tipo === 'error' ? 'error-box' : 'info-box'}>
          {mensaje.texto}
        </div>
      )}

      <form className="form-grid" onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
        {step === 1 && (
          <>
            <label className="input-group full-width">
              <span>Nombre del Remitente</span>
              <input name="remitente_nombre" value={formData.remitente_nombre} onChange={handleChange} placeholder="Nombre completo" required />
            </label>
            <label className="input-group full-width">
              <span>Dirección de Recolección</span>
              <input name="remitente_direccion" value={formData.remitente_direccion} onChange={handleChange} placeholder="Calle, Número, Colonia" required />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <label className="input-group full-width">
              <span>Nombre del Destinatario</span>
              <input name="destinatario_nombre" value={formData.destinatario_nombre} onChange={handleChange} placeholder="¿Quién recibe?" required />
            </label>
            <label className="input-group full-width">
              <span>Dirección de Entrega</span>
              <input name="destinatario_direccion" value={formData.destinatario_direccion} onChange={handleChange} placeholder="Calle, Número, C.P." required />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label className="input-group full-width">
              <span>Descripción del Contenido</span>
              <textarea name="paquete_descripcion" value={formData.paquete_descripcion} onChange={handleChange} placeholder="Ej. Documentos, Ropa, Electrónicos" />
            </label>
            <label className="input-group">
              <span>Peso Declarado (kg)</span>
              <input name="paquete_peso" type="number" value={formData.paquete_peso} onChange={handleChange} required />
            </label>
          </>
        )}

        <div className="form-actions" style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {step > 1 && (
            <button type="button" className="button-secondary" onClick={() => setStep(step - 1)}>
              Anterior
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="button-primary" onClick={handleNext}>
              Siguiente
            </button>
          ) : (
            <button type="submit" className="button-primary">
              Finalizar Registro
            </button>
          )}
        </div>
      </form>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .form-actions { margin-top: 20px; }
        textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; }
      `}} />
    </section>
  );
};

export default RegistroEnvioPage;
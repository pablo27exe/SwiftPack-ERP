import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const EnvioContext = createContext();

export const useEnvio = () => useContext(EnvioContext);

export const EnvioProvider = ({ children }) => {
  const [envios, setEnvios] = useState([]);
  const [envioActual, setEnvioActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los envíos
  const obtenerEnvios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/envios');  // ← Corregido: agregar /api
      console.log('✅ Envíos obtenidos:', response.data);
      setEnvios(response.data);
      return response.data;
    } catch (err) {
      console.error('❌ Error obtener envíos:', err);
      setError(err.response?.data?.detail || 'Error al obtener envíos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener un envío por guía
  const obtenerEnvioPorGuia = async (guia) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/rastreo/${guia}`);  // ← Corregido: agregar /api
      setEnvioActual(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Envío no encontrado');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo envío
  const registrarEnvio = async (datosEnvio) => {
    setLoading(true);
    try {
      const response = await api.post('/api/envios', datosEnvio);  // ← Corregido: agregar /api
      console.log('✅ Envío registrado:', response.data);
      setEnvios([response.data, ...envios]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('❌ Error registrar envío:', err);
      setError(err.response?.data?.detail || 'Error al registrar envío');
      return { success: false, error: err.response?.data?.detail };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de envío
  const actualizarEstado = async (id, estado) => {
    setLoading(true);
    try {
      const response = await api.patch(`/api/envios/${id}/estado`, { estado });  // ← Corregido: agregar /api
      setEnvios(envios.map(e => e.id === id ? response.data : e));
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al actualizar estado');
      return { success: false, error: err.response?.data?.detail };
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnvioContext.Provider value={{
      envios,
      envioActual,
      loading,
      error,
      obtenerEnvios,
      obtenerEnvioPorGuia,
      registrarEnvio,
      actualizarEstado,
      setError
    }}>
      {children}
    </EnvioContext.Provider>
  );
};
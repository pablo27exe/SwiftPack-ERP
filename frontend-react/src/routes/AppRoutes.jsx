import { Routes, Route } from 'react-router-dom'

import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'

import HomePage from '../pages/public/HomePage'
import CotizacionPage from '../pages/public/CotizacionPage'
import RastreoPage from '../pages/public/RastreoPage'
import RegistroEnvioPage from '../pages/public/RegistroEnvioPage'
import LoginPage from '../pages/public/LoginPage'
import HistorialEnviosPage from '../pages/public/HistorialEnviosPage'
import DireccionesPage from '../pages/public/DireccionesPage'
import RutasRepartidorPage from '../pages/public/RutasRepartidorPage'

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cotizar" element={<CotizacionPage />} />
        <Route path="/rastrear/:guia?" element={<RastreoPage />} />
        <Route path="/registro-envio" element={<RegistroEnvioPage />} />
        <Route path="/historial" element={<HistorialEnviosPage />} />
        <Route path="/direcciones" element={<DireccionesPage />} />
        <Route path="/rutas-repartidor" element={<RutasRepartidorPage />} />
      </Route>

      {/* Rutas de Autenticación */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

    </Routes>
  )
}

export default AppRoutes
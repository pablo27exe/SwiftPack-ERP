import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'
import AdminLayout from '../components/layout/AdminLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Páginas Públicas
import HomePage from '../pages/public/HomePage'
import CotizacionPage from '../pages/public/CotizacionPage'
import RastreoPage from '../pages/public/RastreoPage'
import RegistroEnvioPage from '../pages/public/RegistroEnvioPage'
import LoginPage from '../pages/public/LoginPage'

// Páginas de Clientes
import DashboardCliente from '../pages/clientes/DashboardCliente'
import MisEnvios from '../pages/clientes/MisEnvios'
import MiPerfil from '../pages/clientes/MiPerfil'
import DireccionesFrecuentes from '../pages/clientes/DireccionesFrecuentes'

// Páginas de Administración
import AdminDashboard from '../pages/admin/AdminDashboard'
import GestionEnvios from '../pages/admin/GestionEnvios'
import GestionClientes from '../pages/admin/GestionClientes'
import GestionTarifas from '../pages/admin/GestionTarifas'
import Reportes from '../pages/admin/Reportes'
import GestionRH from '../pages/admin/GestionRH'

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cotizar" element={<CotizacionPage />} />
        <Route path="/rastrear/:guia?" element={<RastreoPage />} />
        <Route path="/registro-envio" element={<RegistroEnvioPage />} />
      </Route>

      {/* Rutas de Autenticación */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rutas Protegidas - Clientes */}
      <Route element={<PrivateRoute allowedRoles={['cliente']} />}>
        <Route element={<PublicLayout />}>
          <Route path="/cliente/dashboard" element={<DashboardCliente />} />
          <Route path="/cliente/envios" element={<MisEnvios />} />
          <Route path="/cliente/perfil" element={<MiPerfil />} />
          <Route path="/cliente/direcciones" element={<DireccionesFrecuentes />} />
        </Route>
      </Route>

      {/* Rutas Protegidas - Administración */}
      <Route element={<PrivateRoute allowedRoles={['admin', 'operador']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/envios" element={<GestionEnvios />} />
          <Route path="/admin/clientes" element={<GestionClientes />} />
          <Route path="/admin/tarifas" element={<GestionTarifas />} />
          <Route path="/admin/reportes" element={<Reportes />} />
          <Route path="/admin/rh" element={<GestionRH />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
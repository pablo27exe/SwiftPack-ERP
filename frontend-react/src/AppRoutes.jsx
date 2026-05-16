import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistroEnvioPage from './pages/public/RegistroEnvioPage';
import HistorialEnviosPage from './pages/public/HistorialEnviosPage';
import DireccionesPage from './pages/public/DireccionesPage';
import RutasRepartidorPage from './pages/public/RutasRepartidorPage';

const AppRoutes = () => {
  return (
    <Router>
      {/* Menú de navegación temporal para pruebas */}
      <nav style={{ 
        padding: '1rem', 
        background: '#2c3e50', 
        color: 'white', 
        display: 'flex', 
        gap: '20px',
        marginBottom: '20px' 
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>SwiftPack ERP</Link>
        <Link to="/registro" style={{ color: 'white' }}>Registro</Link>
        <Link to="/historial" style={{ color: 'white' }}>Historial</Link>
        <Link to="/direcciones" style={{ color: 'white' }}>Direcciones</Link>
        <Link to="/repartidor/rutas" style={{ color: 'white' }}>App Repartidor</Link>
      </nav>

      <div style={{ padding: '0 20px' }}>
        <Routes>
          <Route path="/registro" element={<RegistroEnvioPage />} />
          <Route path="/historial" element={<HistorialEnviosPage />} />
          <Route path="/direcciones" element={<DireccionesPage />} />
          <Route path="/repartidor/rutas" element={<RutasRepartidorPage />} />
          <Route path="/" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Módulos de Emmanuel - SwiftPack</h1>
              <p>Selecciona una opción en la barra superior para visualizar el avance.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
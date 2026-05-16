import './App.css'
import { AuthProvider } from './context/AuthContext'
import { EnvioProvider } from './context/EnvioContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <EnvioProvider>
                <AppRoutes />
      </EnvioProvider>
    </AuthProvider>
  )
}

export default App
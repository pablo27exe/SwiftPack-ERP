import { Outlet } from 'react-router-dom'

const AuthLayout = () => (
  <div className="auth-shell">
    <main className="auth-container">
      <Outlet />
    </main>
  </div>
)

export default AuthLayout

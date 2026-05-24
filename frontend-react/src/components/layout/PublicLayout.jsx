import { Outlet } from 'react-router-dom';
import CardNav from '../common/CardNav';
import Footer from '../common/Footer';

// Configuración de los items del menú
const navItems = [
  {
    label: "Servicios",
    bgColor: "#11519c",
    textColor: "#ffffff",
    roles: ["public", "cliente", "admin", "operador"],
    links: [
      { label: "Cotizar Envío", href: "/cotizar", ariaLabel: "Cotizar envío" },
      { label: "Registrar Envío", href: "/registro-envio", ariaLabel: "Registrar envío" },
      { label: "Rastrear Guía", href: "/rastrear", ariaLabel: "Rastrear guía" }
    ]
  },
  {
    label: "Mi Cuenta",
    bgColor: "#2e89c6",
    textColor: "#ffffff",
    roles: ["cliente"],
    links: [
      { label: "Dashboard", href: "/cliente/dashboard", ariaLabel: "Mi dashboard" },
      { label: "Mis Envíos", href: "/cliente/envios", ariaLabel: "Mis envíos" },
      { label: "Direcciones", href: "/cliente/direcciones", ariaLabel: "Mis direcciones" },
      { label: "Mi Perfil", href: "/cliente/perfil", ariaLabel: "Mi perfil" }
    ]
  },
  {
    label: "Administración",
    bgColor: "#ef5a07",
    textColor: "#ffffff",
    roles: ["admin", "operador"],
    links: [
      { label: "Dashboard Admin", href: "/admin/dashboard", ariaLabel: "Panel de administración" },
      { label: "Gestionar Envíos", href: "/admin/envios", ariaLabel: "Gestionar envíos" },
      { label: "Gestionar Clientes", href: "/admin/clientes", ariaLabel: "Gestionar clientes" },
      { label: "Gestionar RH", href: "/admin/rh", ariaLabel: "Gestionar recursos humanos" },
      { label: "Configurar Tarifas", href: "/admin/tarifas", ariaLabel: "Configurar tarifas" },
      { label: "Reportes", href: "/admin/reportes", ariaLabel: "Ver reportes" }
    ]
  },
  {
    label: "Soporte",
    bgColor: "#fd8106",
    textColor: "#ffffff",
    roles: ["public", "cliente", "admin", "operador"],
    links: [
      { label: "Ayuda", href: "/ayuda", ariaLabel: "Centro de ayuda" },
      { label: "Contacto", href: "/contacto", ariaLabel: "Contactar soporte" }
    ]
  }
];

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CardNav
        items={navItems}
        baseColor="#ffffff"
        menuColor="#11519c"
        buttonBgColor="#ef5a07"
        buttonTextColor="#ffffff"
        ease="power3.out"
      />
      
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
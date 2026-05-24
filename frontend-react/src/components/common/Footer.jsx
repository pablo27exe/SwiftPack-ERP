import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#11519c] to-[#2e89c6] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-xl mb-3">SwiftPack</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Soluciones logísticas rápidas y confiables para tus envíos. 
              Tecnología al servicio de tu mercancía.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cotizar" className="text-blue-100 hover:text-[#fd8106] transition">
                  Cotizar envío
                </Link>
              </li>
              <li>
                <Link to="/rastrear" className="text-blue-100 hover:text-[#fd8106] transition">
                  Rastrear paquete
                </Link>
              </li>
              <li>
                <Link to="/registro-envio" className="text-blue-100 hover:text-[#fd8106] transition">
                  Registrar envío
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-blue-100 hover:text-[#fd8106] transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-center gap-2">
                <span>📞</span> (55) 1234-5678
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> hola@swiftpack.mx
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> Ciudad de Puebla, Puebla
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-700 mt-6 pt-6 text-center text-blue-200 text-sm">
          © {new Date().getFullYear()} SwiftPack - Todos los derechos reservados
        </div>
      </div>
    </footer>
  )
}

export default Footer
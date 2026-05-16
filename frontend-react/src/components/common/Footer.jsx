const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-2">SwiftPack</h3>
            <p className="text-gray-400 text-sm">
              Soluciones logísticas rápidas y confiables para tus envíos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-2">Enlaces</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><a href="/cotizar" className="hover:text-white">Cotizar envío</a></li>
              <li><a href="/rastrear" className="hover:text-white">Rastrear paquete</a></li>
              <li><a href="/contacto" className="hover:text-white">Contacto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-2">Contacto</h3>
            <p className="text-gray-400 text-sm">📞 (55) 1234-5678</p>
            <p className="text-gray-400 text-sm">✉️ hola@swiftpack.mx</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-500 text-sm">
          © 2026 SwiftPack
        </div>
      </div>
    </footer>
  );
};

export default Footer;
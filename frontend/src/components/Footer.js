import { Link } from "react-router-dom";
import { Crown, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 mt-20" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-8 h-8 text-[#D4AF37]" />
              <h3 className="text-xl font-bold gold-text">LuxDrop.pt</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              O luxo ao seu alcance, entregue em qualquer lugar.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-[#D4AF37] rounded-full transition-colors" data-testid="facebook-link">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-[#D4AF37] rounded-full transition-colors" data-testid="instagram-link">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-home">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-about">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-contact">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informações</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/policies#shipping" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-shipping">
                  Envios e Entregas
                </Link>
              </li>
              <li>
                <Link to="/policies#returns" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-returns">
                  Política de Devolução
                </Link>
              </li>
              <li>
                <Link to="/policies#privacy" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-privacy">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/policies#terms" className="text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="footer-terms">
                  Termos e Condições
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>support@luxdrop.pt</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>+351 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Lisboa, Portugal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 LuxDrop.pt. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Plataforma de dropshipping premium para o mercado europeu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
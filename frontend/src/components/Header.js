import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, Crown } from "lucide-react";
import Cart from "./Cart";

const Header = ({ cart, removeFromCart, updateQuantity }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass" data-testid="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
              <Crown className="w-8 h-8 text-[#D4AF37]" />
              <div>
                <h1 className="text-2xl font-bold gold-text">LuxDrop</h1>
                <p className="text-[10px] text-gray-400 -mt-1">O luxo ao seu alcance</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="nav-home">
                Início
              </Link>
              <Link to="/blog" className="text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="nav-blog">
                Blog
              </Link>
              <Link to="/about" className="text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="nav-about">
                Sobre
              </Link>
              <Link to="/contact" className="text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="nav-contact">
                Contacto
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                data-testid="search-toggle-btn"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
                data-testid="cart-toggle-btn"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
                data-testid="mobile-menu-toggle"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4 animate-fadeInUp" data-testid="search-bar">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                data-testid="search-input"
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-white/10" data-testid="mobile-menu">
            <nav className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="mobile-nav-home">
                Início
              </Link>
              <Link to="/blog" className="block text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="mobile-nav-blog">
                Blog
              </Link>
              <Link to="/about" className="block text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="mobile-nav-about">
                Sobre
              </Link>
              <Link to="/contact" className="block text-white hover:text-[#D4AF37] transition-colors font-medium" data-testid="mobile-nav-contact">
                Contacto
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <Cart 
        cart={cart} 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
    </>
  );
};

export default Header;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { Star, TrendingUp, Sparkles, Package, CreditCard, Truck } from "lucide-react";
import { toast, Toaster } from "sonner";

const Home = ({ cart, addToCart, removeFromCart, updateQuantity, chatOpen, setChatOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Seed data first
      await axios.post(`${API}/seed-data`);

      // Load products and categories
      const [productsRes, categoriesRes, featuredRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/products/featured/list`)
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setFeaturedProducts(featuredRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Toaster position="top-center" theme="dark" />
      <Header cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full filter blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FFD700] rounded-full filter blur-[120px]" />
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fadeInUp">
          <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 gold-text" data-testid="hero-title">
            LuxDrop.pt
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-4">
            O luxo ao seu alcance, entregue em qualquer lugar
          </p>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Descubra produtos premium das melhores marcas com entregas rápidas para toda a Europa
          </p>
          <button 
            onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}
            className="btn-gold"
            data-testid="explore-btn"
          >
            Explorar Produtos
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center card-hover" data-testid="feature-quality">
              <Package className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Qualidade Premium</h3>
              <p className="text-gray-400">Produtos selecionados das melhores marcas</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center card-hover" data-testid="feature-payment">
              <CreditCard className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
              <p className="text-gray-400">Stripe, PayPal, MB Way e mais</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center card-hover" data-testid="feature-shipping">
              <Truck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Envio Rápido</h3>
              <p className="text-gray-400">7-14 dias para Portugal, grátis acima de €50</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4" data-testid="categories-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gold-text">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/?category=${category.slug}`}
                className="glass rounded-xl overflow-hidden card-hover group"
                data-testid={`category-${category.slug}`}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <p className="text-white font-semibold text-sm">{category.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-20 px-4" data-testid="featured-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-12">
            <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
            <h2 className="text-4xl font-bold gold-text">Produtos em Destaque</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="glass rounded-xl overflow-hidden card-hover" data-testid={`product-card-${product.id}`}>
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {product.original_price && (
                      <div className="absolute top-4 right-4 badge" data-testid={`product-discount-${product.id}`}>
                        -{Math.round((1 - product.price / product.original_price) * 100)}%
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold mb-2 hover:text-[#D4AF37] transition-colors" data-testid={`product-name-${product.id}`}>
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="star-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="inline w-4 h-4" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews_count})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold gold-text" data-testid={`product-price-${product.id}`}>
                      €{product.price.toFixed(2)}
                    </span>
                    {product.original_price && (
                      <span className="text-gray-500 line-through text-sm">
                        €{product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-gold py-2"
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default Home;
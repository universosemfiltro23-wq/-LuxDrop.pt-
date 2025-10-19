import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { Star, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { toast, Toaster } from "sonner";

const ProductPage = ({ cart, addToCart, removeFromCart, updateQuantity, chatOpen, setChatOpen }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
      
      // Load recommendations from same category
      const recsResponse = await axios.get(`${API}/products?category=${response.data.category}`);
      setRecommendations(recsResponse.data.filter(p => p.id !== id).slice(0, 4));
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Produto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="product-page">
      <Toaster position="top-center" theme="dark" />
      <Header cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-gray-400" data-testid="breadcrumb">
            <Link to="/" className="hover:text-[#D4AF37]">Início</Link>
            <span className="mx-2">/</span>
            <span>{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Images */}
            <div data-testid="product-images">
              <div className="glass rounded-2xl overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                  data-testid="product-main-image"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`glass rounded-lg overflow-hidden ${
                      selectedImage === idx ? "ring-2 ring-[#D4AF37]" : ""
                    }`}
                    data-testid={`product-thumbnail-${idx}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4" data-testid="product-title">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="star-rating flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-gray-400" data-testid="product-reviews">
                  {product.rating} ({product.reviews_count} avaliações)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-5xl font-bold gold-text" data-testid="product-price">
                  €{product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      €{product.original_price.toFixed(2)}
                    </span>
                    <span className="badge text-lg" data-testid="product-discount">
                      -{Math.round((1 - product.price / product.original_price) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Quantidade:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 glass rounded-lg hover:bg-white/10 transition-colors"
                    data-testid="quantity-decrease"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold" data-testid="quantity-display">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 glass rounded-lg hover:bg-white/10 transition-colors"
                    data-testid="quantity-increase"
                  >
                    +
                  </button>
                  <span className="text-gray-400 text-sm">({product.stock} disponíveis)</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full btn-gold py-4 text-lg mb-6 flex items-center justify-center space-x-2"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Adicionar ao Carrinho</span>
              </button>

              {/* Features */}
              <div className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3" data-testid="feature-shipping">
                  <Truck className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm">Envio grátis em compras acima de €50</span>
                </div>
                <div className="flex items-center space-x-3" data-testid="feature-returns">
                  <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm">Devoluções grátis até 30 dias</span>
                </div>
                <div className="flex items-center space-x-3" data-testid="feature-warranty">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm">Garantia de qualidade premium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div data-testid="recommendations-section">
              <h2 className="text-3xl font-bold mb-8 gold-text">Pode também gostar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((rec) => (
                  <Link key={rec.id} to={`/product/${rec.id}`} className="glass rounded-xl overflow-hidden card-hover" data-testid={`recommendation-${rec.id}`}>
                    <img src={rec.images[0]} alt={rec.name} className="w-full aspect-square object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{rec.name}</h3>
                      <p className="text-2xl font-bold gold-text">€{rec.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default ProductPage;
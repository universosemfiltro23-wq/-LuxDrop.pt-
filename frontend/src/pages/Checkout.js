import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

const Checkout = ({ cart, clearCart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Portugal",
    payment_method: "stripe"
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total >= 50 ? 0 : 5.99;
  const finalTotal = total + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error("O seu carrinho está vazio");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        user_email: formData.email,
        user_name: formData.name,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: finalTotal,
        payment_method: formData.payment_method,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
          phone: formData.phone
        }
      };

      const response = await axios.post(`${API}/orders`, orderData);
      
      toast.success("Pedido realizado com sucesso!");
      clearCart();
      
      setTimeout(() => {
        navigate(`/order/${response.data.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen" data-testid="checkout-empty">
        <Header cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Carrinho Vazio</h1>
            <p className="text-gray-400 mb-8">Adicione produtos ao carrinho para continuar</p>
            <button onClick={() => navigate("/")} className="btn-gold" data-testid="back-to-shop-btn">
              Voltar à Loja
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="checkout-page">
      <Toaster position="top-center" theme="dark" />
      <Header cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 gold-text text-center" data-testid="checkout-title">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Info */}
                <div className="glass rounded-2xl p-6" data-testid="shipping-form">
                  <div className="flex items-center space-x-2 mb-6">
                    <Truck className="w-6 h-6 text-[#D4AF37]" />
                    <h2 className="text-2xl font-bold">Informações de Envio</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Nome Completo *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-email"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 mb-2 text-sm">Morada *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-address"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Código Postal *</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-postal"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">Telefone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2 text-sm">País *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                        data-testid="input-country"
                      >
                        <option value="Portugal">Portugal</option>
                        <option value="Espanha">Espanha</option>
                        <option value="França">França</option>
                        <option value="Alemanha">Alemanha</option>
                        <option value="Itália">Itália</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="glass rounded-2xl p-6" data-testid="payment-form">
                  <div className="flex items-center space-x-2 mb-6">
                    <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                    <h2 className="text-2xl font-bold">Método de Pagamento</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { value: "stripe", label: "Cartão de Crédito/Débito (Stripe)" },
                      { value: "paypal", label: "PayPal" },
                      { value: "mbway", label: "MB Way" },
                      { value: "revolut", label: "Revolut Pay" }
                    ].map((method) => (
                      <label
                        key={method.value}
                        className="flex items-center space-x-3 p-4 glass rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        data-testid={`payment-${method.value}`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.value}
                          checked={formData.payment_method === method.value}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#D4AF37]"
                        />
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg" data-testid="payment-mock-notice">
                    <p className="text-sm text-gray-300">
                      <strong>Nota:</strong> Este é um sistema de demonstração. Nenhum pagamento real será processado.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  data-testid="submit-order-btn"
                >
                  {loading ? (
                    <div className="loader" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirmar Pedido</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="glass rounded-2xl p-6 sticky top-24" data-testid="order-summary">
                <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex space-x-3" data-testid={`summary-item-${item.id}`}>
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-gray-400 text-sm">Qtd: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#D4AF37]">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span data-testid="summary-subtotal">€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envio:</span>
                    <span data-testid="summary-shipping">{shipping === 0 ? "Grátis" : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold border-t border-white/10 pt-3">
                    <span>Total:</span>
                    <span className="gold-text" data-testid="summary-total">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {total < 50 && (
                  <div className="mt-4 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg" data-testid="free-shipping-notice">
                    <p className="text-xs text-gray-300">
                      Faltam €{(50 - total).toFixed(2)} para envio grátis!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
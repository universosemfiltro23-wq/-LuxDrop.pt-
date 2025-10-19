import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-8 h-8 text-yellow-500" />;
      case "confirmed": return <CheckCircle className="w-8 h-8 text-blue-500" />;
      case "shipped": return <Truck className="w-8 h-8 text-purple-500" />;
      case "delivered": return <Package className="w-8 h-8 text-green-500" />;
      default: return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Aguardando Confirmação";
      case "confirmed": return "Confirmado";
      case "shipped": return "Enviado";
      case "delivered": return "Entregue";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen" data-testid="order-not-found">
        <Header cart={[]} />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Pedido Não Encontrado</h1>
            <Link to="/" className="btn-gold">Voltar ao Início</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="order-tracking-page">
      <Header cart={[]} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gold-text" data-testid="order-title">Pedido #{order.id.substring(0, 8)}</h1>
            <p className="text-gray-400">Obrigado pela sua compra, {order.user_name}!</p>
          </div>

          {/* Order Status */}
          <div className="glass rounded-2xl p-8 mb-8 text-center" data-testid="order-status">
            <div className="mb-6">
              {getStatusIcon(order.status)}
            </div>
            <h2 className="text-2xl font-bold mb-2">{getStatusText(order.status)}</h2>
            <p className="text-gray-400">Estado atual do seu pedido</p>
          </div>

          {/* Order Details */}
          <div className="glass rounded-2xl p-8 mb-8" data-testid="order-details">
            <h2 className="text-2xl font-bold mb-6">Detalhes do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center" data-testid={`order-item-${idx}`}>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-400 text-sm">Quantidade: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#D4AF37]">€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span className="gold-text" data-testid="order-total">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="glass rounded-2xl p-8" data-testid="shipping-info">
            <h2 className="text-2xl font-bold mb-6">Informação de Envio</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Nome:</strong> {order.user_name}</p>
              <p><strong>Email:</strong> {order.user_email}</p>
              <p><strong>Morada:</strong> {order.shipping_address.address}</p>
              <p><strong>Cidade:</strong> {order.shipping_address.city}</p>
              <p><strong>Código Postal:</strong> {order.shipping_address.postal_code}</p>
              <p><strong>País:</strong> {order.shipping_address.country}</p>
              <p><strong>Telefone:</strong> {order.shipping_address.phone}</p>
              <p><strong>Método de Pagamento:</strong> {order.payment_method.toUpperCase()}</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/" className="btn-outline" data-testid="continue-shopping-btn">
              Continuar a Comprar
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderTracking;
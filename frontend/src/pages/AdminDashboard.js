import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Package, ShoppingBag, DollarSign, TrendingUp, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPost, setGeneratingPost] = useState(false);
  const [socialPost, setSocialPost] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/orders`),
        axios.get(`${API}/products`)
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const generateSocialPost = async (product) => {
    setGeneratingPost(true);
    try {
      const response = await axios.post(`${API}/ai/social-post`, {
        product_name: product.name,
        price: product.price,
        description: product.description,
        platform: "instagram"
      });
      setSocialPost(response.data.post);
      toast.success("Post gerado com sucesso!");
    } catch (error) {
      console.error("Error generating post:", error);
      toast.error("Erro ao gerar post");
    } finally {
      setGeneratingPost(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="admin-dashboard">
      <Toaster position="top-center" theme="dark" />
      <Header cart={[]} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 gold-text" data-testid="admin-title">Dashboard Administrativo</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" data-testid="stats-grid">
            <div className="glass rounded-2xl p-6">
              <Package className="w-8 h-8 text-[#D4AF37] mb-4" />
              <p className="text-gray-400 text-sm mb-2">Total Produtos</p>
              <p className="text-3xl font-bold" data-testid="stat-products">{stats.total_products}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <ShoppingBag className="w-8 h-8 text-[#D4AF37] mb-4" />
              <p className="text-gray-400 text-sm mb-2">Total Pedidos</p>
              <p className="text-3xl font-bold" data-testid="stat-orders">{stats.total_orders}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <TrendingUp className="w-8 h-8 text-[#D4AF37] mb-4" />
              <p className="text-gray-400 text-sm mb-2">Pedidos Pendentes</p>
              <p className="text-3xl font-bold" data-testid="stat-pending">{stats.pending_orders}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <DollarSign className="w-8 h-8 text-[#D4AF37] mb-4" />
              <p className="text-gray-400 text-sm mb-2">Receita Total</p>
              <p className="text-3xl font-bold gold-text" data-testid="stat-revenue">€{stats.total_revenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="recent-orders">
            <h2 className="text-2xl font-bold mb-6">Pedidos Recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 text-gray-400 font-semibold">ID</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">Cliente</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">Total</th>
                    <th className="text-left py-3 text-gray-400 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-white/5" data-testid={`order-row-${order.id}`}>
                      <td className="py-4 text-sm">{order.id.substring(0, 8)}</td>
                      <td className="py-4">{order.user_name}</td>
                      <td className="py-4 font-bold text-[#D4AF37]">€{order.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Social Post Generator */}
          <div className="glass rounded-2xl p-8" data-testid="social-generator">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="text-2xl font-bold">Gerador de Posts IA</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 mb-4">Selecione um produto para gerar post:</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {products.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => generateSocialPost(product)}
                      disabled={generatingPost}
                      className="w-full text-left glass rounded-lg p-4 hover:bg-white/10 transition-colors disabled:opacity-50"
                      data-testid={`generate-post-${product.id}`}
                    >
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-400">€{product.price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 mb-4">Post Gerado:</p>
                <div className="glass rounded-lg p-4 min-h-[200px]" data-testid="generated-post">
                  {generatingPost ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="loader" />
                    </div>
                  ) : socialPost ? (
                    <p className="text-gray-300 whitespace-pre-wrap">{socialPost}</p>
                  ) : (
                    <p className="text-gray-500 italic">Selecione um produto para gerar um post...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
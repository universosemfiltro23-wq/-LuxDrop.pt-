import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast, Toaster } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso! Entraremos em contacto em breve.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen" data-testid="contact-page">
      <Toaster position="top-center" theme="dark" />
      <Header cart={[]} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 gold-text" data-testid="contact-title">Contacte-nos</h1>
            <p className="text-xl text-gray-300">
              Estamos aqui para ajudar. Entre em contacto connosco!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-2xl p-6 text-center" data-testid="contact-email">
              <Mail className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-400">support@luxdrop.pt</p>
              <p className="text-gray-400 text-sm mt-2">Respondemos em 24h</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center" data-testid="contact-phone">
              <Phone className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Telefone</h3>
              <p className="text-gray-400">+351 123 456 789</p>
              <p className="text-gray-400 text-sm mt-2">Seg-Sex: 9h-18h</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center" data-testid="contact-address">
              <MapPin className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Morada</h3>
              <p className="text-gray-400">Avenida da Liberdade</p>
              <p className="text-gray-400">1250-096 Lisboa, Portugal</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8" data-testid="contact-form">
            <h2 className="text-3xl font-bold mb-6">Envie-nos uma mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Nome *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Assunto *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  data-testid="contact-subject-input"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Mensagem *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                  data-testid="contact-message-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-4 text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  <div className="loader" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
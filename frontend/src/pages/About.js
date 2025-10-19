import Header from "../components/Header";
import Footer from "../components/Footer";
import { Crown, Target, Award, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen" data-testid="about-page">
      <Header cart={[]} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Crown className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6 gold-text" data-testid="about-title">Sobre a LuxDrop.pt</h1>
            <p className="text-xl text-gray-300">
              Tornamos o luxo acessível a todos, com entregas para toda a Europa
            </p>
          </div>

          <div className="glass rounded-2xl p-8 mb-12" data-testid="about-story">
            <h2 className="text-3xl font-bold mb-6">A Nossa História</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                A LuxDrop.pt nasceu com uma missão clara: democratizar o acesso a produtos de luxo e qualidade premium. 
                Acreditamos que todos merecem ter acesso a produtos excepcionais, independentemente da sua localização.
              </p>
              <p>
                Através de parcerias estratégicas com os melhores fornecedores internacionais, conseguimos oferecer 
                produtos de alta qualidade a preços competitivos, mantendo sempre o foco na satisfação do cliente.
              </p>
              <p>
                Com tecnologia de ponta e inteligência artificial, otimizamos cada etapa da experiência de compra, 
                desde a descoberta do produto até à entrega na sua porta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-2xl p-6 text-center" data-testid="value-quality">
              <Award className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Qualidade</h3>
              <p className="text-gray-400 text-sm">
                Produtos cuidadosamente selecionados das melhores marcas do mundo
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center" data-testid="value-trust">
              <Users className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Confiança</h3>
              <p className="text-gray-400 text-sm">
                Milhares de clientes satisfeitos em toda a Europa
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center" data-testid="value-innovation">
              <Target className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Inovação</h3>
              <p className="text-gray-400 text-sm">
                Tecnologia e IA para a melhor experiência de compra
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8" data-testid="about-commitment">
            <h2 className="text-3xl font-bold mb-6">O Nosso Compromisso</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-[#D4AF37] text-2xl">✓</span>
                <span>Produtos de qualidade premium verificados e testados</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#D4AF37] text-2xl">✓</span>
                <span>Preços competitivos e transparentes, sem taxas escondidas</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#D4AF37] text-2xl">✓</span>
                <span>Entregas rápidas e seguras para toda a Europa</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#D4AF37] text-2xl">✓</span>
                <span>Suporte ao cliente 24/7 com tecnologia IA</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#D4AF37] text-2xl">✓</span>
                <span>Política de devolução de 30 dias, sem complicações</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
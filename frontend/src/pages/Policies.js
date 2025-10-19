import Header from "../components/Header";
import Footer from "../components/Footer";
import { Truck, RotateCcw, Shield, FileText } from "lucide-react";

const Policies = () => {
  return (
    <div className="min-h-screen" data-testid="policies-page">
      <Header cart={[]} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 gold-text text-center" data-testid="policies-title">
            Políticas e Informações
          </h1>

          {/* Shipping */}
          <div id="shipping" className="glass rounded-2xl p-8 mb-8" data-testid="policy-shipping">
            <div className="flex items-center space-x-3 mb-6">
              <Truck className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold">Envios e Entregas</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Prazos de Entrega</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Portugal: 7-14 dias úteis</li>
                  <li>• Espanha: 10-18 dias úteis</li>
                  <li>• Resto da Europa: 14-21 dias úteis</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Custos de Envio</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Envio GRATUITO para encomendas acima de €50</li>
                  <li>• Envio standard: €5.99</li>
                  <li>• Todas as taxas alfandegárias incluídas</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Rastreamento</h3>
                <p>
                  Todas as encomendas incluem código de rastreamento enviado por email. 
                  Pode acompanhar o seu pedido em tempo real.
                </p>
              </div>
            </div>
          </div>

          {/* Returns */}
          <div id="returns" className="glass rounded-2xl p-8 mb-8" data-testid="policy-returns">
            <div className="flex items-center space-x-3 mb-6">
              <RotateCcw className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold">Política de Devolução</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Garantia de 30 Dias</h3>
                <p>
                  Tem 30 dias desde a recepção do produto para solicitar uma devolução ou troca. 
                  O produto deve estar em condições origináis, não usado e com todas as etiquetas.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Como Devolver</h3>
                <ol className="space-y-2 ml-4">
                  <li>1. Contacte support@luxdrop.pt com o número do pedido</li>
                  <li>2. Receba as instruções de devolução e etiqueta de envio</li>
                  <li>3. Envie o produto de volta</li>
                  <li>4. Receba o reembolso total em 5-10 dias úteis</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Custos de Devolução</h3>
                <p>
                  As devoluções são GRATUITAS para produtos defeituosos ou trocas. 
                  Para outras devoluções, o cliente é responsável pelos custos de envio.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div id="privacy" className="glass rounded-2xl p-8 mb-8" data-testid="policy-privacy">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold">Política de Privacidade</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                A LuxDrop.pt leva a sua privacidade a sério. Todos os seus dados pessoais são protegidos 
                e encriptados de acordo com as normas RGPD da União Europeia.
              </p>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Dados Recolhidos</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Nome e contacto para processamento de encomendas</li>
                  <li>• Morada de envio para entrega de produtos</li>
                  <li>• Email para comunicações e atualizações</li>
                  <li>• Informações de pagamento (processadas de forma segura)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Os Seus Direitos</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Direito de acesso aos seus dados</li>
                  <li>• Direito de rectificação de dados incorrectos</li>
                  <li>• Direito ao apagamento dos seus dados</li>
                  <li>• Direito de portabilidade dos dados</li>
                </ul>
              </div>
              <p>
                Nunca partilhamos os seus dados com terceiros sem o seu consentimento explícito.
              </p>
            </div>
          </div>

          {/* Terms */}
          <div id="terms" className="glass rounded-2xl p-8" data-testid="policy-terms">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold">Termos e Condições</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Uso do Site</h3>
                <p>
                  Ao utilizar o site LuxDrop.pt, concorda com estes termos e condições. 
                  Reservamo-nos o direito de modificar estes termos a qualquer momento.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Preços e Disponibilidade</h3>
                <p>
                  Todos os preços estão em Euros (€) e incluem IVA. Os preços e disponibilidade 
                  estão sujeitos a alterações sem aviso prévio.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Garantias</h3>
                <p>
                  Todos os produtos têm garantia do fabricante. Produtos defeituosos serão 
                  substituídos ou reembolsados na totalidade.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Propriedade Intelectual</h3>
                <p>
                  Todo o conteúdo do site (textos, imagens, logotipos) é propriedade da LuxDrop.pt 
                  e está protegido por direitos de autor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Policies;
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookOpen, Calendar, User } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Tendências de Moda para 2025",
      excerpt: "Descubra as principais tendências de moda que vão dominar este ano. Do minimalismo ao maximalismo, passando por cores vibrantes.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
      author: "Maria Silva",
      date: "15 Janeiro 2025",
      category: "Moda"
    },
    {
      id: 2,
      title: "Como Escolher o Relógio Perfeito",
      excerpt: "Guia completo para selecionar o relógio ideal. Estilos, materiais e dicas para acertar na escolha.",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",
      author: "João Costa",
      date: "10 Janeiro 2025",
      category: "Acessórios"
    },
    {
      id: 3,
      title: "Beleza Sustentável: O Futuro dos Cosméticos",
      excerpt: "A indústria da beleza está a mudar. Conheça as marcas e produtos eco-friendly que estão a fazer a diferença.",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600",
      author: "Ana Rodrigues",
      date: "5 Janeiro 2025",
      category: "Beleza"
    },
    {
      id: 4,
      title: "Decoração Minimalista: Menos é Mais",
      excerpt: "Aprenda a criar um espaço elegante e funcional com o conceito minimalista. Dicas práticas e inspiração.",
      image: "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=600",
      author: "Pedro Santos",
      date: "1 Janeiro 2025",
      category: "Casa"
    },
    {
      id: 5,
      title: "Tecnologia Vestível: Smartwatches em 2025",
      excerpt: "Os melhores smartwatches do mercado. Comparações, funcionalidades e guia de compra.",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
      author: "Carlos Mendes",
      date: "28 Dezembro 2024",
      category: "Tecnologia"
    },
    {
      id: 6,
      title: "Estilo de Inverno: Looks Quentes e Elegantes",
      excerpt: "Como manter o estilo mesmo nos dias mais frios. Casacos, acessórios e combinações perfeitas.",
      image: "https://images.unsplash.com/photo-1483118714900-540cf339fd46?w=600",
      author: "Sofia Almeida",
      date: "20 Dezembro 2024",
      category: "Moda"
    }
  ];

  return (
    <div className="min-h-screen" data-testid="blog-page">
      <Header cart={[]} />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BookOpen className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6 gold-text" data-testid="blog-title">Blog LuxDrop</h1>
            <p className="text-xl text-gray-300">
              Tendências, dicas e inspiração para um estilo de vida premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="glass rounded-2xl overflow-hidden card-hover" data-testid={`blog-post-${post.id}`}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="badge text-xs">{post.category}</span>
                    <div className="flex items-center space-x-2 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 hover:text-[#D4AF37] transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Mais artigos em breve...</p>
            <button className="btn-outline" data-testid="subscribe-btn">
              Subscrever Newsletter
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
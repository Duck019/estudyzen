import { ShoppingBag, Search, Menu, X, ArrowRight, Star, FileText, MonitorPlay, ArrowDown, ChevronLeft, Check, StarHalf, Trash2, Copy, ExternalLink, User as UserIcon, LogOut } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

// --- Mock Data & Interfaces ---

export interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  image: string;
  images: string[];
  type: 'template' | 'slide' | 'doc';
  description: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

const productsData: Product[] = [
  {
    id: "cronograma-estudos",
    title: "Cronograma de Estudos",
    category: "Planejamento",
    price: "R$ 8,00",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop"
    ],
    type: "template",
    description: "Planejamento personalizado para organizar sua rotina, matérias e prazos. Ideal para mais foco e produtividade.",
    features: [
      "Organização de rotina",
      "Distribuição de matérias",
      "Controle de prazos",
      "Foco e produtividade"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "pesquisa-texto",
    title: "Pesquisa (texto simples)",
    category: "Pesquisa",
    price: "R$ 12,00",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Conteúdo completo e bem estruturado sobre o tema solicitado. Entregue em texto organizado.",
    features: [
      "Conteúdo completo",
      "Bem estruturado",
      "Tema personalizado",
      "Entrega em texto"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "pesquisa-pdf",
    title: "Pesquisa em PDF",
    category: "Pesquisa",
    price: "R$ 16,00",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Material formatado em PDF com capa, organização visual e referências — pronto para estudo ou entrega.",
    features: [
      "Formato PDF",
      "Capa inclusa",
      "Organização visual",
      "Referências bibliográficas"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "resumo-escolar",
    title: "Resumo Escolar",
    category: "Resumo",
    price: "R$ 12,00",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Resumo claro, objetivo e organizado, destacando os pontos principais para facilitar a revisão.",
    features: [
      "Claro e objetivo",
      "Destaque dos pontos principais",
      "Facilita a revisão",
      "Organizado"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "mapa-mental",
    title: "Mapa Mental",
    category: "Resumo",
    price: "R$ 10,00",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Mapa mental organizado e visualmente estratégico para facilitar memorização e entendimento do conteúdo.",
    features: [
      "Visualmente estratégico",
      "Facilita a memorização",
      "Entendimento rápido",
      "Organizado"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "trabalho-abnt",
    title: "Trabalho em formato ABNT",
    category: "Trabalho",
    price: "R$ 18,00",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Trabalho completo com formatação nas normas ABNT (capa, sumário, referências e estrutura adequada).",
    features: [
      "Normas ABNT",
      "Capa e sumário",
      "Referências",
      "Estrutura adequada"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "slide-sua-pesquisa",
    title: "Slide com sua Pesquisa",
    category: "Slide",
    price: "R$ 1,50",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    ],
    type: "slide",
    description: "Você envia o conteúdo e nós transformamos em slides organizados e prontos para apresentar. (Preço por página)",
    features: [
      "Design organizado",
      "Pronto para apresentar",
      "Baseado no seu conteúdo",
      "Preço por página"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "slide-nossa-pesquisa",
    title: "Slide com nossa Pesquisa",
    category: "Slide",
    price: "R$ 2,50",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop"
    ],
    type: "slide",
    description: "A gente faz a pesquisa completa e entregamos slides prontos, estruturados e visualmente atrativos. (Preço por página)",
    features: [
      "Pesquisa inclusa",
      "Estruturado",
      "Visualmente atrativo",
      "Preço por página"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  },
  {
    id: "redacao",
    title: "Redação",
    category: "Texto",
    price: "R$ 16,00",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Texto bem desenvolvido e estruturado conforme o tema solicitado.",
    features: [
      "Bem desenvolvido",
      "Estruturado",
      "Tema personalizado",
      "Pronto para uso"
    ],
    rating: 5.0,
    reviewsCount: 0,
    reviews: []
  }
];

// --- Helper Functions ---

const parsePrice = (priceStr: string) => {
  return parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
};

const formatPrice = (price: number) => {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

// --- Components ---

const Navbar = ({ 
  onHomeClick, 
  cartCount, 
  onCartClick,
  user,
  onLoginClick,
  onLogoutClick
}: { 
  onHomeClick: () => void, 
  cartCount: number, 
  onCartClick: () => void,
  user: User | null,
  onLoginClick: () => void,
  onLogoutClick: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/10 py-2 shadow-sm' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHomeClick}
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <span className="font-serif text-2xl tracking-tight font-bold italic">EstudyZen</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Templates', 'Slides', 'Resumos'].map((item) => (
              <motion.button 
                key={item}
                onClick={onHomeClick}
                whileHover={{ y: -2 }}
                className="text-sm uppercase tracking-widest hover:text-pink-500 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-pink-300 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
            <div className="flex items-center space-x-2 border-l border-black/10 pl-6">
              {user ? (
                <div className="relative group">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-pink-50 rounded-full transition-colors flex items-center gap-2">
                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                      {user.email?.charAt(0) || 'U'}
                    </div>
                  </motion.button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-black/10 text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                    <button onClick={onLogoutClick} className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-pink-50 transition-colors flex items-center gap-2">
                      <LogOut size={14} /> Sair
                    </button>
                  </div>
                </div>
              ) : (
                <motion.button 
                  onClick={onLoginClick}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                  className="px-4 py-1.5 border-2 border-black font-bold text-sm uppercase tracking-widest hover:bg-pink-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mr-2"
                >
                  Entrar
                </motion.button>
              )}
              <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-pink-50 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={onCartClick}
                whileHover={{ scale: 1.1, rotate: -5 }} 
                whileTap={{ scale: 0.9 }} 
                className="relative p-2 hover:bg-pink-50 rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {user ? (
              <button onClick={onLogoutClick} className="p-2 text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={onLoginClick} className="p-2 text-gray-600">
                <UserIcon className="w-5 h-5" />
              </button>
            )}
            <button onClick={onCartClick} className="relative p-2">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-white border-b border-gray-100 absolute w-full shadow-lg"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {['Templates', 'Slides', 'Resumos'].map((item) => (
            <button key={item} onClick={() => { onHomeClick(); setIsOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium border-b border-gray-50 hover:bg-pink-50 hover:pl-6 transition-all">
              {item}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeItem, 
  onCheckout 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  updateQuantity: (id: string, q: number) => void, 
  removeItem: (id: string) => void,
  onCheckout: () => void
}) => {
  const total = cart.reduce((sum, item) => sum + (parsePrice(item.product.price) * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l-2 border-black shadow-[-8px_0_0_0_rgba(0,0,0,1)] z-50 flex flex-col"
          >
            <div className="p-6 border-b-2 border-black flex justify-between items-center bg-pink-50">
              <h2 className="font-serif text-2xl italic font-bold flex items-center gap-2">
                <ShoppingBag /> Sua Sacola
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="uppercase tracking-widest text-sm font-bold">Sua sacola está vazia</p>
                  <button onClick={onClose} className="text-black underline decoration-pink-300 decoration-2 underline-offset-4">
                    Continuar explorando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative bg-white">
                      <div className="w-20 h-24 bg-gray-100 border border-black flex-shrink-0">
                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif italic font-bold leading-tight line-clamp-2">{item.product.title}</h4>
                          <span className="text-xs text-gray-500 uppercase">{item.product.category}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="font-sans font-bold">{item.product.price}</span>
                          <div className="flex items-center border border-black bg-white h-7">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 hover:bg-gray-100 font-bold">-</button>
                            <span className="px-2 border-x border-black font-bold text-xs w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 hover:bg-gray-100 font-bold">+</button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="absolute -top-3 -right-3 bg-white border-2 border-black p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t-2 border-black bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="uppercase tracking-widest text-sm font-bold text-gray-500">Total</span>
                  <span className="font-serif text-3xl italic font-bold">{formatPrice(total)}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full py-4 bg-black text-white border-2 border-black font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] hover:bg-gray-900"
                >
                  Finalizar Compra
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  message, 
  onConfirm 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  message: string, 
  onConfirm: () => void 
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b-2 border-black bg-pink-50 relative">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-full transition-all"
                >
                  <X size={20} />
                </button>
                <h2 className="font-serif text-3xl italic font-bold mb-2">Quase lá! ✨</h2>
                <p className="text-sm text-gray-600">
                  Nossas compras são finalizadas diretamente pelo Instagram. Siga os passos abaixo:
                </p>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold mb-1">Copie o resumo do pedido</h4>
                      <p className="text-sm text-gray-600 mb-3">Nós já geramos a mensagem com os itens e o valor total para você.</p>
                      
                      <div className="relative group">
                        <pre className="bg-gray-100 p-4 rounded-md text-xs font-mono text-gray-800 whitespace-pre-wrap border border-gray-300 max-h-40 overflow-y-auto">
                          {message}
                        </pre>
                        <button 
                          onClick={handleCopy}
                          className="absolute top-2 right-2 bg-white border border-black p-2 rounded shadow-sm hover:bg-pink-50 transition-colors flex items-center gap-2 text-xs font-bold"
                        >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-bold mb-1">Envie na nossa DM</h4>
                      <p className="text-sm text-gray-600">
                        Clique no botão abaixo para abrir nosso Instagram. Cole a mensagem copiada e envie. Nós te responderemos rapidinho com as formas de pagamento!
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="p-6 border-t-2 border-black bg-gray-50">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleCopy();
                    onConfirm();
                  }}
                  className="w-full py-4 bg-pink-500 text-white border-2 border-black font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-600 flex justify-center items-center gap-2"
                >
                  <ExternalLink size={18} /> Ir para o Instagram
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="flex flex-col items-center text-center z-10 relative">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.1, rotate: 0 }}
            className="absolute top-0 left-4 md:left-20 border border-black rounded-[50%] px-4 py-1 bg-white cursor-pointer hidden md:block z-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">Desde 2024</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] text-black mb-6 relative z-20"
          >
            Estude<br />
            <span className="italic text-pink-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">sem surtar</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base uppercase tracking-[0.2em] mb-12 max-w-md mx-auto bg-white px-4 py-1 border border-black rounded-full"
          >
            Templates • Slides • Organização
          </motion.p>

          <div className="relative w-full max-w-lg mx-auto h-64 md:h-80 mt-4">
            <motion.div 
              drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileHover={{ scale: 1.05, cursor: "grab" }} whileTap={{ scale: 0.95, cursor: "grabbing", rotate: 0 }}
              initial={{ x: -100, opacity: 0, rotate: -15 }}
              animate={{ x: 0, opacity: 1, rotate: -3, y: [0, -10, 0] }}
              transition={{ x: { delay: 0.4, type: "spring", stiffness: 100 }, opacity: { delay: 0.4 }, rotate: { delay: 0.4, type: "spring" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 } }}
              className="absolute top-0 left-0 md:left-10 bg-white border-2 border-dashed border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10"
            >
              <span className="font-sans font-bold text-lg md:text-xl lowercase select-none">escolha o template</span>
            </motion.div>

            <motion.div 
              drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileHover={{ scale: 1.05, cursor: "grab" }} whileTap={{ scale: 0.95, cursor: "grabbing", rotate: 0 }}
              initial={{ x: 100, opacity: 0, rotate: 15 }}
              animate={{ x: 0, opacity: 1, rotate: 2, y: [0, 10, 0] }}
              transition={{ x: { delay: 0.6, type: "spring", stiffness: 100 }, opacity: { delay: 0.6 }, rotate: { delay: 0.6, type: "spring" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
              className="absolute top-20 right-0 md:right-10 bg-pink-200 border-2 border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20"
            >
              <span className="font-sans font-bold text-xl md:text-2xl lowercase select-none">baixe o arquivo</span>
            </motion.div>

            <motion.div 
              drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              whileHover={{ scale: 1.05, cursor: "grab" }} whileTap={{ scale: 0.95, cursor: "grabbing", rotate: 0 }}
              initial={{ y: 100, opacity: 0, rotate: -10 }}
              animate={{ y: [0, -8, 0], opacity: 1, rotate: -2 }}
              transition={{ opacity: { delay: 0.8 }, rotate: { delay: 0.8, type: "spring" }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }}
              className="absolute top-44 left-10 md:left-20 bg-black text-white px-8 py-4 shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] z-30"
            >
              <span className="font-sans font-bold text-xl md:text-2xl lowercase select-none">tire nota 10</span>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-16 flex flex-col items-center"
          >
            <motion.a 
              href="#templates" whileHover={{ y: 5 }} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 border border-black rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors"
            >
              <ArrowDown size={16} />
            </motion.a>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

const ProductCard = ({ product, index, onClick }: { product: Product, index: number, onClick: (p: Product) => void, key?: string | number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(product)}
      className="group cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] bg-gray-100 border-2 border-black overflow-hidden mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover" 
        />
        
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-5 py-3 font-bold uppercase text-xs tracking-widest border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-200 transition-colors"
          >
            <Search size={16} /> Ver Detalhes
          </motion.button>
        </div>

        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white border border-black px-2 py-1 text-[10px] uppercase font-bold tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {product.category}
          </span>
        </div>
        
        <div className="absolute bottom-3 right-3 z-10">
          {product.type === 'template' && <div className="bg-pink-200 border border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Star size={16} /></div>}
          {product.type === 'slide' && <div className="bg-blue-200 border border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><MonitorPlay size={16} /></div>}
          {product.type === 'doc' && <div className="bg-yellow-200 border border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><FileText size={16} /></div>}
        </div>
      </div>
      
      <div className="flex justify-between items-start mt-auto pt-2">
        <div>
          <h3 className="font-serif text-xl italic leading-tight mb-1 group-hover:text-pink-600 transition-colors">{product.title}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wider">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{product.rating} ({product.reviewsCount})</span>
          </div>
        </div>
        <span className="font-sans font-bold text-lg bg-pink-100 px-2 py-1 border border-black -rotate-2">{product.price}</span>
      </div>
    </motion.div>
  );
};

const FeaturedSection = ({ onProductClick }: { onProductClick: (p: Product) => void }) => {
  return (
    <section id="templates" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-16 border-b-2 border-black pb-4"
        >
          <h2 className="font-serif text-4xl md:text-5xl">Mais Populares</h2>
          <motion.a 
            whileHover={{ x: 5 }}
            href="#" 
            className="hidden md:flex items-center text-sm uppercase tracking-widest font-bold hover:text-pink-500 transition-colors"
          >
            Ver tudo <ArrowRight className="ml-2 w-4 h-4" />
          </motion.a>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {productsData.map((product, index) => (
            <ProductCard key={product.id} index={index} product={product} onClick={onProductClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductDetails = ({ 
  product, 
  onBack, 
  onAddToCart,
  onBuyNow,
  onWriteReview
}: { 
  product: Product, 
  onBack: () => void,
  onAddToCart: (p: Product, q: number) => void,
  onBuyNow: (p: Product, q: number) => void,
  onWriteReview: (p: Product) => void,
  key?: string | number
}) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMainImage(product.images[0]);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [product]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<StarHalf key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-20 min-h-screen bg-[#fafafa]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={onBack}
          className="flex items-center text-sm uppercase tracking-widest font-bold hover:text-pink-500 transition-colors mb-8 group"
        >
          <ChevronLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para loja
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              key={mainImage}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="aspect-[4/5] md:aspect-square bg-gray-100 border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border-2 ${mainImage === img ? 'border-pink-500 shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]' : 'border-black opacity-70 hover:opacity-100'} transition-all`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Purchase */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="bg-white border border-black px-3 py-1 text-xs uppercase font-bold tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4 inline-block">
                {product.category}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic leading-tight mb-4">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-bold underline decoration-pink-300 decoration-2 underline-offset-4 cursor-pointer">
                  {product.reviewsCount} Avaliações
                </span>
              </div>
              
              <div className="text-4xl font-sans font-bold mb-8 flex items-center gap-4">
                {product.price}
                <span className="text-sm font-normal text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 border border-dashed border-gray-300">Acesso Vitalício</span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-10">
              <h4 className="font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                <Star size={16} className="text-pink-500" /> O que está incluso:
              </h4>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <div className="bg-pink-100 p-1 border border-black rounded-full mt-0.5">
                      <Check size={12} className="text-black" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase Actions */}
            <div className="mt-auto space-y-4 p-6 border-2 border-dashed border-black bg-pink-50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold uppercase text-sm tracking-widest">Quantidade</span>
                <div className="flex items-center border-2 border-black bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 font-bold">-</button>
                  <span className="px-4 py-2 border-x-2 border-black font-bold w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 font-bold">+</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button 
                  onClick={() => onAddToCart(product, quantity)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-white text-black border-2 border-black font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 flex justify-center items-center gap-2"
                >
                  <ShoppingBag size={18} /> Carrinho
                </motion.button>
                <motion.button 
                  onClick={() => onBuyNow(product, quantity)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-black text-white border-2 border-black font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] hover:bg-gray-900"
                >
                  Comprar Agora
                </motion.button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4 uppercase tracking-wider">
                Pagamento e envio via Instagram DM
              </p>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t-2 border-black pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl italic mb-4">Avaliações de Estudantes</h2>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex gap-1 mb-1">{renderStars(product.rating)}</div>
                  <span className="text-sm text-gray-500 uppercase tracking-widest">Baseado em {product.reviewsCount} avaliações</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onWriteReview(product)}
              className="px-6 py-3 border-2 border-black font-bold uppercase text-sm tracking-widest hover:bg-pink-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Escrever Avaliação
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute -top-3 -right-3 bg-pink-200 border border-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest rotate-6">
                  Verificado
                </div>
                <div className="flex gap-1 mb-4">
                  {renderStars(review.rating)}
                </div>
                <p className="font-serif text-lg italic mb-6">"{review.comment}"</p>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-500 border-t border-dashed border-gray-300 pt-4">
                  <span className="font-bold text-black">{review.user}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- Other Sections ---

const Marquee = () => {
  return (
    <div className="bg-pink-200 border-y-2 border-black py-4 overflow-hidden whitespace-nowrap group cursor-default">
      <div className="inline-block animate-marquee group-hover:[animation-play-state:paused]">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-8 font-serif italic text-2xl">
            Estude com estilo <span className="not-italic font-sans text-sm mx-4 text-black/50">✦</span> 
            Organize sua rotina <span className="not-italic font-sans text-sm mx-4 text-black/50">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

const CategoriesSection = () => {
  return (
    <section className="py-24 bg-pink-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover="hover"
            className="relative h-[28rem] border-2 border-black bg-white p-8 group overflow-hidden cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <motion.div variants={{ hover: { scale: 1.1 } }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-80"></motion.div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <motion.div variants={{ hover: { y: 5 } }} className="bg-white border-2 border-black inline-block px-4 py-2 w-max shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xs uppercase tracking-widest font-bold">Para Apresentações</span>
              </motion.div>
              <div className="overflow-hidden">
                <motion.h3 variants={{ hover: { y: -10 } }} className="font-serif text-5xl text-white drop-shadow-lg italic mb-4">Slides Incríveis</motion.h3>
                <motion.button variants={{ hover: { y: -10, backgroundColor: "#fce7f3", color: "#000" } }} className="bg-white text-black px-8 py-3 text-sm uppercase font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">Ver coleção</motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover="hover"
            className="relative h-[28rem] border-2 border-black bg-white p-8 group overflow-hidden cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <motion.div variants={{ hover: { scale: 1.1 } }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-80"></motion.div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <motion.div variants={{ hover: { y: 5 } }} className="bg-white border-2 border-black inline-block px-4 py-2 w-max shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xs uppercase tracking-widest font-bold">Para Organização</span>
              </motion.div>
              <div className="overflow-hidden">
                <motion.h3 variants={{ hover: { y: -10 } }} className="font-serif text-5xl text-white drop-shadow-lg italic mb-4">Templates Notion</motion.h3>
                <motion.button variants={{ hover: { y: -10, backgroundColor: "#fce7f3", color: "#000" } }} className="bg-white text-black px-8 py-3 text-sm uppercase font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">Ver coleção</motion.button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t-[16px] border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="font-serif text-4xl italic block mb-6">EstudyZen</span>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Transformando a rotina de estudos de milhares de estudantes com materiais estéticos e altamente funcionais.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="uppercase tracking-widest text-xs font-bold mb-6 text-gray-500">Loja</h4>
              <ul className="space-y-4 text-sm">
                {['Templates', 'Slides', 'E-books', 'Combos'].map(link => (
                  <li key={link}><a href="#" className="hover:text-pink-300 hover:pl-2 transition-all inline-block">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="uppercase tracking-widest text-xs font-bold mb-6 text-gray-500">Ajuda</h4>
              <ul className="space-y-4 text-sm">
                {['FAQ', 'Contato', 'Termos'].map(link => (
                  <li key={link}><a href="#" className="hover:text-pink-300 hover:pl-2 transition-all inline-block">{link}</a></li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h4 className="uppercase tracking-widest text-xs font-bold mb-6 text-gray-500">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4">Receba dicas de estudo e cupons exclusivos.</p>
            <div className="flex border-b border-white/30 pb-2 focus-within:border-pink-300 transition-colors">
              <input type="email" placeholder="Seu melhor e-mail" className="bg-transparent w-full outline-none text-sm placeholder-gray-600" />
              <button className="text-xs uppercase font-bold hover:text-pink-300 transition-colors">Enviar</button>
            </div>
          </motion.div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2026 EstudyZen. Todos os direitos reservados.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            {['Instagram', 'TikTok', 'Pinterest'].map(social => (
              <motion.a key={social} whileHover={{ y: -2, color: 'white' }} href="#" className="transition-colors">{social}</motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase não configurado. Verifique as variáveis de ambiente.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Confirme seu email para continuar!');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b-2 border-black bg-pink-50 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-full transition-all">
            <X size={20} />
          </button>
          <h2 className="font-serif text-3xl italic font-bold mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin ? 'Entre para avaliar produtos e ver seus pedidos.' : 'Junte-se a milhares de estudantes.'}
          </p>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 transition-colors"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-black text-white border-2 border-black font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold underline decoration-pink-300 decoration-2 underline-offset-4"
            >
              {isLogin ? 'Cadastre-se' : 'Entre'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: Product | null }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this to Supabase here
    alert('Avaliação enviada com sucesso! (Simulação)');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b-2 border-black bg-pink-50 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-full transition-all">
            <X size={20} />
          </button>
          <h2 className="font-serif text-2xl italic font-bold mb-2">Avaliar Produto</h2>
          <p className="text-sm text-gray-600 truncate">{product.title}</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Sua Nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star size={28} className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Seu Comentário</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 transition-colors resize-none h-32"
                placeholder="O que você achou deste material?"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-black text-white border-2 border-black font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] hover:bg-gray-900"
            >
              Enviar Avaliação
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  // Auth & Review State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [productToReview, setProductToReview] = useState<Product | null>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const handleWriteReview = (product: Product) => {
    if (user) {
      setProductToReview(product);
      setIsReviewModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleHomeClick = () => {
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const handlePrepareCheckout = (itemsToCheckout: CartItem[] = cart) => {
    if (itemsToCheckout.length === 0) return;

    // Generate Order ID
    const orderId = `EZ-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    
    // Format Message
    let message = `Olá! Quero comprar na EstudyZen ✨\n`;
    message += `ID do Pedido: ${orderId}\n\n`;
    message += `Itens:\n`;
    
    let total = 0;
    itemsToCheckout.forEach(item => {
      const priceNum = parsePrice(item.product.price);
      const itemTotal = priceNum * item.quantity;
      total += itemTotal;
      message += `- ${item.quantity}x ${item.product.title} (${item.product.price})\n`;
    });

    message += `\nTotal: ${formatPrice(total)}`;

    // Set message and open modal instead of native alert
    setCheckoutMessage(message);
    setIsCartOpen(false); // Close cart if it was open
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    setIsCheckoutModalOpen(false);
    window.open('https://ig.me/m/estudyzen', '_blank');
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handlePrepareCheckout([{ product, quantity }]);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-pink-200 selection:text-black">
      <Navbar 
        onHomeClick={handleHomeClick} 
        cartCount={cartItemsCount} 
        onCartClick={() => setIsCartOpen(true)} 
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        product={productToReview}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        onCheckout={() => handlePrepareCheckout(cart)}
      />

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        message={checkoutMessage}
        onConfirm={handleConfirmRedirect}
      />

      <AnimatePresence mode="wait">
        {selectedProduct ? (
          <ProductDetails 
            key="product-details" 
            product={selectedProduct} 
            onBack={handleHomeClick}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
            onWriteReview={handleWriteReview}
          />
        ) : (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <Marquee />
            <FeaturedSection onProductClick={setSelectedProduct} />
            <CategoriesSection />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

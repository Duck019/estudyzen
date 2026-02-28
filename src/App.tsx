import { ShoppingBag, Search, Menu, X, ArrowRight, Star, FileText, MonitorPlay, ArrowDown, ChevronLeft, Check, StarHalf, Trash2, Copy, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

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
    id: "planner-2025",
    title: "Planner Universitário 2025",
    category: "Notion",
    price: "R$ 29,90",
    image: "https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop"
    ],
    type: "template",
    description: "O sistema definitivo no Notion para organizar sua vida acadêmica. Chega de perder prazos ou esquecer trabalhos. Este template foi desenhado com uma estética minimalista e clean, focado em produtividade sem distrações.",
    features: [
      "Dashboard central com visão semanal",
      "Rastreador de hábitos e rotina",
      "Gestor de disciplinas e notas",
      "Calendário de provas e entregas",
      "Espaço para anotações de aulas (Método Cornell)"
    ],
    rating: 4.9,
    reviewsCount: 128,
    reviews: [
      { id: 1, user: "Mariana S.", rating: 5, date: "12 Fev 2026", comment: "Simplesmente perfeito! Mudou completamente a forma como me organizo na faculdade. A estética é linda." },
      { id: 2, user: "Lucas M.", rating: 5, date: "05 Fev 2026", comment: "Muito fácil de usar e personalizar. Vale cada centavo." },
      { id: 3, user: "Beatriz C.", rating: 4, date: "28 Jan 2026", comment: "Ótimo template, mas demorei um pouquinho para entender como linkar as bases de dados. Depois que peguei o jeito, fluiu super bem." }
    ]
  },
  {
    id: "pack-slides",
    title: "Pack Slides Minimalistas",
    category: "PowerPoint",
    price: "R$ 45,00",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
    ],
    type: "slide",
    description: "Apresente seus trabalhos com confiança. Um pacote com mais de 50 slides editáveis no PowerPoint e Google Slides, criados com princípios de design editorial para impressionar qualquer professor.",
    features: [
      "50+ layouts únicos",
      "Fontes gratuitas inclusas",
      "Versões claro e escuro",
      "Fácil edição de cores e fotos",
      "Proporção 16:9 (Widescreen)"
    ],
    rating: 4.7,
    reviewsCount: 85,
    reviews: [
      { id: 1, user: "João P.", rating: 5, date: "10 Fev 2026", comment: "Me salvou no TCC! Os slides são muito profissionais." },
      { id: 2, user: "Camila R.", rating: 4, date: "02 Fev 2026", comment: "Lindos slides, recomendo." }
    ]
  },
  {
    id: "resumos-bio",
    title: "Resumos de Biologia",
    category: "PDF",
    price: "R$ 15,90",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?q=80&w=800&auto=format&fit=crop"
    ],
    type: "doc",
    description: "Mapas mentais e resumos esquematizados de Biologia para o ENEM e vestibulares. Foco nos temas que mais caem, com ilustrações desenhadas à mão e mnemônicos.",
    features: [
      "Citologia e Genética",
      "Botânica e Zoologia",
      "Ecologia completa",
      "Alta resolução para impressão",
      "Formato PDF otimizado"
    ],
    rating: 5.0,
    reviewsCount: 342,
    reviews: [
      { id: 1, user: "Sofia L.", rating: 5, date: "15 Fev 2026", comment: "Os desenhos ajudam DEMAIS a memorizar. Perfeito!" }
    ]
  },
  {
    id: "cronograma-estudos",
    title: "Cronograma de Estudos",
    category: "Excel",
    price: "R$ 19,90",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
    ],
    type: "template",
    description: "Planilha automatizada para montar seu ciclo de estudos. Insira suas matérias, peso de cada uma e horas disponíveis, e a planilha calcula seu cronograma ideal.",
    features: [
      "Cálculo automático de horas",
      "Gráficos de desempenho",
      "Aba de revisão espaçada",
      "Tutorial em vídeo incluso"
    ],
    rating: 4.6,
    reviewsCount: 56,
    reviews: [
      { id: 1, user: "Tiago V.", rating: 5, date: "20 Jan 2026", comment: "A automação dessa planilha é genial. Facilitou muito minha vida." }
    ]
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

const Navbar = ({ onHomeClick, cartCount, onCartClick }: { onHomeClick: () => void, cartCount: number, onCartClick: () => void }) => {
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
  onBuyNow
}: { 
  product: Product, 
  onBack: () => void,
  onAddToCart: (p: Product, q: number) => void,
  onBuyNow: (p: Product, q: number) => void,
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
            <button className="px-6 py-3 border-2 border-black font-bold uppercase text-sm tracking-widest hover:bg-pink-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

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

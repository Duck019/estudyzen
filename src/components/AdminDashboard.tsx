import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export const AdminDashboard = ({ products, onProductsChange }: { products: Product[], onProductsChange: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingProduct({
      id: '',
      title: '',
      category: '',
      price: '',
      image: '',
      images: [],
      type: 'template',
      description: '',
      features: []
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    if (!supabase) return;
    
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    setLoading(false);
    
    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      onProductsChange();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    
    setLoading(true);
    
    const productData = {
      id: editingProduct.id,
      title: editingProduct.title,
      category: editingProduct.category,
      price: editingProduct.price,
      image: editingProduct.image,
      images: editingProduct.images,
      type: editingProduct.type,
      description: editingProduct.description,
      features: editingProduct.features
    };

    // Check if it's an update or insert
    const existing = products.find(p => p.id === editingProduct.id);
    
    let error;
    if (existing) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('products').insert([productData]);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      setIsEditing(false);
      onProductsChange();
    }
  };

  const totalReviews = products.reduce((sum, p) => sum + p.reviewsCount, 0);
  const avgRating = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) 
    : '0.0';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen"
    >
      <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl italic font-bold">Painel Admin</h1>
          <p className="text-gray-600 mt-2">Gerencie seus produtos e veja estatísticas</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] hover:bg-gray-900 transition-colors"
        >
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Total de Produtos</h3>
          <p className="text-4xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Avaliações Recebidas</h3>
          <p className="text-4xl font-bold">{totalReviews}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nota Média</h3>
          <p className="text-4xl font-bold">{avgRating}</p>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 border-b-2 border-black">
                <th className="p-4 text-xs font-bold uppercase tracking-widest">Produto</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest">Preço</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest">Categoria</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest">Avaliações</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img src={product.image} alt={product.title} className="w-12 h-12 object-cover border border-black" />
                    <div>
                      <p className="font-bold">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.id}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono">{product.price}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 text-xs uppercase tracking-wider border border-gray-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(product)} className="p-2 hover:bg-pink-100 rounded-full transition-colors mr-2">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full my-8 flex flex-col"
          >
            <div className="p-6 border-b-2 border-black bg-pink-50 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-serif text-2xl italic font-bold">
                {products.find(p => p.id === editingProduct.id) ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">ID do Produto</label>
                  <input 
                    type="text" 
                    value={editingProduct.id || ''}
                    onChange={e => setEditingProduct({...editingProduct, id: e.target.value})}
                    disabled={!!products.find(p => p.id === editingProduct.id)}
                    className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Título</label>
                  <input 
                    type="text" 
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct({...editingProduct, title: e.target.value})}
                    className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Categoria</label>
                  <input 
                    type="text" 
                    value={editingProduct.category || ''}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Preço (ex: R$ 29,90)</label>
                  <input 
                    type="text" 
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Tipo</label>
                  <select 
                    value={editingProduct.type || 'template'}
                    onChange={e => setEditingProduct({...editingProduct, type: e.target.value as any})}
                    className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 bg-white"
                  >
                    <option value="template">Template</option>
                    <option value="slide">Slide</option>
                    <option value="doc">Documento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Imagem Principal (URL)</label>
                  <input 
                    type="url" 
                    value={editingProduct.image || ''}
                    onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                    className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Imagens da Galeria (URLs separadas por vírgula)</label>
                <textarea 
                  value={(editingProduct.images || []).join(',\n')}
                  onChange={e => setEditingProduct({...editingProduct, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Descrição</label>
                <textarea 
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 h-32 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Recursos (um por linha)</label>
                <textarea 
                  value={(editingProduct.features || []).join('\n')}
                  onChange={e => setEditingProduct({...editingProduct, features: e.target.value.split('\n').filter(Boolean)})}
                  className="w-full border-2 border-black p-3 text-sm outline-none focus:border-pink-500 h-32 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t-2 border-black">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-black font-bold uppercase text-sm tracking-widest hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(244,114,182,1)] hover:bg-gray-900 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

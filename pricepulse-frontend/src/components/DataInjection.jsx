import React from 'react';
import { Zap, Camera, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const DataInjection = () => {
  const { formData, setFormData, handleFileChange, handleSubmit, isSubmitting, preview } = usePrice();

  return (
    <div className="bg-white dark:bg-[#0f1115] border border-slate-200/60 dark:border-white/5 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl relative transition-colors duration-500">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
        <Zap size={14} className="text-purple-500" /> Data Injection
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">ID</label>
            <input required type="number" placeholder="e.g. 101" value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Price (Rs.)</label>
            <input required type="number" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-sm text-cyan-600 dark:text-cyan-400 font-mono font-bold" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>
          <input required type="text" placeholder="Product Designation" value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-sm text-slate-900 dark:text-white" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Location</label>
            <input required type="text" placeholder="City Area" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-xs text-slate-900 dark:text-white" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Vendor</label>
            <input required type="text" placeholder="Store Tag" value={formData.store_name} onChange={(e) => setFormData({ ...formData, store_name: e.target.value })} className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-xs text-slate-900 dark:text-white" />
          </div>
        </div>

        <div className="pt-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 flex items-center gap-2"><Camera size={12} /> Evidence</label>
          <div className="relative group cursor-pointer w-full">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-full p-4 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-[#161920] group-hover:bg-slate-100 dark:group-hover:bg-[#1c2029] group-hover:border-purple-400 transition-all h-24">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover rounded-xl opacity-90 transition-all" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="text-slate-400 group-hover:text-purple-500" size={20} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative group overflow-hidden bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 dark:hover:bg-white transition-all mt-6 disabled:opacity-70 flex justify-center items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {isSubmitting ? <Loader2 size={16} className="animate-spin relative z-10" /> : <Sparkles size={16} className="relative z-10" />}
          <span className="relative z-10">{isSubmitting ? 'Transmitting...' : 'Inject Data'}</span>
        </button>
      </form>
    </div>
  );
};

export default DataInjection;

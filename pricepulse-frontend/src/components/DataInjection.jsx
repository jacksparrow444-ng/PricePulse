import React from 'react';
import { PlusCircle, Loader2, MapPin, Store, Tag, IndianRupee } from 'lucide-react';
import { usePrice } from '../context/PriceContext';

const DataInjection = () => {
  const { formData, setFormData, handleFileChange, handleSubmit, isSubmitting, preview } = usePrice();

  return (
    <div className="bg-white/90 dark:bg-[#0a0c10]/80 backdrop-blur-2xl border border-cyan-400/40 dark:border-cyan-500/30 rounded-[2rem] p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)] dark:shadow-[0_0_60px_rgba(6,182,212,0.1)] relative transition-all duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <PlusCircle size={18} className="text-cyan-500" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white tracking-tight">Submit a Price</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Help others by reporting what you paid</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Product ID */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Tag size={10} /> Product ID
          </label>
          <input
            required
            type="number"
            placeholder="e.g. 101"
            value={formData.product_id}
            onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
            className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-mono"
          />
        </div>

        {/* Product Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            Product Name
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Onions, Tomatoes, Rice..."
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <IndianRupee size={10} /> Price You Paid (₹)
          </label>
          <input
            required
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-sm text-cyan-600 dark:text-cyan-400 font-mono font-bold placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
          />
        </div>

        {/* Location + Store in a row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={10} /> City / Area
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Delhi, Pusa Road"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Store size={10} /> Shop Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Big Bazaar"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 outline-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            📷 Upload a Photo <span className="text-slate-400 font-normal normal-case tracking-normal">(optional – bill, tag, or shelf price)</span>
          </label>
          <div className="relative group cursor-pointer w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-[#161920] group-hover:bg-cyan-50/50 dark:group-hover:bg-cyan-500/5 group-hover:border-cyan-400 transition-all h-28 overflow-hidden">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover rounded-2xl" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/10 transition-colors">
                    <span className="text-xl">📸</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-500 transition-colors">Click to upload image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 relative group overflow-hidden bg-cyan-500 hover:bg-cyan-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-60 flex justify-center items-center gap-2"
        >
          {isSubmitting
            ? <><Loader2 size={15} className="animate-spin" /> Submitting...</>
            : <><PlusCircle size={15} /> Submit Price</>
          }
        </button>

      </form>
    </div>
  );
};

export default DataInjection;

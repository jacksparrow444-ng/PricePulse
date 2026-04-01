import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { PlusCircle, Loader2, MapPin, Store, IndianRupee, Search, CheckCircle2, Sparkles } from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import axios from 'axios';

const DataInjection = () => {
  const { formData, setFormData, handleFileChange, handleSubmit, isSubmitting, preview, IMAGE_BASE } = usePrice();

  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // { id, name, category }
  const [dropdownStyle, setDropdownStyle] = useState({});

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSug(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Portal dropdown position
  const updatePos = () => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setDropdownStyle({ position: 'fixed', top: r.bottom + 4, left: r.left, width: r.width, zIndex: 99999 });
  };

  // Fetch suggestions as user types
  useEffect(() => {
    const q = formData.product_name?.trim();
    if (!q || q.length < 2) { setSuggestions([]); return; }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`${IMAGE_BASE}/api/suggestions?q=${q}`);
        setSuggestions(res.data);
        setShowSug(true);
        updatePos();
      } catch { setSuggestions([]); }
    }, 280);

    return () => clearTimeout(t);
  }, [formData.product_name]);

  // User picks a suggestion
  const pickSuggestion = (sugg) => {
    setSelectedProduct(sugg);
    setFormData(prev => ({
      ...prev,
      product_id: String(sugg.id),
      product_name: sugg.name,
    }));
    setSuggestions([]);
    setShowSug(false);
  };

  // If they clear the name, reset selection
  const handleNameChange = (e) => {
    setSelectedProduct(null);
    setFormData(prev => ({ ...prev, product_name: e.target.value, product_id: '' }));
    setShowSug(true);
    updatePos();
  };

  // Portal dropdown
  const dropdown = showSug && suggestions.length > 0 && (
    <div
      style={dropdownStyle}
      className="bg-white dark:bg-[#161920] border border-slate-200 dark:border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden"
    >
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 pt-3 pb-1">Matching Products</p>
      {suggestions.map((s) => (
        <button
          key={s.id}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s); }}
          className="w-full text-left px-4 py-2.5 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 flex items-start gap-3 border-b border-slate-100 dark:border-white/5 last:border-0 group transition-colors"
        >
          <div className="w-7 h-7 mt-0.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{s.id}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{s.name}</p>
            <p className="text-[10px] text-slate-400">{s.category}</p>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="glass-panel rounded-[2rem] p-6 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative transition-all duration-500 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

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

        {/* Hidden product_id — sent to backend automatically */}
        <input type="hidden" value={formData.product_id || ''} name="product_id" readOnly />

        {/* Smart Product Search */}
        <div className="space-y-1.5" ref={wrapperRef}>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1"><Search size={10}/> Product Name</span>
            {selectedProduct && (
              <span className="flex items-center gap-1 text-emerald-500 font-bold normal-case tracking-normal text-[10px]">
                <CheckCircle2 size={10}/> ID {selectedProduct.id} · {selectedProduct.category}
              </span>
            )}
            {!selectedProduct && formData.product_name?.length > 2 && suggestions.length === 0 && (
              <span className="flex items-center gap-1 text-amber-500 font-bold normal-case tracking-normal text-[10px]">
                <Sparkles size={10}/> New product — will be added
              </span>
            )}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              required
              type="text"
              placeholder='Type e.g. "Life" → Lifebuoy appears…'
              value={formData.product_name || ''}
              onChange={handleNameChange}
              onFocus={() => { setShowSug(true); updatePos(); }}
              className={`w-full bg-slate-50 dark:bg-white/5 border rounded-2xl px-4 py-3.5 outline-none text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 transition-all ${
                selectedProduct
                  ? 'border-emerald-400 focus:glow-cyan'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:glow-cyan'
              }`}
            />
            {selectedProduct && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
            )}
          </div>
          {ReactDOM.createPortal(dropdown, document.body)}
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
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 outline-none text-sm text-cyan-600 dark:text-cyan-400 font-mono font-black placeholder-slate-400 focus:border-cyan-500 focus:glow-cyan transition-all"
          />
        </div>

        {/* Location + Store */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={10} /> City / Area
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Delhi, Noida"
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
            📷 Upload a Photo <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <div className="relative group cursor-pointer w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-[#161920] group-hover:bg-cyan-50/50 dark:group-hover:bg-cyan-500/5 group-hover:border-cyan-400 transition-all h-24 overflow-hidden">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover rounded-2xl" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-cyan-100 group-hover:text-cyan-500 transition-colors">
                    <span className="text-xl">📸</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-500 transition-colors">Click to upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.product_name}
          className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-95 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 flex justify-center items-center gap-2 group"
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> Processing Transmission...</>
            : <><PlusCircle size={16} className="group-hover:rotate-90 transition-transform" /> Inject Price Entry</>
          }
        </button>

      </form>
    </div>
  );
};

export default DataInjection;

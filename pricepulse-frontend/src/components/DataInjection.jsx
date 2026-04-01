import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { PlusCircle, Loader2, MapPin, Store, IndianRupee, Search, CheckCircle2, Activity } from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import axios from 'axios';

const DataInjection = () => {
  const { formData, setFormData, handleFileChange, handleSubmit, isSubmitting, preview, IMAGE_BASE } = usePrice();

  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSug(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updatePos = () => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setDropdownStyle({ position: 'fixed', top: r.bottom + 8, left: r.left, width: r.width, zIndex: 99999 });
  };

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

  const handleNameChange = (e) => {
    setSelectedProduct(null);
    setFormData(prev => ({ ...prev, product_name: e.target.value, product_id: '' }));
    setShowSug(true);
    updatePos();
  };

  const dropdown = showSug && suggestions.length > 0 && (
    <div
      style={dropdownStyle}
      className="glass-panel rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/20"
    >
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 pt-3 pb-2 border-b border-white/5">Available Nodes</p>
      {suggestions.map((s) => (
        <button
          key={s.id}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s); }}
          className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 flex items-start gap-4 border-b border-white/5 last:border-0 group transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <span className="text-[10px] font-black text-cyan-500">{s.id}</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-800 dark:text-white leading-tight group-hover:text-cyan-400 transition-colors">{s.name}</p>
            <p className="text-[10px] font-bold text-slate-500 tracking-tight">{s.category}</p>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.1)] relative transition-all duration-700 overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full"></div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-inner group-hover:glow-cyan transition-all duration-500">
          <Activity size={24} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white leading-none tracking-tight">Inject Node Data</h3>
          <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1.5 opacity-60">Price Transmission Protocol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <input type="hidden" value={formData.product_id || ''} name="product_id" readOnly />

        <div className="space-y-2" ref={wrapperRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
            <span className="flex items-center gap-2"><Search size={12} className="text-cyan-500" /> Identifier</span>
            {selectedProduct && (
              <span className="flex items-center gap-1 text-emerald-500 font-black text-[9px] px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                LOCKED: NODE_{selectedProduct.id}
              </span>
            )}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              required
              type="text"
              placeholder='Product Name or ID...'
              value={formData.product_name || ''}
              onChange={handleNameChange}
              onFocus={() => { setShowSug(true); updatePos(); }}
              className={`w-full bg-white/50 dark:bg-black/20 border rounded-2xl px-5 py-4 outline-none text-sm font-black text-slate-800 dark:text-white placeholder-slate-400 transition-all ${
                selectedProduct
                  ? 'border-emerald-500/40 focus:glow-cyan'
                  : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 focus:glow-cyan'
              }`}
            />
            {selectedProduct && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
          </div>
          {ReactDOM.createPortal(dropdown, document.body)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <IndianRupee size={12} className="text-cyan-500" /> Value (₹)
            </label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none text-sm text-cyan-600 dark:text-cyan-400 font-mono font-black placeholder-slate-400 focus:glow-cyan transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MapPin size={12} className="text-cyan-500" /> Geolocation
            </label>
            <input
              required
              type="text"
              placeholder="Area / Sector"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:glow-cyan transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Store size={12} className="text-cyan-500" /> Provider
          </label>
          <input
            required
            type="text"
            placeholder="Market / Store"
            value={formData.store_name}
            onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
            className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:glow-cyan transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Verification Image</label>
          <div className="relative group/upload cursor-pointer w-full">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex items-center justify-center bg-white/30 dark:bg-black/10 group-hover/upload:border-cyan-500/50 group-hover/upload:bg-cyan-500/5 transition-all h-32 overflow-hidden shadow-inner">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover animate-in fade-in duration-500" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover/upload:text-cyan-500 transition-colors">
                  <Activity size={24} strokeWidth={1} className="group-hover/upload:animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Visual Signature</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.product_name}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 hover:scale-[1.02] active:scale-95 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50 flex justify-center items-center gap-3 overflow-hidden relative group/btn"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
          {isSubmitting
            ? <><Loader2 size={18} className="animate-spin" /> Uplinking...</>
            : <><PlusCircle size={18} className="group-hover/btn:rotate-90 transition-transform duration-500" /> Commit Data Node</>
          }
        </button>
      </form>
    </div>
  );
};

export default DataInjection;

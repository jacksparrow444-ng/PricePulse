import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { PlusCircle, Loader2, MapPin, Store, IndianRupee, Search, CheckCircle2, Camera } from 'lucide-react';
import { usePrice } from '../context/PriceContext';
import axios from 'axios';

const DataInjection = () => {
  const { formData, setFormData, handleFileChange, handleSubmit, isSubmitting, preview, IMAGE_BASE, theme } = usePrice();
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSug(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const updatePos = () => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setDropdownStyle({ position: 'fixed', top: r.bottom + 6, left: r.left, width: r.width, zIndex: 99999 });
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
    setFormData(prev => ({ ...prev, product_id: String(sugg.id), product_name: sugg.name }));
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
    <div style={dropdownStyle}
      className={`rounded-2xl shadow-xl overflow-hidden border
        ${isDark
          ? 'bg-[#161920] border-white/10'
          : 'bg-white border-indigo-100'
        }`}>
      <p className={`text-[9px] font-black uppercase tracking-widest px-4 pt-3 pb-1 border-b
        ${isDark ? 'text-slate-500 border-white/5' : 'text-slate-400 border-slate-100'}`}>
        Matching Products
      </p>
      {suggestions.map((s) => (
        <button
          key={s.id}
          type="button"
          onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s); }}
          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 border-b last:border-0 transition-colors
            ${isDark
              ? 'border-white/5 hover:bg-white/5'
              : 'border-slate-100 hover:bg-indigo-50'
            }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
            ${isDark ? 'bg-cyan-500/10' : 'bg-indigo-100'}`}>
            <span className={`text-[10px] font-black ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>{s.id}</span>
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{s.name}</p>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{s.category}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const inputClass = `input-field w-full rounded-xl px-4 py-3.5 outline-none text-sm font-medium transition-all
    ${isDark
      ? 'bg-white/6 border border-white/12 text-white placeholder-slate-500 focus:border-cyan-500/60 focus:bg-white/10'
      : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:shadow-indigo-100/80 focus:shadow-md'
    }`;

  return (
    <div className="glass-panel rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
          ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-indigo-100 text-indigo-600'}`}>
          <PlusCircle size={18} />
        </div>
        <div>
          <h3 className={`font-black text-base leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Add a Price
          </h3>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Help others by sharing what you paid
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" value={formData.product_id || ''} name="product_id" readOnly />

        {/* Product Name */}
        <div className="space-y-1.5" ref={wrapperRef}>
          <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-between
            ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="flex items-center gap-1.5"><Search size={10} /> Product Name</span>
            {selectedProduct && (
              <span className="flex items-center gap-1 text-emerald-500 text-[9px] normal-case tracking-normal font-bold">
                <CheckCircle2 size={10} /> Found · {selectedProduct.category}
              </span>
            )}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              required
              type="text"
              placeholder='e.g. Amul Milk, Dettol...'
              value={formData.product_name || ''}
              onChange={handleNameChange}
              onFocus={() => { setShowSug(true); updatePos(); }}
              className={inputClass + ` ${selectedProduct ? (isDark ? ' border-emerald-500/40' : ' border-emerald-400') : ''}`}
            />
            {selectedProduct && <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />}
          </div>
          {ReactDOM.createPortal(dropdown, document.body)}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
            ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <IndianRupee size={10} /> Price You Paid (₹)
          </label>
          <input
            required type="number" step="0.01" placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={inputClass + ` font-mono ${isDark ? 'text-cyan-400' : 'text-indigo-700'}`}
          />
        </div>

        {/* City + Shop — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
              ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin size={10} /> City / Area
            </label>
            <input
              required type="text" placeholder="e.g. Delhi, Noida"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
              ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Store size={10} /> Shop Name
            </label>
            <input
              required type="text" placeholder="e.g. Big Bazaar"
              value={formData.store_name}
              onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-1.5">
          <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5
            ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Camera size={10} /> Add a Photo
            <span className={`font-normal normal-case tracking-normal text-[9px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>(optional)</span>
          </label>
          <div className="relative group cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`w-full border-2 border-dashed rounded-xl flex items-center justify-center h-20 overflow-hidden transition-all
              ${isDark
                ? 'border-white/10 bg-white/5 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5'
                : 'border-slate-300/60 bg-slate-50 group-hover:border-indigo-400/60 group-hover:bg-indigo-50/60'
              }`}>
              {preview ? (
                <img src={preview} className="h-full w-full object-cover" alt="Preview" />
              ) : (
                <div className={`flex flex-col items-center gap-1 pointer-events-none
                  ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Camera size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-medium">Click to upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.product_name}
          className={`w-full py-4 rounded-xl font-black text-base text-white transition-all btn-primary
            disabled:opacity-50 flex items-center justify-center gap-2
            ${isDark
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.45)]'
              : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.45)]'
            }
            hover:scale-[1.02] active:scale-95`}
        >
          {isSubmitting
            ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            : <><PlusCircle size={16} /> Submit Price</>
          }
        </button>
      </form>
    </div>
  );
};

export default DataInjection;

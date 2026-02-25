import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, BarChart3, TrendingUp, PlusCircle, Store, Camera,
  Image as ImageIcon, CheckCircle2, MapPin, AlertCircle, ShieldCheck,
  Zap, ArrowRight, Loader2, Sparkles, Activity, Settings2, Info, Clock, Check, Tag
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- Global Type Definitions & Helpers ---
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// --- PricePulse Intelligence Engine Interface ---
function App() {
  const [searchId, setSearchId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ product_id: '', product_name: '', price: '', location: '', store_name: '' });
  const [systemStats, setSystemStats] = useState(null);
  const [lastUpdatedSecs, setLastUpdatedSecs] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Loading States
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Lifecycles
  useEffect(() => {
    fetchSystemStats();
  }, []);

  // Real-time Timer
  useEffect(() => {
    if (!analytics) return;
    const interval = setInterval(() => {
      setLastUpdatedSecs(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [analytics]);

  const fetchSystemStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/system-stats');
      setSystemStats(res.data);
    } catch (err) {
      console.error("Stats fetch failed");
    }
  };

  // --- Core Intelligence Handlers ---
  const fetchAnalytics = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalId = searchId.trim();
    if (!finalId) {
      toast.error("Please enter a valid Product ID.");
      return;
    }

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await axios.get(`http://localhost:5000/analytics/${finalId}`);

      if (response.data && response.data.total_samples > 0) {
        setAnalytics(response.data);
        setLastUpdatedSecs(0);
      } else {
        toast.error(`Product ID [${finalId}] not found in the neural cache.`);
        setAnalytics(null);
      }
    } catch (err) {
      toast.error("Connection to Core Systems failed. Verify backend status.");
      setAnalytics(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedPrice = parseFloat(formData.price);
    const parsedId = parseInt(formData.product_id, 10);

    if (parsedPrice <= 0) {
      toast.error("Invalid entry: Price must be greater than 0.");
      return;
    }
    if (parsedId < 0) {
      toast.error("Invalid entry: Product ID cannot be negative.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('product_id', formData.product_id);
    data.append('product_name', formData.product_name);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('store_name', formData.store_name);
    if (file) data.append('image', file);

    try {
      await axios.post('http://localhost:5000/submit-price', data, { headers: { 'Content-Type': 'multipart/form-data' } });

      toast.success("Node successfully added to consensus network");

      setSearchId(formData.product_id);
      fetchSystemStats();

      setTimeout(() => fetchAnalytics(), 1000);

      setFormData({ product_id: '', product_name: '', price: '', location: '', store_name: '' });
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error("Injection failed. Please verify data integrity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Animation Variants ---
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const chartData = analytics?.raw_data ? analytics.raw_data.map(item => ({
    name: item.store_name.substring(0, 10) + '...',
    price: parseFloat(item.price)
  })) : [];

  const confidenceScore = analytics ? Math.min(Math.round((analytics.total_samples / 30) * 100), 100) : 0;
  const pieData = [{ name: 'Conf', value: confidenceScore }, { name: 'Rem', value: 100 - confidenceScore }];
  const PIE_COLORS = ['#22d3ee', '#1e293b'];

  const volatilityIndex = analytics ? ((analytics.max_price - analytics.min_price) / analytics.average_price * 100) : 0;

  let marketClassification = { text: '🟢 Stable Market', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' };
  if (volatilityIndex > 20) marketClassification = { text: '🚨 High Instability', color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' };
  else if (volatilityIndex > 10) marketClassification = { text: '🟡 Moderately Volatile', color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-400/10' };

  let trendDirection = '➡️ Stable Trend';
  let trendPercent = '---';
  if (analytics && analytics.raw_data && analytics.raw_data.length >= 3) {
    if (volatilityIndex > 15) {
      trendDirection = '📈 Upward Trend';
      trendPercent = `+${(volatilityIndex / 2).toFixed(1)}% (7d)`;
    } else {
      trendDirection = '➡️ Stable Trend';
      trendPercent = `+1.2% (7d)`;
    }
  }

  const availableLocations = ['All', ...new Set(analytics?.raw_data?.map(item => item.location) || [])];
  const filteredNodes = analytics?.raw_data ? (selectedLocation === 'All' ? analytics.raw_data : analytics.raw_data.filter(n => n.location === selectedLocation)) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative">

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0f1115',
            color: '#fff',
            border: '1px solid rgba(34,211,238,0.3)',
            boxShadow: '0 10px 40px rgba(34,211,238,0.2)',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '16px 24px',
          },
          success: { iconTheme: { primary: '#22d3ee', secondary: '#0f1115' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#0f1115' }, style: { border: '1px solid rgba(244,63,94,0.3)' } }
        }}
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1400px] mx-auto">

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <Activity className="text-white z-10" size={24} />
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                PricePulse <span className="text-cyan-400">.</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-1">Enabling Transparent Hyperlocal Markets</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors px-4 py-2 rounded-full uppercase tracking-widest"
            >
              Download Report
            </button>
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md w-[160px] justify-center">
              <Clock size={12} /> Updated {lastUpdatedSecs === 0 ? 'just now' : `${lastUpdatedSecs}s ago`}
            </span>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Node Active</span>
            </div>
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
              <Settings2 strokeWidth={1.5} size={18} className="text-slate-400" />
            </button>
          </div>
        </motion.header>

        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">

            <div className="bg-[#0f1115] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                <Search size={14} className="text-cyan-400" /> Query Engine
              </h3>

              <form onSubmit={fetchAnalytics} className="relative">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Search Product ID or Name..."
                  className="w-full bg-[#161920] border border-white/5 focus:border-cyan-500/50 rounded-2xl py-4 pl-5 pr-14 outline-none text-sm font-medium text-white placeholder-slate-600 transition-all focus:ring-4 focus:ring-cyan-500/10"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} strokeWidth={2.5} />}
                </button>
              </form>
            </div>

            {analytics && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f1115] border border-white/5 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[40px] rounded-full pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-1 pointer-events-none flex items-center gap-1.5"><Tag size={10} /> Active Product:</p>
                    <p className="font-bold text-white text-sm truncate pr-2">{analytics.product_name} <span className="text-slate-500 font-mono text-[10px] ml-1">(ID: {searchId})</span></p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full text-cyan-400 text-[9px] font-black uppercase tracking-widest truncate max-w-[100px] flex-shrink-0 text-center">
                    {analytics.category || 'General'}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-[#0f1115] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Zap size={14} className="text-purple-400" /> Data Injection
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">ID</label>
                    <input required type="number" placeholder="e.g. 101" value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} className="w-full bg-[#161920] border border-white/5 rounded-2xl px-4 py-3 outline-none text-sm focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Price (Rs.)</label>
                    <input required type="number" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#161920] border border-white/5 rounded-2xl px-4 py-3 outline-none text-sm focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-cyan-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>
                  <input required type="text" placeholder="Product Designation" value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} className="w-full bg-[#161920] border border-white/5 rounded-2xl px-4 py-3 outline-none text-sm focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Location</label>
                    <input required type="text" placeholder="Sector 7G" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-[#161920] border border-white/5 rounded-2xl px-4 py-3 outline-none text-xs focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Vendor</label>
                    <input required type="text" placeholder="Kwik-E-Mart" value={formData.store_name} onChange={(e) => setFormData({ ...formData, store_name: e.target.value })} className="w-full bg-[#161920] border border-white/5 rounded-2xl px-4 py-3 outline-none text-xs focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block flex items-center gap-2"><Camera size={12} /> Visual Evidence</label>
                  <div className="relative group cursor-pointer w-full">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full p-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center bg-[#161920] group-hover:bg-[#1c2029] group-hover:border-purple-500/30 transition-all h-24">
                      {preview ? (
                        <img src={preview} className="h-full w-full object-cover rounded-xl opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="text-slate-600 group-hover:text-purple-400 transition-colors" size={20} />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden bg-slate-200 text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all mt-6 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isSubmitting ? 'Transmitting...' : 'Inject Data'}</span>
                </button>
              </form>
            </div>

            {systemStats && (
              <div className="grid grid-cols-4 gap-2 bg-[#0f1115] border border-white/5 rounded-2xl p-4 shadow-xl">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Products</p>
                  <p className="font-mono font-bold text-white">{systemStats.total_products}</p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entries</p>
                  <p className="font-mono font-bold text-cyan-400">{systemStats.total_entries}</p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Locations</p>
                  <p className="font-mono font-bold text-purple-400">{systemStats.total_locations}</p>
                </div>
                <div className="text-center border-l border-white/5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Vendors</p>
                  <p className="font-mono font-bold text-emerald-400">{systemStats.total_vendors}</p>
                </div>
              </div>
            )}

          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col h-full">
            {analytics ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="space-y-6 flex-1"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="md:col-span-2 bg-gradient-to-br from-[#0f1115] to-[#161920] p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-colors duration-1000"></div>

                    <div className="flex justify-between items-start mb-4">
                      <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <ShieldCheck size={14} /> Community Consensus Price
                      </p>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-2">Entry ID: {searchId}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight opacity-90">{analytics.product_name}</h3>

                    <div className="flex items-end gap-6">
                      <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                        <span className="text-cyan-400 text-4xl align-top">Rs. </span>
                        {analytics.average_price}
                      </h2>
                      <div className="pb-2 relative group cursor-help mt-4 md:mt-0">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1 flex items-center gap-1">
                          Optimal Range <Info size={10} className="text-slate-400" />
                        </p>
                        <p className="text-lg font-bold text-slate-300">
                          Rs. {analytics.fair_range.low} <span className="text-slate-600 font-light mx-1">-</span> Rs. {analytics.fair_range.high}
                        </p>

                        <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-slate-800 border border-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                          <p className="text-[10px] font-bold text-slate-300 leading-relaxed">Calculated securely as ±10% of the cross-verified market average.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                        Based on <strong className="text-white mx-1">{analytics.total_samples} verified</strong> price contributors
                      </p>
                      <div className={`px-3 py-1.5 rounded-full border ${marketClassification.border} ${marketClassification.bg} relative group cursor-help`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${marketClassification.color}`}>
                          {marketClassification.text}
                        </p>
                        {volatilityIndex > 20 && (
                          <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-slate-800 border border-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                            <p className="text-[10px] font-bold text-slate-300 leading-relaxed">Volatility above 20% indicates unstable pricing behavior.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-[#0f1115] p-6 rounded-[2rem] border border-white/5 flex-1 flex flex-col justify-center relative overflow-hidden items-center group">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full"></div>

                      <div className="relative w-28 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={45}
                              dataKey="value" startAngle={90} endAngle={-270} stroke="none"
                            >
                              {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-cyan-400 leading-none">{confidenceScore}%</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2">Data Confidence</p>
                      <p className="text-[8px] text-slate-600 text-center mt-1 px-4 leading-relaxed">
                        Confidence increases with number of verified contributors.<br />
                        <span className="font-mono opacity-50">(verified_nodes / 30) * 100</span>
                      </p>
                    </div>

                    {analytics.last_image ? (
                      <div className="bg-[#0f1115] p-6 rounded-[2rem] border border-white/5 flex-1 relative overflow-hidden group cursor-pointer min-h-[120px]">
                        <img src={`http://localhost:5000${analytics.last_image}`} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity mix-blend-luminosity group-hover:mix-blend-normal duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent"></div>
                        <div className="relative z-10 h-full flex flex-col justify-end">
                          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                            <ImageIcon size={12} /> Latest Evidence
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#161920] p-6 rounded-[2rem] border border-dashed border-white/10 flex-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px] opacity-80 cursor-not-allowed">
                        <ImageIcon size={20} className="text-slate-600 mb-2" />
                        <p className="text-slate-500 text-[9px] uppercase font-bold tracking-widest text-center mt-1">No evidence<br />uploaded yet</p>
                      </div>
                    )}
                  </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  <div className="lg:col-span-2 bg-[#0f1115] p-8 rounded-[2.5rem] border border-white/5 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          Price Volatility Matrix
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{trendDirection} <span className="text-cyan-400 ml-1 font-mono tracking-normal">{trendPercent}</span></p>
                      </div>

                      <div className="flex gap-4 bg-[#161920] px-4 py-2 rounded-xl border border-white/5">
                        <div className="text-right">
                          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Price Spread</p>
                          <p className="font-mono text-[11px] font-bold text-slate-300">Rs. {analytics.min_price} - Rs. {analytics.max_price}</p>
                        </div>
                        <div className="w-px bg-white/10 mx-1"></div>
                        <div className="text-left">
                          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Volatility</p>
                          <p className="font-mono text-[11px] font-bold text-rose-400">
                            {volatilityIndex.toFixed(1)}%
                          </p>
                        </div>
                        <div className="w-px bg-white/10 mx-1"></div>
                        <div className="text-left">
                          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Market Stability</p>
                          <p className="font-mono text-[11px] font-bold text-cyan-400">
                            {(100 - volatilityIndex).toFixed(1)} / 100
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 w-full min-h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="100%" stopColor="#c084fc" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#161920', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="url(#strokeGradient)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            activeDot={{ r: 6, fill: '#fff', stroke: '#22d3ee', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-[#0f1115] p-6 rounded-[2.5rem] border border-white/5 flex flex-col h-full max-h-[360px]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2 shrink-0">
                        <Store size={14} className="text-purple-400" /> Node Ledger
                      </h3>
                      {availableLocations.length > 2 && (
                        <div className="flex gap-1.5 overflow-x-auto select-none custom-scrollbar pb-1 max-w-[200px] md:max-w-xs justify-end">
                          {availableLocations.map(loc => (
                            <button key={loc} onClick={() => setSelectedLocation(loc)} className={classNames("px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors whitespace-nowrap", selectedLocation === loc ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent")}>{loc}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {filteredNodes.map((shop, idx) => {
                        const price = parseFloat(shop.price);
                        const avg = parseFloat(analytics.average_price);
                        const fairHigh = parseFloat(analytics.fair_range.high);
                        const fairLow = parseFloat(analytics.fair_range.low);

                        let status = { text: '🟢 Fair', dot: 'bg-amber-400', color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-400/10' };

                        if (price > fairHigh) {
                          if (price >= avg * 1.25) {
                            status = { text: '🚨 Extreme Outlier', dot: 'bg-rose-600', color: 'text-rose-500', border: 'border-rose-600/30', bg: 'bg-rose-600/20' };
                          } else {
                            status = { text: '⚠️ Overpriced', dot: 'bg-orange-500', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10' };
                          }
                        } else if (price < fairLow) {
                          status = { text: '🟢 Best Deal', dot: 'bg-emerald-500', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' };
                        }

                        return (
                          <div key={idx} className="flex justify-between items-center p-3.5 bg-[#161920] rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                            <div>
                              <p className="font-bold text-slate-200 text-[13px]">{shop.store_name}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 mt-0.5 font-mono">
                                <MapPin size={10} /> {shop.location}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <p className="font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Rs. {shop.price}</p>
                              <div className={`px-2 py-0.5 rounded border ${status.border} ${status.bg} flex items-center gap-1`}>
                                <span className={`text-[8px] font-black uppercase tracking-wider ${status.color}`}>{status.text}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                </div>

              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] border border-white/5 bg-[#0f1115]/50 backdrop-blur-xl rounded-[3rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mb-8 bg-[#161920] relative">
                    <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[spin_4s_linear_infinite]"></div>
                    <div className="absolute inset-2 rounded-full border border-purple-500/20 animate-[spin_3s_linear_infinite_reverse]"></div>
                    <Search size={32} className="text-slate-600" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-3">Awaiting Instructions</h2>
                  <p className="max-w-xs text-slate-500 font-medium text-xs leading-relaxed">
                    Initialize the query engine with a Product ID or inject new data into the matrix.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}

export default App;
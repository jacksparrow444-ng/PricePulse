import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PriceContext = createContext();

export const usePrice = () => useContext(PriceContext);

export const PriceProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const [searchId, setSearchId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  });
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [formData, setFormData] = useState({ product_id: '', product_name: '', price: '', location: '', store_name: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const API_URL = `${API_BASE}/api`;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const fetchSystemStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/system-stats`);
      setSystemStats(res.data);
      setLastUpdated(Date.now());
    } catch (err) {
      console.error("Stats fetch failed");
    }
  };

  const fetchAnalytics = async (e, customId = null) => {
    if (e) e.preventDefault();
    const finalId = customId || searchId;
    if (!finalId) return;

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Smooth loading transition
      const response = await axios.get(`${API_URL}/analytics/${finalId}`);

      if (response.data && response.data.total_samples > 0) {
        setAnalytics(response.data);
        
        // Add to recent searches
        setRecentSearches(prev => {
          const newSearch = { id: finalId, name: response.data.product_name, time: Date.now() };
          const filtered = prev.filter(s => s.id !== finalId); // Unique
          return [newSearch, ...filtered].slice(0, 5); // Limit to 5
        });
        
        toast.success(`Matrix synchronized for ${response.data.product_name}`);
      } else {
        setAnalytics(null);
        toast.error("Node hash not found in current ledger");
      }
    } catch (err) {
      toast.error("Network synchronization error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) data.append('image', file);

    try {
      await axios.post(`${API_URL}/submit-price`, data, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });

      toast.success("Node successfully injected into consensus network");
      
      // Reset form
      setFormData({ product_id: '', product_name: '', price: '', location: '', store_name: '' });
      setFile(null);
      setPreview(null);
      
      // Refresh context
      fetchSystemStats();
      if (searchId === formData.product_id) fetchAnalytics(null, searchId);
      
    } catch (err) {
      toast.error("Injection failed. Please verify data integrity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const value = {
    theme, toggleTheme,
    searchId, setSearchId,
    analytics, fetchAnalytics,
    systemStats, fetchSystemStats,
    isSearching, isSubmitting,
    recentSearches, 
    selectedLocation, setSelectedLocation,
    formData, setFormData,
    preview, handleFileChange, handleSubmit,
    lastUpdated,
    IMAGE_BASE: API_BASE
  };

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
};

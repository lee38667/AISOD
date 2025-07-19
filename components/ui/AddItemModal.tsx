'use client';

import React, { useState } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: NewItemData) => void;
}

interface NewItemData {
  name: string;
  estimatedPrice: number;
  source: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  isAutoFetch: boolean;
}

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState<NewItemData>({
    name: '',
    estimatedPrice: 0,
    source: '',
    priority: 'medium',
    notes: '',
    isAutoFetch: false
  });

  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: keyof NewItemData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleAutoFetch = async () => {
    if (!formData.name.trim()) {
      setErrors({ name: 'Please enter a product name first' });
      return;
    }

    setIsAutoFetching(true);
    
    // Simulate API call to multiple marketplaces
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock auto-fetched data from "best match" across marketplaces
    const mockMarketplaceData = {
      amazon: { price: Math.floor(Math.random() * 150) + 25, source: 'Amazon' },
      alibaba: { price: Math.floor(Math.random() * 80) + 15, source: 'Alibaba' },
      bestbuy: { price: Math.floor(Math.random() * 200) + 50, source: 'Best Buy' },
      local: { price: Math.floor(Math.random() * 120) + 30, source: 'Local Shop' }
    };

    // Pick the "best" option (lowest price for demo)
    const bestOption = Object.values(mockMarketplaceData).reduce((best, current) => 
      current.price < best.price ? current : best
    );
    
    setFormData(prev => ({
      ...prev,
      estimatedPrice: bestOption.price,
      source: bestOption.source,
    }));
    
    setIsAutoFetching(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (formData.estimatedPrice <= 0) {
      newErrors.estimatedPrice = 'Price must be greater than 0';
    }
    
    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd(formData);
      // Reset form
      setFormData({
        name: '',
        estimatedPrice: 0,
        source: '',
        priority: 'medium',
        notes: '',
        isAutoFetch: false
      });
      setErrors({});
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-400 bg-gray-400/20' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-400/20' },
    { value: 'high', label: 'High', color: 'text-red-400 bg-red-400/20' }
  ];

  const sourceOptions = [
    'Amazon',
    'Alibaba',
    'Best Buy',
    'eBay',
    'Local Shop',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass rounded-2xl p-8 animate-slide-in glow-blue">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-[Orbitron] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            Add New Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto Fetch Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
            <div>
              <h3 className="font-semibold text-white">Auto-fetch product info</h3>
              <p className="text-sm text-gray-400">Automatically fill price and source from marketplaces</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${formData.isAutoFetch ? 'text-gray-400' : 'text-white'}`}>Manual</span>
              <button
                type="button"
                onClick={() => handleInputChange('isAutoFetch', !formData.isAutoFetch)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isAutoFetch ? 'bg-[var(--neon-blue)]' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData.isAutoFetch ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${formData.isAutoFetch ? 'text-white' : 'text-gray-400'}`}>Auto</span>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Name *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name..."
                className={`flex-1 px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-700/50 focus:border-[var(--neon-blue)]'
                }`}
              />
              {formData.isAutoFetch && (
                <button
                  type="button"
                  onClick={handleAutoFetch}
                  disabled={isAutoFetching || !formData.name.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--neon-green)]/25 transition-all duration-300"
                >
                  {isAutoFetching ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    'Fetch'
                  )}
                </button>
              )}
            </div>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Price and Source Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estimated Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.estimatedPrice || ''}
                  onChange={(e) => handleInputChange('estimatedPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200 ${
                    errors.estimatedPrice ? 'border-red-500' : 'border-gray-700/50 focus:border-[var(--neon-blue)]'
                  }`}
                />
              </div>
              {errors.estimatedPrice && <p className="text-red-400 text-sm mt-1">{errors.estimatedPrice}</p>}
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source *
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200 ${
                  errors.source ? 'border-red-500' : 'border-gray-700/50 focus:border-[var(--neon-blue)]'
                }`}
              >
                <option value="">Select source...</option>
                {sourceOptions.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              {errors.source && <p className="text-red-400 text-sm mt-1">{errors.source}</p>}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="flex space-x-3">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('priority', option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    formData.priority === option.value
                      ? option.color + ' ring-2 ring-current'
                      : 'text-gray-400 bg-gray-800/30 hover:bg-gray-700/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes or requirements..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-[var(--neon-blue)]/25 transition-all duration-300"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import AddItemModal from './ui/AddItemModal';

interface PurchaseItem {
  id: string;
  name: string;
  estimatedPrice: number;
  actualPrice?: number;
  status: 'planned' | 'bought' | 'on-hold';
  source: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  dateAdded: string;
  datePurchased?: string;
}

interface StatusToggleProps {
  status: PurchaseItem['status'];
  onStatusChange: (newStatus: PurchaseItem['status']) => void;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ status, onStatusChange }) => {
  const statusConfig = {
    planned: { 
      color: 'text-blue-400 bg-blue-400/20 border-blue-400/30', 
      label: 'Planned',
      glow: 'hover:shadow-blue-400/25'
    },
    bought: { 
      color: 'text-green-400 bg-green-400/20 border-green-400/30', 
      label: 'Bought',
      glow: 'hover:shadow-green-400/25'
    },
    'on-hold': { 
      color: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30', 
      label: 'On Hold',
      glow: 'hover:shadow-yellow-400/25'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PurchaseItem['status'])}
        className={`
          px-3 py-1 rounded-full text-sm font-medium border cursor-pointer
          bg-transparent appearance-none pr-8 transition-all duration-200
          ${config.color} ${config.glow} hover:shadow-lg
        `}
      >
        <option value="planned" className="bg-gray-800 text-blue-400">Planned</option>
        <option value="bought" className="bg-gray-800 text-green-400">Bought</option>
        <option value="on-hold" className="bg-gray-800 text-yellow-400">On Hold</option>
      </select>
      <svg 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

interface PriorityBadgeProps {
  priority: PurchaseItem['priority'];
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityConfig = {
    low: { color: 'text-gray-400 bg-gray-400/20', label: 'Low' },
    medium: { color: 'text-yellow-400 bg-yellow-400/20', label: 'Medium' },
    high: { color: 'text-red-400 bg-red-400/20', label: 'High' }
  };

  const config = priorityConfig[priority];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function ItemListView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: '1',
      name: 'Gaming Headset',
      estimatedPrice: 1687.99,
      status: 'planned',
      source: 'AliExpress',
      priority: 'high',
      notes: 'Noise cancelling required',
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mechanical Keyboard',
      estimatedPrice: 3007.99,
      actualPrice: 2819.99,
      status: 'bought',
      source: 'AliExpress',
      priority: 'medium',
      dateAdded: '2024-01-10',
      datePurchased: '2024-01-12'
    },
    {
      id: '3',
      name: 'Monitor Stand',
      estimatedPrice: 846.00,
      status: 'on-hold',
      source: 'AliExpress',
      priority: 'low',
      notes: 'Wait for sale',
      dateAdded: '2024-01-08'
    },
    {
      id: '4',
      name: 'Webcam 4K',
      estimatedPrice: 2256.00,
      status: 'planned',
      source: 'AliExpress',
      priority: 'medium',
      dateAdded: '2024-01-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | PurchaseItem['status']>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'priority' | 'date'>('date');

  const handleStatusChange = (itemId: string, newStatus: PurchaseItem['status']) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus,
              datePurchased: newStatus === 'bought' ? new Date().toISOString().split('T')[0] : undefined
            }
          : item
      )
    );
  };

  const handleAddItem = (itemData: any) => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      name: itemData.name,
      estimatedPrice: itemData.estimatedPrice,
      status: 'planned',
      source: itemData.source,
      priority: itemData.priority,
      notes: itemData.notes,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setItems(prevItems => [newItem, ...prevItems]);
  };

  const handleEditItem = (itemId: string) => {
    // For now, just log - in a real app, you'd open an edit modal
    console.log('Editing item:', itemId);
    // TODO: Implement edit functionality
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.source.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.estimatedPrice - b.estimatedPrice;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'date':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[Orbitron] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            My Items
          </h1>
          <p className="text-gray-400 mt-2">Manage your purchase list and track progress</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-[var(--neon-green)]/25 transition-all duration-300"
        >
          Add New Item
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-2">
            <input
              type="text"
              placeholder="Search items or sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)] transition-all duration-200"
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)] transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="planned">Planned</option>
            <option value="bought">Bought</option>
            <option value="on-hold">On Hold</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)] transition-all duration-200"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Items Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
        {filteredAndSortedItems.map((item, index) => {
          // Create dynamic grid spans for bento layout
          const isLarge = index % 7 === 0; // Every 7th item is large
          const isTall = index % 5 === 0 && index % 7 !== 0; // Every 5th item (but not 7th) is tall
          const isWide = index % 3 === 0 && index % 5 !== 0 && index % 7 !== 0; // Every 3rd item (but not 5th or 7th) is wide
          
          return (
            <div 
              key={item.id} 
              className={`glass rounded-xl p-6 hover:glow-blue transition-all duration-300 animate-slide-in ${
                isLarge ? 'md:col-span-2 md:row-span-2' : 
                isTall ? 'md:row-span-2' :
                isWide ? 'md:col-span-2' : ''
              }`}
            >
              {/* Item Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-white mb-1 truncate ${isLarge ? 'text-xl' : 'text-lg'}`}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{item.source}</p>
                </div>
                <PriorityBadge priority={item.priority} />
              </div>

              {/* Large card content */}
              {isLarge && (
                <div className="mb-4">
                  <div className="w-full h-32 bg-gray-800/30 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Price Information */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Estimated</span>
                  <span className={`font-semibold text-[var(--neon-blue)] ${isLarge ? 'text-xl' : 'text-lg'}`}>
                    N${item.estimatedPrice.toFixed(2)}
                  </span>
                </div>
                {item.actualPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Actual</span>
                    <span className={`font-semibold text-[var(--neon-green)] ${isLarge ? 'text-xl' : 'text-lg'}`}>
                      N${item.actualPrice.toFixed(2)}
                    </span>
                  </div>
                )}
                {item.actualPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Saved</span>
                    <span className={`font-medium ${item.estimatedPrice > item.actualPrice ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(item.estimatedPrice - item.actualPrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="mb-4">
                <StatusToggle 
                  status={item.status} 
                  onStatusChange={(newStatus) => handleStatusChange(item.id, newStatus)} 
                />
              </div>

              {/* Notes - Show on large cards or if short */}
              {item.notes && (isLarge || item.notes.length < 50) && (
                <div className="mb-4">
                  <p className={`text-gray-300 bg-gray-800/30 p-3 rounded-lg ${isLarge ? 'text-sm' : 'text-xs'}`}>
                    {isLarge ? item.notes : item.notes.substring(0, 50) + (item.notes.length > 50 ? '...' : '')}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                <span className="text-xs text-gray-500">
                  {new Date(item.dateAdded).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditItem(item.id)}
                    className="p-2 text-gray-400 hover:text-[var(--neon-blue)] transition-colors"
                    title="Edit item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or add your first item to get started.</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-[var(--neon-blue)]/25 transition-all duration-300"
          >
            Add Your First Item
          </button>
        </div>
      )}
      
      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}

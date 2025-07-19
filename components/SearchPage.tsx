'use client';

import React, { useState } from 'react';
import { searchAliExpress, Product, isAliExpressApiAvailable } from '../lib/api/marketplace';

// Use the Product interface from marketplace API
type SearchResult = Product;

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products across marketplaces..."
          className="w-full px-6 py-4 pl-12 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-2 focus:ring-[var(--neon-blue)]/20 transition-all duration-200 text-lg"
        />
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--neon-blue)]/25 transition-all duration-300"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </div>
      
      {/* AI Badge */}
      <div className="absolute -top-2 right-4 px-2 py-1 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] rounded-full text-xs font-bold text-white">
        AI POWERED
      </div>
    </form>
  );
};

interface ProductCardProps {
  product: SearchResult;
  onAddToList: (product: SearchResult) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToList }) => {
  return (
    <div className="glass rounded-xl p-6 hover:glow-blue transition-all duration-300 animate-slide-in">
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-800/30 rounded-lg mb-4 flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-400">{product.source.charAt(0).toUpperCase() + product.source.slice(1)}</p>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[var(--neon-green)]">
            N${product.price.toFixed(2)}
          </span>
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-sm">
          <span className={`px-2 py-1 rounded-full ${product.inStock ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span className="text-gray-400">{product.shipping}</span>
        </div>

        {/* Add to List Button */}
        <button
          onClick={() => onAddToList(product)}
          disabled={!product.inStock}
          className="w-full px-4 py-3 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--neon-blue)]/25 transition-all duration-300"
        >
          Add to My List
        </button>
      </div>
    </div>
  );
};

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // AliExpress-only search implementation
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Get AliExpress results using the API
      console.log('Fetching from AliExpress API...');
      const aliexpressResults = await searchAliExpress(query, 12);
      setSearchResults(aliexpressResults);

    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock data
      const fallbackResults = await searchAliExpress(query, 12);
      setSearchResults(fallbackResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = (product: SearchResult) => {
    // Here you would add the product to the user's purchase list
    console.log('Adding to list:', product);
    // Show success notification
    alert(`Added "${product.name}" to your purchase list!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-[Orbitron] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
          AliExpress Product Search
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Search thousands of products on AliExpress with prices converted to Namibian Dollars (NAD). Find the best deals and add items to your purchase list.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Marketplace Badges */}
      <div className="flex justify-center space-x-6">
        {['Amazon', 'Alibaba', 'Best Buy', 'Local Shops'].map((marketplace) => (
          <div key={marketplace} className="flex items-center space-x-2 px-4 py-2 glass rounded-lg">
            <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">{marketplace}</span>
          </div>
        ))}
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg text-gray-400">Searching across marketplaces...</p>
            <p className="text-sm text-gray-500">This may take a few seconds</p>
          </div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Search Results ({searchResults.length})
            </h2>
            <div className="flex space-x-2">
              <select className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white">
                <option>Sort by Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
          <p className="text-gray-500">Try a different search term or check your spelling.</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Start Your Search</h3>
          <p className="text-gray-500">Enter a product name or description to find the best deals across multiple marketplaces.</p>
        </div>
      )}
    </div>
  );
}

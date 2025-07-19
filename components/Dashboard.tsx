'use client';

import React, { useState } from 'react';
import AddItemModal from './ui/AddItemModal';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  glowColor: 'blue' | 'purple' | 'green' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  glowColor,
  trend 
}) => {
  const glowClass = `glow-${glowColor}`;
  
  return (
    <div className={`glass rounded-xl p-6 ${glowClass} hover:scale-105 transition-transform duration-300 animate-slide-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${
          glowColor === 'blue' ? 'from-[var(--neon-blue)]/20 to-[var(--neon-blue)]/10' :
          glowColor === 'purple' ? 'from-[var(--neon-purple)]/20 to-[var(--neon-purple)]/10' :
          glowColor === 'green' ? 'from-[var(--neon-green)]/20 to-[var(--neon-green)]/10' :
          'from-[var(--neon-orange)]/20 to-[var(--neon-orange)]/10'
        }`}>
          <div className={`${
            glowColor === 'blue' ? 'text-[var(--neon-blue)]' :
            glowColor === 'purple' ? 'text-[var(--neon-purple)]' :
            glowColor === 'green' ? 'text-[var(--neon-green)]' :
            'text-[var(--neon-orange)]'
          }`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={trend.isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
              />
            </svg>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold font-[Orbitron] text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  value: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size, 
  strokeWidth, 
  color, 
  label, 
  value 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2d2d44"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${color}40)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-[Orbitron] text-white">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data - replace with real data later (prices in NAD)
  const metrics = {
    totalEstimated: 286725, // ~N$15,250 converted to NAD
    totalSpent: 158484, // ~N$8,430 converted to NAD
    remainingItems: 12,
    completedItems: 8
  };

  const completionPercentage = (metrics.completedItems / (metrics.completedItems + metrics.remainingItems)) * 100;
  const spentPercentage = (metrics.totalSpent / metrics.totalEstimated) * 100;

  const handleAddItem = (itemData: any) => {
    console.log('Adding new item:', itemData);
    // Here you would typically add the item to your state or send to API
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[Orbitron] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] bg-clip-text text-transparent">
            Purchase Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Track your spending and manage your purchase list</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-[var(--neon-blue)]/25 transition-all duration-300"
        >
          Add New Item
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Estimated Cost"
          value={`N$${metrics.totalEstimated.toLocaleString()}`}
          subtitle="Across all items"
          glowColor="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          title="Total Spent"
          value={`N$${metrics.totalSpent.toLocaleString()}`}
          subtitle={`${spentPercentage.toFixed(1)}% of budget`}
          glowColor="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          trend={{ value: 8, isPositive: false }}
        />
        
        <MetricCard
          title="Remaining Items"
          value={metrics.remainingItems}
          subtitle="To be purchased"
          glowColor="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        
        <MetricCard
          title="Completed Items"
          value={metrics.completedItems}
          subtitle="Successfully purchased"
          glowColor="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      {/* Progress Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Progress */}
        <div className="glass rounded-xl p-6 glow-blue">
          <h3 className="text-lg font-bold font-[Orbitron] text-white mb-4 text-center">
            Purchase Progress
          </h3>
          <div className="flex justify-center">
            <ProgressRing
              progress={completionPercentage}
              size={160}
              strokeWidth={10}
              color="var(--neon-blue)"
              label="Items Completed"
              value={`${metrics.completedItems}/${metrics.completedItems + metrics.remainingItems}`}
            />
          </div>
        </div>

        {/* Budget Progress */}
        <div className="glass rounded-xl p-6 glow-purple">
          <h3 className="text-lg font-bold font-[Orbitron] text-white mb-4 text-center">
            Budget Utilization
          </h3>
          <div className="flex justify-center">
            <ProgressRing
              progress={spentPercentage}
              size={160}
              strokeWidth={10}
              color="var(--neon-purple)"
              label="Budget Used"
              value={`N$${metrics.totalSpent.toLocaleString()}`}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass rounded-xl p-6 glow-green">
          <h3 className="text-lg font-bold font-[Orbitron] text-white mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {[
              { name: 'Electronics', amount: 64860, percentage: 41, color: 'var(--neon-blue)' },
              { name: 'Home & Garden', amount: 39480, percentage: 25, color: 'var(--neon-purple)' },
              { name: 'Fashion', amount: 31584, percentage: 20, color: 'var(--neon-green)' },
              { name: 'Sports', amount: 22560, percentage: 14, color: 'var(--neon-orange)' }
            ].map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{category.name}</span>
                  <span className="text-white font-semibold">N${category.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${category.percentage}%`,
                      background: category.color,
                      boxShadow: `0 0 10px ${category.color}40`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-xl p-6 glow-green">
        <h3 className="text-xl font-bold font-[Orbitron] text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Added', item: 'Gaming Headset', price: 'N$1,687.99', time: '2 hours ago' },
            { action: 'Purchased', item: 'Mechanical Keyboard', price: 'N$3,007.99', time: '5 hours ago' },
            { action: 'Updated', item: 'Monitor Stand', price: 'N$846.00', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.action === 'Added' ? 'bg-blue-400' :
                  activity.action === 'Purchased' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-white font-medium">{activity.action}</span>
                <span className="text-gray-300">{activity.item}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[var(--neon-green)] font-semibold">{activity.price}</span>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}

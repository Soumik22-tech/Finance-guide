"use client";
import React, { useState } from 'react';
import { FormData, BudgetResult } from '../types/budget';
import { calculateBudget } from '../lib/budgetCalculator';

interface BudgetFormProps {
  onResult: (result: BudgetResult) => void;
}

export default function BudgetForm({ onResult }: BudgetFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    city: '',
    salary: 0,
    status: 'single',
    members: 1,
    children: 'no',
    kids: 0,
    house: 'rent',
    emi: 'no',
    vehicle: 'public',
    insurance: 'no'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.salary <= 0 || !formData.name) return;
    
    const breakdown = calculateBudget(formData);
    onResult({
      name: formData.name,
      city: formData.city,
      salary: formData.salary,
      breakdown
    });
  };

  const inputClasses = "w-full bg-[#e8f0fe] rounded-xl px-4 py-3 border border-gray-200 outline-none focus:ring-2 focus:ring-[#64ffda] transition-all text-[#1d3557]";
  const labelClasses = "block text-[#1d3557] font-semibold mb-2 text-sm";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-[#1d3557] mb-2">Calculate Your Personalised Monthly Budget</h2>
        <p className="text-[#4a5568] text-sm leading-relaxed">
          Used by thousands of Indians to take control of their salary. Works for all cities — Mumbai, Delhi, Kolkata, Bangalore, Chennai, Hyderabad, Pune, and beyond.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={inputClasses}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className={labelClasses}>City</label>
            <input 
              type="text" 
              required
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className={inputClasses}
              placeholder="e.g. Mumbai"
            />
          </div>
          <div>
            <label className={labelClasses}>Monthly Salary (₹)</label>
            <input 
              type="number" 
              min="0"
              required
              value={formData.salary || ''}
              onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
              className={inputClasses}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label className={labelClasses}>Marital Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'single' | 'married'})}
              className={inputClasses}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Family Members</label>
            <input 
              type="number" 
              min="1"
              required
              value={formData.members || ''}
              onChange={(e) => setFormData({...formData, members: Number(e.target.value)})}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Do you have children?</label>
            <select 
              value={formData.children}
              onChange={(e) => setFormData({...formData, children: e.target.value as 'yes' | 'no', kids: e.target.value === 'no' ? 0 : formData.kids})}
              className={inputClasses}
            >
              <option value="no">No Children</option>
              <option value="yes">Have Children</option>
            </select>
          </div>

          {formData.children === 'yes' && (
            <div>
              <label className={labelClasses}>Number of Kids</label>
              <input 
                type="number" 
                min="1"
                required
                value={formData.kids || ''}
                onChange={(e) => setFormData({...formData, kids: Number(e.target.value)})}
                className={inputClasses}
              />
            </div>
          )}

          <div>
            <label className={labelClasses}>Housing Status</label>
            <select 
              value={formData.house}
              onChange={(e) => setFormData({...formData, house: e.target.value as 'rent' | 'own', emi: e.target.value === 'rent' ? 'no' : formData.emi})}
              className={inputClasses}
            >
              <option value="rent">Rented</option>
              <option value="own">Own House</option>
            </select>
          </div>

          {formData.house === 'own' && (
            <div>
              <label className={labelClasses}>Active Housing EMI?</label>
              <select 
                value={formData.emi}
                onChange={(e) => setFormData({...formData, emi: e.target.value as 'yes' | 'no'})}
                className={inputClasses}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          )}

          <div>
            <label className={labelClasses}>Transportation</label>
            <select 
              value={formData.vehicle}
              onChange={(e) => setFormData({...formData, vehicle: e.target.value as 'public' | 'car'})}
              className={inputClasses}
            >
              <option value="public">Public Transport</option>
              <option value="car">Own Car</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Do you have Insurance?</label>
            <select 
              value={formData.insurance}
              onChange={(e) => setFormData({...formData, insurance: e.target.value as 'yes' | 'no'})}
              className={inputClasses}
            >
              <option value="no">No Insurance</option>
              <option value="yes">Have Insurance</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-[#64ffda] text-[#0a192f] font-bold text-lg py-4 rounded-xl hover:bg-[#4dd3b3] transition duration-300 shadow-md transform hover:-translate-y-1"
          >
            Calculate Budget
          </button>
        </div>
      </form>
    </div>
  );
}

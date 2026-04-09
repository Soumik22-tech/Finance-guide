"use client";
import React, { useState, useEffect, useRef } from 'react';
import { type EMIEntry, type LoanType } from "@/app/types/budget";
import { FormData, BudgetResult } from '../types/budget';
import { calculateBudget } from '../lib/budgetCalculator';

const INDIAN_CITIES = [
  { label: "Mumbai, Maharashtra", value: "Mumbai" },
  { label: "Delhi NCR", value: "Delhi" },
  { label: "Bangalore, Karnataka", value: "Bangalore" },
  { label: "Chennai, Tamil Nadu", value: "Chennai" },
  { label: "Hyderabad, Telangana", value: "Hyderabad" },
  { label: "Pune, Maharashtra", value: "Pune" },
  { label: "Kolkata, West Bengal", value: "Kolkata" },
  { label: "Ahmedabad, Gujarat", value: "Ahmedabad" },
  { label: "Jaipur, Rajasthan", value: "Jaipur" },
  { label: "Lucknow, Uttar Pradesh", value: "Lucknow" },
  { label: "Patna, Bihar", value: "Patna" },
  { label: "Bhopal, Madhya Pradesh", value: "Bhopal" },
  { label: "Surat, Gujarat", value: "Surat" },
  { label: "Nagpur, Maharashtra", value: "Nagpur" },
  { label: "Kochi, Kerala", value: "Kochi" },
  { label: "Indore, Madhya Pradesh", value: "Indore" },
  { label: "Other city", value: "other" },
];

const LOAN_TYPES: { value: LoanType, label: string, icon: string }[] = [
  { value: "housing", label: "Housing Loan", icon: "🏠" },
  { value: "car", label: "Car Loan", icon: "🚗" },
  { value: "personal", label: "Personal Loan", icon: "💳" },
  { value: "education", label: "Education Loan", icon: "🎓" },
  { value: "creditcard", label: "Credit Card EMI", icon: "💰" },
  { value: "other", label: "Other Loan", icon: "📋" },
];

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

  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [cityError, setCityError] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const [emis, setEmis] = useState<EMIEntry[]>([]);
  const [expandedLoanIds, setExpandedLoanIds] = useState<Set<string>>(new Set());

  const addEMIRow = () => {
    if (emis.length >= 5) return;
    const newEMI: EMIEntry = {
      id: Date.now().toString(),
      type: "personal",
      typeLabel: "Personal Loan",
      monthlyEMI: 0,
      hasLoanDetails: false,
    };
    setEmis([...emis, newEMI]);
  };

  const updateEMI = (id: string, updates: Partial<EMIEntry>) => {
    setEmis(emis.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeEMI = (id: string) => {
    setEmis(emis.filter(e => e.id !== id));
    setExpandedLoanIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  const toggleLoanDetails = (id: string) => {
    setExpandedLoanIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); updateEMI(id, { hasLoanDetails: false }); }
      else { next.add(id); updateEMI(id, { hasLoanDetails: true }); }
      return next;
    });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.emi === 'yes' && emis.length === 0) {
      addEMIRow();
    }
  }, [formData.emi]);

  useEffect(() => {
    let updated = false;
    const newEmis = emis.map(emi => {
      if (emi.hasLoanDetails && emi.loanDetails && (!emi.monthlyEMI || emi.autoCalculated)) {
        const details = emi.loanDetails;
        const principal = details.originalAmount
        const annualRate = details.interestRate
        const tenureMonths = details.tenureMonths

        if (principal > 0 && annualRate > 0 && tenureMonths > 0) {
          const monthlyRate = annualRate / 12 / 100
          const calculatedEMI = Math.round(
            (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
          )
          if (calculatedEMI > 0 && calculatedEMI < principal) {
            if (emi.monthlyEMI !== calculatedEMI) {
              updated = true;
              return { ...emi, monthlyEMI: calculatedEMI, autoCalculated: true } as any;
            }
          }
        } else if (principal > 0 && annualRate === 0 && tenureMonths > 0) {
          const calculatedEMI = Math.round(principal / tenureMonths)
          if (emi.monthlyEMI !== calculatedEMI) {
            updated = true;
            return { ...emi, monthlyEMI: calculatedEMI, autoCalculated: true } as any;
          }
        }
      }
      return emi;
    });

    if (updated) {
      setEmis(newEmis);
    }
  }, [emis]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const city = selectedCity === "other" ? otherCity : selectedCity;

    if (!city || city.trim() === "") {
      setCityError(true);
      return;
    }
    setCityError(false);

    if (formData.salary <= 0 || !formData.name) return;
    
    // Ensure EMIs are calculated if still 0 but loan details exist
    const finalEmis = emis.map(emi => {
      if (emi.hasLoanDetails && emi.loanDetails && (!emi.monthlyEMI || emi.autoCalculated)) {
        const details = emi.loanDetails;
        const principal = details.originalAmount
        const annualRate = details.interestRate
        const tenureMonths = details.tenureMonths

        if (principal > 0 && annualRate > 0 && tenureMonths > 0) {
          const monthlyRate = annualRate / 12 / 100
          const calculatedEMI = Math.round(
            (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
          )
          if (calculatedEMI > 0 && calculatedEMI < principal) {
            return { ...emi, monthlyEMI: calculatedEMI, autoCalculated: true } as any;
          }
        } else if (principal > 0 && annualRate === 0 && tenureMonths > 0) {
          const calculatedEMI = Math.round(principal / tenureMonths)
          return { ...emi, monthlyEMI: calculatedEMI, autoCalculated: true } as any;
        }
      }
      return emi;
    });

    const activeEmis = finalEmis.filter(e => e.monthlyEMI > 0);
    const totalMonthlyEMI = activeEmis.reduce((sum, e) => sum + e.monthlyEMI, 0);
    const debtToIncomeRatio = formData.salary > 0 ? Math.round((totalMonthlyEMI / formData.salary) * 100) : 0;
    
    const liabilityProfile = {
      hasEMI: formData.emi === "yes" && activeEmis.length > 0,
      emis: activeEmis,
      totalMonthlyEMI,
      debtToIncomeRatio,
    };

    const submittedData = { ...formData, city };
    const breakdown = calculateBudget(submittedData);
    onResult({
      name: formData.name,
      city: city,
      salary: formData.salary,
      breakdown,
      liabilityProfile,
      members: formData.members,
      children: formData.children,
      kids: formData.kids,
      house: formData.house,
      maritalStatus: formData.status
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
            <div className="relative" ref={cityRef}>
              <div
                onClick={() => { setCityDropdownOpen(!cityDropdownOpen); setCityError(false); }}
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl border bg-[#e8f0fe] cursor-pointer hover:border-[#64ffda] transition-colors ${cityError ? "border-red-400" : "border-gray-200"}`}
              >
                <span className={selectedCity ? "text-[#1d3557]" : "text-gray-400"}>
                  {selectedCity
                    ? selectedCity === "other"
                      ? "Other city"
                      : INDIAN_CITIES.find((c) => c.value === selectedCity)?.label
                    : "Select your city"}
                </span>
                <span className={`text-[#8892b0] text-xs transition-transform duration-200 ${cityDropdownOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </div>

              {cityError && (
                <p className="text-xs text-red-500 mt-1 pl-1">Please select your city.</p>
              )}

              {cityDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#dfe6f3] rounded-xl shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-[#dfe6f3]">
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#dfe6f3] bg-[#f8f9fc] text-[#1d3557] focus:outline-none focus:border-[#64ffda]"
                    />
                  </div>
                  <ul className="max-h-52 overflow-y-auto">
                    {INDIAN_CITIES.filter((c) =>
                      c.label.toLowerCase().includes(citySearch.toLowerCase())
                    ).map((city) => (
                      <li
                        key={city.value}
                        onClick={() => {
                          setSelectedCity(city.value);
                          setCityDropdownOpen(false);
                          setCitySearch("");
                        }}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#f1f6ff] transition-colors ${
                          selectedCity === city.value
                            ? "bg-[#E1F5EE] text-[#0F6E56] font-semibold"
                            : "text-[#1d3557]"
                        } ${city.value === "other" ? "border-t border-[#dfe6f3] text-[#8892b0] italic" : ""}`}
                      >
                        {city.label}
                      </li>
                    ))}
                    {INDIAN_CITIES.filter((c) =>
                      c.label.toLowerCase().includes(citySearch.toLowerCase())
                    ).length === 0 && (
                      <li className="px-4 py-3 text-sm text-[#8892b0] text-center">No city found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {selectedCity === "other" && (
              <input
                type="text"
                placeholder="Enter your city name"
                value={otherCity}
                onChange={(e) => setOtherCity(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-[#e8f0fe] text-[#1d3557] placeholder-gray-400 focus:outline-none focus:border-[#64ffda] transition-colors mt-2"
              />
            )}
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
              onChange={(e) => setFormData({...formData, house: e.target.value as 'rent' | 'own'})}
              className={inputClasses}
            >
              <option value="rent">Rented</option>
              <option value="own">Own House</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Have any EMI?</label>
            <select 
              value={formData.emi}
              onChange={(e) => setFormData({...formData, emi: e.target.value as 'yes' | 'no'})}
              className={inputClasses}
            >
              <option value="no">No EMI</option>
              <option value="yes">Yes, I have EMI</option>
            </select>
          </div>
        </div>

        {formData.emi === 'yes' && (
          <div className="bg-[#f8f9fc] border-l-4 border-[#0a192f] rounded-r-xl p-6 mt-6 space-y-4">
            <div>
              <h3 className="font-bold text-[#1d3557] text-lg">Your Active Loans</h3>
              <p className="text-sm text-gray-500">Add each loan you are currently repaying</p>
            </div>
            
            <div className="space-y-4">
              {emis.map((emi) => (
                <div key={emi.id} className="bg-white border border-[#dfe6f3] rounded-xl p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <select
                      value={emi.type}
                      onChange={(e) => {
                        const val = e.target.value as LoanType;
                        const label = LOAN_TYPES.find(t => t.value === val)?.label || val;
                        updateEMI(emi.id, { type: val, typeLabel: label });
                      }}
                      className={`${inputClasses} md:w-1/3 !py-2`}
                    >
                      {LOAN_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                      ))}
                    </select>

                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Monthly EMI (₹)"
                        value={emi.monthlyEMI || ''}
                        onChange={(e) => updateEMI(emi.id, { monthlyEMI: Number(e.target.value), autoCalculated: false })}
                        className={`${inputClasses} w-full !py-2`}
                      />
                      {emi.autoCalculated && (
                        <p className="text-[#1D9E75] text-xs font-semibold mt-1 pl-1">
                          Auto-calculated from loan details
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEMI(emi.id)}
                      className="text-red-500 hover:text-red-700 p-2 text-xl"
                      title="Remove loan"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleLoanDetails(emi.id)}
                      className="text-teal-600 text-sm font-semibold hover:text-teal-700"
                    >
                      Add loan details for deeper analysis {expandedLoanIds.has(emi.id) ? "▲" : "▼"}
                    </button>
                  </div>

                  {expandedLoanIds.has(emi.id) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <input
                        type="number"
                        placeholder="Original loan amount ₹"
                        value={emi.loanDetails?.originalAmount || ''}
                        onChange={(e) => updateEMI(emi.id, {
                          loanDetails: { ...emi.loanDetails, originalAmount: Number(e.target.value), interestRate: emi.loanDetails?.interestRate || 0, tenureMonths: emi.loanDetails?.tenureMonths || 0, startMonth: emi.loanDetails?.startMonth || 1, startYear: emi.loanDetails?.startYear || new Date().getFullYear() }
                        })}
                        className={`${inputClasses} !py-2`}
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Interest rate % p.a."
                        value={emi.loanDetails?.interestRate || ''}
                        onChange={(e) => updateEMI(emi.id, {
                          loanDetails: { ...emi.loanDetails, originalAmount: emi.loanDetails?.originalAmount || 0, interestRate: Number(e.target.value), tenureMonths: emi.loanDetails?.tenureMonths || 0, startMonth: emi.loanDetails?.startMonth || 1, startYear: emi.loanDetails?.startYear || new Date().getFullYear() }
                        })}
                        className={`${inputClasses} !py-2`}
                      />
                      <input
                        type="number"
                        placeholder="Total tenure in months"
                        value={emi.loanDetails?.tenureMonths || ''}
                        onChange={(e) => updateEMI(emi.id, {
                          loanDetails: { ...emi.loanDetails, originalAmount: emi.loanDetails?.originalAmount || 0, interestRate: emi.loanDetails?.interestRate || 0, tenureMonths: Number(e.target.value), startMonth: emi.loanDetails?.startMonth || 1, startYear: emi.loanDetails?.startYear || new Date().getFullYear() }
                        })}
                        className={`${inputClasses} !py-2`}
                      />
                      <div className="flex gap-2">
                        <select
                          value={emi.loanDetails?.startMonth || 1}
                          onChange={(e) => updateEMI(emi.id, {
                            loanDetails: { ...emi.loanDetails, originalAmount: emi.loanDetails?.originalAmount || 0, interestRate: emi.loanDetails?.interestRate || 0, tenureMonths: emi.loanDetails?.tenureMonths || 0, startMonth: Number(e.target.value), startYear: emi.loanDetails?.startYear || new Date().getFullYear() }
                          })}
                          className={`${inputClasses} !py-2 flex-1`}
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <select
                          value={emi.loanDetails?.startYear || new Date().getFullYear()}
                          onChange={(e) => updateEMI(emi.id, {
                            loanDetails: { ...emi.loanDetails, originalAmount: emi.loanDetails?.originalAmount || 0, interestRate: emi.loanDetails?.interestRate || 0, tenureMonths: emi.loanDetails?.tenureMonths || 0, startMonth: emi.loanDetails?.startMonth || 1, startYear: Number(e.target.value) }
                          })}
                          className={`${inputClasses} !py-2 flex-1`}
                        >
                          {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - 10 + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {emis.length < 5 && (
              <button
                type="button"
                onClick={addEMIRow}
                className="w-full py-3 border-2 border-dashed border-[#0a192f] text-[#0a192f] font-semibold rounded-xl hover:bg-[#e8f0fe] transition-colors mt-4"
              >
                + Add another loan
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

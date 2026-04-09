export type SalaryBand = "below_30k" | "30k_60k" | "60k_1L" | "above_1L";

export interface CityCosts {
  city: string;
  state: string;
  tier: 1 | 2 | 3; // 1 = metro, 2 = large city, 3 = small city
  salaryBands: Record<
    SalaryBand,
    {
      rent: { min: number; max: number; avg: number };
      food: { min: number; max: number; avg: number };
      transport: { min: number; max: number; avg: number };
      utilities: { min: number; max: number; avg: number };
      savingsRate: number; // recommended % of income
    }
  >;
  cheaperAreas: string[]; // 3 affordable neighbourhoods/areas
  expensiveAreas: string[]; // 3 expensive neighbourhoods/areas
  costIndex: number; // relative to India avg of 100
  notes: string; // one sentence city-specific insight
}

export const CITY_DATA: Record<string, CityCosts> = {
  mumbai: {
    city: "Mumbai",
    state: "Maharashtra",
    tier: 1,
    costIndex: 165,
    notes: "Mumbai has India's highest rent-to-income ratio. Western suburbs offer better value than South Mumbai.",
    cheaperAreas: ["Virar", "Nalasopara", "Vasai"],
    expensiveAreas: ["Bandra", "Worli", "Colaba"],
    salaryBands: {
      below_30k: {
        rent: { min: 6000, max: 12000, avg: 8500 },
        food: { min: 5000, max: 8000, avg: 6500 },
        transport: { min: 1500, max: 3000, avg: 2000 },
        utilities: { min: 1500, max: 2500, avg: 1800 },
        savingsRate: 8,
      },
      "30k_60k": {
        rent: { min: 10000, max: 22000, avg: 15000 },
        food: { min: 7000, max: 12000, avg: 9000 },
        transport: { min: 2000, max: 5000, avg: 3000 },
        utilities: { min: 2000, max: 3500, avg: 2500 },
        savingsRate: 12,
      },
      "60k_1L": {
        rent: { min: 20000, max: 40000, avg: 28000 },
        food: { min: 10000, max: 18000, avg: 13000 },
        transport: { min: 3000, max: 8000, avg: 5000 },
        utilities: { min: 2500, max: 4500, avg: 3200 },
        savingsRate: 18,
      },
      above_1L: {
        rent: { min: 35000, max: 80000, avg: 50000 },
        food: { min: 15000, max: 30000, avg: 20000 },
        transport: { min: 5000, max: 15000, avg: 8000 },
        utilities: { min: 3500, max: 7000, avg: 5000 },
        savingsRate: 25,
      },
    },
  },

  delhi: {
    city: "Delhi",
    state: "Delhi NCR",
    tier: 1,
    costIndex: 145,
    notes: "Delhi NCR has wide cost variance. Noida and Gurgaon are expensive; East and North Delhi offer much better value.",
    cheaperAreas: ["Dwarka", "Rohini", "Uttam Nagar"],
    expensiveAreas: ["South Delhi", "Gurgaon Cyber City", "Noida Sector 18"],
    salaryBands: {
      below_30k: {
        rent: { min: 5000, max: 10000, avg: 7000 },
        food: { min: 4500, max: 7500, avg: 5800 },
        transport: { min: 1200, max: 2500, avg: 1800 },
        utilities: { min: 1200, max: 2200, avg: 1600 },
        savingsRate: 10,
      },
      "30k_60k": {
        rent: { min: 9000, max: 20000, avg: 13000 },
        food: { min: 6500, max: 11000, avg: 8200 },
        transport: { min: 2000, max: 4500, avg: 2800 },
        utilities: { min: 1800, max: 3200, avg: 2300 },
        savingsRate: 15,
      },
      "60k_1L": {
        rent: { min: 18000, max: 35000, avg: 25000 },
        food: { min: 9000, max: 16000, avg: 12000 },
        transport: { min: 3000, max: 7000, avg: 4500 },
        utilities: { min: 2500, max: 4200, avg: 3000 },
        savingsRate: 20,
      },
      above_1L: {
        rent: { min: 30000, max: 70000, avg: 45000 },
        food: { min: 13000, max: 25000, avg: 18000 },
        transport: { min: 5000, max: 14000, avg: 8000 },
        utilities: { min: 3200, max: 6500, avg: 4500 },
        savingsRate: 28,
      },
    },
  },

  bangalore: {
    city: "Bangalore",
    state: "Karnataka",
    tier: 1,
    costIndex: 155,
    notes: "Bangalore rents have surged 40% since 2022. North Bangalore near airport offers newer housing at lower cost.",
    cheaperAreas: ["Yelahanka", "Hennur", "Tumkur Road"],
    expensiveAreas: ["Koramangala", "Indiranagar", "Whitefield"],
    salaryBands: {
      below_30k: {
        rent: { min: 6000, max: 11000, avg: 8000 },
        food: { min: 4800, max: 7800, avg: 6200 },
        transport: { min: 1500, max: 3000, avg: 2000 },
        utilities: { min: 1300, max: 2300, avg: 1700 },
        savingsRate: 9,
      },
      "30k_60k": {
        rent: { min: 10000, max: 22000, avg: 15500 },
        food: { min: 7000, max: 12000, avg: 9000 },
        transport: { min: 2000, max: 5000, avg: 3200 },
        utilities: { min: 1800, max: 3300, avg: 2400 },
        savingsRate: 14,
      },
      "60k_1L": {
        rent: { min: 20000, max: 40000, avg: 28000 },
        food: { min: 10000, max: 17000, avg: 13000 },
        transport: { min: 3000, max: 8000, avg: 5000 },
        utilities: { min: 2500, max: 4500, avg: 3200 },
        savingsRate: 20,
      },
      above_1L: {
        rent: { min: 35000, max: 75000, avg: 50000 },
        food: { min: 14000, max: 28000, avg: 19000 },
        transport: { min: 5000, max: 14000, avg: 8500 },
        utilities: { min: 3500, max: 7000, avg: 5000 },
        savingsRate: 27,
      },
    },
  },

  chennai: {
    city: "Chennai",
    state: "Tamil Nadu",
    tier: 1,
    costIndex: 130,
    notes: "Chennai is more affordable than other metros. South Chennai near OMR has good value for IT workers.",
    cheaperAreas: ["Ambattur", "Avadi", "Tambaram"],
    expensiveAreas: ["Adyar", "Nungambakkam", "OMR (Sholinganallur)"],
    salaryBands: {
      below_30k: {
        rent: { min: 5000, max: 9000, avg: 6500 },
        food: { min: 4200, max: 7000, avg: 5500 },
        transport: { min: 1200, max: 2500, avg: 1700 },
        utilities: { min: 1100, max: 2000, avg: 1500 },
        savingsRate: 12,
      },
      "30k_60k": {
        rent: { min: 8000, max: 18000, avg: 12000 },
        food: { min: 6000, max: 10500, avg: 8000 },
        transport: { min: 1800, max: 4200, avg: 2700 },
        utilities: { min: 1600, max: 3000, avg: 2200 },
        savingsRate: 17,
      },
      "60k_1L": {
        rent: { min: 15000, max: 30000, avg: 21000 },
        food: { min: 8500, max: 15000, avg: 11500 },
        transport: { min: 2800, max: 6500, avg: 4200 },
        utilities: { min: 2200, max: 4000, avg: 2900 },
        savingsRate: 22,
      },
      above_1L: {
        rent: { min: 25000, max: 60000, avg: 38000 },
        food: { min: 12000, max: 23000, avg: 16500 },
        transport: { min: 4500, max: 12000, avg: 7000 },
        utilities: { min: 3000, max: 6000, avg: 4200 },
        savingsRate: 28,
      },
    },
  },

  hyderabad: {
    city: "Hyderabad",
    state: "Telangana",
    tier: 1,
    costIndex: 135,
    notes: "Hyderabad offers the best quality-of-life to cost ratio among Indian metros. HITEC City is expensive but outskirts are affordable.",
    cheaperAreas: ["Kompally", "Shamshabad", "LB Nagar"],
    expensiveAreas: ["Banjara Hills", "Jubilee Hills", "HITEC City"],
    salaryBands: {
      below_30k: {
        rent: { min: 5000, max: 9500, avg: 7000 },
        food: { min: 4500, max: 7200, avg: 5700 },
        transport: { min: 1200, max: 2500, avg: 1700 },
        utilities: { min: 1100, max: 2100, avg: 1500 },
        savingsRate: 12,
      },
      "30k_60k": {
        rent: { min: 8500, max: 18000, avg: 12500 },
        food: { min: 6500, max: 11000, avg: 8500 },
        transport: { min: 1800, max: 4200, avg: 2800 },
        utilities: { min: 1700, max: 3000, avg: 2200 },
        savingsRate: 18,
      },
      "60k_1L": {
        rent: { min: 16000, max: 32000, avg: 22000 },
        food: { min: 9000, max: 16000, avg: 12000 },
        transport: { min: 2800, max: 6500, avg: 4200 },
        utilities: { min: 2300, max: 4200, avg: 3000 },
        savingsRate: 22,
      },
      above_1L: {
        rent: { min: 28000, max: 65000, avg: 42000 },
        food: { min: 13000, max: 24000, avg: 17500 },
        transport: { min: 4500, max: 13000, avg: 7500 },
        utilities: { min: 3200, max: 6500, avg: 4500 },
        savingsRate: 28,
      },
    },
  },

  pune: {
    city: "Pune",
    state: "Maharashtra",
    tier: 1,
    costIndex: 140,
    notes: "Pune rents have risen sharply in Hinjewadi and Kharadi IT corridors. PMC areas remain affordable.",
    cheaperAreas: ["Hadapsar", "Wagholi", "Bhosari"],
    expensiveAreas: ["Koregaon Park", "Hinjewadi Phase 1", "Baner"],
    salaryBands: {
      below_30k: {
        rent: { min: 5500, max: 10000, avg: 7200 },
        food: { min: 4500, max: 7500, avg: 5800 },
        transport: { min: 1300, max: 2700, avg: 1900 },
        utilities: { min: 1200, max: 2200, avg: 1600 },
        savingsRate: 11,
      },
      "30k_60k": {
        rent: { min: 9000, max: 19000, avg: 13500 },
        food: { min: 6500, max: 11500, avg: 8500 },
        transport: { min: 2000, max: 4500, avg: 3000 },
        utilities: { min: 1800, max: 3200, avg: 2400 },
        savingsRate: 16,
      },
      "60k_1L": {
        rent: { min: 17000, max: 34000, avg: 24000 },
        food: { min: 9500, max: 17000, avg: 12500 },
        transport: { min: 3000, max: 7000, avg: 4800 },
        utilities: { min: 2500, max: 4500, avg: 3200 },
        savingsRate: 21,
      },
      above_1L: {
        rent: { min: 28000, max: 65000, avg: 43000 },
        food: { min: 13000, max: 25000, avg: 18000 },
        transport: { min: 5000, max: 13000, avg: 8000 },
        utilities: { min: 3500, max: 6800, avg: 4800 },
        savingsRate: 27,
      },
    },
  },

  kolkata: {
    city: "Kolkata",
    state: "West Bengal",
    tier: 1,
    costIndex: 110,
    notes: "Kolkata is India's most affordable metro. Salt Lake and New Town are IT hubs with moderate rents.",
    cheaperAreas: ["Howrah", "Barasat", "Dum Dum"],
    expensiveAreas: ["Salt Lake Sector 5", "New Town", "Alipore"],
    salaryBands: {
      below_30k: {
        rent: { min: 3500, max: 7000, avg: 5000 },
        food: { min: 3800, max: 6500, avg: 5000 },
        transport: { min: 800, max: 1800, avg: 1200 },
        utilities: { min: 900, max: 1700, avg: 1200 },
        savingsRate: 14,
      },
      "30k_60k": {
        rent: { min: 6000, max: 14000, avg: 9500 },
        food: { min: 5500, max: 9500, avg: 7200 },
        transport: { min: 1500, max: 3500, avg: 2200 },
        utilities: { min: 1400, max: 2600, avg: 1900 },
        savingsRate: 20,
      },
      "60k_1L": {
        rent: { min: 12000, max: 25000, avg: 17000 },
        food: { min: 8000, max: 14000, avg: 10500 },
        transport: { min: 2500, max: 5500, avg: 3500 },
        utilities: { min: 2000, max: 3800, avg: 2700 },
        savingsRate: 25,
      },
      above_1L: {
        rent: { min: 22000, max: 50000, avg: 32000 },
        food: { min: 11000, max: 22000, avg: 15000 },
        transport: { min: 4000, max: 10000, avg: 6000 },
        utilities: { min: 2800, max: 5500, avg: 3800 },
        savingsRate: 30,
      },
    },
  },

  ahmedabad: {
    city: "Ahmedabad",
    state: "Gujarat",
    tier: 2,
    costIndex: 105,
    notes: "Ahmedabad is very affordable with good infrastructure. SG Highway corridor has seen rapid growth.",
    cheaperAreas: ["Vastral", "Naroda", "Odhav"],
    expensiveAreas: ["Prahlad Nagar", "Bodakdev", "Satellite"],
    salaryBands: {
      below_30k: {
        rent: { min: 3000, max: 6500, avg: 4500 },
        food: { min: 3500, max: 6000, avg: 4700 },
        transport: { min: 800, max: 1800, avg: 1200 },
        utilities: { min: 800, max: 1600, avg: 1100 },
        savingsRate: 15,
      },
      "30k_60k": {
        rent: { min: 5500, max: 13000, avg: 8500 },
        food: { min: 5000, max: 9000, avg: 6800 },
        transport: { min: 1400, max: 3200, avg: 2000 },
        utilities: { min: 1300, max: 2500, avg: 1800 },
        savingsRate: 20,
      },
      "60k_1L": {
        rent: { min: 11000, max: 22000, avg: 15500 },
        food: { min: 7500, max: 13500, avg: 10000 },
        transport: { min: 2200, max: 5000, avg: 3200 },
        utilities: { min: 1800, max: 3500, avg: 2500 },
        savingsRate: 26,
      },
      above_1L: {
        rent: { min: 18000, max: 42000, avg: 28000 },
        food: { min: 10000, max: 20000, avg: 14000 },
        transport: { min: 3500, max: 9000, avg: 5500 },
        utilities: { min: 2500, max: 5000, avg: 3500 },
        savingsRate: 30,
      },
    },
  },

  jaipur: {
    city: "Jaipur",
    state: "Rajasthan",
    tier: 2,
    costIndex: 95,
    notes: "Jaipur is affordable with rising IT sector. Malviya Nagar and C-scheme are premium; Mansarovar offers great value.",
    cheaperAreas: ["Mansarovar", "Sanganer", "Pratap Nagar"],
    expensiveAreas: ["C-Scheme", "Malviya Nagar", "Vaishali Nagar"],
    salaryBands: {
      below_30k: {
        rent: { min: 2800, max: 6000, avg: 4000 },
        food: { min: 3200, max: 5500, avg: 4300 },
        transport: { min: 700, max: 1600, avg: 1100 },
        utilities: { min: 700, max: 1500, avg: 1000 },
        savingsRate: 15,
      },
      "30k_60k": {
        rent: { min: 5000, max: 12000, avg: 8000 },
        food: { min: 4800, max: 8500, avg: 6500 },
        transport: { min: 1300, max: 3000, avg: 1900 },
        utilities: { min: 1200, max: 2300, avg: 1700 },
        savingsRate: 21,
      },
      "60k_1L": {
        rent: { min: 9000, max: 20000, avg: 14000 },
        food: { min: 7000, max: 13000, avg: 9500 },
        transport: { min: 2000, max: 4800, avg: 3000 },
        utilities: { min: 1700, max: 3300, avg: 2400 },
        savingsRate: 26,
      },
      above_1L: {
        rent: { min: 16000, max: 38000, avg: 25000 },
        food: { min: 9500, max: 19000, avg: 13500 },
        transport: { min: 3200, max: 8500, avg: 5200 },
        utilities: { min: 2400, max: 4800, avg: 3400 },
        savingsRate: 30,
      },
    },
  },

  lucknow: {
    city: "Lucknow",
    state: "Uttar Pradesh",
    tier: 2,
    costIndex: 90,
    notes: "Lucknow is growing fast with affordable rents. Gomti Nagar is the premium zone; Alambagh offers strong value.",
    cheaperAreas: ["Alambagh", "Indira Nagar (east)", "Chinhat"],
    expensiveAreas: ["Gomti Nagar Extension", "Hazratganj", "Vibhuti Khand"],
    salaryBands: {
      below_30k: {
        rent: { min: 2500, max: 5500, avg: 3800 },
        food: { min: 3000, max: 5200, avg: 4100 },
        transport: { min: 600, max: 1500, avg: 1000 },
        utilities: { min: 650, max: 1400, avg: 950 },
        savingsRate: 16,
      },
      "30k_60k": {
        rent: { min: 4500, max: 11000, avg: 7500 },
        food: { min: 4500, max: 8000, avg: 6200 },
        transport: { min: 1200, max: 2800, avg: 1800 },
        utilities: { min: 1100, max: 2200, avg: 1600 },
        savingsRate: 22,
      },
      "60k_1L": {
        rent: { min: 8500, max: 18000, avg: 13000 },
        food: { min: 6500, max: 12000, avg: 9000 },
        transport: { min: 1800, max: 4500, avg: 2800 },
        utilities: { min: 1600, max: 3200, avg: 2300 },
        savingsRate: 27,
      },
      above_1L: {
        rent: { min: 14000, max: 35000, avg: 22000 },
        food: { min: 9000, max: 18000, avg: 12500 },
        transport: { min: 3000, max: 8000, avg: 5000 },
        utilities: { min: 2300, max: 4500, avg: 3200 },
        savingsRate: 31,
      },
    },
  },

  patna: {
    city: "Patna",
    state: "Bihar",
    tier: 2,
    costIndex: 80,
    notes: "Patna is one of India's most affordable large cities. Boring Road and Bailey Road are premium areas.",
    cheaperAreas: ["Danapur", "Phulwari Sharif", "Khagaul"],
    expensiveAreas: ["Boring Road", "Bailey Road", "Patna Sahib"],
    salaryBands: {
      below_30k: {
        rent: { min: 2000, max: 4500, avg: 3000 },
        food: { min: 2800, max: 4800, avg: 3700 },
        transport: { min: 500, max: 1300, avg: 850 },
        utilities: { min: 550, max: 1200, avg: 800 },
        savingsRate: 18,
      },
      "30k_60k": {
        rent: { min: 3800, max: 9000, avg: 6000 },
        food: { min: 4200, max: 7500, avg: 5700 },
        transport: { min: 1000, max: 2500, avg: 1600 },
        utilities: { min: 1000, max: 2000, avg: 1400 },
        savingsRate: 24,
      },
      "60k_1L": {
        rent: { min: 7000, max: 16000, avg: 11000 },
        food: { min: 6000, max: 11000, avg: 8200 },
        transport: { min: 1600, max: 4000, avg: 2500 },
        utilities: { min: 1500, max: 3000, avg: 2100 },
        savingsRate: 28,
      },
      above_1L: {
        rent: { min: 12000, max: 28000, avg: 19000 },
        food: { min: 8500, max: 17000, avg: 12000 },
        transport: { min: 2800, max: 7000, avg: 4500 },
        utilities: { min: 2100, max: 4200, avg: 3000 },
        savingsRate: 32,
      },
    },
  },

  bhopal: {
    city: "Bhopal",
    state: "Madhya Pradesh",
    tier: 2,
    costIndex: 88,
    notes: "Bhopal is affordable and green. MP Nagar and New Market are premium; Kolar Road offers great value.",
    cheaperAreas: ["Kolar Road", "Ayodhya Bypass", "Misrod"],
    expensiveAreas: ["MP Nagar", "Arera Colony", "Shymala Hills"],
    salaryBands: {
      below_30k: {
        rent: { min: 2200, max: 5000, avg: 3400 },
        food: { min: 2900, max: 5000, avg: 3800 },
        transport: { min: 550, max: 1400, avg: 900 },
        utilities: { min: 600, max: 1300, avg: 900 },
        savingsRate: 17,
      },
      "30k_60k": {
        rent: { min: 4000, max: 10000, avg: 6800 },
        food: { min: 4500, max: 7800, avg: 6000 },
        transport: { min: 1100, max: 2600, avg: 1700 },
        utilities: { min: 1100, max: 2100, avg: 1500 },
        savingsRate: 22,
      },
      "60k_1L": {
        rent: { min: 8000, max: 17000, avg: 12000 },
        food: { min: 6500, max: 12000, avg: 9000 },
        transport: { min: 1800, max: 4200, avg: 2700 },
        utilities: { min: 1600, max: 3100, avg: 2200 },
        savingsRate: 27,
      },
      above_1L: {
        rent: { min: 13000, max: 30000, avg: 20000 },
        food: { min: 9000, max: 18000, avg: 12800 },
        transport: { min: 3000, max: 7500, avg: 4800 },
        utilities: { min: 2300, max: 4500, avg: 3200 },
        savingsRate: 32,
      },
    },
  },

  surat: {
    city: "Surat",
    state: "Gujarat",
    tier: 2,
    costIndex: 100,
    notes: "Surat is a fast-growing business city with moderate rents. Vesu and Adajan are premium areas.",
    cheaperAreas: ["Katargam", "Udhna", "Limbayat"],
    expensiveAreas: ["Vesu", "Adajan", "Althan"],
    salaryBands: {
      below_30k: {
        rent: { min: 3000, max: 6500, avg: 4500 },
        food: { min: 3300, max: 5800, avg: 4500 },
        transport: { min: 700, max: 1700, avg: 1100 },
        utilities: { min: 750, max: 1600, avg: 1100 },
        savingsRate: 15,
      },
      "30k_60k": {
        rent: { min: 5500, max: 13000, avg: 8800 },
        food: { min: 5000, max: 9000, avg: 6800 },
        transport: { min: 1300, max: 3000, avg: 2000 },
        utilities: { min: 1300, max: 2500, avg: 1800 },
        savingsRate: 20,
      },
      "60k_1L": {
        rent: { min: 10000, max: 22000, avg: 15500 },
        food: { min: 7500, max: 13500, avg: 10000 },
        transport: { min: 2200, max: 5000, avg: 3200 },
        utilities: { min: 1800, max: 3500, avg: 2500 },
        savingsRate: 25,
      },
      above_1L: {
        rent: { min: 17000, max: 40000, avg: 27000 },
        food: { min: 10000, max: 20000, avg: 14000 },
        transport: { min: 3500, max: 9000, avg: 5500 },
        utilities: { min: 2500, max: 5000, avg: 3600 },
        savingsRate: 30,
      },
    },
  },

  nagpur: {
    city: "Nagpur",
    state: "Maharashtra",
    tier: 2,
    costIndex: 92,
    notes: "Nagpur is one of India's most liveable cities with low cost of living. Dharampeth and Civil Lines are prime areas.",
    cheaperAreas: ["Hingna", "Wadi", "Kamptee"],
    expensiveAreas: ["Dharampeth", "Civil Lines", "Ramdaspeth"],
    salaryBands: {
      below_30k: {
        rent: { min: 2500, max: 5500, avg: 3800 },
        food: { min: 3000, max: 5200, avg: 4100 },
        transport: { min: 600, max: 1500, avg: 1000 },
        utilities: { min: 650, max: 1400, avg: 950 },
        savingsRate: 16,
      },
      "30k_60k": {
        rent: { min: 4500, max: 11000, avg: 7500 },
        food: { min: 4600, max: 8200, avg: 6300 },
        transport: { min: 1200, max: 2900, avg: 1900 },
        utilities: { min: 1100, max: 2200, avg: 1600 },
        savingsRate: 22,
      },
      "60k_1L": {
        rent: { min: 8500, max: 19000, avg: 13500 },
        food: { min: 6800, max: 12500, avg: 9200 },
        transport: { min: 1900, max: 4600, avg: 2900 },
        utilities: { min: 1700, max: 3300, avg: 2300 },
        savingsRate: 27,
      },
      above_1L: {
        rent: { min: 15000, max: 35000, avg: 23000 },
        food: { min: 9500, max: 19000, avg: 13500 },
        transport: { min: 3200, max: 8200, avg: 5200 },
        utilities: { min: 2400, max: 4800, avg: 3400 },
        savingsRate: 31,
      },
    },
  },

  kochi: {
    city: "Kochi",
    state: "Kerala",
    tier: 2,
    costIndex: 118,
    notes: "Kochi has Kerala's highest rents but also strong salaries. Edapally and Kakkanad near Infopark are popular IT zones.",
    cheaperAreas: ["Aluva", "Thrippunithura", "Kalamassery"],
    expensiveAreas: ["Marine Drive", "Panampilly Nagar", "Kakkanad"],
    salaryBands: {
      below_30k: {
        rent: { min: 4000, max: 8000, avg: 5800 },
        food: { min: 4000, max: 6800, avg: 5300 },
        transport: { min: 1000, max: 2200, avg: 1500 },
        utilities: { min: 950, max: 1900, avg: 1400 },
        savingsRate: 13,
      },
      "30k_60k": {
        rent: { min: 7000, max: 16000, avg: 11000 },
        food: { min: 6000, max: 10500, avg: 8000 },
        transport: { min: 1700, max: 4000, avg: 2600 },
        utilities: { min: 1600, max: 3000, avg: 2200 },
        savingsRate: 18,
      },
      "60k_1L": {
        rent: { min: 14000, max: 28000, avg: 20000 },
        food: { min: 9000, max: 16000, avg: 12000 },
        transport: { min: 2700, max: 6200, avg: 4000 },
        utilities: { min: 2200, max: 4200, avg: 3000 },
        savingsRate: 23,
      },
      above_1L: {
        rent: { min: 24000, max: 55000, avg: 36000 },
        food: { min: 13000, max: 24000, avg: 17500 },
        transport: { min: 4500, max: 12000, avg: 7000 },
        utilities: { min: 3200, max: 6200, avg: 4500 },
        savingsRate: 28,
      },
    },
  },

  indore: {
    city: "Indore",
    state: "Madhya Pradesh",
    tier: 2,
    costIndex: 90,
    notes: "Indore is MP's commercial hub and consistently ranks among India's cleanest cities. Super Corridor is the new growth zone.",
    cheaperAreas: ["Sanwer Road", "Banganga", "Scheme 54"],
    expensiveAreas: ["Vijay Nagar", "Super Corridor", "Palasia"],
    salaryBands: {
      below_30k: {
        rent: { min: 2300, max: 5200, avg: 3600 },
        food: { min: 2900, max: 5000, avg: 3900 },
        transport: { min: 580, max: 1400, avg: 920 },
        utilities: { min: 620, max: 1350, avg: 920 },
        savingsRate: 17,
      },
      "30k_60k": {
        rent: { min: 4200, max: 10500, avg: 7000 },
        food: { min: 4600, max: 8000, avg: 6100 },
        transport: { min: 1100, max: 2700, avg: 1750 },
        utilities: { min: 1100, max: 2200, avg: 1550 },
        savingsRate: 22,
      },
      "60k_1L": {
        rent: { min: 8200, max: 17500, avg: 12500 },
        food: { min: 6700, max: 12200, avg: 9000 },
        transport: { min: 1850, max: 4400, avg: 2800 },
        utilities: { min: 1650, max: 3200, avg: 2300 },
        savingsRate: 27,
      },
      above_1L: {
        rent: { min: 14000, max: 32000, avg: 21000 },
        food: { min: 9200, max: 18500, avg: 13200 },
        transport: { min: 3100, max: 7800, avg: 5000 },
        utilities: { min: 2300, max: 4700, avg: 3300 },
        savingsRate: 32,
      },
    },
  },
};

// Helper: get salary band from salary number
export function getSalaryBand(salary: number): SalaryBand {
  // salary is the MONTHLY figure passed from the form
  // Make sure we are comparing monthly, not annual
  const monthly = salary;
  if (monthly < 30000) return "below_30k";
  if (monthly < 60000) return "30k_60k";
  if (monthly < 100000) return "60k_1L";
  return "above_1L"; // anything ₹1L+/month uses premium band
}

// Helper: normalize city name from user input to data key
export function normalizeCityKey(city: string): string | null {
  const input = city.toLowerCase().trim();
  const aliases: Record<string, string> = {
    mumbai: "mumbai",
    "bombay": "mumbai",
    delhi: "delhi",
    "new delhi": "delhi",
    "delhi ncr": "delhi",
    ncr: "delhi",
    bangalore: "bangalore",
    bengaluru: "bangalore",
    chennai: "chennai",
    "madras": "chennai",
    hyderabad: "hyderabad",
    pune: "pune",
    kolkata: "kolkata",
    "calcutta": "kolkata",
    ahmedabad: "ahmedabad",
    jaipur: "jaipur",
    lucknow: "lucknow",
    patna: "patna",
    bhopal: "bhopal",
    surat: "surat",
    nagpur: "nagpur",
    kochi: "kochi",
    "cochin": "kochi",
    indore: "indore",
  };
  return aliases[input] || null;
}

// Helper: get deviation status for a category
export type DeviationStatus = "good" | "warning" | "danger" | "low";

export function getDeviationStatus(
  userAmount: number,
  avgAmount: number
): DeviationStatus {
  const ratio = userAmount / avgAmount;
  if (ratio > 1.3) return "danger";   // 30%+ above average
  if (ratio > 1.15) return "warning"; // 15-30% above average
  if (ratio < 0.7) return "low";      // 30%+ below average (under-spending)
  return "good";                       // within normal range
}

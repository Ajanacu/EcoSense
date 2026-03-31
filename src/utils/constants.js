export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
];

export const TARIFFS = {
  'Kerala': 6.50,
  'Karnataka': 7.10,
  'Tamil Nadu': 6.00,
  'Maharashtra': 8.50,
  'Delhi': 7.00,
  'Gujarat': 5.50,
  'Rajasthan': 6.20,
  'West Bengal': 7.50
};

export const DEFAULT_TARIFF = 6.80;

export const DEFAULT_APPLIANCES = [
  { id: 'ac15', name: 'Air Conditioner 1.5T', wattage: 1500, hasStarRating: true },
  { id: 'fan', name: 'Ceiling Fan', wattage: 75, hasStarRating: false },
  { id: 'fridge', name: 'Refrigerator', wattage: 150, hasStarRating: false },
  { id: 'geyser', name: 'Water Heater / Geyser', wattage: 2000, hasStarRating: false },
  { id: 'wm', name: 'Washing Machine', wattage: 500, hasStarRating: false },
  { id: 'microwave', name: 'Microwave', wattage: 1200, hasStarRating: false },
  { id: 'tv', name: 'Television', wattage: 100, hasStarRating: false },
  { id: 'led', name: 'LED Lights (per room)', wattage: 10, hasStarRating: false },
  { id: 'incandescent', name: 'Incandescent Bulbs (per room)', wattage: 60, hasStarRating: false },
  { id: 'laptop', name: 'Laptop', wattage: 65, hasStarRating: false },
  { id: 'induction', name: 'Induction Cooktop', wattage: 1500, hasStarRating: false },
  { id: 'mixer', name: 'Mixer / Grinder', wattage: 750, hasStarRating: false },
  { id: 'iron', name: 'Iron Box', wattage: 1000, hasStarRating: false }
];

export const PEAK_SUN_HOURS = {
  'Rajasthan': 6.5,
  'Gujarat': 6.2,
  'Maharashtra': 5.8,
  'Karnataka': 5.5,
  'Tamil Nadu': 5.8,
  'Kerala': 5.5,
  'Delhi': 5.5,
  'West Bengal': 4.5
};
export const DEFAULT_SUN_HOURS = 5.0;

export const EMISSION_FACTOR = 0.82; // kg CO2 per kWh

export const CITY_AVERAGES = [
  { city: 'Mumbai', state: 'Maharashtra', kwh: 280, bill: 2380 },
  { city: 'Delhi', state: 'Delhi', kwh: 310, bill: 2170 },
  { city: 'Bangalore', state: 'Karnataka', kwh: 260, bill: 1846 },
  { city: 'Chennai', state: 'Tamil Nadu', kwh: 295, bill: 1770 },
  { city: 'Hyderabad', state: 'Telangana', kwh: 275, bill: 1788 },
  { city: 'Kochi', state: 'Kerala', kwh: 240, bill: 1560 },
  { city: 'Pune', state: 'Maharashtra', kwh: 265, bill: 2253 },
  { city: 'Ahmedabad', state: 'Gujarat', kwh: 255, bill: 1403 },
  { city: 'Kolkata', state: 'West Bengal', kwh: 270, bill: 2025 },
  { city: 'Jaipur', state: 'Rajasthan', kwh: 250, bill: 1550 }
];

export const GENERIC_RECOMMENDATIONS = [
  {
    title: 'AC Temperature Optimization',
    appliance: 'Air Conditioner 1.5T',
    description: 'Set your AC to 24°C instead of 18°C. Each degree above 18°C saves about 6% on your cooling costs.',
    monthlySavingsRupees: 350,
    co2ReductionKgPerMonth: 8.5,
    effortLevel: 'Easy',
    paybackPeriodMonths: 0,
    requiresPurchase: false
  },
  {
    title: 'Unplug Standby Devices',
    appliance: 'Television',
    description: 'Turn off the TV and microwave from the main switch. Phantom loads can account for 10% of your bill.',
    monthlySavingsRupees: 150,
    co2ReductionKgPerMonth: 3.2,
    effortLevel: 'Easy',
    paybackPeriodMonths: 0,
    requiresPurchase: false
  },
  {
    title: 'Upgrade to BLDC Fans',
    appliance: 'Ceiling Fan',
    description: 'Replace traditional 75W ceiling fans with 28W BLDC fans for significant long-term savings.',
    monthlySavingsRupees: 200,
    co2ReductionKgPerMonth: 5.1,
    effortLevel: 'Medium',
    paybackPeriodMonths: 15,
    requiresPurchase: true
  }
];

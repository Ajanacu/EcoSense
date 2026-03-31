import { TARIFFS, DEFAULT_TARIFF, EMISSION_FACTOR } from './constants';

export const getTariff = (state) => {
  return TARIFFS[state] || DEFAULT_TARIFF;
};

export const calculateApplianceDailyKwh = (appliance) => {
  let wattage = appliance.wattage;
  if (appliance.hasStarRating && appliance.starRating) {
    if (appliance.starRating === 5) wattage = 900;
    else if (appliance.starRating === 1) wattage = 1800;
    else wattage = 1800 - ((appliance.starRating - 1) * 225); // Linear approx
  }
  return (wattage * (appliance.hours || 0)) / 1000;
};

export const calculateTotalDailyKwh = (appliances) => {
  return appliances.reduce((sum, app) => sum + calculateApplianceDailyKwh(app), 0);
};

export const calculateMonthlyKwh = (dailyKwh) => dailyKwh * 30;

export const calculateMonthlyBill = (monthlyKwh, state) => {
  return monthlyKwh * getTariff(state);
};

export const calculateDailyCO2 = (dailyKwh) => dailyKwh * EMISSION_FACTOR;

export const getEfficiencyGrade = (monthlyKwh) => {
  if (monthlyKwh < 150) return 'A+';
  if (monthlyKwh < 200) return 'A';
  if (monthlyKwh < 250) return 'B+';
  if (monthlyKwh < 300) return 'B';
  if (monthlyKwh < 400) return 'C';
  return 'D';
};

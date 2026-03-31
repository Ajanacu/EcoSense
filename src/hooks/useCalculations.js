import { useMemo } from 'react';
import { 
  calculateTotalDailyKwh, 
  calculateMonthlyKwh, 
  calculateMonthlyBill, 
  calculateDailyCO2, 
  getEfficiencyGrade 
} from '../utils/calculations';

export function useCalculations(profile) {
  return useMemo(() => {
    if (!profile || !profile.appliances) return null;

    const dailyKwh = calculateTotalDailyKwh(profile.appliances);
    const monthlyKwh = calculateMonthlyKwh(dailyKwh);
    const monthlyBill = calculateMonthlyBill(monthlyKwh, profile.state);
    const dailyCO2 = calculateDailyCO2(dailyKwh);
    const grade = getEfficiencyGrade(monthlyKwh);

    // Provide appliance breakdown
    const breakdown = profile.appliances.map(app => {
      const kwh = (app.wattage * (app.hours || 0)) / 1000;
      let colorClass = 'bg-accent'; // < 1 kwh
      if (kwh > 3) colorClass = 'bg-danger';
      else if (kwh >= 1) colorClass = 'bg-warning';
      
      const percentage = dailyKwh > 0 ? ((kwh / dailyKwh) * 100).toFixed(1) : 0;
      
      return { ...app, dailyKwh: kwh, percentage, colorClass };
    }).sort((a, b) => b.dailyKwh - a.dailyKwh);

    return {
      dailyKwh,
      monthlyKwh,
      monthlyBill,
      dailyCO2,
      grade,
      breakdown
    };
  }, [profile]);
}

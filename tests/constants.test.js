import { describe, it, expect } from 'vitest';
import { TABS, CATEGORIES, INDIA_AVERAGES, INDIA_GRID_FACTORS, INDIA_TRANSPORT_FACTORS, INDIA_FOOD_FACTORS } from '../src/constants.js';

describe('Constants Verification Suite', () => {
  it('should verify all 8 tabs exist', () => {
    expect(TABS).toHaveLength(8);
    expect(TABS.map(t => t.id)).toEqual([
      'dashboard',
      'todo',
      'tracker',
      'actions',
      'insights',
      'pledge',
      'leaderboard',
      'assistant'
    ]);
  });

  it('should verify all 5 carbon categories exist', () => {
    expect(CATEGORIES).toHaveLength(5);
    expect(CATEGORIES.map(c => c.id)).toEqual(['transport', 'food', 'energy', 'shopping', 'waste']);
  });

  it('should check India carbon averages', () => {
    expect(INDIA_AVERAGES.dailyKg).toBe(5.2);
    expect(INDIA_AVERAGES.annualTonnes).toBe(1.9);
    expect(INDIA_AVERAGES.globalDailyKg).toBe(11.0);
    expect(INDIA_AVERAGES.safeDailyKg).toBe(6.8);
  });

  it('should verify major India city grid factors exist and have valid values', () => {
    expect(INDIA_GRID_FACTORS.Delhi.kgCO2perKWh).toBe(0.82);
    expect(INDIA_GRID_FACTORS.Bengaluru.kgCO2perKWh).toBe(0.65);
    expect(INDIA_GRID_FACTORS.Kerala.kgCO2perKWh).toBe(0.35);
    expect(INDIA_GRID_FACTORS.Kolkata.kgCO2perKWh).toBe(0.85);
    expect(INDIA_GRID_FACTORS.Other.kgCO2perKWh).toBe(0.71);
  });

  it('should verify transport factors exist', () => {
    expect(INDIA_TRANSPORT_FACTORS.auto_cng.kgPerkm).toBe(0.09);
    expect(INDIA_TRANSPORT_FACTORS.metro.kgPerkm).toBe(0.028);
    expect(INDIA_TRANSPORT_FACTORS.car_petrol.kgPerkm).toBe(0.21);
    expect(INDIA_TRANSPORT_FACTORS.ev_two_wheeler.kgPerkm).toBe(0.015);
  });

  it('should verify food factors exist', () => {
    expect(INDIA_FOOD_FACTORS.dal_rice.kgCO2).toBe(0.8);
    expect(INDIA_FOOD_FACTORS.chapati_sabzi.kgCO2).toBe(0.6);
    expect(INDIA_FOOD_FACTORS.mutton_biryani.kgCO2).toBe(4.2);
    expect(INDIA_FOOD_FACTORS.lpg_cylinder.kgCO2).toBe(2.98);
  });
});

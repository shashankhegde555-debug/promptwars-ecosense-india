import { describe, it, expect } from 'vitest';
import { INDIA_GRID_FACTORS, INDIA_TRANSPORT_FACTORS, INDIA_FOOD_FACTORS, INDIA_CARBON_FACTS } from '../src/constants.js';

describe('India Data Layer Validation Suite', () => {
  it('should verify all major Indian metros are supported in grid factors', () => {
    const expectedMetros = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Kerala', 'Pune'];
    expectedMetros.forEach(metro => {
      expect(INDIA_GRID_FACTORS).toHaveProperty(metro);
      expect(INDIA_GRID_FACTORS[metro].kgCO2perKWh).toBeGreaterThan(0);
    });
  });

  it('should verify Kerala has the lowest grid factor due to hydro', () => {
    const keralaFactor = INDIA_GRID_FACTORS.Kerala.kgCO2perKWh;
    const delhiFactor = INDIA_GRID_FACTORS.Delhi.kgCO2perKWh;
    expect(keralaFactor).toBeLessThan(delhiFactor);
    expect(keralaFactor).toBe(0.35);
  });

  it('should verify India transport factors contain Indian local transport systems', () => {
    expect(INDIA_TRANSPORT_FACTORS).toHaveProperty('auto_cng');
    expect(INDIA_TRANSPORT_FACTORS).toHaveProperty('auto_petrol');
    expect(INDIA_TRANSPORT_FACTORS).toHaveProperty('metro');
    expect(INDIA_TRANSPORT_FACTORS).toHaveProperty('bus');
    expect(INDIA_TRANSPORT_FACTORS).toHaveProperty('ev_two_wheeler');
  });

  it('should verify CNG auto has lower factor than petrol auto', () => {
    const cng = INDIA_TRANSPORT_FACTORS.auto_cng.kgPerkm;
    const petrol = INDIA_TRANSPORT_FACTORS.auto_petrol.kgPerkm;
    expect(cng).toBeLessThan(petrol);
    expect(cng).toBe(0.09);
  });

  it('should verify metro emission factor is lower than private car commute', () => {
    const metro = INDIA_TRANSPORT_FACTORS.metro.kgPerkm;
    const car = INDIA_TRANSPORT_FACTORS.car_petrol.kgPerkm;
    expect(metro).toBeLessThan(car);
    expect(metro).toBe(0.028);
  });

  it('should verify India food factors contain staple Indian meals', () => {
    expect(INDIA_FOOD_FACTORS).toHaveProperty('dal_rice');
    expect(INDIA_FOOD_FACTORS).toHaveProperty('chapati_sabzi');
    expect(INDIA_FOOD_FACTORS).toHaveProperty('chicken_curry');
    expect(INDIA_FOOD_FACTORS).toHaveProperty('mutton_biryani');
  });

  it('should verify vegetarian meal has lower carbon footprint than meat-based biryani', () => {
    const dalRice = INDIA_FOOD_FACTORS.dal_rice.kgCO2;
    const muttonBiryani = INDIA_FOOD_FACTORS.mutton_biryani.kgCO2;
    expect(dalRice).toBeLessThan(muttonBiryani);
  });

  it('should verify LPG cylinder emission factor matches standard cylinder stats', () => {
    expect(INDIA_FOOD_FACTORS.lpg_cylinder.kgCO2).toBe(2.98);
  });

  it('should verify India-specific facts are loaded correctly', () => {
    expect(INDIA_CARBON_FACTS.length).toBeGreaterThanOrEqual(10);
    expect(INDIA_CARBON_FACTS[0].fact).toContain('tonnes/year');
  });

  it('should verify all grid factor entries have regions and sources defined', () => {
    Object.values(INDIA_GRID_FACTORS).forEach(grid => {
      expect(grid.source).toBeDefined();
      expect(grid.region).toBeDefined();
    });
  });
});

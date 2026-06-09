import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { INDIA_GRID_FACTORS } from '../constants.js';

const CITIES = Object.keys(INDIA_GRID_FACTORS);

export default function CitySelector() {
  const { city, updateCity, user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="city-selector" role="group" aria-label="Select your city">
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        id="city-button"
      >
        📍 {city || 'Select City'}
      </button>
      {open && (
        <ul
          className="city-dropdown"
          role="listbox"
          aria-labelledby="city-button"
        >
          {CITIES.map(c => (
            <li key={c}>
              <button
                role="option"
                aria-selected={city === c}
                className={`city-option ${city === c ? 'selected' : ''}`}
                onClick={() => { updateCity(c); setOpen(false); }}
              >
                {c}
                <span className="city-factor">
                  {INDIA_GRID_FACTORS[c].kgCO2perKWh} kg CO₂/kWh
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

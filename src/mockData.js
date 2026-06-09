export const MOCK_ASSISTANT_RESPONSES = {
  'How can I reduce my transport carbon footprint in India?': `Here are the most effective ways to reduce your transport carbon footprint in India:

• **Use public transit**: Switch to Metro systems (like Delhi Metro, Namma Metro) or local trains, which emit only **0.028 kg CO₂ per km**.
• **Adopt electric vehicles**: Transition to electric two-wheelers or EVs. Charging with India's grid still saves over **60% emissions** compared to petrol/diesel.
• **Carpool and shared mobility**: Use shared autos (CNG-powered autos emit **57% less CO₂** than petrol cars) or rideshare options.
• **Eco-driving**: Maintain proper tyre pressure and drive at moderate speeds (40-50 km/h) to improve fuel efficiency by up to **15%**.`,

  'What are the best eco-friendly habits for daily life?': `Simple daily habit changes can make a significant cumulative impact on your footprint:

• **Optimize AC usage**: Set your air conditioner to **24°C or 26°C**. Every 1°C increase saves about **6% electricity**.
• **Switch to LED bulbs**: Replace all traditional bulbs. LEDs consume **80% less energy** and last much longer.
• **Unplug standby devices**: Turn off power switches for chargers, TVs, and appliances when not in use to avoid 'vampire' power draw.
• **Reduce food waste**: Plan meals to avoid discarding food. Organic waste in Indian landfills is a major source of methane.
• **Carry reusable bags**: Avoid single-use plastics by keeping a cloth bag handy for grocery shopping.`,

  'Calculate my footprint: drove 20km in a petrol car in Delhi': `**Total carbon footprint:** 4.20 kg CO₂

**Breakdown:**
• Petrol combustion: 4.200 kg — Based on average petrol car emission factor of 0.21 kg CO₂ per km in Delhi.

**Real-world equivalents:**
🔁 Charging a smartphone 510 times
🔁 0.2% of an average Indian's annual carbon footprint

**💡 How to reduce:**
✅ Delhi Metro: Taking the metro for this route would emit just 0.56 kg CO₂ (saving 3.64 kg CO₂).
✅ Carpooling: Share the ride with 2-3 colleagues to split the footprint.
✅ Eco-driving: Smooth acceleration and avoiding idling can reduce fuel consumption by 15%.`,

  'How much CO₂ does using AC for 8 hours produce?': `**Total carbon footprint:** 3.20 kg CO₂

**Breakdown:**
• Electricity Consumption: 3.200 kg — Assuming a 1.5-ton AC drawing ~1.0 kW/h over 8 hours (8 kWh) on the average Indian grid.

**Real-world equivalents:**
🔁 Driving a petrol car for 15 km
🔁 Running a ceiling fan for 80 hours

**💡 How to reduce:**
✅ Set to 24°C: Setting the temperature to 24°C instead of 18°C can reduce the power consumption by up to 30%.
✅ Use fan combination: Run a ceiling fan alongside the AC to distribute cool air more efficiently.
✅ Clean filters: Clean your AC filters monthly to maintain peak operating efficiency.`,

  "What is India's carbon footprint compared to global average?": `India's per capita carbon emissions present a unique picture compared to global averages:

• **Per Capita Average**: An average Indian emits **1.9 tonnes** of CO₂ per year, which is significantly lower than the global average of **4.0 tonnes**.
• **Comparison with developed nations**: For context, the average person in the United States emits about 14-15 tonnes per year.
• **Total emissions**: Due to its population, India is the 3rd largest emitter globally, but its historical responsibility and per capita levels remain very low.
• **Future Target**: To prevent warming beyond 1.5°C, the global climate-safe target is around **2.5 tonnes** per year per person by 2030.`,

  'Give me tips to reduce my food-related carbon emissions': `Food choices and cooking habits have a massive impact on your personal carbon footprint:

• **Eat more plant-based meals**: A dal-rice or chapati-sabzi meal has a footprint of 0.6 to 0.8 kg CO₂, while a mutton or chicken dish can exceed 2.1 to 4.2 kg CO₂.
• **Efficient cooking**: Use pressure cookers (which save up to 50% LPG compared to open-pot cooking) and cover pots while boiling.
• **Switch to induction**: Using induction cooktops powered by a cleaner grid can be more efficient than LPG.
• **Buy local and seasonal**: Purchase locally grown produce to reduce the transportation emissions ('food miles') of your groceries.
• **Minimize dairy waste**: Dairy is carbon-intensive; try to purchase only what is needed and store it correctly.`
};

export const MOCK_ACTIONS = {
  transport: {
    category: 'transport',
    actions: [
      {
        title: 'Unclog Air Filters',
        difficulty: 'easy',
        icon: '🔧',
        savingKgPerYear: 90,
        description: 'Clean or replace dirty air filters in your two-wheeler or car.',
        indiaContext: 'In dusty Indian traffic conditions, dirty filters reduce fuel mileage significantly.'
      },
      {
        title: 'Maintain Ideal Tyre Pressure',
        difficulty: 'easy',
        icon: '🛞',
        savingKgPerYear: 120,
        description: 'Check and fill your tyres weekly to the recommended PSI.',
        indiaContext: 'Properly inflated tyres reduce rolling resistance and save fuel on city roads.'
      },
      {
        title: 'Carpool to Work',
        difficulty: 'medium',
        icon: '👥',
        savingKgPerYear: 450,
        description: 'Share rides with colleagues or use ride-sharing apps 3 days a week.',
        indiaContext: 'Helps reduce high traffic congestion in metro cities like Bengaluru, Mumbai, and Delhi.'
      },
      {
        title: 'Switch to CNG or Shared Auto',
        difficulty: 'medium',
        icon: '🛺',
        savingKgPerYear: 320,
        description: 'Use CNG auto-rickshaws or shared autos for short commutes instead of private petrol cars.',
        indiaContext: 'CNG autos have 57% lower emissions per passenger-km compared to single-occupant petrol cars.'
      },
      {
        title: 'Switch to Delhi/Namma Metro',
        difficulty: 'committed',
        icon: '🚇',
        savingKgPerYear: 1100,
        description: 'Make Metro your primary mode of daily commute.',
        indiaContext: 'Metro rail systems are highly efficient and cut carbon footprint by up to 88%.'
      },
      {
        title: 'Upgrade to an Electric Two-Wheeler',
        difficulty: 'committed',
        icon: '🛵',
        savingKgPerYear: 780,
        description: 'Replace your older petrol scooter/bike with a modern electric scooter.',
        indiaContext: 'Saves money on petrol while utilizing subsidy benefits under schemes like FAME.'
      }
    ]
  },
  food: {
    category: 'food',
    actions: [
      {
        title: 'Cover Pots While Cooking',
        difficulty: 'easy',
        icon: '🍲',
        savingKgPerYear: 40,
        description: 'Always put a lid on your cooking vessels.',
        indiaContext: 'Reduces cooking time and cuts LPG/gas usage by up to 15%.'
      },
      {
        title: 'Eat Leftovers',
        difficulty: 'easy',
        icon: '🍱',
        savingKgPerYear: 70,
        description: 'Store leftovers properly in the fridge and finish them before cooking fresh meals.',
        indiaContext: 'Food waste in landfills produces methane, a potent greenhouse gas.'
      },
      {
        title: 'Switch to Induction Cooktop',
        difficulty: 'medium',
        icon: '🍳',
        savingKgPerYear: 180,
        description: 'Use electric induction cooktops for boiling and simple cooking tasks.',
        indiaContext: 'More efficient than LPG and safer, especially when paired with hydro-heavy or solar power grids.'
      },
      {
        title: 'Two Vegetarian Days a Week',
        difficulty: 'medium',
        icon: '🥗',
        savingKgPerYear: 240,
        description: 'Substitute chicken/meat dishes with traditional lentil and vegetable meals twice a week.',
        indiaContext: 'Traditional Indian vegetarian meals like dal-rice emit 60% less CO₂ than non-veg options.'
      },
      {
        title: 'Adopt a Low-Impact Diet',
        difficulty: 'committed',
        icon: '🍛',
        savingKgPerYear: 500,
        description: 'Transition to a fully plant-based or low-impact vegetarian diet.',
        indiaContext: 'Mutton and beef have the highest carbon footprints; switching to local pulses is a huge win.'
      },
      {
        title: 'Zero-Waste Kitchen',
        difficulty: 'committed',
        icon: '🪱',
        savingKgPerYear: 210,
        description: 'Compost all wet organic waste at home using a simple composting bin.',
        indiaContext: 'Reduces trash sent to city dump yards like Deonar or Ghazipur, preventing landfill gas emissions.'
      }
    ]
  },
  energy: {
    category: 'energy',
    actions: [
      {
        title: 'Set AC to 24°C',
        difficulty: 'easy',
        icon: '❄️',
        savingKgPerYear: 150,
        description: 'Keep your AC thermostat at 24°C or 26°C instead of colder temperatures.',
        indiaContext: 'Each degree increase saves about 6% of electricity in Indian summer conditions.'
      },
      {
        title: 'Turn Off Standby Power',
        difficulty: 'easy',
        icon: '🔌',
        savingKgPerYear: 80,
        description: 'Switch off wall outlets for appliances, TVs, and chargers when not in use.',
        indiaContext: 'Prevents phantom loads which contribute significantly to monthly electric bills.'
      },
      {
        title: 'Switch to 5-Star BEE Appliances',
        difficulty: 'medium',
        icon: '⭐️',
        savingKgPerYear: 350,
        description: 'Look for the Bureau of Energy Efficiency (BEE) 5-star label when buying ACs or fridges.',
        indiaContext: '5-star appliances use up to 40% less electricity than 1-star alternatives.'
      },
      {
        title: 'Replace All Lamps with LEDs',
        difficulty: 'medium',
        icon: '💡',
        savingKgPerYear: 200,
        description: 'Replace remaining incandescent or CFL bulbs with energy-saving LED lamps.',
        indiaContext: 'LEDs use up to 80% less energy and are highly subsidized in India under the UJALA scheme.'
      },
      {
        title: 'Install Solar Water Heaters',
        difficulty: 'committed',
        icon: '☀️',
        savingKgPerYear: 600,
        description: 'Install a rooftop solar water heater for domestic hot water needs.',
        indiaContext: 'Reduces dependency on high-wattage electric geysers, saving hundreds of units per year.'
      },
      {
        title: 'Rooftop Solar Panels',
        difficulty: 'committed',
        icon: '⚡',
        savingKgPerYear: 2200,
        description: 'Set up a grid-connected rooftop solar photovoltaic system.',
        indiaContext: 'Generates clean electricity and allows net metering benefits with state utility companies.'
      }
    ]
  },
  shopping: {
    category: 'shopping',
    actions: [
      {
        title: 'Carry a Cloth Bag',
        difficulty: 'easy',
        icon: '🛍️',
        savingKgPerYear: 30,
        description: 'Keep reusable jute or cotton bags in your vehicle/bag for daily errands.',
        indiaContext: 'Avoids taking plastic bags from local sabzi wallahs and grocery stores.'
      },
      {
        title: 'Buy Local Handloom/Cotton',
        difficulty: 'easy',
        icon: '👕',
        savingKgPerYear: 60,
        description: 'Choose local cotton and handloom fabrics over fast-fashion polyester.',
        indiaContext: 'Polyester is synthetic and fossil-fuel-derived, whereas local cotton supports weavers and has low transport emissions.'
      },
      {
        title: 'Opt for No-Rush Delivery',
        difficulty: 'medium',
        icon: '📦',
        savingKgPerYear: 120,
        description: 'Consolidate orders on Amazon/Flipkart/Zepto and choose longer delivery slots when possible.',
        indiaContext: 'Reduces the number of delivery bike trips and packaging materials used.'
      },
      {
        title: 'Avoid Over-packaged Goods',
        difficulty: 'medium',
        icon: '🧃',
        savingKgPerYear: 90,
        description: 'Choose loose vegetables and larger packs instead of individually wrapped items.',
        indiaContext: 'Saves raw plastic manufacturing energy and reduces waste processing loads.'
      },
      {
        title: 'Practice One-In, One-Out rule',
        difficulty: 'committed',
        icon: '🧥',
        savingKgPerYear: 310,
        description: 'Commit to buying new clothes or shoes only when replacing an old item.',
        indiaContext: 'Textile manufacturing is highly water and energy-intensive, particularly in manufacturing hubs.'
      },
      {
        title: 'Rent or Buy Secondhand',
        difficulty: 'committed',
        icon: '♻️',
        savingKgPerYear: 420,
        description: 'Rent formal attire for weddings/festivals instead of buying one-time outfits.',
        indiaContext: 'Prevents waste from high-cost ethnic wear that is rarely used.'
      }
    ]
  },
  waste: {
    category: 'waste',
    actions: [
      {
        title: 'Decline Single-Use Cutlery',
        difficulty: 'easy',
        icon: '🍴',
        savingKgPerYear: 25,
        description: "Check 'Don't send cutlery' when ordering food from Swiggy or Zomato.",
        indiaContext: 'Saves millions of plastic spoons, forks, and tissues from going straight to landfills.'
      },
      {
        title: 'Refuse Bottled Water',
        difficulty: 'easy',
        icon: '🍼',
        savingKgPerYear: 50,
        description: 'Carry a reusable steel/copper bottle and refill it from trusted RO water dispensers.',
        indiaContext: 'Plastic water bottles are major pollutants in Indian tourist locations and water bodies.'
      },
      {
        title: 'Separate Dry and Wet Waste',
        difficulty: 'medium',
        icon: '🗑️',
        savingKgPerYear: 140,
        description: 'Use separate bins for biodegradable kitchen waste and dry recyclable waste.',
        indiaContext: 'Enables municipal workers to recycle materials and prevents toxic mixing in landfill fires.'
      },
      {
        title: 'Sell to local Raddiwallah',
        difficulty: 'medium',
        icon: '🗞️',
        savingKgPerYear: 180,
        description: 'Accumulate paper, cardboard, and glass bottles and sell them to local scrap dealers.',
        indiaContext: "India's informal recycling network (raddiwallahs) is highly efficient and ensures high circularity."
      },
      {
        title: 'Upcycle and Repair Furniture',
        difficulty: 'committed',
        icon: '🪑',
        savingKgPerYear: 340,
        description: 'Repair old wooden or metal household furniture rather than buying cheap plastic/particleboard imports.',
        indiaContext: 'Saves trees and reduces manufacturing footprint from global supply chains.'
      },
      {
        title: 'E-Waste Recycling',
        difficulty: 'committed',
        icon: '💻',
        savingKgPerYear: 220,
        description: 'Drop off dead batteries, phones, and chargers at authorized e-waste collection centers.',
        indiaContext: 'Prevents heavy metals from leaching into groundwater and supports valuable metal recovery.'
      }
    ]
  }
};

// Offline city list for suggestions — name, country, [lon, lat].
// No API key needed; picked cities feed real coordinates to the globe.
export const CITY_LIST = [
  ['Amsterdam','Netherlands',4.90,52.37],['Athens','Greece',23.73,37.98],['Auckland','New Zealand',174.76,-36.85],
  ['Austin','United States',-97.74,30.27],['Bangkok','Thailand',100.50,13.76],['Barcelona','Spain',2.17,41.39],
  ['Beijing','China',116.41,39.90],['Berlin','Germany',13.40,52.52],['Bogotá','Colombia',-74.07,4.71],
  ['Boston','United States',-71.06,42.36],['Brussels','Belgium',4.35,50.85],['Budapest','Hungary',19.04,47.50],
  ['Buenos Aires','Argentina',-58.38,-34.60],['Cairo','Egypt',31.24,30.04],['Cape Town','South Africa',18.42,-33.92],
  ['Chicago','United States',-87.63,41.88],['Copenhagen','Denmark',12.57,55.68],['Dallas','United States',-96.80,32.78],
  ['Delhi','India',77.10,28.70],['Denver','United States',-104.99,39.74],['Doha','Qatar',51.53,25.29],
  ['Dubai','United Arab Emirates',55.27,25.20],['Dublin','Ireland',-6.26,53.35],['Edinburgh','United Kingdom',-3.19,55.95],
  ['Florence','Italy',11.25,43.77],['Frankfurt','Germany',8.68,50.11],['Geneva','Switzerland',6.14,46.20],
  ['Hanoi','Vietnam',105.83,21.03],['Havana','Cuba',-82.37,23.11],['Helsinki','Finland',24.94,60.17],
  ['Ho Chi Minh City','Vietnam',106.63,10.82],['Hong Kong','China',114.17,22.32],['Honolulu','United States',-157.86,21.31],
  ['Houston','United States',-95.37,29.76],['Istanbul','Türkiye',28.98,41.01],['Jakarta','Indonesia',106.85,-6.21],
  ['Johannesburg','South Africa',28.05,-26.20],['Kyoto','Japan',135.77,35.01],['Lagos','Nigeria',3.39,6.52],
  ['Las Vegas','United States',-115.14,36.17],['Lima','Peru',-77.04,-12.05],['Lisbon','Portugal',-9.14,38.72],
  ['London','United Kingdom',-0.12,51.51],['Los Angeles','United States',-118.24,34.05],['Madrid','Spain',-3.70,40.42],
  ['Marrakesh','Morocco',-7.98,31.63],['Melbourne','Australia',144.96,-37.81],['Mexico City','Mexico',-99.13,19.43],
  ['Miami','United States',-80.19,25.76],['Milan','Italy',9.19,45.46],['Montreal','Canada',-73.57,45.50],
  ['Moscow','Russia',37.62,55.76],['Mumbai','India',72.88,19.08],['Munich','Germany',11.58,48.14],
  ['Nairobi','Kenya',36.82,-1.29],['Naples','Italy',14.27,40.85],['Nashville','United States',-86.78,36.16],
  ['New Orleans','United States',-90.07,29.95],['New York','United States',-74.01,40.71],['Nice','France',7.26,43.71],
  ['Osaka','Japan',135.50,34.69],['Oslo','Norway',10.75,59.91],['Paris','France',2.35,48.85],
  ['Philadelphia','United States',-75.17,39.95],['Phoenix','United States',-112.07,33.45],['Porto','Portugal',-8.61,41.15],
  ['Prague','Czechia',14.44,50.08],['Quebec City','Canada',-71.21,46.81],['Reykjavik','Iceland',-21.90,64.15],
  ['Rio de Janeiro','Brazil',-43.17,-22.91],['Rome','Italy',12.50,41.90],['San Diego','United States',-117.16,32.72],
  ['San Francisco','United States',-122.42,37.77],['San Juan','Puerto Rico',-66.11,18.47],['Santiago','Chile',-70.67,-33.45],
  ['São Paulo','Brazil',-46.63,-23.55],['Seattle','United States',-122.33,47.61],['Seoul','South Korea',126.98,37.57],
  ['Seville','Spain',-5.99,37.39],['Shanghai','China',121.47,31.23],['Singapore','Singapore',103.85,1.29],
  ['Stockholm','Sweden',18.07,59.33],['Sydney','Australia',151.21,-33.87],['Taipei','Taiwan',121.56,25.03],
  ['Tel Aviv','Israel',34.78,32.09],['Tokyo','Japan',139.69,35.69],['Toronto','Canada',-79.38,43.65],
  ['Vancouver','Canada',-123.12,49.28],['Venice','Italy',12.32,45.44],['Vienna','Austria',16.37,48.21],
  ['Warsaw','Poland',21.01,52.23],['Washington','United States',-77.04,38.91],['Zurich','Switzerland',8.54,47.37],
  ['Accra','Ghana',-0.19,5.60],['Addis Ababa','Ethiopia',38.75,9.02],['Anchorage','United States',-149.90,61.22],
  ['Bali (Denpasar)','Indonesia',115.22,-8.65],['Belgrade','Serbia',20.46,44.79],['Bergen','Norway',5.32,60.39],
  ['Bilbao','Spain',-2.93,43.26],['Bordeaux','France',-0.58,44.84],['Bruges','Belgium',3.22,51.21],
  ['Busan','South Korea',129.08,35.18],['Cancún','Mexico',-86.85,21.16],['Cartagena','Colombia',-75.48,10.39],
  ['Casablanca','Morocco',-7.59,33.57],['Chiang Mai','Thailand',98.99,18.79],['Cusco','Peru',-71.97,-13.53],
  ['Dubrovnik','Croatia',18.09,42.65],['Fes','Morocco',-4.98,34.03],['Fukuoka','Japan',130.40,33.59],
  ['Galway','Ireland',-9.05,53.27],['Gothenburg','Sweden',11.97,57.71],['Granada','Spain',-3.60,37.18],
  ['Hamburg','Germany',9.99,53.55],['Hoi An','Vietnam',108.33,15.88],['Innsbruck','Austria',11.40,47.27],
  ['Interlaken','Switzerland',7.87,46.69],['Jaipur','India',75.79,26.91],['Kathmandu','Nepal',85.32,27.72],
  ['Kraków','Poland',19.94,50.06],['Kuala Lumpur','Malaysia',101.69,3.14],['Kyiv','Ukraine',30.52,50.45],
  ['Lyon','France',4.84,45.76],['Manila','Philippines',120.98,14.60],['Medellín','Colombia',-75.56,6.25],
  ['Mendoza','Argentina',-68.83,-32.89],['Nagano','Japan',138.19,36.65],['Oaxaca','Mexico',-96.73,17.07],
  ['Palermo','Italy',13.36,38.12],['Phuket','Thailand',98.39,7.88],['Porto Alegre','Brazil',-51.23,-30.03],
  ['Portland','United States',-122.68,45.52],['Queenstown','New Zealand',168.66,-45.03],['Quito','Ecuador',-78.47,-0.18],
  ['Rotterdam','Netherlands',4.48,51.92],['Salt Lake City','United States',-111.89,40.76],['Salzburg','Austria',13.05,47.81],
  ['San Sebastián','Spain',-1.98,43.32],['Santorini (Thira)','Greece',25.43,36.42],['Sapporo','Japan',141.35,43.06],
  ['Sarajevo','Bosnia and Herzegovina',18.41,43.86],['Savannah','United States',-81.10,32.08],['Siem Reap','Cambodia',103.86,13.36],
  ['Split','Croatia',16.44,43.51],['Tbilisi','Georgia',44.79,41.72],['Tromsø','Norway',18.96,69.65],
  ['Tulum','Mexico',-87.47,20.21],['Ubud','Indonesia',115.26,-8.51],['Valencia','Spain',-0.38,39.47],
  ['Valparaíso','Chile',-71.62,-33.05],['Wellington','New Zealand',174.78,-41.29],['Zermatt','Switzerland',7.75,46.02],
];

// Filter helper: matches city or country, returns top results.
export function suggestCities(query, limit = 5) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts = [];
  const contains = [];
  for (const c of CITY_LIST) {
    const name = c[0].toLowerCase();
    const country = c[1].toLowerCase();
    if (name.startsWith(q)) starts.push(c);
    else if (name.includes(q) || country.startsWith(q)) contains.push(c);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

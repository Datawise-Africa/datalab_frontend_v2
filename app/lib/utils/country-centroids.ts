/**
 * Approximate country centroids (lat, lng) and ISO-3166-1 alpha-2 codes.
 * Used to plot per-country analytics on the world map.
 *
 * Focused on African countries (most platform data is Africa-centric) plus
 * common partner regions. Names match what the backend returns from
 * `/dataset-analytics/{id}/geography/`.
 *
 * Lookup is case-insensitive — use `getCountryCentroid()`.
 */

export interface CountryCentroid {
  code: string;
  lat: number;
  lng: number;
}

const ENTRIES: Record<string, CountryCentroid> = {
  // ── Africa ──
  Algeria: { code: 'DZ', lat: 28.0339, lng: 1.6596 },
  Angola: { code: 'AO', lat: -11.2027, lng: 17.8739 },
  Benin: { code: 'BJ', lat: 9.3077, lng: 2.3158 },
  Botswana: { code: 'BW', lat: -22.3285, lng: 24.6849 },
  'Burkina Faso': { code: 'BF', lat: 12.2383, lng: -1.5616 },
  Burundi: { code: 'BI', lat: -3.3731, lng: 29.9189 },
  Cameroon: { code: 'CM', lat: 7.3697, lng: 12.3547 },
  'Cabo Verde': { code: 'CV', lat: 16.5388, lng: -23.0418 },
  'Cape Verde': { code: 'CV', lat: 16.5388, lng: -23.0418 },
  'Central African Republic': { code: 'CF', lat: 6.6111, lng: 20.9394 },
  Chad: { code: 'TD', lat: 15.4542, lng: 18.7322 },
  Comoros: { code: 'KM', lat: -11.6455, lng: 43.3333 },
  Congo: { code: 'CG', lat: -0.228, lng: 15.8277 },
  'Republic of the Congo': { code: 'CG', lat: -0.228, lng: 15.8277 },
  'Democratic Republic of the Congo': {
    code: 'CD',
    lat: -4.0383,
    lng: 21.7587,
  },
  'DR Congo': { code: 'CD', lat: -4.0383, lng: 21.7587 },
  "Cote d'Ivoire": { code: 'CI', lat: 7.54, lng: -5.5471 },
  'Ivory Coast': { code: 'CI', lat: 7.54, lng: -5.5471 },
  Djibouti: { code: 'DJ', lat: 11.8251, lng: 42.5903 },
  Egypt: { code: 'EG', lat: 26.8206, lng: 30.8025 },
  'Equatorial Guinea': { code: 'GQ', lat: 1.6508, lng: 10.2679 },
  Eritrea: { code: 'ER', lat: 15.1794, lng: 39.7823 },
  Eswatini: { code: 'SZ', lat: -26.5225, lng: 31.4659 },
  Swaziland: { code: 'SZ', lat: -26.5225, lng: 31.4659 },
  Ethiopia: { code: 'ET', lat: 9.145, lng: 40.4897 },
  Gabon: { code: 'GA', lat: -0.8037, lng: 11.6094 },
  Gambia: { code: 'GM', lat: 13.4432, lng: -15.3101 },
  Ghana: { code: 'GH', lat: 7.9465, lng: -1.0232 },
  Guinea: { code: 'GN', lat: 9.9456, lng: -9.6966 },
  'Guinea-Bissau': { code: 'GW', lat: 11.8037, lng: -15.1804 },
  Kenya: { code: 'KE', lat: -0.0236, lng: 37.9062 },
  Lesotho: { code: 'LS', lat: -29.61, lng: 28.2336 },
  Liberia: { code: 'LR', lat: 6.4281, lng: -9.4295 },
  Libya: { code: 'LY', lat: 26.3351, lng: 17.2283 },
  Madagascar: { code: 'MG', lat: -18.7669, lng: 46.8691 },
  Malawi: { code: 'MW', lat: -13.2543, lng: 34.3015 },
  Mali: { code: 'ML', lat: 17.5707, lng: -3.9962 },
  Mauritania: { code: 'MR', lat: 21.0079, lng: -10.9408 },
  Mauritius: { code: 'MU', lat: -20.3484, lng: 57.5522 },
  Morocco: { code: 'MA', lat: 31.7917, lng: -7.0926 },
  Mozambique: { code: 'MZ', lat: -18.6657, lng: 35.5296 },
  Namibia: { code: 'NA', lat: -22.9576, lng: 18.4904 },
  Niger: { code: 'NE', lat: 17.6078, lng: 8.0817 },
  Nigeria: { code: 'NG', lat: 9.082, lng: 8.6753 },
  Rwanda: { code: 'RW', lat: -1.9403, lng: 29.8739 },
  'Sao Tome and Principe': { code: 'ST', lat: 0.1864, lng: 6.6131 },
  Senegal: { code: 'SN', lat: 14.4974, lng: -14.4524 },
  Seychelles: { code: 'SC', lat: -4.6796, lng: 55.492 },
  'Sierra Leone': { code: 'SL', lat: 8.4606, lng: -11.7799 },
  Somalia: { code: 'SO', lat: 5.1521, lng: 46.1996 },
  'South Africa': { code: 'ZA', lat: -30.5595, lng: 22.9375 },
  'South Sudan': { code: 'SS', lat: 6.877, lng: 31.307 },
  Sudan: { code: 'SD', lat: 12.8628, lng: 30.2176 },
  Tanzania: { code: 'TZ', lat: -6.369, lng: 34.8888 },
  Togo: { code: 'TG', lat: 8.6195, lng: 0.8248 },
  Tunisia: { code: 'TN', lat: 33.8869, lng: 9.5375 },
  Uganda: { code: 'UG', lat: 1.3733, lng: 32.2903 },
  Zambia: { code: 'ZM', lat: -13.1339, lng: 27.8493 },
  Zimbabwe: { code: 'ZW', lat: -19.0154, lng: 29.1549 },

  // ── Common partner regions ──
  'United States': { code: 'US', lat: 37.0902, lng: -95.7129 },
  USA: { code: 'US', lat: 37.0902, lng: -95.7129 },
  'United Kingdom': { code: 'GB', lat: 55.3781, lng: -3.436 },
  UK: { code: 'GB', lat: 55.3781, lng: -3.436 },
  Canada: { code: 'CA', lat: 56.1304, lng: -106.3468 },
  Germany: { code: 'DE', lat: 51.1657, lng: 10.4515 },
  France: { code: 'FR', lat: 46.2276, lng: 2.2137 },
  Netherlands: { code: 'NL', lat: 52.1326, lng: 5.2913 },
  Belgium: { code: 'BE', lat: 50.5039, lng: 4.4699 },
  Spain: { code: 'ES', lat: 40.4637, lng: -3.7492 },
  Italy: { code: 'IT', lat: 41.8719, lng: 12.5674 },
  Sweden: { code: 'SE', lat: 60.1282, lng: 18.6435 },
  Switzerland: { code: 'CH', lat: 46.8182, lng: 8.2275 },
  India: { code: 'IN', lat: 20.5937, lng: 78.9629 },
  China: { code: 'CN', lat: 35.8617, lng: 104.1954 },
  Japan: { code: 'JP', lat: 36.2048, lng: 138.2529 },
  Brazil: { code: 'BR', lat: -14.235, lng: -51.9253 },
  Australia: { code: 'AU', lat: -25.2744, lng: 133.7751 },
};

const NORMALIZED = new Map<string, CountryCentroid>(
  Object.entries(ENTRIES).map(([name, value]) => [name.toLowerCase(), value])
);

export function getCountryCentroid(
  name: string | null | undefined
): CountryCentroid | null {
  if (!name) return null;
  return NORMALIZED.get(name.trim().toLowerCase()) ?? null;
}

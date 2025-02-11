import fetch from 'node-fetch';

const API_URL = 'https://uvdata.arpansa.gov.au/api/uvlevel/';

// City to coordinates mapping (AEDT timezone cities)
const CITY_COORDINATES = {
    // ACT
    'canberra': { latitude: -35.31, longitude: 149.2 },
    // NSW
    'newcastle': { latitude: -32.9, longitude: 151.72 },
    'sydney': { latitude: -34.04, longitude: 151.1 },
    // NT
    'alice springs': { latitude: -23.8, longitude: 133.89 },
    'darwin': { latitude: -12.43, longitude: 130.89 },
    // QLD
    'brisbane': { latitude: -27.45, longitude: 153.03 },
    'emerald': { latitude: -23.5251, longitude: 148.161346 },
    'gold coast': { latitude: -28, longitude: 153.37 },
    'townsville': { latitude: -19.33, longitude: 146.76 },
    // SA
    'adelaide': { latitude: -34.95, longitude: 138.52 },
    // TAS
    'kingston': { latitude: -42.99, longitude: 147.29 },
    // VIC
    'melbourne': { latitude: -37.73, longitude: 145.1 },
    // WA
    'perth': { latitude: -31.93, longitude: 115.98 },
    // Antarctica
    'casey': { latitude: -66.28, longitude: 110.53 },
    'davis': { latitude: -68.58, longitude: 77.97 },
    'macquarie island': { latitude: -54.5, longitude: 158.94 },
    'mawson': { latitude: -67.6, longitude: 62.87 }
};

/**
 * Get coordinates for city name
 * @param {string} location - City name
 * @returns {{ longitude: number, latitude: number }}
 */
const resolveCoordinates = (location) => {
    if (typeof location === 'string') {
        const city = location.trim().toLowerCase();
        if (!CITY_COORDINATES[city]) {
            throw new Error(`Unsupported city. Available: ${Object.keys(CITY_COORDINATES).join(', ')}`);
        }
        return CITY_COORDINATES[city];
    }

    throw new Error('Invalid location. Use city name as a string');
};

/**
 * Validate and format date input
 * @param {Date} date
 * @returns {string} YYYY-MM-DD
 */
const validateAndFormatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date. Must be a valid Date object');
    }

    // Get local date components (need to do this to avoid things getting screwed by timezones...)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;  // Months are 0-indexed
    const day = date.getDate();

    // Format with leading zeros and combine
    return [
        year.toString(),
        month.toString().padStart(2, '0'),
        day.toString().padStart(2, '0')
    ].join('-');
};

/**
 * Transform API response into cleaner format
 * @param {Array} graphData
 * @returns {Array}
 */
const transformData = (graphData) => {
    return graphData.map(entry => ({
        timestamp: entry.Date,
        forecast: entry.Forecast,
        measured: entry.Measured
    }));
};

/**
 * Fetch UV data by city name
 * @param {Object} options - { location: string, date: Date }
 * @returns {Promise<Array>}
 */
export default async function fetchUVData({ location, date }) {
    const coords = resolveCoordinates(location);
    const formattedDate = validateAndFormatDate(date);

    const params = new URLSearchParams({
        longitude: coords.longitude.toString(),
        latitude: coords.latitude.toString(),
        date: formattedDate
    });

    try {
        const response = await fetch(`${API_URL}?${params}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return transformData(data.GraphData);
    } catch (error) {
        throw new Error(`UV data fetch failed: ${error.message}`);
    }
}

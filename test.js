import test from 'ava';
import fetchUVData from './index.js';
import { setTimeout } from 'node:timers/promises';

// Delay between requests
const DELAY = 2000;

const TEST_CITIES = [
    'Canberra',
    'neWcastle',
    'SYDNEY',
    'alice springs   ',
    ' darwin ',
    'brisbane',
    'emerald',
    'gold coast',
    'townsville',
    'adelaide',
    'kingston',
    'melbourne',
    'perth',
    'casey',
    'davis',
    'macquarie island',
    'mawson',
];

// Basic validation tests
test('throws error for invalid city', async t => {
    await t.throwsAsync(
        async () => {
            await fetchUVData({ location: 'fake place', date: new Date() });
        },
        {
            message: 'Unsupported city. Available: canberra, newcastle, sydney, alice springs, darwin, brisbane, emerald, gold coast, townsville, adelaide, kingston, melbourne, perth, casey, davis, macquarie island, mawson'
        }
    );
});

test('throws error for invalid date', async t => {
    await t.throwsAsync(async () => {
        await fetchUVData({ location: 'Sydney', date: 'invalid' });
    }, {
        message: 'Invalid date. Must be a valid Date object'
    }
    );
});

TEST_CITIES.forEach(city => {
    test.serial(`fetches data for ${city}`, async t => {
        const lastWeekDate = new Date();
        lastWeekDate.setDate(new Date().getDate() - 7);

        const result = await fetchUVData({
            location: city,
            date: lastWeekDate
        });

        // Basic response validation
        t.true(Array.isArray(result), 'Should return an array');
        t.true(result.length >= 14 * 60, 'Should have 14 hours of data');

        // Validate entry structure
        for (const sample of result) {
            t.true('timestamp' in sample, 'Should have timestamp');
            t.true('forecast' in sample, 'Should have forecast');
            t.true('measured' in sample, 'Should have measured');

            // Validate timestamp format (YYYY-MM-DD HH:mm)
            t.regex(sample.timestamp, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);

            // Validate numbers
            t.true(typeof sample.forecast === 'number', 'Forecast should be number');
            t.true(typeof sample.measured === 'number', 'Measured should be number');
            t.true(sample.forecast >= 0 && sample.forecast <= 16, 'Forecast should be between 0 and 16');
        }

        // Rate limit delay
        await setTimeout(DELAY);
    });
});

test.serial('fetches historical data', async t => {
    const result = await fetchUVData({
        location: 'Canberra',
        date: new Date('2024-01-01')
    });

    t.true(result.length >= 14 * 60, 'Should have 14 hours of data');
    t.is(result[0].timestamp, '2024-01-01 06:00');

    await setTimeout(DELAY);
});

test.serial('handles antarctic stations', async t => {
    const result = await fetchUVData({
        location: 'Casey',
        date: new Date()
    });

    t.true(result.length >= 14 * 60, 'Should return data');
    await setTimeout(DELAY);
});

test.serial('handles dates from before data available', async t => {
    const result = await fetchUVData({
        location: 'Brisbane',
        date: new Date(2015, 0, 1)
    });

    t.true(result.length >= 14 * 60, 'Should return data');
    t.is(result[0].timestamp, '2015-01-01 06:00');
    t.is(result[0].forecast, null);
    t.is(result[0].measured, null);

    await setTimeout(DELAY);
});

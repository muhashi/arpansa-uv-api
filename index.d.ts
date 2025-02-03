/**
Fetches UV data from ARPANSA API
@param options Request parameters
@returns Array of UV data entries

@example
```
import fetchUVData from './index.js';

await fetchUVData({
    location: 'Sydney',
    date: new Date(2024, 11, 1)
});
//=> [
  {
    timestamp: '2025-02-02 06:00',
    forecast: 0.450479984,
    measured: 0.5214388
  },
  {
    timestamp: '2025-02-02 06:01',
    forecast: 0.456480026,
    measured: 0.5285755
  },
  ...
]
```
*/
export default function fetchUVData(options: {
    /**
    City name (case-insensitive) from supported locations
    @example 'Sydney', 'Melbourne', 'Casey'
    */
    location: string;

    /**
    Date for which to retrieve UV data
    */
    date: Date;
}): Promise<Array<{
    /**
    Timestamp in local Australian time (format: "YYYY-MM-DD HH:mm")
    @example "2024-12-01 06:00"
    */
    timestamp: string;

    /**
    Forecast UV index value (may be null for future dates or dates before data is available)
    */
    forecast: number;

    /**
    Measured UV index value (may be null for future dates or dates before data is available)
    */
    measured: number;
}>>;

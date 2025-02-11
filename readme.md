# arpansa-uv-data

> Get UV index data from ARPANSA for multiple locations in Australia and Antarctica

## Install

```sh
npm install arpansa-uv-data
```

## Usage

```js
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

## API

### fetchUVData(options)

#### options

Type: `object`

##### location

Type: `string`

City name (case-insensitive) from supported locations.

The following locations are supported:
```js
[
    // ACT
    'canberra',
    // NSW
    'newcastle',
    'sydney',
    // NT
    'alice springs',
    'darwin',
    // QLD
    'brisbane',
    'emerald',
    'gold coast',
    'townsville',
    // SA
    'adelaide',
    // TAS
    'kingston',
    // VIC
    'melbourne',
    // WA
    'perth',
    // Antarctica
    'casey',
    'davis',
    'macquarie island',
    'mawson'
]
```

##### date

Type: `Date`

Date for which to retrieve UV data. Will retrieve the data on the same date in the locale the data is being retrieved from.

For example, if the input date is 2023-01-01, the data returned from Sydney will be from 2023-01-01 Sydney time.

#### output

Returns a list of forecasted and measured UV indexes in the format:

```js
[
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

Timestamps are in the local time of the location the data is being retrieved from. Data begins from `2016-11-01`, missing data / future dates will return null for both forecast and measured UV indexes.

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
```json
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

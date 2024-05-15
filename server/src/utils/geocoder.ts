import nodeFetch from 'node-fetch';

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  fetch: function fetch(url: any, options: any) {
    return nodeFetch(url, {
      ...options,
      headers: {
        'user-agent': 'JobBoardApp/1.0 (OpenStreetMap Integration)',
      },
    });
  },
};

const geocoder = NodeGeocoder(options);

export { geocoder };

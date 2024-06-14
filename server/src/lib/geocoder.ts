import { Job } from '@/api/jobs/jobs.model.js';
import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  fetch: function customFetch(url: any, options: any) {
    return fetch(url, {
      ...options,
      headers: {
        'user-agent': 'JobBoardApp/1.0 (OpenStreetMap Integration)',
      },
    });
  },
};
// @ts-expect-error NodeGeocoder expects node-fetch as a dependency but I'm using native fetch API
const geocoder = NodeGeocoder(options);

const validateAndGeocodeAddress = async (address: Job['address']) => {
  const location = await geocoder.geocode(address);
  if (!location || location.length === 0) {
    return null;
  }

  return {
    type: 'Point',
    coordinates: [location[0].longitude, location[0].latitude],
    streetNumber: location[0].streetNumber,
    street: location[0].streetName,
    formattedAddress: location[0].formattedAddress,
    city: location[0].city,
    state: location[0].state,
    postcode: location[0].zipcode,
    country: location[0].country,
    countryCode: location[0].countryCode,
  };
};

export { validateAndGeocodeAddress };

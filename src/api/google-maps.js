import Vue from 'vue';
import { gmapApi } from 'vue2-google-maps';

const cache = {};

export async function getGoogleApi() {
  await Vue.$gmapApiPromiseLazy();
  return gmapApi();
}

async function getService(name, factory) {
  if (cache[name]) {
    return cache[name];
  }
  const google = await getGoogleApi();
  const service = factory(google);
  cache[name] = service;
  return service;
}

export async function getPlacesService() {
  return getService(
    'places',
    (google) =>
      new google.maps.places.PlacesService(document.createElement('div'))
  );
}

export const PLACE_RESULT_FIELDS = [
  'place_id',
  'name',
  'vicinity',
  'formatted_address',
  'geometry.location',
  'business_status',
  'photos',
];

export async function getPlaceDetails(placeId) {
  const service = await getPlacesService();
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: PLACE_RESULT_FIELDS,
      },
      (placeDetails, error) => {
        if (error && error !== 'OK') {
          reject(error);
        } else {
          resolve(placeDetails);
        }
      }
    );
  });
}

export async function nearbySearch({ lat, lng }) {
  const google = await getGoogleApi();
  const service = await getPlacesService();
  return new Promise((resolve, reject) => {
    service.nearbySearch(
      {
        location: {
          lat,
          lng,
        },
        // radius: 5000,
        type: 'supermarket',
        rankBy: google.maps.places.RankBy.DISTANCE,
      },
      (nearbyPlaces, status) => {
        if (status == 'OK') {
          resolve(nearbyPlaces);
        } else {
          reject(status);
        }
      }
    );
  });
}

async function getGeocoder() {
  return getService('geocoder', (google) => new google.maps.Geocoder());
}

export async function geocode(req) {
  const geocoder = await getGeocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode(req, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0]);
      } else {
        reject(status);
      }
    });
  });
}

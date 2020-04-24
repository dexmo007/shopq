import Vue from 'vue';
import { gmapApi } from 'vue2-google-maps';

const cache = {};

export async function getGoogleApi() {
  await Vue.$gmapApiPromiseLazy();
  return gmapApi();
}

export async function getPlacesService() {
  if (cache.places) {
    return cache.places;
  }
  const google = await getGoogleApi();
  cache.places = new google.maps.places.PlacesService(
    document.createElement('div')
  );
  return cache.places;
}

export async function getPlaceDetails(placeId) {
  const service = await getPlacesService();
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
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
  if (cache.geocoder) {
    return cache.geocoder;
  }
  const google = await getGoogleApi();
  cache.geocoder = new google.maps.Geocoder();
  return cache.geocoder;
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

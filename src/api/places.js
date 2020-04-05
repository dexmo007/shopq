import Vue from 'vue';
import { gmapApi } from 'vue2-google-maps';

const cache = {};

async function getPlacesService() {
  if (cache.places) {
    return cache.places;
  }
  await Vue.$gmapApiPromiseLazy();
  const google = gmapApi();
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
        if (error) {
          reject(error);
        } else {
          resolve(placeDetails);
        }
      }
    );
  });
}

import ApiService from '../framework/api-service.js';

export default class BigTripApiService extends ApiService {
  getPoints() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(ApiService.parseResponse);
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }).then(ApiService.parseResponse);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'DELETE'
    });
  }

  /* eslint-disable camelcase */
  #adaptToServer(point) {
    return {
      base_price: Number(point.basePrice),
      date_from: new Date(point.dateFrom).toISOString(),
      date_to: new Date(point.dateTo).toISOString(),
      destination: point.destination,
      is_favorite: point.isFavorite,
      offers: point.offers,
      type: point.type
    };
  }

  /* eslint-enable camelcase */
}

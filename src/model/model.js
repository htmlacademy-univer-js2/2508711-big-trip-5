import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = {};
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#apiService.getPoints(),
        this.#apiService.getDestinations(),
        this.#apiService.getOffers()
      ]);

      this.#points = points.map(this.#adaptPointFromServer);
      this.#destinations = destinations;
      this.#offers = this.#formatOffers(offers);
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = {};
    }

    this._notify(UpdateType.MAJOR);
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getPointById(id) {
    return this.#points.find((point) => point.id === id);
  }

  async updatePoint(updateType, update) {
    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptPointFromServer(response);
      const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

      if (index === -1) {
        throw new Error('Point not found');
      }

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Cannot update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptPointFromServer(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Cannot add point');
    }
  }

  async deletePoint(updateType, update) {
    try {
      await this.#apiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Cannot delete point');
    }
  }

  #adaptPointFromServer(point) {
    return {
      id: point.id,
      basePrice: point.base_price ?? 0,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      destination: point.destination,
      isFavorite: point.is_favorite ?? false,
      offers: Array.isArray(point.offers) ? point.offers : [],
      type: point.type
    };
  }

  #formatOffers(offers) {
    return offers.reduce((acc, offerGroup) => {
      acc[offerGroup.type] = offerGroup.offers;
      return acc;
    }, {});
  }
}

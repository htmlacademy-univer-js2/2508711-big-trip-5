import { generateDestinations, generateOffers, generatePoints } from '../mock/mock.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    super();
    this.#destinations = generateDestinations();
    this.#offers = generateOffers();
    this.#points = generatePoints(this.#destinations);
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  getPointById(id) {
    return this.#points.find((point) => point.id === id) || null;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Point not found');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [update, ...this.#points];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }
}

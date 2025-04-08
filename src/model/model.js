import { generateDestinations, generateOffers, generatePoints } from '../mock/mock.js';

export default class Model {
  constructor() {
    this.destinations = generateDestinations();
    this.offers = generateOffers();
    this.points = generatePoints(this.destinations);
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getPoints() {
    return this.points;
  }

  getPointById(id) {
    return this.points.find((point) => point.id === id);
  }

  updatePoint(updatedPoint) {
    const index = this.points.findIndex((point) => point.id === updatedPoint.id);
    if (index === -1) {
      throw new Error(`Can't update unexisting point with id: ${updatedPoint.id}`);
    }

    this.points[index] = updatedPoint;
  }
}

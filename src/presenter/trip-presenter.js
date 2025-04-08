import { render, replace } from '../framework/render.js';
import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';
import Model from '../model/model.js';

export default class TripPresenter {
  #model = new Model();
  #listContainer = null;
  #pointComponents = new Map();
  #formEditComponents = new Map();

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderList();
    this.#renderPoints();
  }

  #renderFilters() {
  }

  #renderSort() {
  }

  #renderList() {
    const container = document.querySelector('.trip-events');
    const listElement = document.createElement('ul');
    listElement.classList.add('trip-events__list');
    container.appendChild(listElement);
    this.#listContainer = listElement;
  }

  #renderPoints() {
    const points = this.#model.getPoints();
    const destinations = this.#model.getDestinations();
    const offers = this.#model.getOffers();

    points.forEach((point) => {
      this.#renderPoint(point, destinations, offers);
    });
  }

  #renderPoint(point, destinations, offers) {
    const pointComponent = new PointView(
      point,
      destinations,
      offers,
      (p) => this.#handlePointEditClick(p),
      (p) => this.#handleFavoriteClick(p)
    );

    render(pointComponent, this.#listContainer);
    this.#pointComponents.set(point.id, pointComponent);
  }

  #handlePointEditClick = (point) => {
    this.#replacePointToForm(point);
  };

  #handleFormEditSubmit = (point) => {
    this.#replaceFormToPoint(point);
  };

  #handleFormEditClose = (point) => {
    this.#replaceFormToPoint(point);
  };

  #handleFavoriteClick = (point) => {
    this.#model.updatePoint(point);
    this.#pointComponents.get(point.id).updateElement(point);
  };

  #replacePointToForm(point) {
    const pointComponent = this.#pointComponents.get(point.id);
    const formEditComponent = new FormEditView(
      point,
      this.#model.getDestinations(),
      this.#model.getOffers(),
      (p) => this.#handleFormEditSubmit(p),
      (p) => this.#handleFormEditClose(p)
    );

    replace(formEditComponent, pointComponent);
    this.#pointComponents.delete(point.id);
    this.#formEditComponents.set(point.id, formEditComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint(point) {
    const formEditComponent = this.#formEditComponents.get(point.id);
    const pointComponent = new PointView(
      point,
      this.#model.getDestinations(),
      this.#model.getOffers(),
      (p) => this.#handlePointEditClick(p),
      (p) => this.#handleFavoriteClick(p)
    );

    replace(pointComponent, formEditComponent);
    this.#formEditComponents.delete(point.id);
    this.#pointComponents.set(point.id, pointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      const [pointId] = [...this.#formEditComponents.keys()];
      this.#handleFormEditClose(this.#model.getPointById(pointId));
    }
  };
}

import { render, replace } from '../framework/render.js';
import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';
import Model from '../model/model.js';
import EmptyListView from '../view/empty-list-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';

export default class TripPresenter {
  #model = new Model();
  #listContainer = null;
  #pointComponents = new Map();
  #formEditComponents = new Map();

  #currentFilter = 'everything';

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderList();
    this.#renderPoints();
  }

  #renderFilters() {
    const filters = [
      { type: 'everything', name: 'Everything', isDisabled: false, isChecked: this.#currentFilter === 'everything' },
      { type: 'future', name: 'Future', isDisabled: false, isChecked: this.#currentFilter === 'future' },
      { type: 'present', name: 'Present', isDisabled: true, isChecked: this.#currentFilter === 'present' },
      { type: 'past', name: 'Past', isDisabled: false, isChecked: this.#currentFilter === 'past' }
    ];

    const container = document.querySelector('.trip-controls__filters');
    const filtersView = new FiltersView(filters);
    render(filtersView, container);

    filtersView.element.addEventListener('change', (evt) => {
      if (evt.target.name === 'trip-filter') {
        this.#filterChangeHandler(evt.target.id.replace('filter-', ''));
      }
    });
  }

  #filterChangeHandler = (filterType) => {
    this.#currentFilter = filterType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #renderSort() {
    const sorts = [
      { type: 'day', name: 'Day', isChecked: true },
      { type: 'price', name: 'Price', isChecked: false }
    ];

    const container = document.querySelector('.trip-events');
    render(new SortView(sorts), container);
  }

  #renderList() {
    const container = document.querySelector('.trip-events');
    const listElement = document.createElement('ul');
    listElement.classList.add('trip-events__list');
    container.appendChild(listElement);
    this.#listContainer = listElement;
  }

  #clearPoints() {
    this.#pointComponents.forEach((component) => component.element.remove());
    this.#pointComponents.clear();
  }

  #getFilteredPoints() {
    const points = this.#model.getPoints();

    switch (this.#currentFilter) {
      case 'everything':
        return points;
      case 'future':
        return points.filter((point) => new Date(point.date) > new Date());
      case 'past':
        return points.filter((point) => new Date(point.date) < new Date());
      case 'present':
        return [];
      default:
        return points;
    }
  }

  #renderPoints() {
    this.#listContainer.innerHTML = '';

    const points = this.#getFilteredPoints();
    const destinations = this.#model.getDestinations();
    const offers = this.#model.getOffers();

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    points.forEach((point) => {
      this.#renderPoint(point, destinations, offers);
    });
  }

  #renderEmptyList() {
    const emptyComponent = new EmptyListView();
    render(emptyComponent, this.#listContainer);
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

import { render } from '../framework/render.js';
import Model from '../model/model.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #model = new Model();
  #listContainer = null;
  #filtersComponent = null;
  #sortComponent = null;
  #emptyListComponent = null;

  #pointPresenters = new Map();

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
    this.#filtersComponent = new FiltersView(filters);
    render(this.#filtersComponent, container);

    this.#filtersComponent.element.addEventListener('change', (evt) => {
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
    this.#sortComponent = new SortView(sorts);
    render(this.#sortComponent, container);
  }

  #renderList() {
    const container = document.querySelector('.trip-events');
    const listElement = document.createElement('ul');
    listElement.classList.add('trip-events__list');
    container.appendChild(listElement);
    this.#listContainer = listElement;
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #getFilteredPoints() {
    const points = this.#model.getPoints();

    switch (this.#currentFilter) {
      case 'everything':
        return points;
      case 'future':
        return points.filter((point) => new Date(point.dateFrom) > new Date());
      case 'past':
        return points.filter((point) => new Date(point.dateFrom) < new Date());
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
      const pointPresenter = new PointPresenter(
        this.#listContainer,
        this.#handleDataChange,
        this.#handleModeChange,
        destinations,
        offers
      );

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView();
    render(this.#emptyListComponent, this.#listContainer);
  }

  #handleDataChange = (updatedPoint) => {
    this.#model.updatePoint(updatedPoint);
    const presenter = this.#pointPresenters.get(updatedPoint.id);
    presenter.init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

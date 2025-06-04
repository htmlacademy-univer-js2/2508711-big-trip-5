import { render, remove, replace } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import dayjs from 'dayjs';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #model = null;
  #filterModel = null;
  #listContainer = null;
  #filtersComponent = null;
  #sortComponent = null;
  #emptyListComponent = null;
  #newPointButton = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #isCreating = false;
  #editingPresenter = null;

  constructor({ model, filterModel, newPointButton }) {
    this.#model = model;
    this.#filterModel = filterModel;
    this.#newPointButton = newPointButton;

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (this.#newPointButton) {
      this.#newPointButton.addEventListener('click', this.#newPointButtonClickHandler);
    }
  }

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderList();
    this.#renderPoints();
  }

  #renderFilters() {
    const filters = this.#getFilters();
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, document.querySelector('.trip-controls__filters'));
    } else {
      replace(this.#filtersComponent, prevFiltersComponent);
      remove(prevFiltersComponent);
    }
  }

  #getFilters() {
    const points = this.#model.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        isDisabled: points.length === 0
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        isDisabled: filter[FilterType.FUTURE](points).length === 0
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        isDisabled: filter[FilterType.PRESENT](points).length === 0
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        isDisabled: filter[FilterType.PAST](points).length === 0
      }
    ];
  }

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (prevSortComponent === null) {
      render(this.#sortComponent, document.querySelector('.trip-events'));
    } else {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    }
  }

  #renderList() {
    const container = document.querySelector('.trip-events');
    const listElement = document.createElement('ul');
    listElement.classList.add('trip-events__list');
    container.appendChild(listElement);
    this.#listContainer = listElement;
  }

  #renderPoints() {
    const points = this.#getSortedFilteredPoints();
    const destinations = this.#model.destinations;
    const offers = this.#model.offers;

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: this.#listContainer,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
        destinations,
        offers
      });
      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
    render(this.#emptyListComponent, this.#listContainer);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#emptyListComponent);
  }

  #getSortedFilteredPoints() {
    const filteredPoints = filter[this.#filterModel.filter](this.#model.points);
    const sortedPoints = [...filteredPoints];

    switch (this.#currentSortType) {
      case SortType.PRICE:
        sortedPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case SortType.TIME:
        sortedPoints.sort((a, b) => {
          const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
          const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
          return durationB - durationA;
        });
        break;
      case SortType.DAY:
      default:
        sortedPoints.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
    }

    return sortedPoints;
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    this.#currentSortType = SortType.DAY;
    this.#clearPoints();
    this.#renderPoints();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#model.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#model.deletePoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this.#model.updatePoint(updateType, update);
        break;
    }

    this.#clearPoints();
    this.#renderPoints();
  };

  #handleModeChange = (activePresenter = null) => {
    this.#editingPresenter = activePresenter;

    if (this.#isCreating) {
      this.#isCreating = false;
      this.#newPointButton.disabled = false;
    }

    for (const presenter of this.#pointPresenters.values()) {
      if (presenter !== this.#editingPresenter) {
        presenter.resetView();
      }
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearPoints();
        this.#renderPoints();
        break;
    }
  };

  #newPointButtonClickHandler = () => {
    if (this.#isCreating) {
      return;
    }

    this.#isCreating = true;
    this.#newPointButton.disabled = true;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;

    const handleDestroy = () => {
      this.#isCreating = false;
      this.#newPointButton.disabled = false;
    };

    const pointPresenter = new PointPresenter({
      container: this.#listContainer,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      destinations: this.#model.destinations,
      offers: this.#model.offers,
      isCreating: true,
      handleDestroy
    });

    pointPresenter.init();
  };
}

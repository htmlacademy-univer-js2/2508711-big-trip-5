import { render, remove, replace } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import dayjs from 'dayjs';

import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #model = null;
  #filterModel = null;
  #listContainer = null;
  #filtersComponent = null;
  #sortComponent = null;
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();
  #tripInfoComponent = null;
  #newPointButton = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #isCreating = false;
  #editingPresenter = null;
  #isLoading = true;

  constructor({ model, filterModel, newPointButton }) {
    this.#model = model;
    this.#filterModel = filterModel;
    this.#newPointButton = newPointButton;

    const container = document.querySelector('.trip-events');
    if (!container) {
      throw new Error('Контейнер .trip-events не найден');
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, container, 'afterbegin');

    const listElement = document.createElement('ul');
    listElement.classList.add('trip-events__list');
    container.appendChild(listElement);
    this.#listContainer = listElement;

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (this.#newPointButton) {
      this.#newPointButton.addEventListener('click', this.#newPointButtonClickHandler);
    }
  }

  init() {
    this.#renderFilters();
    this.#renderTripInfo();
    render(this.#loadingComponent, this.#listContainer);
  }

  #renderFilters() {
    const filters = this.#getFilters();
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    const target = document.querySelector('.trip-controls__filters');

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, target);
    } else {
      replace(this.#filtersComponent, prevFiltersComponent);
      remove(prevFiltersComponent);
    }
  }

  #renderTripInfo() {
    const container = document.querySelector('.trip-main');

    const points = this.#model.points;
    const destinations = this.#model.destinations;
    const offers = this.#model.offers;

    if (points.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const sortedPoints = [...points].sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
    const startDate = dayjs(sortedPoints[0].dateFrom);
    const endDate = dayjs(sortedPoints[sortedPoints.length - 1].dateTo);

    const route = sortedPoints.map((point) => {
      const destination = destinations.find((d) => d.id === point.destination);
      return destination ? destination.name : '';
    }).filter(Boolean);

    let routeText = '';
    const uniqueCities = [...new Set(route)];

    if (uniqueCities.length > 3) {
      routeText = `${uniqueCities[0]} — ... — ${uniqueCities[uniqueCities.length - 1]}`;
    } else {
      routeText = uniqueCities.join(' — ');
    }

    const totalPrice = sortedPoints.reduce((sum, point) => {
      const pointOffersByType = offers[point.type] || [];
      const selectedOffers = pointOffersByType.filter((offer) => point.offers.includes(offer.id));
      const offersSum = selectedOffers.reduce((sumOffer, offer) => sumOffer + offer.price, 0);
      return sum + point.basePrice + offersSum;
    }, 0);

    const prevTripInfo = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView({
      route: routeText,
      startDate,
      endDate,
      totalPrice
    });

    if (prevTripInfo) {
      replace(this.#tripInfoComponent, prevTripInfo);
      remove(prevTripInfo);
    } else {
      render(this.#tripInfoComponent, container, 'afterbegin');
    }
  }

  #getFilters() {
    const points = this.#model.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: points.length,
        isDisabled: points.length === 0
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        count: filter[FilterType.FUTURE](points).length,
        isDisabled: filter[FilterType.FUTURE](points).length === 0
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        count: filter[FilterType.PRESENT](points).length,
        isDisabled: filter[FilterType.PRESENT](points).length === 0
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        count: filter[FilterType.PAST](points).length,
        isDisabled: filter[FilterType.PAST](points).length === 0
      }
    ];
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
    this.#renderTripInfo();
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

    this.#renderTripInfo();
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
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderTripInfo();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearPoints();
        this.#renderFilters();
        this.#renderTripInfo();
        this.#renderPoints();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilters();
        this.#renderTripInfo();
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

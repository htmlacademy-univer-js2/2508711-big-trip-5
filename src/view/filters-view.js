import AbstractView from '../framework/view/abstract-view.js';

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilterType = null;
  #handleFilterChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return `
      <form class="trip-filters">
        ${this.#filters.map((filter) => `
          <div class="trip-filters__filter">
            <input
              id="filter-${filter.type}"
              class="trip-filters__filter-input visually-hidden"
              type="radio"
              name="trip-filter"
              value="${filter.type}"
              ${this.#currentFilterType === filter.type ? 'checked' : ''}
              ${filter.isDisabled ? 'disabled' : ''}
            >
            <label class="trip-filters__filter-label" for="filter-${filter.type}">
              ${filter.name}
            </label>
          </div>
        `).join('')}
      </form>
    `;
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#handleFilterChange(evt.target.value);
    }
  };
}

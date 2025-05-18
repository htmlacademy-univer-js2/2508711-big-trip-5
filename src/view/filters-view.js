import AbstractView from '../framework/view/abstract-view.js';

export default class FiltersView extends AbstractView {
  #filters = [];

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return `
      <form class="trip-filters">
        ${this.#filters.map(({ type, name, isDisabled, isChecked }) => `
          <div class="trip-filters__filter">
            <input
              id="filter-${type}"
              class="trip-filters__filter-input visually-hidden"
              type="radio"
              name="trip-filter"
              value="${type}"
              ${isChecked ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
            >
            <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
          </div>
        `).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }
}

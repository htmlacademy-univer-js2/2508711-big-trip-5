import AbstractView from '../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  #sorts = [];
  #handleSortTypeChange = null;

  constructor(sorts, handleSortTypeChange) {
    super();
    this.#sorts = sorts;
    this.#handleSortTypeChange = handleSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return `
      <div class="trip-sort">
        ${this.#sorts.map(({ type, name, isChecked }) => `
          <div class="trip-sort__item">
            <input id="sort-${type}" type="radio" name="trip-sort" value="${type}" ${isChecked ? 'checked' : ''}>
            <label for="sort-${type}">${name}</label>
          </div>
        `).join('')}
      </div>
    `;
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.name === 'trip-sort') {
      this.#handleSortTypeChange(evt.target.value);
    }
  };
}

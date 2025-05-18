import AbstractView from '../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  #sorts = [];

  constructor(sorts) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return `
      <div class="trip-sort">
        ${this.#sorts.map(({ type, name, isChecked }) => `
          <div class="trip-sort__item">
            <input id="sort-${type}" type="radio" name="trip-sort" ${isChecked ? 'checked' : ''}>
            <label for="sort-${type}">${name}</label>
          </div>
        `).join('')}
      </div>
    `;
  }
}


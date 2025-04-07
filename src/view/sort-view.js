import AbstractView from '../framework/view/abstract-view.js';

export default class SortView extends AbstractView {
  get template() {
    return `
      <div class="trip-sort">
        <div class="trip-sort__item">
          <input id="sort-day" type="radio" name="trip-sort" checked>
          <label for="sort-day">Day</label>
        </div>
        <div class="trip-sort__item">
          <input id="sort-price" type="radio" name="trip-sort">
          <label for="sort-price">Price</label>
        </div>
      </div>
    `;
  }
}

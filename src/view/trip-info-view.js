import AbstractView from '../framework/view/abstract-view.js';
import { formatDate } from '../utils/date.js';

export default class TripInfoView extends AbstractView {
  #route = '';
  #startDate = null;
  #endDate = null;
  #totalPrice = 0;

  constructor({ route, startDate, endDate, totalPrice }) {
    super();
    this.#route = route;
    this.#startDate = startDate;
    this.#endDate = endDate;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${this.#route}</h1>
          <p class="trip-info__dates">
            ${formatDate(this.#startDate)}&nbsp;&mdash;&nbsp;${formatDate(this.#endDate)}
          </p>
        </div>
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.#totalPrice}</span>
        </p>
      </section>
    `;
  }
}

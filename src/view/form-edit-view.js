import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

export default class FormEditView extends AbstractStatefulView {
  constructor(point = {}, destinations = [], offersByType = []) {
    super();
    this._state = this.#parsePointToState(point, destinations, offersByType);
    this.#setInnerHandlers();
  }

  get template() {
    const { type, destination, dateFrom, dateTo, basePrice, offers } = this._state;

    return `
      <form class="event event--edit">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${this.#createOffersTemplate(offers)}
        </section>
      </form>
    `;
  }

  #parsePointToState = (point, destinations, offersByType) => ({
    ...point,
    destination: destinations.find((d) => d.id === point.destination) || { name: '' },
    offers: offersByType[point.type]?.filter((o) => point.offers.includes(o.id)) || []
  });

  #createOffersTemplate = (offers) => {
    if (!offers?.length) {
      return '';
    }

    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers.map((offer) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden"
                     id="event-offer-${offer.id}"
                     type="checkbox"
                     name="event-offer"
                     value="${offer.id}"
                     ${this._state.offers.includes(offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.id}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  };

  #setInnerHandlers = () => {
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };
}

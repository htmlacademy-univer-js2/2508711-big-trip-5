import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

export default class FormEditView extends AbstractStatefulView {
  constructor(point, destinations, offers, onFormSubmit, onFormClose, onFormDelete) {
    super();
    this._state = FormEditView.parsePointToState(point);
    this._destinations = destinations;
    this._offers = offers;

    this._onFormSubmit = onFormSubmit;
    this._onFormClose = onFormClose;
    this._onFormDelete = onFormDelete;

    this._setInnerHandlers();
    this._restoreHandlers();
  }

  get template() {
    const currentDestination = this._destinations.find((d) => d.id === this._state.destination);
    const currentOffers = this._offers[this._state.type] || [];

    return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._state.type}.png" alt="Event type icon">
            </label>
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${Object.keys(this._offers).map((type) => `
                  <div class="event__type-item">
                    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === this._state.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
                  </div>
                `).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${this._state.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${this._destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._state.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${currentOffers.map((offer) => `
                <div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer" value="${offer.id}" ${this._state.offers.includes(offer.id) ? 'checked' : ''}>
                  <label class="event__offer-label" for="${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                  </label>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination?.description || ''}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${(currentDestination?.pictures || []).map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
              </div>
            </div>
          </section>
        </section>
      </form>
    `;
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteHandler);
  }

  _setInnerHandlers() {
    this.element.querySelectorAll('input[name="event-type"]').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this._destinations.find((dest) => dest.name === evt.target.value);
    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      ...this._state,
      destination: selectedDestination.id
    });
  };

  #offersChangeHandler = () => {
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((input) => input.value);

    this._setState({
      ...this._state,
      offers: selectedOffers
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._onFormSubmit(FormEditView.parseStateToPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this._onFormClose();
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this._onFormDelete(FormEditView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    return { ...state };
  }
}

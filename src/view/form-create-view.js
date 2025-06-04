import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import { POINT_TYPES } from '../const.js';

export default class FormCreateView extends AbstractStatefulView {
  #flatpickrStart = null;
  #flatpickrEnd = null;
  #destinations = [];
  #offers = {};
  #handleFormSubmit = null;
  #handleFormClose = null;

  constructor({ destinations = [], offers = {}, onFormSubmit, onFormClose }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._state = this.#getDefaultState();
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;

    this._restoreHandlers();
  }

  #getDefaultState() {
    return {
      type: 'flight',
      destination: '',
      dateFrom: new Date(),
      dateTo: new Date(),
      basePrice: 0,
      offers: [],
      isFavorite: false
    };
  }

  get template() {
    const currentDestination = this.#destinations.find((d) => d.id === this._state.destination) || {};
    const currentOffers = this.#offers[this._state.type] || [];

    return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._state.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${POINT_TYPES.map((type) => `
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
            <select class="event__input event__input--destination" id="event-destination-1" name="event-destination" required>
              <option value="" disabled ${this._state.destination === '' ? 'selected' : ''}>Select destination</option>
              ${this.#destinations.map((dest) => `
                <option value="${dest.id}" ${this._state.destination === dest.id ? 'selected' : ''}>${dest.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start" value="${dayjs(this._state.dateFrom).format('DD/MM/YYYY HH:mm')}" required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end" value="${dayjs(this._state.dateTo).format('DD/MM/YYYY HH:mm')}" required>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${this._state.basePrice}" required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>

        <section class="event__details">
          ${currentOffers.length > 0 ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${currentOffers.map((offer) => `
                  <div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" value="${offer.id}" ${this._state.offers.includes(offer.id) ? 'checked' : ''}>
                    <label class="event__offer-label" for="event-offer-${offer.id}">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                    </label>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${currentDestination.description ? `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${currentDestination.description}</p>
              ${currentDestination.pictures?.length ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${currentDestination.pictures.map((pic) => `
                      <img class="event__photo" src="${pic.src}" alt="${pic.description}">
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
      </form>
    `;
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    const resetBtn = this.element.querySelector('.event__reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', this.#formCloseHandler);
    }
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.element.querySelectorAll('input[name="event-type"]').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelectorAll('.event__offer-checkbox')
      .forEach((checkbox) => checkbox.addEventListener('change', this.#offersChangeHandler));

    this.#initDatepickers();
  }

  #initDatepickers() {
    this.#flatpickrStart = flatpickr(
      this.element.querySelector('input[name="event-start"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        // eslint-disable-next-line camelcase
        time_24hr: true,
      }
    );

    this.#flatpickrEnd = flatpickr(
      this.element.querySelector('input[name="event-end"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        // eslint-disable-next-line camelcase
        time_24hr: true,
      }
    );
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedId = evt.target.value;
    this.updateElement({
      destination: selectedId
    });
  };

  #priceInputHandler = (evt) => {
    evt.target.value = evt.target.value.replace(/[^0-9]/g, '');
    this._state.basePrice = parseInt(evt.target.value, 10) || 0;
  };

  #offersChangeHandler = () => {
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((input) => input.value);

    this._setState({
      offers: selectedOffers
    });
  };

  #dateFromChangeHandler = ([date]) => {
    this._setState({
      dateFrom: date
    });
  };

  #dateToChangeHandler = ([date]) => {
    this._setState({
      dateTo: date
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const destinationSelect = this.element.querySelector('.event__input--destination');
    const selectedDestination = this.#destinations.find((d) => d.id === destinationSelect.value);

    if (!selectedDestination) {
      destinationSelect.setCustomValidity('Please select a destination from the list');
      destinationSelect.reportValidity();
      return;
    }

    this.#handleFormSubmit({
      ...this._state,
      destination: selectedDestination.id
    });
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  removeElement() {
    super.removeElement();

    if (this.#flatpickrStart) {
      this.#flatpickrStart.destroy();
      this.#flatpickrStart = null;
    }

    if (this.#flatpickrEnd) {
      this.#flatpickrEnd.destroy();
      this.#flatpickrEnd = null;
    }
  }
}

import AbstractView from '../framework/view/abstract-view.js';

function formatDate(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getDuration(dateFrom, dateTo) {
  const diff = dateTo - dateFrom;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes}M`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}H ${remainingMinutes}M`;
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor(point, destinations, offers, onEditClick, onFavoriteClick) {
    super();
    this.#point = point;
    this.#destination = destinations.find((d) => d.id === point.destination);
    this.#offers = offers[point.type]?.filter((o) => point.offers.includes(o.id));
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    const { isFavorite } = this.#point;
    const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42"
                 src="img/icons/${this.#point.type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this.#point.type} ${this.#destination?.name || ''}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time">${formatDate(this.#point.dateFrom)}</time>
              &mdash;
              <time class="event__end-time">${formatDate(this.#point.dateTo)}</time>
            </p>
            <p class="event__duration">${getDuration(this.#point.dateFrom, this.#point.dateTo)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this.#point.basePrice}</span>
          </p>
          <button class="event__favorite-btn ${favoriteClass}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick(this.#point);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  updateElement(point) {
    this.#point = point;
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
    this.#restoreHandlers();
  }

  #restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }
}

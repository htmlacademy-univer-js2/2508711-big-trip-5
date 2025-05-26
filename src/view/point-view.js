import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function formatDate(date) {
  return dayjs(date).format('HH:mm');
}

function getDuration(dateFrom, dateTo) {
  const diffMs = dayjs(dateTo).diff(dayjs(dateFrom));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const minutes = diffMinutes % 60;
  const hours = diffHours % 24;
  const days = diffDays;

  if (diffMinutes < 60) {
    return `${diffMinutes}M`;
  } else if (diffHours < 24) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
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
    this.#offers = offers[point.type]?.filter((o) => point.offers.includes(o.id)) || [];
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')?.addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    const {basePrice, dateFrom, dateTo, type, isFavorite} = this.#point;
    const destinationName = this.#destination ? this.#destination.name : '';
    const offersMarkup = this.#offers.length > 0 ? this.#offers.map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `).join('') : '';

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('MMM D')}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} ${destinationName}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dayjs(dateFrom).toISOString()}">${formatDate(dateFrom)}</time>
              &mdash;
              <time class="event__end-time" datetime="${dayjs(dateTo).toISOString()}">${formatDate(dateTo)}</time>
            </p>
            <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersMarkup}
          </ul>
          <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-6.16 3.24 1.18-6.88L3 12.74l6.9-1L14 5l2.1 6.74 6.9 1-5 4.62 1.18 6.88z"/>
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
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();

    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    };

    this.#handleFavoriteClick(updatedPoint);
  };
}

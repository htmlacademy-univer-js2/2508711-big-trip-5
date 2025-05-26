import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';

export default class PointPresenter {
  #point = null;
  #destinations = null;
  #offers = null;
  #pointComponent = null;
  #formEditComponent = null;
  #listContainer = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = 'DEFAULT';

  constructor(listContainer, handleDataChange, handleModeChange, destinations, offers) {
    this.#listContainer = listContainer;
    this.#handleDataChange = handleDataChange;
    this.#handleModeChange = handleModeChange;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleEditClick,
      this.#handleFavoriteClick
    );

    this.#formEditComponent = new FormEditView(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#handleFormSubmit,
      this.#handleFormClose
    );

    if (prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#listContainer);
      return;
    }

    if (this.#mode === 'DEFAULT') {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === 'EDITING') {
      replace(this.#formEditComponent, prevFormEditComponent);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  resetView() {
    if (this.#mode !== 'DEFAULT') {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    this.#handleModeChange();
    replace(this.#formEditComponent, this.#pointComponent);
    this.#mode = 'EDITING';
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    this.#mode = 'DEFAULT';
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
    this.#replaceFormToPoint();
  };

  #handleFormClose = () => {
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}

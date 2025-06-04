import { render, remove, replace } from '../framework/render.js';
import FormEditView from '../view/form-edit-view.js';
import FormCreateView from '../view/form-create-view.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointPresenter {
  #container = null;
  #pointComponent = null;
  #formEditComponent = null;
  #formCreateComponent = null;
  #onDataChange = null;
  #onModeChange = null;
  #destinations = [];
  #offers = {};
  #isCreating = false;
  #point = null;
  #handleDestroy = null;
  #isFormOpen = false;

  constructor({ container, onDataChange, onModeChange, destinations, offers, isCreating = false, handleDestroy }) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isCreating = isCreating;
    this.#handleDestroy = handleDestroy;
  }

  init(point) {
    this.#point = point;

    if (this.#isCreating) {
      this.#renderFormCreate();
      return;
    }

    this.#renderPoint();
  }

  #renderPoint() {
    const prevPointComponent = this.#pointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (prevPointComponent) {
      replace(this.#pointComponent, prevPointComponent);
      remove(prevPointComponent);
    } else {
      render(this.#pointComponent, this.#container);
    }
  }

  #renderFormEdit() {
    if (this.#isFormOpen) {
      return;
    }
    this.#isFormOpen = true;

    const prevFormEditComponent = this.#formEditComponent;

    this.#formEditComponent = new FormEditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormClose,
      onFormDelete: this.#handleFormDelete
    });

    if (prevFormEditComponent) {
      replace(this.#formEditComponent, prevFormEditComponent);
      remove(prevFormEditComponent);
    } else if (this.#pointComponent?.element?.parentElement) {
      replace(this.#formEditComponent, this.#pointComponent);
    } else {
      render(this.#formEditComponent, this.#container);
    }

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #renderFormCreate() {
    if (this.#isFormOpen) {
      return;
    }
    this.#isFormOpen = true;

    this.#formCreateComponent = new FormCreateView({
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormClose
    });

    render(this.#formCreateComponent, this.#container, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointComponent) {
      remove(this.#pointComponent);
      this.#pointComponent = null;
    }
    if (this.#formEditComponent) {
      remove(this.#formEditComponent);
      this.#formEditComponent = null;
    }
    if (this.#formCreateComponent) {
      remove(this.#formCreateComponent);
      this.#formCreateComponent = null;
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isFormOpen = false;
    if (this.#handleDestroy) {
      this.#handleDestroy();
    }
  }

  resetView() {
    if (this.#isCreating) {
      this.destroy();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#isFormOpen = false;
      return;
    }

    if (!this.#formEditComponent) {
      return;
    }

    if (this.#pointComponent) {
      replace(this.#pointComponent, this.#formEditComponent);
      remove(this.#formEditComponent);
      this.#formEditComponent = null;
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#isFormOpen = false;
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleEditClick = () => {
    this.#onModeChange(this);
    this.#renderFormEdit();
  };

  #handleFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !this.#isCreating;

    this.#onDataChange(
      this.#isCreating ? UserAction.ADD_POINT : UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );

    this.destroy();
    if (this.#isCreating) {
      this.#onModeChange();
    }
  };

  #handleFormClose = () => {
    this.resetView();
  };

  #handleFormDelete = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}

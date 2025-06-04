import PointsModel from './model/model.js';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter.js';

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter({
  model: pointsModel,
  filterModel,
  newPointButton
});

document.addEventListener('DOMContentLoaded', () => {
  tripPresenter.init();
});

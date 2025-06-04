import PointsModel from './model/model.js';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import BigTripApiService from './api/big-trip-api-service.js';

const AUTHORIZATION = 'Basic dbxt01ot';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const apiService = new BigTripApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel(apiService);
const filterModel = new FilterModel();
const newPointButton = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter({
  model: pointsModel,
  filterModel,
  newPointButton
});

pointsModel.init().then(() => {
  tripPresenter.init();
});

export const POINT_TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export const UserAction = {
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
  UPDATE_POINT: 'UPDATE_POINT'
};

export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

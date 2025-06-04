import dayjs from 'dayjs';
import { FilterType } from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) =>
    points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),

  [FilterType.PRESENT]: (points) =>
    points.filter((point) =>
      dayjs().isAfter(dayjs(point.dateFrom)) &&
      dayjs().isBefore(dayjs(point.dateTo)) ||
      dayjs(point.dateFrom).isSame(dayjs(), 'minute') ||
      dayjs(point.dateTo).isSame(dayjs(), 'minute')
    ),

  [FilterType.PAST]: (points) =>
    points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
};

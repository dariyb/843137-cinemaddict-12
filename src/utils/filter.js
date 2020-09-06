import {FilterType} from "../constants.js";

// export const filter = {
//   [FilterType.ALL]: 0,
//   [FilterType.WATCHLIST]: (values) => values.filter((element) => element.watchlist).length,
//   [FilterType.HISTORY]: (values) => values.filter((element) => element.watched).length,
//   [FilterType.FAVORITES]: (values) => values.filter((element) => element.favorite).length,
// };
export const filter = {
  [FilterType.ALL]: (values) => values,
  [FilterType.WATCHLIST]: (values) => values.filter((element) => element.isWatchlist === true),
  [FilterType.HISTORY]: (values) => values.filter((element) => element.isFavorite === true),
  [FilterType.FAVORITES]: (values) => values.filter((element) => element.isHistory === true),
};

export const countWatchlist = (added) => {
  const filmListNew = {
    all: 0,
    watchlist: added.filter((index) => index.isWatchlist === true),
    favorite: added.filter((index) => index.isFavorite === true),
    history: added.filter((index) => index.isHistory === true),
  };
  return filmListNew;
};

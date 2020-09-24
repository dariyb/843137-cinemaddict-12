import {FilterType} from "../constants.js";

const filter = {
  [FilterType.ALL]: (values) => values.slice(),
  [FilterType.WATCHLIST]: (values) => values.filter((element) => element.isWatchlist),
  [FilterType.HISTORY]: (values) => values.filter((element) => element.isHistory),
  [FilterType.FAVORITES]: (values) => values.filter((element) => element.isFavorite),
};

export {filter};

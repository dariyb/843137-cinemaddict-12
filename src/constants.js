export const ESC_KEYCODE = 27;
export const ENTR_KEYCODE = 13;
export const CTRL_KEYCODE = 17;
export const FILM_COUNT = 20;
export const FILM_COUNT_PER_STEP = 5;
export const TOP_RATED = 2;
export const MOST_COMMENTED = 2;
export const DOUBLE_SECTION = 2;
export const MIN_COMMENT_AMOUNT = 0;
export const MAX_COMMENT_AMOUNT = 5;

export const SortType = {
  DEFAULT: `default`,
  DATE: `date-up`,
  RATING: `rating-up`
};

export const EMOJIES = [`smile.png`, `sleeping.png`, `puke.png`, `angry.png`];

export const UserAction = {
  UPDATE_FILM_INFO: `UPDATE_FILM_INFO`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  ALL: `All Movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`
};

export const MenuItem = {
  DEFAULT: `default`,
  STATS: `stats`
};

export const StatsFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

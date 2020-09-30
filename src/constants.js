const ESC_KEYCODE = 27;
const ENTR_KEYCODE = 13;
const FILM_COUNT_PER_STEP = 5;
const TOP_RATED = 2;
const MOST_COMMENTED = 2;
const MAX_DESCRIPTION_LENGTH = 140;
const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;
const BAR_HEIGHT = 50;
const DELETE = `Delete`;
const DELETING = `Deleting...`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VERSION = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;

const SortType = {
  DEFAULT: `default`,
  DATE: `date-up`,
  RATING: `rating-up`
};

const EMOJIES = [`smile.png`, `sleeping.png`, `puke.png`, `angry.png`];

const UserAction = {
  UPDATE_FILM_INFO: `UPDATE_FILM_INFO`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const FilterType = {
  ALL: `All Movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
  STATS: `Stats`
};

const MenuItem = {
  DEFAULT: `default`,
  STATS: `stats`
};

const StatsFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export {ESC_KEYCODE, ENTR_KEYCODE, FILM_COUNT_PER_STEP, TOP_RATED, MOST_COMMENTED, MAX_DESCRIPTION_LENGTH, AUTHORIZATION, END_POINT, BAR_HEIGHT, SortType, EMOJIES, UserAction, UpdateType, FilterType, MenuItem, StatsFilter, DELETE, DELETING, STORE_NAME};

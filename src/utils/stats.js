const WatchedFilmsCount = {
  ZERO: `0`,
  NOVICE: `1`,
  FAN: `11`,
  MOVIE_BUFF: `21`
};

export const getUserStatus = (watchedFilmsCount) => {
  let userStatus = null;
  switch (true) {
    case watchedFilmsCount >= WatchedFilmsCount.NOVICE && watchedFilmsCount < WatchedFilmsCount.FAN:
      userStatus = `Novice`;
      break;
    case watchedFilmsCount >= WatchedFilmsCount.FAN && watchedFilmsCount < WatchedFilmsCount.MOVIE_BUFF:
      userStatus = `Fan`;
      break;
    case watchedFilmsCount >= WatchedFilmsCount.MOVIE_BUFF:
      userStatus = `Movie Buff`;
      break;
    case watchedFilmsCount === WatchedFilmsCount.ZERO:
      userStatus = ``;
      break;
  }
  return userStatus;
};

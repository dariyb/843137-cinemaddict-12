const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomNumber = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

const shuffleArray = (array) => {
  let count = array.length;
  while (count > 0) {
    let index = Math.floor(Math.random() * count);
    count -= 1;
    let temp = array[count];
    array[count] = array[index];
    array[index] = temp;
  }
  return array;
};

const getPosterFile = () => {
  const posters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const getFilmName = () => {
  const filmsNames = [`Blade`, `Titanic`, `Taxi`, `My soul to take`, `Harry Potter`, `You are next`, `Hangover`];

  const randomIndex = getRandomInteger(0, filmsNames.length - 1);

  return filmsNames[randomIndex];
};

const getRating = () => {
  const MIN_RATING = 0;
  const MAX_RATING = 10;

  return getRandomNumber(MIN_RATING, MAX_RATING);
};

const getReleaseDate = () => {
  const MIN_RELEASE = 1929;
  const MAX_RELEASE = 2020;

  const currentDate = new Date();

  currentDate.setFullYear(getRandomInteger(MIN_RELEASE, MAX_RELEASE));

  return new Date(currentDate).getFullYear();
};

const getRunningTime = () => {
  const MIN_HOUR_TIME = 0;
  const MAX_HOUR_TIME = 3;
  const MIN_MINUTE_TIME = 0;
  const MAX_MINUTE_TIME = 59;

  const hourRunningTime = getRandomInteger(MIN_HOUR_TIME, MAX_HOUR_TIME);
  const minuteRunningTime = getRandomInteger(MIN_MINUTE_TIME, MAX_MINUTE_TIME);

  if (hourRunningTime && minuteRunningTime) {
    return `${hourRunningTime}h ${minuteRunningTime}m`;
  } else if (!hourRunningTime && minuteRunningTime) {
    return `${minuteRunningTime}m`;
  } else if (!hourRunningTime && !minuteRunningTime) {
    return `unknown`;
  }
  return `${hourRunningTime}`;
};

const getGenre = () => {
  const genres = [`horror`, `comedy`, `thriller`, `musical`, `drama`, `cartoon`, `western`];

  const randomIndex = getRandomInteger(1, genres.length - 1);
  const randomGenre = shuffleArray(genres).slice(0, randomIndex);

  if (randomGenre.length > 1) {
    return `Genres ${randomGenre}`;
  }
  return `Genre ${randomGenre}`;
};

const getDescription = () => {
  const MIN_SENTENCES_AMOUNT = 1;
  const MAX_SENTENCES_AMOUNT = 5;

  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const randomIndex = getRandomInteger(MIN_SENTENCES_AMOUNT, MAX_SENTENCES_AMOUNT + 1);
  return description.split(`.`).slice(0, randomIndex).join(`.`);
};

export const generateFilmInfo = () => {
  return {
    poster: `./images/posters/${getPosterFile()}`,
    name: getFilmName(),
    rating: getRating(),
    releaseDate: getReleaseDate(),
    runningTime: getRunningTime(),
    genre: getGenre(),
    description: getDescription(),
    // comment
  };
};

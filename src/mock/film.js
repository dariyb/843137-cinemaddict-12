const MIN_COMMENT_AMOUNT = 0;
const MAX_COMMENT_AMOUNT = 5;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomNumber = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  let point = lower + Math.random() * (upper - lower);

  return point.toFixed(1);
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

const groupComments = (item, amount) => {
  return new Array(amount).fill().map(item);
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

const getCommentText = () => {
  const texts = [`Cried a river`, `WTF`, `LOL`, `Best thing EVER`, `Do NOT Recommend`, `Wish I was there`, `AMAZING!!!`];

  const randomIndex = getRandomInteger(0, texts.length - 1);
  return texts[randomIndex];
};

const getEmoji = () => {
  const emojies = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`];

  const randomIndex = getRandomInteger(0, emojies.length - 1);
  return emojies[randomIndex];
};

const getAuthor = () => {
  const authors = [`Jonny Cash`, `David Bowie`, `Incognito`, `Lucky Charly`, `Filmo-guru`, `Stella Prize`, `Marry Jo`];

  const randomIndex = getRandomInteger(0, authors.length - 1);
  return authors[randomIndex];
};

const generateCommentDate = () => {
  const currentDay = new Date();

  currentDay.setHours(23, 59, 59, 999);
  currentDay.setDate(currentDay.getDate());

  return new Date(currentDay);
};

const getComments = () => {
  return {
    text: getCommentText(),
    emoji: `./images/emoji/${getEmoji()}`,
    author: getAuthor(),
    date: generateCommentDate()
  };
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
    comments: groupComments(getComments, getRandomInteger(MIN_COMMENT_AMOUNT, MAX_COMMENT_AMOUNT))
  };
};

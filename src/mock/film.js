import {getRandomInteger, getRandomNumber, shuffleArray, getRandomizeInfo} from "../utils.js";
import {MIN_COMMENT_AMOUNT, MAX_COMMENT_AMOUNT} from "../constants.js";

const directors = [`Camden Derick`, `Finn Weys`, `Cemeron Case`, `Anthony Pull`, `Fill Blacke`];
const filmsNames = [`Blade`, `Titanic`, `Taxi`, `My soul to take`, `Harry Potter`, `You are next`, `Hangover`];
const posters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const texts = [`Cried a river`, `WTF`, `LOL`, `Best thing EVER`, `Do NOT Recommend`, `Wish I was there`, `AMAZING!!!`];
const emojies = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`];
const authors = [`Jonny Cash`, `David Bowie`, `Incognito`, `Lucky Charly`, `Filmo-guru`, `Stella Prize`, `Marry Jo`];
const actors = [[`Ricj Pass`, `Vin Disel`, `Caty Holms`, `Abel Plancoff`, `Will Smith`], [`Peter Weid`, `Dexter Asque`, `Heis Bun`], [`Lester Kess`, `Jojo Wilson`, `Nick Newman`, `Oleg Petrov`]];
const writers = [[`Eric Growe`, `Deton Ber`, `Camore Dotel`, `Firect Acew`], [`Wong Er`, `Owen Bas`, `Kein Cain`, `JJ Abrams`], [`Gregory Unnit`, `Quin Delpot`, `Wein Woss`, `Meme Vick`]];
const countries = [`USA`, `Germany`, `Russia`, `Austria`, `Spain`];


const groupComments = (item, amount) => {
  return new Array(amount).fill().map(item);
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
  const genres = [`Horror`, `Comedy`, `Thriller`, `Musical`];

  const randomIndex = getRandomInteger(1, genres.length - 1);
  const randomGenre = shuffleArray(genres).slice(0, randomIndex);

  const filmDetailGenres = Object.create({}, {
    title: {
      get() {
        return randomGenre.length > 1 ? `Genres` : `Genre`;
      }
    },
    genres: {
      value: randomGenre
    },
    age: {
      get() {
        return randomGenre.includes(`Horror`) ? `18+` : ``;
      }
    }
  });

  return filmDetailGenres;
};

const getDescription = () => {
  const MIN_SENTENCES_AMOUNT = 1;
  const MAX_SENTENCES_AMOUNT = 5;

  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

  const randomIndex = getRandomInteger(MIN_SENTENCES_AMOUNT, MAX_SENTENCES_AMOUNT + 1);
  return description.split(`.`).slice(0, randomIndex).join(`.`);
};

const generateCommentDate = () => {
  const currentDay = new Date();

  currentDay.setHours(23, 59, 59, 999);
  currentDay.setDate(currentDay.getDate());

  return new Date(currentDay);
};

const getComments = () => {
  return {
    text: getRandomizeInfo(texts),
    emoji: `./images/emoji/${getRandomizeInfo(emojies)}`,
    author: getRandomizeInfo(authors),
    date: generateCommentDate()
  };
};

export const generateFilmInfo = () => {
  return {
    poster: `./images/posters/${getRandomizeInfo(posters)}`,
    name: getRandomizeInfo(filmsNames),
    rating: getRating(),
    releaseDate: getReleaseDate(),
    runningTime: getRunningTime(),
    genre: getGenre(),
    description: getDescription(),
    comments: groupComments(getComments, getRandomInteger(MIN_COMMENT_AMOUNT, MAX_COMMENT_AMOUNT)),
    director: getRandomizeInfo(directors),
    writers: getRandomizeInfo(writers),
    actors: getRandomizeInfo(actors),
    country: getRandomizeInfo(countries),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

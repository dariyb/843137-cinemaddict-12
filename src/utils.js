export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomNumber = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  let point = lower + Math.random() * (upper - lower);

  return point.toFixed(1);
};

export const shuffleArray = (array) => {
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

export const humanizeCommentDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {year: `numeric`, month: `numeric`, day: `numeric`, hour: `numeric`, minute: `numeric`, hour12: false});
};

export const getRandomizeInfo = (info) => {
  const randomIndex = getRandomInteger(0, info.length - 1);
  return info[randomIndex];
};

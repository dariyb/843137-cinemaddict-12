const uniqueNumber = () => {
  let i = 0;
  return () => i++;
};

const runningFilmTime = (runnTime) => {
  if (runnTime > 60) {
    let hour = Math.floor((runnTime / 60));
    let minutes = Math.floor(runnTime - (hour * 60));
    if (minutes > 60) {
      hour = Math.floor(hour + (minutes / 60));
      minutes = Math.floor(minutes - (minutes / 60));
    }
    if (minutes < 60) {
      minutes = Math.floor(minutes);
    }
    return `${hour}h ${minutes}m`;
  } else if (runnTime < 60) {
    return `${runnTime}m`;
  }
  return `${runnTime}h`;
};

export {uniqueNumber, runningFilmTime};

export const createFilmGenres = (film) => {
  const {genre} = film;
  return `<tr class="film-details__row">
    <td class="film-details__term">${genre.title}</td>
    <td class="film-details__cell"></td>
    </tr>`;
};

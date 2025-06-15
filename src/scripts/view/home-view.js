import { MovieModel } from '../model/movie-model';
import { HomePresenter } from '../presenter/home-presenter';

export default class HomeView {
  async render() {
    return `
      <section class="welcome-section">
        <h1>🎬 Selamat datang di <span style="color:#d63384;">UpdateDong</span>!</h1>
        <p>Temukan dan tambahkan katalog film favoritmu.</p>
        <div id="movie-list" class="movie-list">
          <p>Loading daftar film...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const model = new MovieModel();
    const presenter = new HomePresenter({ view: this, model });
    await presenter.loadMovies();
  }

  showMovies(movies) {
    const container = document.getElementById('movie-list');
    if (!movies.length) {
      container.innerHTML = '<p>Belum ada film yang tersedia.</p>';
      return;
    }

    container.innerHTML = '';
    movies.forEach((movie) => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${movie.photoUrl}" alt="${movie.name}" loading="lazy" />
        <h3>${movie.name}</h3>
        <p>${movie.description}</p>
        <small>📍 ${movie.lat}, ${movie.lon}</small>
      `;
      container.appendChild(card);
    });
  }

  showError(message) {
    const container = document.getElementById('movie-list');
    container.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}

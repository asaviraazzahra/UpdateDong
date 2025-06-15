export class HomePresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async loadMovies() {
    try {
      const movies = await this.model.getMovies();
      this.view.showMovies(movies);
    } catch (error) {
      this.view.showError('Gagal memuat data film.');
    }
  }
}

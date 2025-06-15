export class AddMoviePresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async submitMovie(formData) {
    try {
      this.view.showLoading();

      await this.model.postMovie(formData);

      this.view.showSuccess('🎉 Film berhasil ditambahkan!');
    } catch (error) {
      this.view.showError('❌ Gagal menambahkan film: ' + error.message);
    }
  }
}

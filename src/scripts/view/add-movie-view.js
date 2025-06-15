import L from 'leaflet';
import { AddMovieModel } from '../model/add-movie-model';
import { AddMoviePresenter } from '../presenter/add-movie-presenter';

export default class AddMovieView {
  async render() {
    return `
      <section class="add-movie-section">
        <h2>➕ Tambah Film Baru</h2>
        <form id="movie-form" class="movie-form">
          <label for="name">Judul Film</label>
          <input type="text" id="name" name="name" required />

          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required></textarea>

          <label for="image">Gambar (dari Kamera)</label>
          <video id="camera-stream" autoplay playsinline width="100%" height="200"></video>
          <button type="button" id="capture-btn">📸 Ambil Gambar</button>
          <canvas id="captured-image" style="display:none;"></canvas>

          <label for="location">Pilih Lokasi</label>
          <div id="map" style="height: 250px; border-radius: 10px;"></div>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />

          <button type="submit">Kirim</button>
        </form>
        <div id="form-message" style="margin-top:1rem;font-weight:bold;"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new AddMovieModel();
    const presenter = new AddMoviePresenter({ view: this, model });

    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('captured-image');
    const captureBtn = document.getElementById('capture-btn');
    const form = document.getElementById('movie-form');
    const messageBox = document.getElementById('form-message');
    let mediaStream;

    // Kamera
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = mediaStream;
    } catch (err) {
      video.replaceWith('🚫 Kamera tidak tersedia di perangkat Anda.');
    }

    captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.display = 'block';
      captureBtn.innerText = '✅ Gambar Diambil';
      if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    });

    // Peta
    const map = L.map('map').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker;
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      marker.bindPopup(`📍 Lokasi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`).openPopup();
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const lat = document.getElementById('lat').value;
      const lon = document.getElementById('lon').value;
      const imageBase64 = canvas.toDataURL('image/jpeg');

      const data = { name, description, lat, lon, imageBase64 };
      await presenter.submitMovie(data);
    });

    this.showLoading = () => {
      messageBox.innerHTML = '⏳ Mengirim data...';
      messageBox.style.color = '#333';
    };

    this.showSuccess = (msg) => {
      messageBox.innerHTML = msg;
      messageBox.style.color = 'green';
    };

    this.showError = (msg) => {
      messageBox.innerHTML = msg;
      messageBox.style.color = 'red';
    };
  }
}

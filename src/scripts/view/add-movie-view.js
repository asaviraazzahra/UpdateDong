import L from 'leaflet';
import { AddMovieModel } from '../model/add-movie-model';
import { AddMoviePresenter } from '../presenter/add-movie-presenter';

export default class AddMovieView {
    async render() {
        return `
      <section class="add-movie-section">
        <h2>➕ Tambah Cerita Baru</h2>
        <form id="movie-form" class="movie-form">
          <label for="name">Judul Cerita</label>
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
        const mapContainer = document.getElementById('map');
        let mediaStream;

        const stopCamera = () => {
            if (mediaStream) {
                console.log('Kamera dimatikan.');
                mediaStream.getTracks().forEach((track) => track.stop());
                video.srcObject = null;
                mediaStream = null;
            }
        };

        const startCamera = async () => {
            if (mediaStream) return;
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = mediaStream;
            } catch (err) {
                video.replaceWith('🚫 Kamera tidak tersedia di perangkat Anda.');
                console.error('Gagal mengakses kamera:', err);
            }
        };

        const handleVisibilityChange = () => {
            const isPictureTaken = captureBtn.innerText.includes('✅');

            if (document.hidden) {
                stopCamera();
            } else if (!isPictureTaken) {
                startCamera();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        captureBtn.addEventListener('click', () => {
            if (!mediaStream) return;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.style.display = 'block';
            video.style.display = 'none';
            captureBtn.innerText = '✅ Gambar Diambil';
            stopCamera();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                lat: document.getElementById('lat').value,
                lon: document.getElementById('lon').value,
                imageBase64: canvas.toDataURL('image/jpeg'),
            };
            await presenter.submitMovie(data);
        });

        const map = L.map(mapContainer).setView([-6.2, 106.8], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // FIX: Panggil invalidateSize untuk memastikan peta dirender dengan benar setelah transisi.
        setTimeout(() => {
            map.invalidateSize();
        }, 10); // Memberi sedikit jeda agar transisi CSS selesai.
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

        this.showLoading = () => {
            messageBox.innerHTML = '⏳ Mengirim data...';
        };
        this.showSuccess = (msg) => {
            messageBox.innerHTML = `✅ ${msg}`;
        };
        this.showError = (msg) => {
            messageBox.innerHTML = `❌ ${msg}`;
        };

        await startCamera();

        return () => {
            console.log('Membersihkan halaman Tambah Film...');
            stopCamera();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }
}

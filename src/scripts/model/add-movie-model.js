const BASE_URL = 'https://story-api.dicoding.dev/v1';

export class AddMovieModel {
  async postMovie({ name, description, lat, lon, imageBase64 }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('lon', lon);

    // Convert Base64 to Blob
    const byteString = atob(imageBase64.split(',')[1]);
    const mimeString = imageBase64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    formData.append('photo', blob, 'photo.jpg');

    const token = localStorage.getItem('token'); // pastikan login token disimpan
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal menambahkan data');
    }

    return await response.json();
  }
}

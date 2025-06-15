const BASE_URL = 'https://story-api.dicoding.dev/v1';

export class MovieModel {
    async _login() {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'asav.updatedong@mail.com',
                    password: '12345678',
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Login failed: ${errorResponse.message}`);
            }

            const result = await response.json();

            if (result.error || !result.loginResult || !result.loginResult.token) {
                throw new Error('Login was successful, but no token was returned.');
            }

            const token = result.loginResult.token;

            localStorage.setItem('token', token);

            return token;
        } catch (error) {
            throw error;
        }
    }

    async getMovies() {
        try {
            let token = localStorage.getItem('token');

            if (!token) {
                token = await this._login();
            }

            const response = await fetch(`${BASE_URL}/stories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    const newToken = await this._login();

                    const retryResponse = await fetch(`${BASE_URL}/stories`, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });

                    if (!retryResponse.ok) {
                        throw new Error('Gagal mengambil data dari API setelah login ulang');
                    }

                    const retryResult = await retryResponse.json();
                    return retryResult.listStory;
                }

                // For other non-successful responses
                throw new Error('Gagal mengambil data dari API');
            }

            const result = await response.json();
            return result.listStory;
        } catch (error) {
            throw error;
        }
    }
}

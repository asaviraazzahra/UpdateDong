const LoginView = {
  async render() {
    return `
      <section class="login-page">
        <h2>Masuk ke UpdateDong</h2>
        <form id="loginForm">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
          
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
          
          <button type="submit">Login</button>
        </form>
        <p id="login-error" style="color: red;"></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('loginForm');
    const errorDisplay = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value;
      const password = form.password.value;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('token', result.loginResult.token);
          window.location.hash = '/'; // redirect ke homepage
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        errorDisplay.textContent = 'Login gagal: ' + err.message;
      }
    });
  },
};

export default LoginView;

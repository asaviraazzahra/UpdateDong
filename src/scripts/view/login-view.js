class LoginView {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <section class="login-form">
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email</label><br>
          <input type="email" id="email" name="email" required><br>

          <label for="password">Password</label><br>
          <input type="password" id="password" name="password" required><br><br>

          <button type="submit">Login</button>
        </form>
        <div id="loginError" style="color:red;"></div>
      </section>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = event.target.email.value;
      const password = event.target.password.value;

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        // Simpan token ke localStorage
        localStorage.setItem('token', result.loginResult.token);
        alert('Login berhasil!');
        window.location.hash = '/';

      } catch (err) {
        document.getElementById('loginError').textContent = err.message;
      }
    });
  }
}

export default LoginView;

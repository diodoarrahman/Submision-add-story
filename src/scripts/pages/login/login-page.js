import LoginPresenter from '../../presenter/login-presenter.js';

const LoginPage = {
  render() {
    return /*html*/`
      <main class="login-container">
        <h2 class="login-title">Login</h2>
        <form id="login-form" aria-label="Login form" class="form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required class="form-input"/>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required class="form-input"/>
          </div>

          <button type="submit" class="btn">Login</button>
        </form>

        <p class="register-prompt">
          Belum punya akun? 
          <a href="#/register" class="register-link" aria-label="Go to register page">Register di sini</a>
        </p>
      </main>
    `;
  },

  afterRender() {
    const form = document.getElementById('login-form');
    LoginPresenter.init(form);
  }
};

export default LoginPage;

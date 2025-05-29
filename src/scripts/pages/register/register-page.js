import RegisterPresenter from '../../presenter/register-presenter.js';

const RegisterPage = {
  render() {
    return /*html*/`
      <main>
        <h2 style="text-align: center; margin-bottom: 1rem;">Register</h2>
        <form id="register-form" aria-label="Register form">
          <div>
            <label for="name">Nama</label>
            <input id="name" name="name" type="text" required />
          </div>

          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div>
            <label for="password">Password</label>
            <input id="password" name="password" type="password" minlength="8" required />
          </div>

          <button type="submit">Register</button>
        </form>

        <p style="text-align: center; margin-top: 1rem;">
          Sudah punya akun? 
          <a href="#/login" aria-label="Go to login page">Login di sini</a>
        </p>
      </main>
    `;
  },

  afterRender() {
    const form = document.getElementById('register-form');
    RegisterPresenter.init(form);
  }
};

export default RegisterPage;

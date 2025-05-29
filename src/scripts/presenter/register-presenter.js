import { registerUser } from '../data/api.js';

const RegisterPresenter = {
  init(form) {
    this.form = form;
    this._setupEvent();
  },

  _setupEvent() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = this.form.name.value.trim();
      const email = this.form.email.value.trim();
      const password = this.form.password.value.trim();

      if (!name || !email || !password) {
        alert('Semua kolom wajib diisi.');
        return;
      }

      if (password.length < 8) {
        alert('Password minimal 8 karakter.');
        return;
      }

      try {
        const result = await registerUser({ name, email, password });
        if (!result.error) {
          alert('Berhasil daftar! Silakan login.');
          location.hash = '#/login';
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
        alert('Gagal mendaftar. Coba lagi nanti.');
      }
    });
  }
};

export default RegisterPresenter;
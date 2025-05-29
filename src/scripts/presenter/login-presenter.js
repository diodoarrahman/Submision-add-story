import { loginUser } from '../data/api.js';
import pushNotificationHelper from '../utils/push-notification';

const LoginPresenter = {
  init(form) {
    this.form = form;
    this._setupEvent();
  },

  _setupEvent() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = this.form.email.value.trim();
      const password = this.form.password.value.trim();

      if (!email || !password) {
        alert('Email dan password tidak boleh kosong.');
        return;
      }

      try {
        const result = await loginUser({ email, password });

        if (!result.error) {
          const { token } = result.loginResult;

          // Simpan ke localStorage
          localStorage.setItem('storyAppUser', JSON.stringify(result.loginResult));

          // Redirect ke home terlebih dahulu
          location.hash = '#/home';

          // Request for push notification permissions and register service worker
          try {
            await pushNotificationHelper.requestPermission();
            const swRegistration = await pushNotificationHelper.registerServiceWorker();
            await pushNotificationHelper.subscribeUser(swRegistration, token);
          } catch (pushError) {
            console.warn('Push notification gagal:', pushError.message);
          }

        } else {
          alert(result.message); // Jika login error dari API
        }

      } catch (err) {
        console.error(err);
        alert('Gagal login. Silakan coba lagi.');
      }
    });
  }
};

export default LoginPresenter;
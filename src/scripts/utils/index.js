// index.js
import '../styles/styles.css';
import App from './pages/app';
import { subscribePush } from './utils/push-helper';

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  if ('serviceWorker' in navigator && token) {
    const registration = await navigator.serviceWorker.ready;
    await subscribePush(registration, token);
  }
});

import RegisterPage from './register/register-page.js';
import LoginPage from './login/login-page.js';
import HomePage from './home/home-page.js';
import AddStoryPage from './add-story/add-story-page.js';
import DetailStoryPage from './detail-story/detail-story-page.js';
import NotFoundPage from './not-found/not-found.js';
import BookmarkPage from './bookmark/bookmark-page.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service Worker registered with scope:', reg.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;

    this.routes = {
      '/register': RegisterPage,
      '/login': LoginPage,
      '/home': HomePage,
      '/add-story': AddStoryPage,
      '/detail-story': DetailStoryPage,
      '/bookmark': BookmarkPage,
    };

    this._initialListener();
    this._setupSkipLink();
  }

  _initialListener() {
    if (this.drawerButton && this.navigationDrawer) {
      this.drawerButton.setAttribute('aria-haspopup', 'true');
      this.drawerButton.setAttribute('aria-controls', 'navigationDrawer');
      this.drawerButton.setAttribute('aria-expanded', 'false');

      this.drawerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = this.navigationDrawer.classList.toggle('open');
        this.drawerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      window.addEventListener('click', () => {
        this.navigationDrawer.classList.remove('open');
        this.drawerButton.setAttribute('aria-expanded', 'false');
      });
    }
  }

  _setupSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.padding = '10px';
    skipLink.style.backgroundColor = '#ffb3b3'; 
    skipLink.style.color = '#fff';
    skipLink.style.border = '1px solid #ffb3b3'; 
    skipLink.style.zIndex = '1000';
    skipLink.style.transition = 'top 0.3s ease-in-out';
    document.body.insertBefore(skipLink, document.body.firstChild);

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        skipLink.style.top = '0';
      }
    });

    window.addEventListener('click', () => {
      skipLink.style.top = '-40px';
    });
  }

  _parseLocation() {
    const hash = location.hash.slice(1).toLowerCase() || '/login';
    const [_, mainRoute, id] = hash.split('/');
    return {
      route: `/${mainRoute || 'login'}`,
      id: id || null,
    };
  }

  async renderPage() {
    if (document.startViewTransition) {
      await document.startViewTransition(() => this._renderContent());
    } else {
      await this._renderContent();
    }
  }

  async _renderContent() {
    const { route, id } = this._parseLocation();
    const Page = this.routes[route] || NotFoundPage;

    let rendered = null;

    try {
      if (id) {
        rendered = await Page.render(id);
      }
      if (!rendered) {
        rendered = await Page.render();
      }
    } catch (err) {
      console.error('Render error:', err);
      rendered = '<p>Error while loading the page.</p>';
    }

    this.content.innerHTML = rendered;

    if (Page.afterRender) {
      try {
        await Page.afterRender(id);
      } catch (err) {
        console.error('After render error:', err);
      }
    }
  }
}

export default App;
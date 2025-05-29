const NotFound = {
  async render() {
    return `
      <section class="not-found">
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <a href="#/home" class="btn-back-home">Go to Home</a>
      </section>
    `;
  },

  async afterRender() {
    // Optionally add any animations or additional logic here
    const btnBackHome = document.querySelector('.btn-back-home');
    btnBackHome.addEventListener('click', () => {
      location.hash = '#/home';
    });
  }
};

export default NotFound;
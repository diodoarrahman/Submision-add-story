import DetailStoryPresenter from '../../presenter/detail-story-presenter.js';

const DetailStoryPage = {
  async render() {
    return /*html*/`
      <main id="detail-story" class="detail-story-container">
        <h2 class="page-title">Detail Story</h2>
        <div id="story-detail-content" class="story-detail-content" aria-live="polite">
          Loading...
        </div>
        <br>
        <a href="#/home" class="back-home-link" aria-label="Back to home">← Back</a>
      </main>
    `;
  },

  async afterRender() {
    const user = JSON.parse(localStorage.getItem('storyAppUser'));
    if (!user) {
      location.hash = '#/login';
      return;
    }

    const id = window.location.hash.split('/detail-story/')[1];
    if (!id) {
      alert('Story ID not found.');
      location.hash = '#/home';
      return;
    }

    const container = document.getElementById('story-detail-content');
    await DetailStoryPresenter.showDetail({ token: user.token, id, container });
  }
};

export default DetailStoryPage;

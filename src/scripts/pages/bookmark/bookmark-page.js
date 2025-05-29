import BookmarkPresenter from '../../presenter/bookmark-presenter.js';

const BookmarkPage = {
  async render() {
    return /*html*/`
      <main class="bookmark-container">
        <h2 class="page-title">Bookmarked Stories</h2>
        <div id="bookmark-list" class="bookmark-list" role="list" aria-live="polite">Loading...</div>
      </main>
    `;
  },

  async afterRender() {
    const listEl = document.getElementById('bookmark-list');

    BookmarkPresenter.loadBookmarks(
      (stories) => {
        if (!stories.length) {
          listEl.textContent = 'No stories bookmarked yet.';
          return;
        }

        listEl.innerHTML = '';
        stories.forEach((story) => {
          const item = document.createElement('article');
          item.setAttribute('role', 'listitem');
          item.classList.add('bookmark-item');
          item.innerHTML = `
            <img src="${story.photoUrl}" alt="Story by ${story.name}" class="bookmark-image" loading="lazy" />
            <h3 class="bookmark-title">${story.name}</h3>
            <p class="bookmark-description">${story.description}</p>
            <time datetime="${story.createdAt}" class="bookmark-time">${new Date(story.createdAt).toLocaleString()}</time>
            <a href="#/detail-story/${story.id}" class="bookmark-details-link" aria-label="View details of ${story.name}">Details</a>
          `;

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Remove Bookmark';
          deleteBtn.classList.add('delete-btn');
          deleteBtn.setAttribute('aria-label', `Remove bookmark for ${story.name}`);
          deleteBtn.addEventListener('click', async () => {
            await BookmarkPresenter.deleteBookmark(story.id);
            alert('Story removed from bookmarks.');
            this.afterRender(); // Reload the bookmarks after deletion
          });

          item.appendChild(deleteBtn);
          listEl.appendChild(item);
        });
      },
      (error) => {
        listEl.textContent = 'Failed to load bookmarked stories.';
        console.error(error);
      }
    );
  }
};

export default BookmarkPage;
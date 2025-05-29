import IdbHelper from '../utils/idb.js';

const BookmarkPresenter = {
  async loadBookmarks(onSuccess, onError) {
    try {
      const stories = await IdbHelper.getAllStories();
      onSuccess(stories);
    } catch (error) {
      onError(error);
    }
  },

  async deleteBookmark(id) {
    try {
      await IdbHelper.deleteStory(id);
    } catch (error) {
      console.error('Gagal menghapus story dari bookmark:', error);
    }
  }
};

export default BookmarkPresenter;

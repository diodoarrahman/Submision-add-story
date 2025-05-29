import { openDB } from 'idb';

const dbPromise = openDB('story-app-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('stories')) {
      db.createObjectStore('stories', { keyPath: 'id' });
    }
  }
});

const IdbHelper = {
  async putStory(story) {
    if (!story.id) return;
    return (await dbPromise).put('stories', story);
  },

  async getStory(id) {
    return (await dbPromise).get('stories', id);
  },

  async getAllStories() {
    return (await dbPromise).getAll('stories');
  },

  async deleteStory(id) {
    return (await dbPromise).delete('stories', id);
  }
};

export default IdbHelper;

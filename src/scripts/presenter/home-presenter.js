import { getStories } from '../data/api.js';

const HomePresenter = {
  async loadStories(token, onSuccess, onError) {
    try {
      const data = await getStories(token);
      if (data.error) {
        onError(data.message);
      } else {
        onSuccess(data.listStory);
      }
    } catch (err) {
      onError('Failed to load stories.');
    }
  }
};

export default HomePresenter;
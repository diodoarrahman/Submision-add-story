import { getStoryDetail } from '../data/api.js';

const DetailStoryPresenter = {
  async showDetail({ token, id, container }) {
    try {
      const data = await getStoryDetail(token, id);
      if (data.error) {
        throw new Error(data.message);
      }

      const story = data.story;

      container.innerHTML = `
        <img src="${story.photoUrl}" alt="Story image by ${story.name}" style="max-width: 100%;" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <time datetime="${story.createdAt}">${new Date(story.createdAt).toLocaleString()}</time>
        <div id="detail-map" style="height:300px; margin-top: 16px;"></div>
      `;

      if (story.lat && story.lon) {
        const map = L.map('detail-map').setView([story.lat, story.lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(story.description).openPopup();
      }
    } catch (error) {
      alert(error.message || 'Unable to fetch story detail.');
      location.hash = '#/home';
    }
  }
};

export default DetailStoryPresenter;
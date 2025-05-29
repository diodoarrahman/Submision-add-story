import HomePresenter from '../../presenter/home-presenter.js';
import pushNotificationHelper from '../../utils/push-notification.js';

const HomePage = {
  async render() {
    return /*html*/ `
      <style>
        .notification-container {
          margin-top: 16px;
          margin-left: 20px;  /* Memberikan margin kiri agar tidak center */
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .notif-toggle-btn {
          background-color: #0078d4;
          color: white;
          border: none;
          padding: 8px 12px;  /* Menyesuaikan padding agar pas dengan teks dan emoji */
          font-size: 18px;  /* Menyesuaikan ukuran font dengan teks emoji */
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease;
          border-radius: 8px;
          white-space: nowrap;  /* Agar teks dan emoji tidak terpotong */
        }

        .notif-toggle-btn:hover {
          background-color: #005a8a;
        }

        .add-story-btn {
          background-color: #0078d4;
          color: white;
          border: none;
          padding: 10px 16px;
          font-size: 24px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease;
          border-radius: 8px;
        }

        .add-story-btn:hover {
          background-color: #005a8a;
        }

        /* Styling untuk card setiap cerita */
        .story-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .story-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          background-color: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .story-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .story-card .story-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .story-card img {
          border-radius: 8px;
          object-fit: cover;
          max-width: 100%;
        }

        .story-card button {
          align-self: flex-start;
          background-color: #0078d4;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .story-card button:hover {
          background-color: #005a8a;
        }

        /* Styling untuk map dan lokasi */
        .map-container {
          height: 300px;
          margin-top: 16px;
        }

        .coordinates label {
          font-weight: bold;
        }

        .location-display {
          font-weight: bold;
          color: #0078d4;
          margin-top: 8px;
        }

        .btn-submit {
          background-color: #0078d4;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 1.2em;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-submit:hover {
          background-color: #005a8a;
        }

        .back-home-link {
          display: block;
          text-align: center;
          margin-top: 20px;
          font-size: 1.1em;
          color: #0078d4;
          text-decoration: none;
        }

        .back-home-link:hover {
          text-decoration: underline;
        }
      </style>

      <h2 class="page-title">All Stories</h2>

      <!-- Tombol Notification dan Add Story berada tepat di bawah judul -->
      <div class="notification-container">
        <button id="notif-toggle-btn" class="notif-toggle-btn" aria-label="Toggle Push Notification">🔔 Notification</button>
        <a href="#/add-story" id="add-story-btn" class="add-story-btn" aria-label="Add New Story">➕</a>
      </div>

      <div id="story-list" class="story-list" role="list" aria-live="polite">Loading stories...</div>

      <div id="map" class="map-container" aria-label="Map showing story locations"></div>

      <div class="coordinates">
        <label>
          Latitude:
          <input id="lat-display" type="text" readonly style="margin-right: 8px;" />
        </label>
        <label>
          Longitude:
          <input id="lon-display" type="text" readonly />
        </label>
      </div>
    `;
  },

  async afterRender() {
    const user = JSON.parse(localStorage.getItem('storyAppUser'));
    if (!user) {
      location.hash = '#/login';
      return;
    }
    const token = user.token;

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('storyAppUser');
      location.hash = '#/login';
    });

    const storyListEl = document.getElementById('story-list');

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data © Google'
    });

    const storyMarkers = L.layerGroup();

    const map = L.map('map', {
      center: [0, 0],
      zoom: 2,
      layers: [streetLayer, storyMarkers],
    });

    L.control.layers(
      { 'Street Map': streetLayer, 'Satellite': satelliteLayer },
      { 'Story Markers': storyMarkers }
    ).addTo(map);

    const latInput = document.getElementById('lat-display');
    const lonInput = document.getElementById('lon-display');

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);
    });

    const onSuccess = (stories) => {
      if (!stories.length) {
        storyListEl.textContent = 'No stories found.';
        return;
      }

      storyListEl.innerHTML = '';
      stories.forEach((story) => {
        const item = document.createElement('article');
        item.setAttribute('role', 'listitem');
        item.classList.add('story-card');
        item.innerHTML = `
          <div class="story-content">
            <img src="${story.photoUrl}" alt="Story by ${story.name}" width="150" loading="lazy" />
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <time datetime="${story.createdAt}">${new Date(story.createdAt).toLocaleString()}</time>
            <a href="#/detail-story/${story.id}" aria-label="View detail of ${story.name}">Details</a>
          </div>
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Bookmark';
        saveBtn.setAttribute('aria-label', `Bookmark story ${story.name}`);
        saveBtn.addEventListener('click', async () => {
          try {
            const IdbHelper = (await import('../../utils/idb.js')).default;
            await IdbHelper.putStory(story);
            alert('Story berhasil disimpan ke bookmark!');
          } catch (error) {
            console.error('Gagal menyimpan story:', error);
            alert('Gagal menyimpan story ke bookmark.');
          }
        });

        item.appendChild(saveBtn);
        storyListEl.appendChild(item);

        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]);
          marker.bindPopup(`
            <strong>${story.name}</strong>
            <p>${story.description}</p>
            <img src="${story.photoUrl}" alt="${story.name}" style="max-width: 150px;" />
          `);
          marker.on('click', () => {
            latInput.value = story.lat;
            lonInput.value = story.lon;
          });
          storyMarkers.addLayer(marker);
        }
      });

      const firstWithLocation = stories.find(story => story.lat && story.lon);
      if (firstWithLocation) {
        map.setView([firstWithLocation.lat, firstWithLocation.lon], 5);
      }
    };

    const onError = (message) => {
      storyListEl.textContent = message;
    };

    HomePresenter.loadStories(token, onSuccess, onError);

    const notifBtn = document.getElementById('notif-toggle-btn');

    try {
      const swReg = await pushNotificationHelper.registerServiceWorker();
      const existingSub = await swReg.pushManager.getSubscription();
      notifBtn.textContent = existingSub ? 'Unsubscribe 🔕' : 'Subscribe 🔔';
    } catch (err) {
      console.error('Gagal mengecek status notifikasi:', err);
      notifBtn.textContent = 'Toggle Push Notification';
    }

    notifBtn.addEventListener('click', async () => {
      try {
        const swReg = await pushNotificationHelper.registerServiceWorker();
        const existingSub = await swReg.pushManager.getSubscription();

        if (existingSub) {
          await pushNotificationHelper.unsubscribeUser(swReg, token);
          alert('Notifikasi dimatikan');
          notifBtn.textContent = 'Subscribe 🔔';
        } else {
          await pushNotificationHelper.requestPermission();
          await pushNotificationHelper.subscribeUser(swReg, token);
          alert('Notifikasi diaktifkan');
          notifBtn.textContent = 'Unsubscribe 🔕';
        }
      } catch (err) {
        console.error('Push Notification error:', err);
        alert(`Gagal mengubah status notifikasi: ${err.message}`);
      }
    });
  }
};

export default HomePage;
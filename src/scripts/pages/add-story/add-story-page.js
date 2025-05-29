import AddStoryPresenter from '../../presenter/add-story-presenter.js';

const AddStoryPage = {
  render() {
    return /*html*/ `
      <style>
        .add-story-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          text-align: center;
          font-size: 2em;
          color: #0078d4;
          margin-bottom: 20px;
        }

        .story-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 1.1em;
          color: #333;
        }

        .form-input {
          padding: 10px;
          font-size: 1em;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
        }

        .form-input:focus {
          border-color: #0078d4;
        }

        textarea {
          height: 150px;
          resize: none;
        }

        .camera-preview {
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .btn-capture {
          background-color: #0078d4;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1em;
          transition: background-color 0.3s;
        }

        .btn-capture:hover {
          background-color: #005a8a;
        }

        .image-preview-container {
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }

        .map-container {
          height: 300px;
          margin-top: 10px;
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

      <main class="add-story-container">
        <h2 class="page-title">Add New Story</h2>
        <form id="add-story-form" enctype="multipart/form-data" aria-label="Add new story form" class="story-form">
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required class="form-input" placeholder="Describe your story..."></textarea>
          </div>

          <div class="form-group">
            <label>Camera Preview</label>
            <video id="camera" width="100%" autoplay muted class="camera-preview"></video>
            <canvas id="canvas" style="display:none;"></canvas>
            <button type="button" id="capture-btn" class="btn-capture">📸 Capture Image</button>
          </div>

          <div class="form-group">
            <label for="fileInput">Or Choose Image from Device:</label>
            <input type="file" id="fileInput" accept="image/*" class="form-input" />
            <div id="image-preview" class="image-preview-container"></div>
          </div>

          <div class="form-group">
            <label>Pick Location (click on map)</label>
            <div id="map" class="map-container"></div>
            <div id="location-display" aria-live="polite" class="location-display">
              Location not selected
            </div>
          </div>

          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />

          <button type="submit" class="btn-submit">Submit</button>
        </form>

        <a href="#/home" aria-label="Back to home" class="back-home-link">← Back</a>
      </main>
    `;
  },

  async afterRender() {
    const user = JSON.parse(localStorage.getItem('storyAppUser'));
    if (!user) {
      location.hash = '#/login';
      return;
    }

    AddStoryPresenter.init({
      user,
      form: document.getElementById('add-story-form'),
      video: document.getElementById('camera'),
      canvas: document.getElementById('canvas'),
      captureBtn: document.getElementById('capture-btn'),
      fileInput: document.getElementById('fileInput'),
      previewContainer: document.getElementById('image-preview'),
      latInput: document.getElementById('lat'),
      lonInput: document.getElementById('lon'),
      locationDisplay: document.getElementById('location-display'),
    });
  },
};

export default AddStoryPage;
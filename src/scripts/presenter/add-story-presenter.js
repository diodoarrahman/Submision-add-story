import { addStory } from '../data/api.js';

const AddStoryPresenter = {
  init({
    user,
    form,
    video,
    canvas,
    captureBtn,
    fileInput,
    previewContainer,
    latInput,
    lonInput,
    locationDisplay,
  }) {
    this.user = user;
    this.form = form;
    this.video = video;
    this.canvas = canvas;
    this.captureBtn = captureBtn;
    this.fileInput = fileInput;
    this.previewContainer = previewContainer;
    this.latInput = latInput;
    this.lonInput = lonInput;
    this.locationDisplay = locationDisplay;

    this.capturedBlob = null;
    this.stream = null;
    this.marker = null;

    this._initCamera();
    this._initMap();
    this._initEvents();
  },

  _initCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.stream = stream;
        this.video.srcObject = stream;
      })
      .catch((err) => {
        console.error('Webcam error:', err);
        alert('Tidak bisa akses kamera. Periksa izin browser.');
      });
  },

  _stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  },

  _initMap() {
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.latInput.value = lat;
      this.lonInput.value = lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      this.locationDisplay.textContent = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
    });
  },

  _previewImage(file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '100%';
    img.style.marginTop = '10px';
    this.previewContainer.innerHTML = '';
    this.previewContainer.appendChild(img);
  },

  _initEvents() {
    this.captureBtn.addEventListener('click', () => {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      this.canvas.getContext('2d').drawImage(this.video, 0, 0);
      this.canvas.toBlob((blob) => {
        this.capturedBlob = blob;
        this.fileInput.value = '';
        this._previewImage(blob);
        alert('Gambar berhasil diambil!');
      }, 'image/jpeg', 0.9);
    });

    this.fileInput.addEventListener('change', () => {
      const file = this.fileInput.files[0];
      if (file) {
        this.capturedBlob = file;
        this._previewImage(file);
      } else {
        this.previewContainer.innerHTML = '';
        this.capturedBlob = null;
      }
    });

    this.form.addEventListener('submit', (e) => this._handleSubmit(e));

    window.addEventListener('hashchange', () => {
      this._stopCamera(); 
    });
  },

  async _handleSubmit(e) {
    e.preventDefault();

    const desc = this.form.elements.description.value.trim();
    const lat = this.latInput.value.trim();
    const lon = this.lonInput.value.trim();

    if (!this.capturedBlob) {
      alert('Silakan ambil atau pilih gambar terlebih dahulu.');
      return;
    }

    if (this.capturedBlob.size > 1_000_000) {
      alert('Ukuran foto terlalu besar. Coba ambil ulang atau pilih gambar lain.');
      return;
    }

    if (!desc) {
      alert('Deskripsi tidak boleh kosong.');
      this.form.elements.description.focus();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', desc);
      formData.append('photo', this.capturedBlob, 'photo.jpg');
      if (lat) formData.append('lat', lat);
      if (lon) formData.append('lon', lon);

      const result = await addStory(this.user.token, formData);

      if (!result.error) {
        this._stopCamera();
        alert('Story berhasil ditambahkan!');
        location.hash = '#/home';
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah story.');
    }
  },
};

export default AddStoryPresenter;
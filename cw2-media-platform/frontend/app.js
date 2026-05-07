const API_BASE = 'https://cw2-media-api-g6e6gcgxakfkgbgp.spaincentral-01.azurewebsites.net/api';

const uploadForm = document.getElementById('uploadForm');

if (uploadForm) {

  uploadForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    const message = document.getElementById('message');

    message.innerText = 'Uploading...';

    const fileInput = document.getElementById('file');

    if (!fileInput.files[0]) {
      message.innerText = 'Please choose a file first.';
      return;
    }

    const formData = new FormData();

    formData.append(
      'title',
      document.getElementById('title').value
    );

    formData.append(
      'description',
      document.getElementById('description').value
    );

    formData.append(
      'file',
      fileInput.files[0]
    );

    try {

      const response = await fetch(`${API_BASE}/uploadmedia`, {
        method: 'POST',
        body: formData
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok) {

        message.innerText =
          'Upload successful. Redirecting to gallery...';

        uploadForm.reset();

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);

      } else {

        message.innerText =
          'Upload failed: ' +
          (result.error || 'Unknown server error');
      }

    } catch (error) {

      message.innerText =
        'Upload failed: ' + error.message;
    }
  });
}
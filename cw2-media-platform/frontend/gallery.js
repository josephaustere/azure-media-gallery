const API_BASE = 'https://cw2-media-api-g6e6gcgxakfkgbgp.spaincentral-01.azurewebsites.net/api';

async function loadMedia() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '<p>Loading media...</p>';

  try {
    const response = await fetch(`${API_BASE}/getmedia`);
    const mediaItems = await response.json();

    gallery.innerHTML = '';

    if (mediaItems.length === 0) {
      gallery.innerHTML = '<p>No media uploaded yet.</p>';
      return;
    }

    mediaItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'media-card';

      let mediaElement = '';

      if (item.contentType && item.contentType.startsWith('image')) {
        mediaElement = `<img src="${item.fileUrl}" alt="${item.title}">`;
      } else if (item.contentType && item.contentType.startsWith('video')) {
        mediaElement = `<video src="${item.fileUrl}" controls></video>`;
      } else if (item.contentType && item.contentType.startsWith('audio')) {
        mediaElement = `
          <div class="audio-box">
            <audio src="${item.fileUrl}" controls></audio>
          </div>
        `;
      } else {
        mediaElement = `<a href="${item.fileUrl}" target="_blank">Open File</a>`;
      }

      card.innerHTML = `
        ${mediaElement}

        <div class="media-content">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <small>${formatDate(item.uploadDate)}</small>

          <div class="media-actions">
            <button onclick="editMedia('${item.id}', \`${escapeText(item.title)}\`, \`${escapeText(item.description)}\`)">
              Edit
            </button>

            <button class="delete-btn" onclick="deleteMedia('${item.id}')">
              Delete
            </button>
          </div>
        </div>
      `;

      gallery.appendChild(card);
    });

  } catch (error) {
    gallery.innerHTML = '<p>Failed to load media: ' + error.message + '</p>';
  }
}

async function deleteMedia(id) {
  const confirmDelete = confirm('Are you sure you want to delete this media?');

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE}/deletemedia/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Media deleted successfully.');
      loadMedia();
      return;
    }

    const errorText = await response.text();
    alert('Delete failed: ' + errorText);

  } catch (error) {
    alert('Delete failed: ' + error.message);
  }
}

async function editMedia(id, currentTitle, currentDescription) {
  const newTitle = prompt('Enter new title:', currentTitle);
  const newDescription = prompt('Enter new description:', currentDescription);

  if (newTitle === null || newDescription === null) return;

  try {
    const response = await fetch(`${API_BASE}/updatemedia/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Media updated successfully.');
      loadMedia();
    } else {
      alert('Update failed: ' + (result.error || 'Unknown error'));
    }

  } catch (error) {
    alert('Update failed: ' + error.message);
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
}

function escapeText(text) {
  if (!text) return '';
  return String(text)
    .replace(/`/g, '\\`')
    .replace(/\\/g, '\\\\');
}

loadMedia();
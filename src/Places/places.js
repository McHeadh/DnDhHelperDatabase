document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('AddPlaceButton');
  button.addEventListener('click', function () {
    window.location.href = "addPlace.html";
  });
});

async function fetchPlaces() {
  const apiUrl = `${window.apiUrl}/Places`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch places from the API.');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function deletePlace(placeId, placeDiv) {
  const deleteUrl = `${window.apiUrl}/Places/${placeId}`;
  try {
    const response = await fetch(deleteUrl, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete place from the API.');
    }

    placeDiv.remove();
  } catch (error) {
    console.error(error);
  }
}

async function displayPlaces() {
  const placeListDiv = document.querySelector('.PlaceList');

  const places = await fetchPlaces();

  places.forEach(place => {
    const placeDiv = document.createElement('div');
    placeDiv.classList.add('place');

    const nameDiv = document.createElement('div'); // Use <div> instead of <li>
    nameDiv.textContent = place.name;

    const editIcon = document.createElement('span');
    editIcon.innerHTML = '&#9998;'; // Use the pencil icon HTML entity
    editIcon.classList.add('edit-icon');
    editIcon.addEventListener('click', () => {
      editPlace(place);
    });

    const trashIcon = document.createElement('span');
    trashIcon.innerHTML = '&#128465;'; // You can set any trash icon representation you like
    trashIcon.classList.add('trash-icon');

    trashIcon.addEventListener('click', () => {
      const confirmation = confirm(`Are you sure you want to delete "${place.name}"?`);
      if (confirmation) {
        deletePlace(place.placeID, placeDiv);
      }
    });

    placeDiv.appendChild(nameDiv);
    placeDiv.appendChild(trashIcon);
    placeDiv.appendChild(editIcon);

    placeListDiv.appendChild(placeDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayPlaces();
});

function editPlace(place) {
  const editUrl = `editPlace.html?placeId=${place.placeID}`;
  window.location.href = editUrl;
}
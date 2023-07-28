var placeDetails;
//cancel button
document.addEventListener('DOMContentLoaded', async function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "places.html";
  });

  // Fetch place details and populate the form
  try {
    placeDetails = await fetchPlaceDetails();
    populateForm(placeDetails);
  } catch (error) {
    console.error('Error fetching place details:', error);
    alert('Failed to fetch place details for editing');
    window.location.href = "places.html";
  }
});

async function fetchPlaceDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get('placeId');

  const apiUrl = `${window.apiUrl}/Places/${placeId}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch place details from the API.');
    }
    const placeDetails = await response.json();
    return placeDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function populateForm(placeDetails) {
  const form = document.getElementById("EditPlaceForm");

  form.elements["name"].value = placeDetails.name || '';
  form.elements["description"].value = placeDetails.description || '';

  // Repopulate the image
  const imagePreview = document.getElementById('image-preview');
  const imageData = placeDetails.imageData || ''; // The base64 image data
  if (imageData) {
    imagePreview.src = `data:image/jpeg;base64,${imageData}`;
  } else {
    // If there's no image data, you can set a placeholder image or leave it empty
    imagePreview.src = ''; // You can set a placeholder image URL here
  }

  const imageInput = document.getElementById('image');
  imageInput.addEventListener('change', function () {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      imagePreview.src = reader.result; // Update the image preview with the selected image
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, you can set a placeholder image or leave it empty
      imagePreview.src = ''; // You can set a placeholder image URL here
    }
  });

}

//submit button

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('submit');
  var form = document.getElementById("EditPlaceForm");
  button.addEventListener('click', function () {
    event.preventDefault();

    const placeId = getPlaceIdFromUrl();
    const parsedPlaceID = parseInt(placeId);

    const placeData = {
      PlaceID: parsedPlaceID,
      Name: form.elements["name"].value,
      Description: form.elements["description"].value,
    };

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    if (imageFile) {
      // Read the image file as a base64 encoded string
      const reader = new FileReader();
      reader.onload = function () {
        placeData.ImageData = reader.result.split(',')[1]; // Get the base64 data part
        updatePlaceInDatabase(placeId, placeData)
          .then((response) => {
            console.log('Place updated successfully:', response);
            window.location.href = "places.html";
          })
          .catch((error) => {
            console.error('Error updating place:', error);
            alert('Failed to update the place');
          });
      };
      reader.readAsDataURL(imageFile);
    } else {
      // If no image is selected, update the place data without ImageData
      placeData.ImageData = placeDetails.imageData;
      updatePlaceInDatabase(placeId, placeData)
        .then((response) => {
          console.log('Place updated successfully:', response);
          window.location.href = "places.html";
        })
        .catch((error) => {
          console.error('Error updating place:', error);
          alert('Failed to update the place');
        });
    }

  });
});

function getPlaceIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get('placeId');
  return placeId;
}

async function updatePlaceInDatabase(placeId, placeData) {
  
  const apiUrl = `${window.apiUrl}/Places/${placeId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update place in the database');
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "places.html";
  });
});

document.addEventListener('DOMContentLoaded', async function () {
  const avaliableRegions = await fetchRegionNames();

  var regionSelect = document.getElementById('region');

  for (const region of avaliableRegions) {
    const newOption = document.createElement('option');
    newOption.value = region.regionID;
    newOption.innerHTML = region.name;
    regionSelect.appendChild(newOption);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('image-preview');
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
});

document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('submit');
  var form = document.getElementById("AddPlaceForm");
  var regionSelect = document.getElementById('region');
  button.addEventListener('click', function () {
    event.preventDefault();
    var name = form.elements["name"].value;
    var description = form.elements["description"].value;
    var region = regionSelect.value;
    var isVisible = form.elements["isVisible"].checked;

    const newPlaceData = {
      Name: name,
      Description: description,
      RegionID: region,
      IsVisible: isVisible,
    };

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        newPlaceData.ImageData = reader.result.split(',')[1];
        addPlaceToDatabase(newPlaceData)
          .then((response) => {
            console.log('Place added successfully:', response);
            window.location.href = "places.html";
          })
          .catch((error) => {
            console.error('Error adding place:', error);
            alert('Failed to add a place');
          });
      }
      reader.readAsDataURL(imageFile);
    }
    else {
      addPlaceToDatabase(newPlaceData)
        .then((response) => {
          console.log('Place added successfully:', response);
          window.location.href = "places.html";
        })
        .catch((error) => {
          console.error('Error adding place:', error);
          alert('Failed to add an place');
        });
    }
  });
});

async function addPlaceToDatabase(placeData) {
  const apiUrl = `${window.apiUrl}/Places`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeData),
    });

    if (!response.ok) {
      throw new Error('Failed to add place to the database');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchRegionNames() {
  const apiUrl = `${window.apiUrl}/Regions/Names`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch enemies from the API.');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
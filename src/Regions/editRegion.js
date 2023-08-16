var regionDetails;
//cancel button
document.addEventListener('DOMContentLoaded', async function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "regions.html";
  });

  // Fetch region details and populate the form
  try {
    regionDetails = await fetchRegionDetails();
    populateForm(regionDetails);
  } catch (error) {
    console.error('Error fetching region details:', error);
    alert('Failed to fetch region details for editing');
    window.location.href = "regions.html";
  }
});

async function fetchRegionDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const regionId = urlParams.get('regionId');
  
    const apiUrl = `${window.apiUrl}/Regions/${regionId}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch region details from the API.');
      }
      const regionDetails = await response.json();
      return regionDetails;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function populateForm(regionDetails) {
    const form = document.getElementById("EditRegionForm");
  
    form.elements["name"].value = regionDetails.name || '';
    form.elements["description"].value = regionDetails.description || '';
    form.elements["isVisible"].checked = regionDetails.isVisible;
  
    // Repopulate the image
    const imagePreview = document.getElementById('image-preview');
    const imageData = regionDetails.imageData || ''; // The base64 image data
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

  function getRegionIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const regionId = urlParams.get('regionId');
    return regionId;
  }

  async function updateRegionInDatabase(regionId, regionData) {
  
    const apiUrl = `${window.apiUrl}/Regions/${regionId}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regionData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update region in the database');
      }
  
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

//submit button

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('submit');
    var form = document.getElementById("EditRegionForm");
    button.addEventListener('click', function () {
      event.preventDefault();
  
      const regionId = getRegionIdFromUrl();
      const parsedRegionID = parseInt(regionId);
  
      const regionData = {
        RegionID: parsedRegionID,
        Name: form.elements["name"].value,
        Description: form.elements["description"].value,
        IsVisible: form.elements["isVisible"].checked,
      };
  
      const imageInput = document.getElementById('image');
      const imageFile = imageInput.files[0];
  
      if (imageFile) {
        // Read the image file as a base64 encoded string
        const reader = new FileReader();
        reader.onload = function () {
          regionData.ImageData = reader.result.split(',')[1]; // Get the base64 data part
          updateRegionInDatabase(regionId, regionData)
            .then((response) => {
              console.log('Region updated successfully:', response);
              window.location.href = "regions.html";
            })
            .catch((error) => {
              console.error('Error updating region:', error);
              alert('Failed to update the region');
            });
        };
        reader.readAsDataURL(imageFile);
      } else {
        // If no image is selected, update the region data without ImageData
        regionData.ImageData = regionDetails.imageData;
        updateRegionInDatabase(regionId, regionData)
          .then((response) => {
            console.log('Region updated successfully:', response);
            window.location.href = "regions.html";
          })
          .catch((error) => {
            console.error('Error updating region:', error);
            alert('Failed to update the region');
          });
      }
  
    });
  });
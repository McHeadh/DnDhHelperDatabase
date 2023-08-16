document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('cancel');
    button.addEventListener('click', function () {
      window.location.href = "regions.html";
    });
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
    var form = document.getElementById("AddRegionForm");
    button.addEventListener('click', function () {
      event.preventDefault();
      var name = form.elements["name"].value;
      var description = form.elements["description"].value;
      var isVisible = form.elements["isVisible"].checked;
  
      const newRegionData = {
        Name: name,
        Description: description,
        IsVisible: isVisible,
      };
  
      const imageInput = document.getElementById('image');
      const imageFile = imageInput.files[0];
  
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function () {
            newRegionData.ImageData = reader.result.split(',')[1];
          addRegionToDatabase(newRegionData)
            .then((response) => {
              console.log('Region added successfully:', response);
              window.location.href = "regions.html";
            })
            .catch((error) => {
              console.error('Error adding region:', error);
              alert('Failed to add a region');
            });
        }
        reader.readAsDataURL(imageFile);
      }
      else {
        addRegionToDatabase(newRegionData)
          .then((response) => {
            console.log('Region added successfully:', response);
            window.location.href = "regions.html";
          })
          .catch((error) => {
            console.error('Error adding region:', error);
            alert('Failed to add a region');
          });
      }
    });
  });

  async function addRegionToDatabase(regionData) {
    const apiUrl = `${window.apiUrl}/Regions`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regionData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add region to the database');
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
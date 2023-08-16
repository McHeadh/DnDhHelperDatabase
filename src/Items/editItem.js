var itemDetails;
//cancel button
document.addEventListener('DOMContentLoaded', async function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "items.html";
  });

  // Fetch item details and populate the form
  try {
    itemDetails = await fetchItemDetails();
    populateForm(itemDetails);
  } catch (error) {
    console.error('Error fetching item details:', error);
    alert('Failed to fetch item details for editing');
    window.location.href = "items.html";
  }
});

async function fetchItemDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');

  const apiUrl = `${window.apiUrl}/Items/${itemId}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch item details from the API.');
    }
    const itemDetails = await response.json();
    return itemDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function populateForm(itemDetails) {
  const form = document.getElementById("EditItemForm");

  form.elements["name"].value = itemDetails.name || '';
  form.elements["description"].value = itemDetails.description || '';
  form.elements["effect"].value = itemDetails.effect || '';
  form.elements["rarity"].value = itemDetails.rarity || '';
  form.elements["price"].value = itemDetails.price || '';
  form.elements["isVisible"].checked = itemDetails.isVisible;

  // Handle the case where shopType is null (uncategorized)
  if (itemDetails.shopType === null) {
    form.elements["shopType"].value = 'uncategorized';
  } else {
    form.elements["shopType"].value = itemDetails.shopType;
  }

  // Repopulate the image
  const imagePreview = document.getElementById('image-preview');
  const imageData = itemDetails.imageData || ''; // The base64 image data
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
  var form = document.getElementById("EditItemForm");
  button.addEventListener('click', function () {
    event.preventDefault();

    const itemId = getItemIdFromUrl();
    const parsedItemID = parseInt(itemId);

    const itemData = {
      ItemID: parsedItemID,
      Name: form.elements["name"].value,
      Description: form.elements["description"].value,
      Effect: form.elements["effect"].value,
      Rarity: form.elements["rarity"].value,
      Price: parseInt(form.elements["price"].value),
      ShopType: form.elements["shopType"].value === 'uncategorized' ? null : form.elements["shopType"].value,
      IsVisible: form.elements["isVisible"].checked,
    };

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    if (imageFile) {
      // Read the image file as a base64 encoded string
      const reader = new FileReader();
      reader.onload = function () {
        itemData.ImageData = reader.result.split(',')[1]; // Get the base64 data part
        updateItemInDatabase(itemId, itemData)
          .then((response) => {
            console.log('Item updated successfully:', response);
            window.location.href = "items.html";
          })
          .catch((error) => {
            console.error('Error updating item:', error);
            alert('Failed to update the item');
          });
      };
      reader.readAsDataURL(imageFile);
    } else {
      // If no image is selected, update the item data without ImageData
      itemData.ImageData = itemDetails.imageData;
      updateItemInDatabase(itemId, itemData)
        .then((response) => {
          console.log('Item updated successfully:', response);
          window.location.href = "items.html";
        })
        .catch((error) => {
          console.error('Error updating item:', error);
          alert('Failed to update the item');
        });
    }

  });
});

function getItemIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');
  return itemId;
}

async function updateItemInDatabase(itemId, itemData) {
  
  const apiUrl = `${window.apiUrl}/Items/${itemId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to update item in the database');
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

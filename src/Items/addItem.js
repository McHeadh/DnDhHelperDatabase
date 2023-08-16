document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "items.html";
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
  var form = document.getElementById("AddItemForm");
  button.addEventListener('click', function () {
    event.preventDefault();
    var name = form.elements["name"].value;
    var description = form.elements["description"].value;
    var effect = form.elements["effect"].value;
    var rarity = form.elements["rarity"].value;
    var price = form.elements["price"].value;
    var isVisible = form.elements["isVisible"].checked;

    var shopType;
    if (form.elements["shopType"].value == 'uncategorized')
      shopType = null;
    else
      shopType = form.elements["shopType"].value;

    const newItemData = {
      Name: name,
      Description: description,
      Effect: effect,
      Rarity: rarity,
      Price: price,
      ShopType: shopType,
      IsVisible: isVisible,
    };

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        newItemData.ImageData = reader.result.split(',')[1];
        addItemToDatabase(newItemData)
          .then((response) => {
            console.log('Item added successfully:', response);
            window.location.href = "items.html";
          })
          .catch((error) => {
            console.error('Error adding item:', error);
            alert('Failed to add an item');
          });
      }
      reader.readAsDataURL(imageFile);
    }
    else {
      addItemToDatabase(newItemData)
        .then((response) => {
          console.log('Item added successfully:', response);
          window.location.href = "items.html";
        })
        .catch((error) => {
          console.error('Error adding item:', error);
          alert('Failed to add an item');
        });
    }
  });
});

async function addItemToDatabase(itemData) {
  const apiUrl = `${window.apiUrl}/Items`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to the database');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
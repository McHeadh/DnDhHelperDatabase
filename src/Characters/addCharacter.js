document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "characters.html";
  });
});

function addCharacteristicField() {
  const characteristicsContainer = document.getElementById('characteristics-container');
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.name = 'characteristic';
  characteristicsContainer.appendChild(newInput);
  characteristicsContainer.appendChild(document.createElement('br'));
  characteristicsContainer.appendChild(document.createElement('br'));
}

function getCharacteristics() {
  const characteristics = [];
  const characteristicsContainer = document.getElementById('characteristics-container');
  const characteristicInputs = characteristicsContainer.getElementsByTagName('input');
  for (let i = 0; i < characteristicInputs.length; i++) {
    characteristics.push(characteristicInputs[i].value);
  }
  return characteristics;
}

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
  var form = document.getElementById("AddCharacterForm");

  button.addEventListener('click', function () {
    event.preventDefault();
    var name = form.elements["name"].value;
    var description = form.elements["description"].value;
    var positionInTown = form.elements["positionInTown"].value;
    var status = form.elements["status"].value;
    var category = form.elements["category"].value;


    const newCharacterData = {
      Name: name,
      Description: description,
      PositionInTown: positionInTown,
      Status: status,
      Category: category,
    };

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    var characteristics = getCharacteristics();

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        newCharacterData.ImageData = reader.result.split(',')[1];
        addCharacterToDatabase(newCharacterData)
          .then((response) => {
            console.log('Character added successfully:', response);
            var createdCharacter = response;
            console.log(createdCharacter.characterID);
            addCharacteristicsToDatabase(createdCharacter.characterID, characteristics)
              .then((response) => {
                console.log('Characteristics added successfully:', response);
                window.location.href = "characters.html";
              })
              .catch((error) => {
                console.error('Error adding characteristics:', error);
                alert('Failed to add a characteristics');
              });

            //window.location.href = "characters.html";
          })
          .catch((error) => {
            console.error('Error adding character:', error);
            alert('Failed to add a character');
          });
      }
      reader.readAsDataURL(imageFile);
    }
    else {
      addCharacterToDatabase(newCharacterData)
        .then((response) => {
          console.log('Character added successfully:', response);
          var createdCharacter = response;
          console.log(createdCharacter.characterID);
          addCharacteristicsToDatabase(createdCharacter.characterID, characteristics)
            .then((response) => {
              console.log('Characteristics added successfully:', response);
              window.location.href = "characters.html";
            })
            .catch((error) => {
              console.error('Error adding characteristics:', error);
              alert('Failed to add a characteristics');
            });

          //window.location.href = "characters.html";
        })
        .catch((error) => {
          console.error('Error adding character:', error);
          alert('Failed to add a character');
        });
    }
  });
})

async function addCharacterToDatabase(characterData) {
  const apiUrl = `${window.apiUrl}/Characters`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      throw new Error('Failed to add character to the database');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addCharacteristicsToDatabase(characterID, characteristicData) {
  const apiUrl = `${window.apiUrl}/Characteristics`;

  try {
    //const characterData = await characterDataPromise;
    if (characteristicData.length > 0) {
      for (const characteristic of characteristicData) {

        const newCharacteristicData = {
          CharacterID: characterID,
          Value: characteristic,
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCharacteristicData),
        });

        if (!response.ok) {
          throw new Error('Failed to add characteristic to the database');
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

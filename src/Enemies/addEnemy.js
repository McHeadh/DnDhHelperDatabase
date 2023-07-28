document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('cancel');
  button.addEventListener('click', function () {
    window.location.href = "enemies.html";
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
  var form = document.getElementById("AddEnemyForm");

  button.addEventListener('click', function () {
    event.preventDefault();
    var name = form.elements["name"].value;
    var description = form.elements["description"].value;
    var status = form.elements["status"].value;
    var category = form.elements["category"].value;

    const newEnemyData = {
      Name: name,
      Description: description,
      Status: status,
      Category: category,
    };

    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];

    var characteristics = getCharacteristics();

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function () {
        newEnemyData.ImageData = reader.result.split(',')[1];
        addEnemyToDatabase(newEnemyData)
          .then((response) => {
            console.log('Enemy added successfully:', response);
            var createdEnemy = response;
            console.log(createdEnemy.EnemyID);
            addCharacteristicsToDatabase(createdEnemy.EnemyID, characteristics)
              .then((response) => {
                console.log('Characteristics added successfully:', response);
                window.location.href = "enemies.html";
              })
              .catch((error) => {
                console.error('Error adding characteristics:', error);
                alert('Failed to add a characteristics');
              });

            //window.location.href = "characters.html";
          })
          .catch((error) => {
            console.error('Error adding Enemy:', error);
            alert('Failed to add an Enemy');
          });
      }
      reader.readAsDataURL(imageFile);
    }
    else {
      addEnemyToDatabase(newEnemyData)
        .then((response) => {
          console.log('Enemy added successfully:', response);
          var createdEnemy = response;
          console.log(createdEnemy.enemyID);
          addCharacteristicsToDatabase(createdEnemy.enemyID, characteristics)
            .then((response) => {
              console.log('Characteristics added successfully:', response);
              window.location.href = "enemies.html";
            })
            .catch((error) => {
              console.error('Error adding characteristics:', error);
              alert('Failed to add a characteristics');
            });

        })
        .catch((error) => {
          console.error('Error adding enemy:', error);
          alert('Failed to add an enemy');
        });
    }
  });
})

async function addEnemyToDatabase(enemyData) {
  const apiUrl = `${window.apiUrl}/Enemies`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enemyData),
    });

    if (!response.ok) {
      throw new Error('Failed to add enemy to the database');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addCharacteristicsToDatabase(enemyID, characteristicData) {
  const apiUrl = `${window.apiUrl}/EnemyCharacteristics`;

  try {
    //const characterData = await characterDataPromise;
    if (characteristicData.length > 0) {
      for (const characteristic of characteristicData) {

        const newCharacteristicData = {
          EnemyID: enemyID,
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

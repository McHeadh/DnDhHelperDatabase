var characterDetails;
var trashedCharacteristics = [];
//cancel button
document.addEventListener('DOMContentLoaded', async function () {
    const button = document.getElementById('cancel');
    button.addEventListener('click', function () {
        window.location.href = "characters.html";
    });

    try {
        characterDetails = await fetchCharacterDetails();

        console.log(characterDetails);

    } catch (error) {
        console.error('Error fetching character details:', error);
        alert('Failed to fetch character details for editing');
        window.location.href = "characters.html";
    }

    populateForm(characterDetails);
});

function addCharacteristicField() {
    const characteristicsContainer = document.getElementById('characteristics-container');

    const characteristicDiv = document.createElement('div');
    characteristicDiv.classList.add('characteristic-field');

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'characteristic';

    const deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '&#128465;'; // Use the pencil icon HTML entity
    deleteIcon.classList.add('trash-icon');
    deleteIcon.style.paddingLeft = '15px';
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.addEventListener('click', () => {
        characteristicDiv.remove();
    });

    characteristicDiv.appendChild(newInput);
    characteristicDiv.appendChild(deleteIcon);
    characteristicDiv.appendChild(document.createElement('br'));
    characteristicDiv.appendChild(document.createElement('br'));

    characteristicsContainer.appendChild(characteristicDiv);
}

async function fetchCharacterDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('characterId');

    const apiUrl = `${window.apiUrl}/Characters/${characterId}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch character details from the API.');
        }
        const characterDetails = await response.json();
        return characterDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function populateForm(characterDetails) {
    const form = document.getElementById("EditCharacterForm");

    form.elements["name"].value = characterDetails.name || '';
    form.elements["description"].value = characterDetails.description || '';
    form.elements["positionInTown"].value = characterDetails.positionInTown || '';
    form.elements["status"].value = characterDetails.status || '';
    form.elements["category"].value = characterDetails.category || '';

    var characteristicList = characterDetails.characteristics;
    console.log(characteristicList);

    const characteristicsContainer = document.getElementById('characteristics-container');

    if (characteristicList.length > 0) {

        for (const characteristic of characteristicList) {
            const characteristicDiv = document.createElement('div');
            characteristicDiv.classList.add('characteristic-field');

            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.name = 'characteristic';
            newInput.value = characteristic.value;
            newInput.setAttribute('data-characteristic-id', characteristic.characteristicID);

            const deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '&#128465;'; // Use the pencil icon HTML entity
            deleteIcon.classList.add('trash-icon');
            deleteIcon.style.paddingLeft = '15px';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.addEventListener('click', () => {
                //add to trashedList
                //console.log(characteristic.value);
                trashedCharacteristics.push(characteristic);
                characteristicDiv.remove();

                console.log(trashedCharacteristics);
            });

            characteristicDiv.appendChild(newInput);
            characteristicDiv.appendChild(deleteIcon);
            characteristicDiv.appendChild(document.createElement('br'));
            characteristicDiv.appendChild(document.createElement('br'));

            characteristicsContainer.appendChild(characteristicDiv);
        }
    }

    // Repopulate the image
    const imagePreview = document.getElementById('image-preview');
    const imageData = characterDetails.imageData || ''; // The base64 image data
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


document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('submit');
    var form = document.getElementById("EditCharacterForm");

    button.addEventListener('click', function () {
        event.preventDefault();

        const characterId = getCharacterIdFromUrl();
        const parsedCharacterID = parseInt(characterId);

        const characterData = {
            CharacterID: parsedCharacterID,
            Name: form.elements["name"].value,
            Description: form.elements["description"].value,
            PositionInTown: form.elements["positionInTown"].value,
            Status: form.elements["status"].value,
            Category: form.elements["category"].value,
        };

        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function () {
                characterData.ImageData = reader.result.split(',')[1];

                updateCharacterInDatabase(characterId, characterData)
                    .then((response) => {
                        console.log('Character updated successfully:', response);
                        window.location.href = "characters.html";
                    })
                    .catch((error) => {
                        console.error('Error updating character:', error);
                        alert('Failed to update the character');
                    });
            }
        }
        else {
            characterData.ImageData = characterDetails.imageData;
            updateCharacterInDatabase(characterId, characterData)
                .then((response) => {
                    console.log('Character updated successfully:', response);
                    window.location.href = "characters.html";
                })
                .catch((error) => {
                    console.error('Error updating character:', error);
                    alert('Failed to update the character');
                });
        }

        const characteristicsContainer = document.getElementById('characteristics-container');
        const characteristicInputs = characteristicsContainer.querySelectorAll('input[name="characteristic"]');

        for (const characteristic of trashedCharacteristics) {
            console.log('characteristic: ' + characteristic.characteristicID);
            deleteCharacteristic(characteristic.characteristicID);
            //delete from database 
        }

        for (const inputElement of characteristicInputs) {

            if (inputElement.hasAttribute('data-characteristic-id')) { // if it has id PUT request to update
                updateCharacteristicInDatabase(inputElement.getAttribute('data-characteristic-id'), inputElement.value, characterDetails.characterID);
            }
            else { // if it doesn't have id POST request to add new
                addCharacteristicToDatabase(characterDetails.characterID, inputElement.value);
            }
        }

    });
});

function getCharacterIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('characterId');
    return characterId;
}

async function updateCharacterInDatabase(characterId, characterData) {

    const apiUrl = `${window.apiUrl}/Characters/${characterId}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(characterData),
        });

        if (!response.ok) {
            throw new Error('Failed to update character in the database');
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteCharacteristic(characteristicId) {
    const deleteUrl = `${window.apiUrl}/Characteristics/${characteristicId}`;
    try {
        const response = await fetch(deleteUrl, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete characteristic from the API.');
        }

    } catch (error) {
        console.error(error);
    }
}

async function updateCharacteristicInDatabase(characteristicId, characteristicValue, characterId) {

    const apiUrl = `${window.apiUrl}/Characteristics/${characteristicId}`;

    try {
        const newCharacteristicData = {
            CharacteristicID: characteristicId,
            CharacterID: characterId,
            Value: characteristicValue,
        };

        console.log(newCharacteristicData);

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCharacteristicData),
        });

        if (!response.ok) {
            throw new Error('Failed to update characteristic in the database');
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addCharacteristicToDatabase(characterID, characteristicValue) {
    const apiUrl = `${window.apiUrl}/Characteristics`;

    try {
        const newCharacteristicData = {
            CharacterID: characterID,
            Value: characteristicValue,
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
    } catch (error) {
        console.error(error);
        throw error;
    }
}

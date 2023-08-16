var enemyDetails;
var avaliableRegions;
var trashedCharacteristics = [];
var trashedRegions = [];
//cancel button
document.addEventListener('DOMContentLoaded', async function () {
    const button = document.getElementById('cancel');
    button.addEventListener('click', function () {
        window.location.href = "enemies.html";
    });

    try {
        enemyDetails = await fetchEnemyDetails();

        console.log(enemyDetails);

    } catch (error) {
        console.error('Error fetching enemy details:', error);
        alert('Failed to fetch enemy details for editing');
        window.location.href = "enemies.html";
    }

    try {
        avaliableRegions = await fetchRegionNames();

        console.log(avaliableRegions);

    } catch (error) {
        console.error('Error fetching region names:', error);
        alert('Failed to fetch region names for editing');
        window.location.href = "enemies.html";
    }

    populateForm(enemyDetails, avaliableRegions);
});

function addCharacteristicField() {
    const characteristicsContainer = document.getElementById('characteristics-container');

    const characteristicDiv = document.createElement('div');
    characteristicDiv.classList.add('characteristic-field');

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'characteristic';

    const deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '&#128465;';
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

async function fetchEnemyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const enemyId = urlParams.get('enemyId');

    const apiUrl = `${window.apiUrl}/Enemies/${enemyId}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch enemy details from the API.');
        }
        const enemyDetails = await response.json();
        return enemyDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function populateForm(enemyDetails, avaliableRegions) {
    const form = document.getElementById("EditEnemyForm");

    form.elements["name"].value = enemyDetails.name || '';
    form.elements["description"].value = enemyDetails.description || '';
    form.elements["status"].value = enemyDetails.status || '';
    form.elements["category"].value = enemyDetails.category || '';
    form.elements["isVisible"].checked = enemyDetails.isVisible;

    var characteristicList = enemyDetails.characteristics;
    console.log(characteristicList);
    var regionList = enemyDetails.regions;
    console.log(regionList);

    const characteristicsContainer = document.getElementById('characteristics-container');
    const regionsContainer = document.getElementById('regions-container');

    if (characteristicList.length > 0) {

        for (const characteristic of characteristicList) {
            const characteristicDiv = document.createElement('div');
            characteristicDiv.classList.add('characteristic-field');

            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.name = 'characteristic';
            newInput.value = characteristic.value;
            newInput.setAttribute('data-characteristic-id', characteristic.enemyCharacteristicID);

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

    if (regionList.length > 0) {

        for (const region of regionList) {
            const regionDiv = document.createElement('div');
            regionDiv.classList.add('region-field');

            const newSelect = document.createElement('select');
            newSelect.name = 'region';
            newSelect.setAttribute('data-region-link-id', region.enemyToRegionID);

            for (const element of avaliableRegions) {
                const newOption = document.createElement('option');
                newOption.value = element.regionID;
                newOption.innerHTML = element.name;
                if (element.regionID === region.region.regionID) {
                    newOption.selected = true;
                }
                newSelect.appendChild(newOption);
            }

            const deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = '&#128465;'; // Use the pencil icon HTML entity
            deleteIcon.classList.add('trash-icon');
            deleteIcon.style.paddingLeft = '15px';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.addEventListener('click', () => {
                //add to trashedList
                trashedRegions.push(region);
                regionDiv.remove();

                console.log(trashedRegions);
            });

            regionDiv.appendChild(newSelect);
            regionDiv.appendChild(deleteIcon);
            regionDiv.appendChild(document.createElement('br'));
            regionDiv.appendChild(document.createElement('br'));

            regionsContainer.appendChild(regionDiv);
        }
    }

    // Repopulate the image
    const imagePreview = document.getElementById('image-preview');
    const imageData = enemyDetails.imageData || ''; // The base64 image data
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
    var form = document.getElementById("EditEnemyForm");

    button.addEventListener('click', function () {
        event.preventDefault();

        const enemyId = getEnemyIdFromUrl();
        const parsedEnemyID = parseInt(enemyId);

        const enemyData = {
            EnemyID: parsedEnemyID,
            Name: form.elements["name"].value,
            Description: form.elements["description"].value,
            Status: form.elements["status"].value,
            Category: form.elements["category"].value,
            IsVisible: form.elements["isVisible"].checked,
        };

        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function () {
                enemyData.ImageData = reader.result.split(',')[1];

                updateEnemyInDatabase(enemyId, enemyData)
                    .then((response) => {
                        console.log('Enemy updated successfully:', response);
                        window.location.href = "enemies.html";
                    })
                    .catch((error) => {
                        console.error('Error updating enemy:', error);
                        alert('Failed to update the enemy');
                    });
            }
        }
        else {
            enemyData.ImageData = enemyDetails.imageData;
            updateEnemyInDatabase(enemyId, enemyData)
                .then((response) => {
                    console.log('Enemy updated successfully:', response);
                    window.location.href = "enemies.html";
                })
                .catch((error) => {
                    console.error('Error updating enemy:', error);
                    alert('Failed to update the enemy');
                });
        }

        const characteristicsContainer = document.getElementById('characteristics-container');
        const characteristicInputs = characteristicsContainer.querySelectorAll('input[name="characteristic"]');

        for (const characteristic of trashedCharacteristics) {
            console.log('characteristic: ' + characteristic.enemyCharacteristicID);
            deleteCharacteristic(characteristic.enemyCharacteristicID);
            //delete from database 
        }

        for (const inputElement of characteristicInputs) {

            if (inputElement.hasAttribute('data-characteristic-id')) { // if it has id PUT request to update
                updateCharacteristicInDatabase(inputElement.getAttribute('data-characteristic-id'), inputElement.value, enemyDetails.enemyID);
            }
            else { // if it doesn't have id POST request to add new
                addCharacteristicToDatabase(enemyDetails.enemyID, inputElement.value);
            }
        }

        const regionsContainer = document.getElementById('regions-container');
        const regionSelects = regionsContainer.querySelectorAll('select[name="region"]');

        for (const region of trashedRegions) {
            deleteRegionLink(region.enemyToRegionID);
            //delete from database 
        }

        for (const regionSelect of regionSelects) {

            if (regionSelect.hasAttribute('data-region-link-id')) { // if it has id PUT request to update
                updateRegionLinkInDatabase(regionSelect.getAttribute('data-region-link-id'), enemyDetails.enemyID, regionSelect.value);
            }
            else { // if it doesn't have id POST request to add new
                addRegionLinkToDatabase(enemyDetails.enemyID, regionSelect.value);
            }
        }

    });
});

function getEnemyIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const enemyId = urlParams.get('enemyId');
    return enemyId;
}

async function updateEnemyInDatabase(enemyId, enemyData) {

    const apiUrl = `${window.apiUrl}/Enemies/${enemyId}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enemyData),
        });

        if (!response.ok) {
            throw new Error('Failed to update enemy in the database');
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteCharacteristic(characteristicId) {
    const deleteUrl = `${window.apiUrl}/EnemyCharacteristics/${characteristicId}`;
    try {
        const response = await fetch(deleteUrl, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete characteristic from the API.');
        }

    } catch (error) {
        console.error(error);
    }
}

async function updateCharacteristicInDatabase(characteristicId, characteristicValue, enemyId) {

    const apiUrl = `${window.apiUrl}/EnemyCharacteristics/${characteristicId}`;

    try {
        const newCharacteristicData = {
            EnemyCharacteristicID: characteristicId,
            EnemyID: enemyId,
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

async function addCharacteristicToDatabase(enemyID, characteristicValue) {
    const apiUrl = `${window.apiUrl}/EnemyCharacteristics`;

    try {
        const newCharacteristicData = {
            EnemyID: enemyID,
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

async function addRegionField() {
    const regionNames = await fetchRegionNames(); // Fetch the available regions
    const regionsContainer = document.getElementById('regions-container');

    const regionDiv = document.createElement('div');
    regionDiv.classList.add('region-field');

    const newSelect = document.createElement('select');
    newSelect.name = 'region';

    for (const element of regionNames) {
        const newOption = document.createElement('option');
        newOption.value = element.regionID;
        newOption.innerHTML = element.name;
        newSelect.appendChild(newOption);
    }

    const deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '&#128465;';
    deleteIcon.classList.add('trash-icon');
    deleteIcon.style.paddingLeft = '15px';
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.addEventListener('click', () => {
        regionDiv.remove();
    });

    regionDiv.appendChild(newSelect);
    regionDiv.appendChild(deleteIcon);
    regionDiv.appendChild(document.createElement('br'));
    regionDiv.appendChild(document.createElement('br'));

    regionsContainer.appendChild(regionDiv);
}

async function deleteRegionLink(regionLinkId) {
    const deleteUrl = `${window.apiUrl}/EnemyToRegions/${regionLinkId}`;
    try {
        const response = await fetch(deleteUrl, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete region link from the API.');
        }

    } catch (error) {
        console.error(error);
    }
}

async function updateRegionLinkInDatabase(linkId, enemyId, regionIdString) {
    const apiUrl = `${window.apiUrl}/EnemyToRegions/${linkId}`;

    const regionId = parseInt(regionIdString, 10);

    try {
        const newRegionLinkData = {
            EnemyToRegionID: linkId,
            EnemyID: enemyId,
            RegionID: regionId,
        };

        console.log(newRegionLinkData);

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRegionLinkData),
        });

        if (!response.ok) {
            throw new Error('Failed to update region link in the database');
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addRegionLinkToDatabase(enemyId, regionIdString) {
    const apiUrl = `${window.apiUrl}/EnemyToRegions`;

    const regionId = parseInt(regionIdString, 10);

    try {
        const newRegionLinkData = {
            EnemyID: enemyId,
            RegionID: regionId,
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRegionLinkData),
        });

        if (!response.ok) {
            throw new Error('Failed to add Region Link to the database');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}





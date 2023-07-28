document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('AddCharacterButton');
  button.addEventListener('click', function () {
    window.location.href = "addCharacter.html";
  });
});

async function fetchCharacters() {
  const apiUrl = `${window.apiUrl}/Characters`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch characters from the API.');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function deleteCharacter(characterId, characterDiv) {
  const deleteUrl = `${window.apiUrl}/Characters/${characterId}`;
  try {
    const response = await fetch(deleteUrl, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete character from the API.');
    }
    // If successful, remove the character from the UI
    characterDiv.remove();
  } catch (error) {
    console.error(error);
  }
}

async function displayCharacters() {
  const characterListDiv = document.querySelector('.CharacterList');

  const characters = await fetchCharacters();

  characters.forEach(character => {
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');

    const nameDiv = document.createElement('div');
    nameDiv.textContent = character.name;

    const editIcon = document.createElement('span');
    editIcon.innerHTML = '&#9998;'; // Use the pencil icon HTML entity
    editIcon.classList.add('edit-icon');
    editIcon.addEventListener('click', () => {
      editCharacter(character);
    });

    const trashIcon = document.createElement('span');
    trashIcon.innerHTML = '&#128465;'; // You can set any trash icon representation you like
    trashIcon.classList.add('trash-icon');

    trashIcon.addEventListener('click', () => {
      const confirmation = confirm(`Are you sure you want to delete "${character.name}"?`);
      if (confirmation) {
        deleteCharacter(character.characterID, characterDiv);
      }
    });

    characterDiv.appendChild(nameDiv);
    characterDiv.appendChild(trashIcon);
    characterDiv.appendChild(editIcon);

    characterListDiv.appendChild(characterDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayCharacters();
});

function editCharacter(character) {
  const editUrl = `editCharacter.html?characterId=${character.characterID}`;
  window.location.href = editUrl;
}
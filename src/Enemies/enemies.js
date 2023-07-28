document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('AddEnemyButton');
  button.addEventListener('click', function () {
    window.location.href = "addEnemy.html";
  });
});

async function fetchEnemies() {
  const apiUrl = `${window.apiUrl}/Enemies`;

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

async function deleteEnemy(enemyId, enemyDiv) {
  const deleteUrl = `${window.apiUrl}/Enemies/${enemyId}`;
  try {
    const response = await fetch(deleteUrl, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete enemy from the API.');
    }
    // If successful, remove the enemy from the UI
    enemyDiv.remove();
  } catch (error) {
    console.error(error);
  }
}

async function displayEnemies() {
  const enemyListDiv = document.querySelector('.EnemyList');

  const enemies = await fetchEnemies();

  enemies.forEach(enemy => {
    const enemyDiv = document.createElement('div');
    enemyDiv.classList.add('enemy');

    const nameDiv = document.createElement('div');
    nameDiv.textContent = enemy.name;

    const editIcon = document.createElement('span');
    editIcon.innerHTML = '&#9998;'; // Use the pencil icon HTML entity
    editIcon.classList.add('edit-icon');
    editIcon.addEventListener('click', () => {
      editEnemy(enemy);
    });

    const trashIcon = document.createElement('span');
    trashIcon.innerHTML = '&#128465;'; // You can set any trash icon representation you like
    trashIcon.classList.add('trash-icon');

    trashIcon.addEventListener('click', () => {
      const confirmation = confirm(`Are you sure you want to delete "${enemy.name}"?`);
      if (confirmation) {
        deleteEnemy(enemy.enemyID, enemyDiv);
      }
    });

    enemyDiv.appendChild(nameDiv);
    enemyDiv.appendChild(trashIcon);
    enemyDiv.appendChild(editIcon);

    enemyListDiv.appendChild(enemyDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayEnemies();
});

function editEnemy(enemy) {
  const editUrl = `editEnemy.html?enemyId=${enemy.enemyID}`;
  window.location.href = editUrl;
}
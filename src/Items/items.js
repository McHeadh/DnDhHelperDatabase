document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('AddItemButton');
  button.addEventListener('click', function () {
    window.location.href = "addItem.html";
  });
});

async function fetchItems() {
  const apiUrl = `${window.apiUrl}/Items/Names`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch items from the API.');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function deleteItem(itemId, itemDiv) {
  const deleteUrl = `${window.apiUrl}/Items/${itemId}`;
  try {
    const response = await fetch(deleteUrl, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete item from the API.');
    }
    // If successful, remove the item from the UI
    itemDiv.remove();
  } catch (error) {
    console.error(error);
  }
}

async function displayItems() {
  const itemListDiv = document.querySelector('.ItemList');

  const items = await fetchItems();

  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const nameDiv = document.createElement('div'); // Use <div> instead of <li>
    nameDiv.textContent = item.name;

    const editIcon = document.createElement('span');
    editIcon.innerHTML = '&#9998;'; // Use the pencil icon HTML entity
    editIcon.classList.add('edit-icon');
    editIcon.addEventListener('click', () => {
      editItem(item);
    });

    const trashIcon = document.createElement('span');
    trashIcon.innerHTML = '&#128465;'; // You can set any trash icon representation you like
    trashIcon.classList.add('trash-icon');

    trashIcon.addEventListener('click', () => {
      const confirmation = confirm(`Are you sure you want to delete "${item.name}"?`);
      if (confirmation) {
        deleteItem(item.itemID, itemDiv);
      }
    });

    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(trashIcon);
    itemDiv.appendChild(editIcon);

    itemListDiv.appendChild(itemDiv);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayItems();
});

function editItem(item) {
  const editUrl = `editItem.html?itemId=${item.itemID}`;
  window.location.href = editUrl;
}
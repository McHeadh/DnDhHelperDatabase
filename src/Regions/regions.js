document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('AddRegionButton');
    button.addEventListener('click', function () {
      window.location.href = "addRegion.html";
    });
  });

async function fetchRegions() {
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

  async function deleteRegion(regionId, regionDiv) {
    const deleteUrl = `${window.apiUrl}/Regions/${regionId}`;
    try {
      const response = await fetch(deleteUrl, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete region from the API.');
      }
      // If successful, remove the region from the UI
      regionDiv.remove();
    } catch (error) {
      console.error(error);
    }
  }

  async function displayRegions() {
    const regionListDiv = document.querySelector('.RegionList');
  
    const regions = await fetchRegions();
  
    regions.forEach(region => {
      const regionDiv = document.createElement('div');
      regionDiv.classList.add('region');
  
      const nameDiv = document.createElement('div');
      nameDiv.textContent = region.name;
  
      const editIcon = document.createElement('span');
      editIcon.innerHTML = '&#9998;'; // Use the pencil icon HTML entity
      editIcon.classList.add('edit-icon');
      editIcon.addEventListener('click', () => {
        editRegion(region);
      });
  
      const trashIcon = document.createElement('span');
      trashIcon.innerHTML = '&#128465;'; // You can set any trash icon representation you like
      trashIcon.classList.add('trash-icon');
  
      trashIcon.addEventListener('click', () => {
        const confirmation = confirm(`Are you sure you want to delete "${region.name}"?`);
        if (confirmation) {
          deleteRegion(region.regionID, regionDiv);
        }
      });
  
      regionDiv.appendChild(nameDiv);
      regionDiv.appendChild(trashIcon);
      regionDiv.appendChild(editIcon);
  
      regionListDiv.appendChild(regionDiv);
    });
  }

  function editRegion(region) {
    const editUrl = `editRegion.html?regionId=${region.regionID}`;
    window.location.href = editUrl;
  }

  document.addEventListener('DOMContentLoaded', () => {
    displayRegions();
  });
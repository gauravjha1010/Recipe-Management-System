const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const container = document.querySelector(".grid-wrapper");
const grid = document.getElementById("recipeGrid");

fetch("/recipes.json")
  .then(res => res.json())
  .then(data => {
    if (!data[recipeId]) {
      grid.innerHTML = "<p>Recipe not found.</p>";
      return;
    }

    const details = data[recipeId].details;
    if (!details || details.length === 0) {
      grid.innerHTML = "<p>No details available.</p>";
      return;
    }

    let cols = details[0].length;
    let rows = details.length - 1;

    // Apply same grid structure as fillRecipeDetail page
    grid.classList.add("grid-view");
    grid.style.gridTemplateColumns = `243px repeat(${cols}, 180px)`;
    grid.innerHTML = "";

    // Empty top-left header
    grid.innerHTML += `<div class="step-header"></div>`;

    // Column Headers
    details[0].forEach(col => {
      grid.innerHTML += `
        <div class="col-header">${col}</div>
      `;
    });

    // Step rows + data cells
    for (let r = 1; r <= rows; r++) {
      grid.innerHTML += `<div class="step-cell">STEP-${r}</div>`;

      for (let c = 0; c < cols; c++) {
        grid.innerHTML += `
          <div class="cell">${details[r][c] || ""}</div>
        `;
      }
    }

    // Edit button action
    document.getElementById("editRecipeBtn").onclick = () => {
      window.location.href = `fillRecipeDetail.html?id=${recipeId}&edit=true`;
    };
  })
  .catch(err => {
    grid.innerHTML = "<p>Error loading recipe details.</p>";
    console.error(err);
  });
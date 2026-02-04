const details = document.getElementById("details");
const fetchData = async () => {
  try {
    const res = await fetch("recipes.json");
    const data = await res.json();
    details.innerHTML = `<h1>List of Recipes: Name & their ID</h1>`;
    for (const [id, recipe] of Object.entries(data)) {
      details.innerHTML += `
        <div class="data">
          <ul type="disc">
            <li>${recipe.name} &nbsp;&nbsp;&nbsp;&nbsp; ID: ${id}</li>
          </ul>
        </div>`;
    }
    details.innerHTML += `
      <div id="formBox">
        <input type="text" placeholder="Enter recipe id" id="recipeid">
        <input type="submit" value="Submit" id="submitBtn">
      </div>`;
    document.getElementById("submitBtn").addEventListener("click", () => {
      const idVal = document.getElementById("recipeid").value.trim();
      if (idVal) window.location.href = `value.html?id=${encodeURIComponent(idVal)}`;
      else alert("Invalid recipe ID");
    });
  } catch (e) {
    console.log(`Fetching error: ${e}`);
  }
};
fetchData();
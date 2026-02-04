document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("dynamicGrid");
    let rows = 4, cols = 5;

    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");
    const editMode = params.get("edit") === "true";

    // BUTTON VISIBILITY
    const saveDetailBtn = document.getElementById("saveDetailBtn");
    const editButtons = document.getElementById("editButtons");
    const replaceOldBtn = document.getElementById("replaceOldBtn");
    const saveNewBtn = document.getElementById("saveNewBtn");

    if (editMode) {
        saveDetailBtn.style.display = "none"; 
        editButtons.style.display = "flex";  
    }

    function saveCurrentData() {
        let saved = { headers: {}, cells: {} };
        document.querySelectorAll(".colname").forEach(i => saved.headers[i.dataset.col] = i.value);
        document.querySelectorAll("#dynamicGrid input:not(.colname)").forEach(c => saved.cells[c.name] = c.value);
        return saved;
    }

    function renderGrid(saved = null) {
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `150px repeat(${cols}, 198.6px)`;

        grid.innerHTML += `<div class="step-header"></div>`;

        for (let c = 1; c <= cols; c++) {
            grid.innerHTML += `
                <div class="col-header-input">
                    <input type="text" class="colname" data-col="${c}" placeholder="Column ${c}">
                </div>`;
        }

        for (let r = 1; r <= rows; r++) {
            grid.innerHTML += `<div class="step-cell">STEP-${r}</div>`;
            for (let c = 1; c <= cols; c++) {
                grid.innerHTML += `
                    <div class="input-group">
                        <input type="text" name="cell_r${r}_c${c}" data-col="${c}">
                    </div>`;
            }
        }

        if (saved) {
            document.querySelectorAll(".colname").forEach(inp => {
                if (saved.headers[inp.dataset.col]) inp.value = saved.headers[inp.dataset.col];
            });

            document.querySelectorAll("#dynamicGrid input:not(.colname)").forEach(inp => {
                if (saved.cells[inp.name] !== undefined) inp.value = saved.cells[inp.name];
            });
        }
    }

    renderGrid();

    // Load recipe into grid
    if (editMode && recipeId) {
        fetch("/recipes.json")
            .then(r => r.json())
            .then(data => {
                if (!data[recipeId]) return;

                let d = data[recipeId].details;
                cols = d[0].length;
                rows = d.length - 1;

                renderGrid();

                document.querySelectorAll(".colname").forEach((inp, i) => inp.value = d[0][i]);

                let flat = d.flat().slice(cols);
                document.querySelectorAll("#dynamicGrid input:not(.colname)")
                    .forEach((inp, i) => inp.value = flat[i] || "");
            });
    }

    // BUTTONS
    document.getElementById("addRowBtn").onclick = () => {
        rows++;
        renderGrid(saveCurrentData());
    };

    document.getElementById("removeRowBtn").onclick = () => {
        if (rows > 1) {
            rows--;
            renderGrid(saveCurrentData());
        }
    };

    document.getElementById("addColBtn").onclick = () => {
        cols++;
        renderGrid(saveCurrentData());
    };

    document.getElementById("removeColBtn").onclick = () => {
        if (cols > 1) {
            cols--;
            renderGrid(saveCurrentData());
        }
    };

    function collectData() {
        let headers = [...document.querySelectorAll(".colname")].map(h => h.value.trim());
        let cells = [...document.querySelectorAll("#dynamicGrid input:not(.colname)")];

        let result = [headers];

        for (let i = 0; i < cells.length; i += cols) {
            result.push(cells.slice(i, i + cols).map(c => c.value));
        }

        return result;
    }

    // ✔ REPLACE OLD RECIPE
    replaceOldBtn.onclick = async () => {
        let details = collectData();

        await fetch("/addRecipeDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId, details })
        });

        alert("Recipe Updated Successfully");
        window.location.href = "get.html";
    };

    // ✔ SAVE AS NEW RECIPE
    saveNewBtn.onclick = async () => {
        let newId = prompt("Enter NEW Recipe ID:");
        let newName = prompt("Enter NEW Recipe Name:");

        if (!newId || !newName) return alert("Both fields required.");

        await fetch("/addRecipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId: newId, recipeName: newName })
        });

        await fetch("/addRecipeDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId: newId, details: collectData() })
        });

        alert("New Recipe Saved");
        window.location.href = "get.html";
    };

    // OLD SAVE FOR NEW RECIPE
    document.getElementById("recipeForm").onsubmit = async e => {
        e.preventDefault();

        let details = collectData();

        await fetch("/addRecipeDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId, details })
        });

        alert("Details Saved");
        window.location.href = "get.html";
    };

    document.getElementById("goBackBtn").onclick = () => {
        window.location.href = "get.html";
    };

});
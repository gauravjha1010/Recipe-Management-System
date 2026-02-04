import express from "express";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Static file serving
app.use(express.static(__dirname));

// Allow frontend to read recipes.json
app.get("/recipes.json", (req, res) => {
  res.sendFile(path.join(__dirname, "recipes.json"));
});

const recipesDataFile = path.join(__dirname, "recipes.json");
const usersDataFile = path.join(__dirname, "user.json");

// Initialize JSON files if empty or missing
const initializeJsonFile = async (filePath, defaultContent) => {
  try {
    await fs.access(filePath);
    const content = await fs.readFile(filePath, "utf-8");
    if (content.trim() === "") {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
    }
  }
};

const readData = async (filePath) =>
  JSON.parse(await fs.readFile(filePath, "utf-8"));

const writeData = async (filePath, data) =>
  fs.writeFile(filePath, JSON.stringify(data, null, 2));

/* ---------------------- USER SIGNUP ---------------------- */
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const users = await readData(usersDataFile);

    if (users.find((u) => u.email === email))
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, email, password: hashedPassword });
    await writeData(usersDataFile, users);

    res.status(201).json({ message: "User registered successfully!" });
  } catch {
    res.status(500).json({ message: "Server error during sign-up." });
  }
});

/* ---------------------- USER SIGNIN ---------------------- */
app.post("/api/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await readData(usersDataFile);
    const user = users.find((u) => u.username === username);

    if (!user)
      return res
        .status(401)
        .json({ message: "You are a new user, please register yourself" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid username or password." });

    res.status(200).json({ message: "Login successful!" });
  } catch {
    res.status(500).json({ message: "Server error during sign-in." });
  }
});

/* ---------------------- CREATE NEW RECIPE ---------------------- */
app.post("/addRecipe", async (req, res) => {
  try {
    const { recipeId, recipeName } = req.body;

    if (!recipeId || !recipeName)
      return res
        .status(400)
        .json({ error: "RecipeId and RecipeName are required" });

    const data = await readData(recipesDataFile);

    if (data[recipeId])
      return res.status(409).json({ error: "Recipe ID already exists." });

    data[recipeId] = { name: recipeName, details: [] };

    await writeData(recipesDataFile, data);

    res.json({ message: "Recipe added successfully" });
  } catch {
    res.status(500).json({ message: "Server error while adding recipe." });
  }
});

/* ---------------------- SAVE OR UPDATE DETAILS ---------------------- */
app.post("/addRecipeDetails", async (req, res) => {
  try {
    const { recipeId, details } = req.body;

    if (!recipeId || !details)
      return res
        .status(400)
        .json({ error: "recipeId and details are required" });

    const data = await readData(recipesDataFile);

    // Ensure recipe exists
    if (!data[recipeId]) {
      data[recipeId] = { name: recipeId, details: [] };
    }

    data[recipeId].details = details;

    await writeData(recipesDataFile, data);

    res.json({ message: "Recipe details saved successfully" });
  } catch {
    res.status(500).json({ message: "Server error while saving details." });
  }
});

/* ---------------------- START SERVER ---------------------- */
app.listen(3000, async () => {
  await initializeJsonFile(usersDataFile, []);
  await initializeJsonFile(recipesDataFile, {});
  console.log("Server running at http://localhost:3000");
});
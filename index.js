import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { addItem, removeItem, getItems, updateItem } from "./db.js";

const app = express();
app.use(cors());
const port = 3002;

app.use(express.json());

app.post("/add", async (req, res) => {
  try {
    const item = req.body;

    if (!item || typeof item !== "object") {
      return res.status(400).json({ message: "Invalid item data" });
    }

    await addItem({
      id: uuidv4(),
      ...item,
    });
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item" });
  }
});

app.get("/get", async (req, res) => {
  try {
    const items = await getItems();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: "Error retrieving items" });
  }
});

app.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await removeItem(id);
    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Error removing item" });
  }
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const success = await updateItem(id, updatedData);

    if (success) {
      res.status(200).json({ message: "Item updated successfully" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

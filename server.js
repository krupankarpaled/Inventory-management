
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Define Bottle Schema
const bottleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const Bottle = mongoose.model("Bottle", bottleSchema);

// Get all bottles
app.get("/api/inventory", async (req, res) => {
    try {
        const inventory = await Bottle.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new bottle
app.post("/api/inventory", async (req, res) => {
    try {
        const { name, quantity } = req.body;
        if (!name || quantity == null) {
            return res.status(400).json({ error: "Name and quantity are required" });
        }

        const newBottle = new Bottle({ name, quantity });
        await newBottle.save();
        res.status(201).json(newBottle);
    } catch (error) {
        res.status(500).json({ error: "Could not add bottle" });
    }
});

// Update bottle quantity
app.put("/api/inventory/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const updatedBottle = await Bottle.findByIdAndUpdate(
            id,
            { quantity },
            { new: true }
        );

        if (!updatedBottle) {
            return res.status(404).json({ error: "Bottle not found" });
        }

        res.json(updatedBottle);
    } catch (error) {
        res.status(500).json({ error: "Could not update bottle" });
    }
});

// Delete a bottle
app.delete("/api/inventory/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBottle = await Bottle.findByIdAndDelete(id);

        if (!deletedBottle) {
            return res.status(404).json({ error: "Bottle not found" });
        }

        res.json({ message: "Bottle deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete bottle" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

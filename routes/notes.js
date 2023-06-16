const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Notes = require("../models/Notes");

// Route 1: Get all the Notes using details GET: "/api/auth/fetchallnotes".  requires login
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 2: Add a new Note using details POST: "/api/auth/addnote".  requires login
router.post(
  "/addnote",
  [
    body("title", "Enter a title").exists(),
    body("description", "Enter a description").exists(),
  ],
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route 3: Update an existing Note using PUT: "/api/auth/updatenote".  requires login
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};

    //find the note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send({ error: "NOt Found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route 4: Delete an existing Note using Delete: "/api/auth/delteenote".  requires login
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send({ error: "NOt Found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Access Denied");
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success":"Not has been deleted",note:note});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;

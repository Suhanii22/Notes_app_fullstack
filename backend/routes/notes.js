const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/auth");


// Fetch all tenant notes
router.get("/all", auth, async (req, res) => {
 
    const notes = await Note.find({ tenant: req.user.tenant })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(notes);
 
});

router.get("/my", auth, async (req, res) => {
  
    const notes = await Note.find({ user: req.user._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(notes);
  
});



router.post("/", auth, async (req, res) => {
 
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user._id,     
      tenant: req.user.tenant 
    });

    await note.save();
    res.json(note);
 
});


// Edit a note
router.put("/:id", auth, async (req, res) => {
 
    const note = await Note.findById(req.params.id);

    if (!note) return res.json({ error: "Note not found" });

    if (note.user.toString() !== req.user._id.toString()) {
      return res.json({ error: "Not authorized" });
    }

    const { title, content } = req.body;
    note.title = title || note.title;
    note.content = content || note.content;
    await note.save();

    res.json(note);
 
});

//deleting note
router.delete("/:id", auth, async (req, res) => {
 
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.json({ error: "Note not found" });
    res.json({ message: "Note deleted" });
  
});


module.exports = router;

const noteStorage = require("./getDataFromFile");
const bcryptjs = require("bcryptjs");

const noteController = {
  getANote: async (req, res) => {
    const noteId = req.params.noteId;
    try {
      const data = await noteStorage.getData();
      const note = [...data].find((i) => i.id.toString() === noteId.toString());
      if (note) {
        res.status(200).json(note);
      } else {
        res.status(404).json({ message: "404 not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getData: async (req, res) => {
    try {
      const data = await noteStorage.getData();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  addData: async (req, res) => {
    const newNote = req.body;
    console.log(newNote);
    let noteList = [];
    try {
      noteList = await noteStorage.getData();
    } catch (err) {
      console.log(err);
    }

    if (noteList.find((i) => i.id === newNote.id)) {
      // edit note
      noteList = noteList.filter((i) => {
        return i.id !== newNote.id;
      });

      noteList.push(newNote);
    } else {
      // add new note
      const password = newNote.password;
      try {
        const hashPass = await bcryptjs.hash(password, 12);
        if (hashPass) {
          newNote.password = hashPass;
          noteList.push(newNote);
        }
      } catch (err) {
        console.log(err);
      }
    }

    console.log(noteList);
    try {
      const saveNote = await noteStorage.saveData(noteList);
      res.status(200).json(saveNote);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteNote: async (req, res) => {
    const noteId = req.params.noteId;
    try {
      let data = await noteStorage.getData();
      const note = data.find((i) => i.id.toString() === noteId.toString());
      if (note) {
        data = data.filter((i) => {
          return i.id !== noteId;
        });

        const removeNote = await noteStorage.saveData(data);
        if (removeNote) {
          res.status(200).json(note);
        }
      } else {
        res.status(404).json({ message: "404 not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = noteController;

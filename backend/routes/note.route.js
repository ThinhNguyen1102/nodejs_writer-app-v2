const noteController = require("../controllers/note.controller");

const router = require("express").Router();

router.get("/", noteController.getData);

router.post("/", noteController.addData);

router.get("/:noteId", noteController.getANote);

router.delete("/:noteId", noteController.deleteNote);

module.exports = router;

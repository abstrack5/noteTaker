const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");

let notes = require("./db/db.json");

// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/Routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", 'utf8', (err, data) => {
    if (err) {
      throw err.console.err(err);
    } else {
      const noteObj = {
        "title": req.body.title,
        "text": req.body.text,
        "id": uuid()
      };
      notes.push(noteObj);
      const newNote = JSON.stringify(notes);
      res.json(notes);

      fs.writeFile("./db/db.json", newNote, (err, data) => {
        if (err) {
          console.err(err);
        } else {
          console.log("New note added!");
        }
      });
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    const removNote = notes.find(note => note.id == noteId);
    if (removNote) {
        notes = notes.filter(note => note.id !== noteId);
        res.json(notes);
        console.log('Note deleted!')
    } else {
        console.err(err + ' note not found!');
    }
    
});

// basic routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server online using port ${PORT}`);
});


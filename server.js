
const fs = require("fs");
const path = require("path");
const express = require("express");

// Set up varibales for path, app, and directory to point toward /public.
const port = process.env.port;
const app = express();
const publicDir = path.join(__dirname, "/public");

// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(publicDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(publicDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let addNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    addNote.id = uniqueID;
    savedNotes.push(addNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", addNote);
    res.json(savedNotes);
});

// Delete function
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currentNote => {
        return currentNote.id != noteID;
    })
    
    for (currentNote of savedNotes) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

// Server Start
app.listen(port, function() {
    console.log(`Now listening to port ${port}.`);
});

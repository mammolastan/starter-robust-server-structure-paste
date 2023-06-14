const express = require("express");
const app = express();
const pastes = require("./data/pastes-data.js");
app.use(express.json());
var morgan = require("morgan");

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;
  console.log("req.body");
  console.log(req.body);
  if (text) {
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);

    res.status(201).json({ data: newPaste });
  } else {
    res.sendStatus(400);
  }
});

// Not found handler
app.use((request, response, next) => {
  const properties = {
    originalURL: request.originalUrl,
    requestIP: request.ip,
    method:request.method
  };
  next(`Not found - : ${JSON.stringify(properties)}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;

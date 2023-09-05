const express = require("express");
const path = require("path");
const app = express();
const PORT = 8877;

app.use(express.static(path.join(__dirname, "web")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web/index.html"));
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = startServer;

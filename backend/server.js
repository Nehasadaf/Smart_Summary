const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/api/summarize", (req, res) => {
  const text = req.body.text;

  const python = spawn("python", ["summary.py", text], {
    cwd: __dirname
  });

  let summary = "";
  python.stdout.on("data", (data) => {
    summary += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    if (code === 0) {
      res.json({ summary: summary.trim() });
    } else {
      res.status(500).json({ error: "Summarization failed." });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

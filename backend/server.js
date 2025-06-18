const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// MongoDB schema & model
const summarySchema = new mongoose.Schema({
  inputText: String,
  summaryText: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Summary = mongoose.model("Summary", summarySchema);

// Express app setup
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

  python.on("close", async (code) => {
    if (code === 0) {
      const trimmedSummary = summary.trim();

      // Save to MongoDB
      try {
        const newSummary = new Summary({
          inputText: text,
          summaryText: trimmedSummary
        });
        await newSummary.save();
        console.log("✅ Summary saved to DB");
        res.json({ summary: trimmedSummary });
      } catch (error) {
        console.error("❌ DB Save Error:", error);
        res.status(500).json({ error: "Failed to save summary to database." });
      }

    } else {
      res.status(500).json({ error: "Summarization failed." });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

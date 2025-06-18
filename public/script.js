// Summarize text using backend API
async function summarize() {
  const text = document.getElementById("inputText").value;
  const resultDiv = document.getElementById("result");

  if (!text.trim()) {
    resultDiv.innerText = "⚠️ Please enter some text to summarize.";
    return;
  }

  resultDiv.innerHTML = "⏳ Summarizing... Please wait.";

  try {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (res.ok) {
      resultDiv.innerText = data.summary || "✅ Summary complete.";
    } else {
      resultDiv.innerText = `❌ Error: ${data.error || "Something went wrong."}`;
    }
  } catch (err) {
    resultDiv.innerText = `❌ Network error: ${err.message}`;
  }
}

// Toggle helper bot sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("helperBot");
  sidebar.classList.toggle("open");
}

// Ask the Gemini helper bot a question
async function askBot() {
  const question = document.getElementById("userQuestion").value.trim();
  const answerDiv = document.getElementById("botAnswer");

  if (!question) {
    answerDiv.innerText = "⚠️ Please enter a question.";
    return;
  }

  answerDiv.innerHTML = "🤖 Thinking...";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (res.ok) {
      answerDiv.innerText = data.answer || "🤖 No response.";
    } else {
      answerDiv.innerText = `❌ Error: ${data.error || "Failed to get answer."}`;
    }
  } catch (err) {
    answerDiv.innerText = `❌ Network error: ${err.message}`;
  }
}

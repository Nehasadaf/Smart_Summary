async function summarize() {
  const text = document.getElementById("inputText").value;
  const res = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  document.getElementById("result").innerText = data.summary || data.error;
}

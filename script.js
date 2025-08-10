// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  mode: "python",
  theme: "material-darker",
  tabSize: 4,
});

// Language ID mapping
const langMap = {
  71: "python",
  50: "text/x-csrc",
  54: "text/x-c++src",
  62: "text/x-java"
};

// Update CodeMirror mode on language change
document.getElementById("language").addEventListener("change", (e) => {
  editor.setOption("mode", langMap[e.target.value]);
});

document.getElementById("run").addEventListener("click", async () => {
  const code = editor.getValue();
  const langId = document.getElementById("language").value;
  const stdin = document.getElementById("stdin").value;

  document.getElementById("output").textContent = "⏳ Running...";

  try {
    const res = await fetch("https://ide-backend-nklt.onrender.com/run", { // Change to your Render URL after deploy
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: parseInt(langId),
        stdin: stdin
      })
    });

    const data = await res.json();
    if (data.stderr) {
      document.getElementById("output").textContent = `🚨 Error:\n${data.stderr}`;
    } else {
      document.getElementById("output").textContent = data.stdout || "(No output)";
    }
  } catch (err) {
    document.getElementById("output").textContent = `❌ Request failed: ${err}`;
  }
});


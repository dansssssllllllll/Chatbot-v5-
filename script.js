
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("userInput");
const API_KEY = "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";

function appendMessage(text, sender, animated = false) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  if (animated) {
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "jump";
      span.style.animationDelay = (i * 50) + "ms";
      span.textContent = ch;
      div.appendChild(span);
    });
  } else {
    div.textContent = text;
  }
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const input = inputEl.value.trim();
  if (!input) return;
  appendMessage(input, "user");
  inputEl.value = "";
  appendMessage("...", "bot");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: input }
        ]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    const lastBot = [...messagesEl.querySelectorAll(".bot")].pop();
    if (lastBot) lastBot.remove();
    appendMessage(reply, "bot", true);
  } catch (e) {
    console.error(e);
    appendMessage("Error talking to AI.", "bot");
  }
}

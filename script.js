
const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("userInput");

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
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    const lastBot = [...messagesEl.querySelectorAll(".bot")].pop();
    if (lastBot) lastBot.remove();
    appendMessage(data.reply, "bot", true);
  } catch (e) {
    console.error(e);
    appendMessage("Error talking to AI.", "bot");
  }
}

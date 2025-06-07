const userInput = document.getElementById("userInput");

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent newline
    sendMessage();
  }
});

async function sendMessage() {
  const userText = userInput.value.trim();
  if (!userText) return;

  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<div class="chat user"><strong>You:</strong> ${userText}</div>`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer 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", // <-- replace this
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // use "llama3-8b-8192" or "llama3-70b-8192"
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: userText },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const botReply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand that.";

    chatbox.innerHTML += `<div class="chat bot"><strong>Bot:</strong> ${botReply}</div>`;
  } catch (err) {
    console.error("Fetch error:", err);
    chatbox.innerHTML += `<div class="chat bot"><strong>Bot:</strong> Error: ${err.message}</div>`;
  }

  document.getElementById("userInput").value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
}

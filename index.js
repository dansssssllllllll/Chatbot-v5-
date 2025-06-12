
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMessage }
      ],
    });
    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const venom = require('venom-bot');
const axios = require('axios');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

app.get('/', (req, res) => {
  res.send('Venom bot running');
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

venom.create({
  session: 'my-session', // session name for persistence
  multidevice: false,
  headless: true,
  useChrome: true,
  // add more options if needed
}).then(client => {
  console.log('Venom client started');
  
  client.onMessage(async (message) => {
    try {
      const payload = {
        from: message.from,
        body: message.body,
        type: message.type,
        timestamp: message.timestamp,
        isMedia: message.isMedia,
        mimetype: message.mimetype,
        caption: message.caption,
      };
      
      await axios.post(N8N_WEBHOOK_URL, payload);
      console.log('Message forwarded to n8n webhook');
    } catch (error) {
      console.error('Error sending message to n8n:', error.message);
    }
  });
}).catch(err => {
  console.error('Error starting Venom client:', err);
});

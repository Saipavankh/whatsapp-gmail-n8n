const venom = require('venom-bot');
const axios = require('axios');

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

venom.create({
  session: 'my-session', // session name for persistence
  multidevice: false,
  headless: true,
  useChrome: true,
  // options here if needed
}).then(client => {
  console.log('Venom client started');
  
  client.onMessage(async (message) => {
    try {
      // Prepare payload to send to n8n webhook
      const payload = {
        from: message.from,
        body: message.body,
        type: message.type,
        timestamp: message.timestamp,
        isMedia: message.isMedia,
        mimetype: message.mimetype,
        caption: message.caption,
        // add more fields if you want
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

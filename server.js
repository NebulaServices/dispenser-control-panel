const express = require('express');
const app = express();
const config = require('./config.js');
const fs = require('fs');

app.use(express.static('static'));
app.use(express.json()); // added to parse JSON request body

app.get('/config', (req, res) => {
  res.json(config);
});

app.post('/config', express.json(), (req, res) => {
  config.links = req.body.links;
  config.logging = req.body.logging;
  config.logToHook = req.body.logToHook;
  config.reportWebhook = req.body.reportWebhook;
  config.logWebhook = req.body.logWebhook;
  config.userLimit = req.body.userLimit;
  config.buttonEmoji = req.body.buttonEmoji;
  config.buttonLabel = req.body.buttonLabel;
  config.buttonStyle = req.body.buttonStyle;

  fs.writeFile('./config.js', `module.exports = ${JSON.stringify(config, null, 2)}`, (err) => {
    if (err) {
      console.error(err);
      res.send('Error saving settings');
    } else {
      console.log(config);
      res.send('Settings saved');
    }
  });
});

app.listen(3002, () => {
  console.log('Server running on port 3002');
});

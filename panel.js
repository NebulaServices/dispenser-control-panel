const express = require('express');
const app = express();
const config = require('./config.js');
const panel = require('./panel-config.js');
const fs = require('fs');
var color = require('colors-cli');
app.use(express.json());

app.use((req, res, next) => {
  const ip = req.ip;
  const time = new Date();
  const userAgent = req.get('user-agent');
  const referrer = req.get('referrer') || 'none';
  const url = req.originalUrl;
  console.log(color.blue('[LOG] ') + `Incoming request: `)
  console.log(`      ${color.green('IP: ')}        ${ip}\n      ${color.green('Time: ')}      ${time}\n      ${color.green('User Agent:')} ${userAgent}\n      ${color.green('Referrer: ')}  ${referrer}\n      ${color.green('URL: ')}       ${url}`);
  if (req.method === 'POST') {
    console.log(`      ${color.green('Payload: ')}   ${JSON.stringify(req.body)}`);
  }
  next();
});



  app.use(express.static('static'));


  
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
if (panel.enabled == true){

try {
  app.listen(panel.port, () => {
    console.log(color.green('🎉 Control Panel running on port: ' + panel.port));
  });
} catch (e){
  console.error('An error occured when starting the control panel.')
  console.error(e)
  console.log(color.blue('TRY: '), "\n - Checking if Dispenser is trying to run on the same port as dispenser \n - Try a new port ")
}

} else { 
  console.log('Control panel disabled, skipping listener')
}
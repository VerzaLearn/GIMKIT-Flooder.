const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/spawn', async (req, res) => {
  const { pin, pattern, amount } = req.body;
  if (amount > 100) {
    return res.status(400).send('Cannot spawn more than 100 bots.');
  }

  try {
    const browser = await puppeteer.launch({ headless: false });
    for (let i = 1; i <= amount; i++) {
      const botName = pattern.replace('{n}', i);
      const page = await browser.newPage();
      const gameUrl = `https://www.gimkit.com/join/${pin}`;
      await page.goto(gameUrl);
      await page.waitForSelector('input[name="name"]');
      await page.type('input[name="name"]', botName);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      console.log(`${botName} joined`);
    }
    // Keep browser open or close after some time
    // await browser.close(); // Uncomment to close after spawning
    res.send('Bots spawned successfully!');
  } catch (err) {
    res.status(500).send('Error spawning bots: ' + err.message);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));

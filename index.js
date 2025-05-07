import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const FORWARD_URL = process.env.FORWARD_URL;

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.status(403).send('Token inválido');
  }
});

app.post('/webhook', async (req, res) => {
  try {
    await fetch(FORWARD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send('Erro ao encaminhar: ' + err.message);
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

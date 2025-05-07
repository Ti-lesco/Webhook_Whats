export default async function handler(req, res) {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const FORWARD_URL = process.env.FORWARD_URL;

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Token inválido");
    }
  }

  if (req.method === "POST") {
    try {
      await fetch(FORWARD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      return res.status(200).send("Encaminhado ao n8n");
    } catch (error) {
      return res.status(500).send("Erro ao encaminhar: " + error.message);
    }
  }

  return res.status(405).send("Método não permitido");
}

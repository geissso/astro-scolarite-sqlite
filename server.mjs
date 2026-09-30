// server.mjs — petit serveur Node qui corrige le protocole vu par Astro
// quand la requête arrive via un reverse proxy HTTPS (Apache).
import { createServer } from "node:http";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const port = process.env.PORT ? Number(process.env.PORT) : 4321;

const server = createServer((req, res) => {
  if (req.headers["x-forwarded-proto"] === "https") {
    // Astro/Node ne regarde que req.socket.encrypted pour décider http/https.
    // On le force à true quand Apache nous dit que la requête d'origine est en https.
    req.socket.encrypted = true;
  }
  ssrHandler(req, res, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
import http from "http";

const server = http.createServer((req, res) => {
  const target = new URL(req.url ?? "/", "http://example.com").searchParams.get("target");

  if (!target) {
    res.writeHead(400);
    res.end("Missing target");
    return;
  }

  // INTENTIONAL TEST VULNERABILITY:
  // `target` is controlled by the user and is used to build a server-side request URL.
  http.get(`https://${target}.example.com/data/`, (response) => {
    response.pipe(res);
  });
});

server.listen(3000);

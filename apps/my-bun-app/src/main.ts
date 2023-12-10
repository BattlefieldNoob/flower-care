Bun.serve({
  port: 8080,
  async fetch(request: Request): Promise<Response> {
    return new Response('Hello Worldo!');
  },
});
console.log('running on port http://localhost:8080');

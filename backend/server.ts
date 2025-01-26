import { fastify } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import cors from "@fastify/cors";
import connectRoutes from "./connect"; // The file containing your search service implementation

async function main() {
  const server = fastify();

  // Register the CORS plugin
  await server.register(cors, {
    origin: '*', // Allow all origins - change this to specific origins as needed
    methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed HTTP methods
  });

  // Register the connect plugin with your routes
  await server.register(fastifyConnectPlugin, {
    routes: connectRoutes, // Using your connect file to register the SearchService
  });

  // Define a basic route to check server health or respond to basic requests
  server.get("/", (_, reply) => {
    reply.type("text/plain");
    reply.send("Search service is running!");
  });

  // Start the server on port 3001
  await server.listen({ host: "localhost", port: 3001 });
  console.log("Server is listening at", server.server.address());
}

// Start the Fastify server
void main();
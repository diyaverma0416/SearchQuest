import { createClient } from "@connectrpc/connect";
import { SearchService } from "./gen/search/v2/search_pb";
import { createConnectTransport } from "@connectrpc/connect-node";

// Create the transport that will communicate with the Fastify server
const transport = createConnectTransport({
  baseUrl: "http://localhost:3001", // This is where your server is running
  httpVersion: "1.1",
});

async function main() {
  // Create a client instance for the SearchService
  const client = createClient(SearchService, transport);

  // Example search query
  const query = "the"; // Replace with dynamic user input as needed

  // Call the search method from the SearchService
  const res = await client.search({ query });

  // Log the search results
  console.log("Search Results:", res.results);
}

void main();

import type { ConnectRouter } from "@connectrpc/connect";
import { SearchService } from "./gen/search/v2/search_pb";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = ""; // Replace with your MongoDB URI
const DATABASE_NAME = ""; // Replace with your database name
const COLLECTION_NAME = ""; // Replace with your collection name

export default (router: ConnectRouter) =>
  // Registers search.v2.SearchService
  router.service(SearchService, {
    // Implements rpc Search
    async search(req) {
      const client = new MongoClient(MONGO_URI);

      try {
        // Connect to the MongoDB client
        await client.connect();
        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);

        // Query the database for search results
        const query = req.query ? { title: { $regex: req.query, $options: "i" } } : {};
        const results = await collection.find(query).toArray();

        // Map MongoDB documents to SearchResult format
        const formattedResults = results.map((doc) => ({
          id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
          type: doc.type || "UNKNOWN",
          title: doc.title || "Untitled",
          solution: doc.solution || "No solution provided",
          blocks: (doc.blocks || []).map((block: {
            text: string;
            showInOption: boolean;
            isAnswer: boolean;
          }) => ({
            text: block.text,
            showInOption: !!block.showInOption,
            isAnswer: !!block.isAnswer,
          })),
        }));

        return {
          results: formattedResults,
        };
      } catch (error) {
        console.error("Error while querying MongoDB:", error);
        throw new Error("Failed to fetch search results.");
      } finally {
        // Ensure the client is closed after operation
        await client.close();
      }
    },
  });

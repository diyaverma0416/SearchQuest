import React, { useState } from 'react';
import { createClient } from '@connectrpc/connect';
import { SearchService } from '../gen/proto/search/v2/search_pb'; // Adjust the import path as needed
import { createConnectTransport } from '@connectrpc/connect-web'; // Use a web-compatible transport

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  // Create the transport for ConnectRPC
  const transport = createConnectTransport({
    baseUrl: 'http://localhost:3001', // Your server's base URL
  });

  // Create a client instance for the SearchService
  const client = createClient(SearchService, transport);

  const handleSearch = async () => {
    try {
      const request = { query }; // Create a SearchRequest
      const response = await client.search(request);
      setResults(response.results.map(result => result.title)); // Assuming you want to display titles
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Search Your Content</h1>
        <div className="mb-4 flex items-center border-b-2 border-gray-300 focus-within:border-indigo-600">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
            className="w-full py-2 px-4 text-lg text-gray-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-md"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full py-2 px-4 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4 transition"
        >
          Search
        </button>
        <ul className="mt-6 space-y-4">
          {results.map((result, index) => (
            <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-indigo-50">
              <span className="text-lg text-gray-800">{result}</span>
              <button className="text-indigo-600 hover:text-indigo-800">View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;

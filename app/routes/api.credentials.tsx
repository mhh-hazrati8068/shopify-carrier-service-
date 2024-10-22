import { json, ActionFunction } from "@remix-run/node";
import db from "../db.server";
import { cors } from "remix-utils/cors"; // Import cors from remix-utils

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  // Define your CORS options
  const corsOptions = {
    origin: "https://extensions.shopifycdn.com", // Allow requests from any origin
    methods: ["POST"], // Only allow POST requests
    headers: ["Content-Type"], // Only allow Content-Type header
  };

  // Check if the request method is POST, otherwise throw an error
  if (request.method !== "POST") {
    return new Response("Invalid request method", { status: 405 });
  }

  // Try to parse the request body as JSON, otherwise throw an error
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const shopDomain = body.shop;

  // Validate that the shopDomain is a valid string
  if (typeof shopDomain !== "string" || shopDomain.trim() === "") {
    return new Response("shopDomain parameter must be a valid string", {
      status: 400,
    });
  }

  // Find the credentials for the given shopDomain in the database
  const credential = await db.credentials.findFirst({
    where: { shop: shopDomain },
  });

  // If no credentials are found, return a 404 error
  if (!credential) {
    return new Response("No credentials found for the given shopDomain", {
      status: 404,
    });
  }

  // Return the response wrapped with the CORS function
  const response = json(credential);
  return await cors(request, response, corsOptions); // Use remix-utils' cors
};

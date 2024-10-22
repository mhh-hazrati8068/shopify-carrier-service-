import { json, ActionFunction } from "@remix-run/node";
import db from "../db.server";

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  // Handle non-POST requests
  if (request.method !== "POST") {
    return new Response("Invalid request method", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*", // Update with the allowed origin
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response("Invalid JSON payload", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*", // Update with the allowed origin
      },
    });
  }

  const shopDomain = body.shop;

  if (typeof shopDomain !== "string" || shopDomain.trim() === "") {
    return new Response("shopDomain parameter must be a valid string", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*", // Update with the allowed origin
      },
    });
  }

  const credential = await db.credentials.findFirst({
    where: { shop: shopDomain },
  });

  if (!credential) {
    return new Response("No credentials found for the given shopDomain", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*", // Update with the allowed origin
      },
    });
  }

  // Return the credentials with CORS headers
  return json(credential, {
    headers: {
      "Access-Control-Allow-Origin": "*", // Update with Shopify's domain
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

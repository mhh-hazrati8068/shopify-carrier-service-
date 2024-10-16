import { json, ActionFunction } from "@remix-run/node";
import db from "../db.server";

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  if (request.method !== "POST") {
    throw new Response("Invalid request method", { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    throw new Response("Invalid JSON payload", { status: 400 });
  }

  const { id, shopDomain, apiKey, apiSecret } = body;

  // Validate the inputs
  if (
    typeof shopDomain !== "string" ||
    shopDomain.trim() === "" ||
    typeof apiKey !== "string" ||
    apiKey.trim() === "" ||
    typeof apiSecret !== "string" ||
    apiSecret.trim() === ""
  ) {
    throw new Response(
      "Invalid input. shopDomain, apiKey, and apiSecret are required.",
      { status: 400 },
    );
  }

  try {
    // Use upsert to either create or update the record
    const upsertedCredential = await db.credentials.upsert({
      where: { id: id, shop: shopDomain }, // Find the record based on shopDomain
      update: {
        // Update fields if the record exists
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
      create: {
        // Create new record if it doesn't exist
        shop: shopDomain,
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
    });

    return json(upsertedCredential, { status: 200 }); // Success response (200 for upserted)
  } catch (error) {
    console.error("Error upserting credentials:", error);
    throw new Response("Failed to upsert credentials", { status: 500 });
  }
};

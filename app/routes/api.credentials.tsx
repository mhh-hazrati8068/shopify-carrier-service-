import { json, ActionFunction } from "@remix-run/node";
import db from "../db.server";

export const action: ActionFunction = async ({ request }): Promise<Response> => {
  if (request.method !== "POST") {
    throw new Response("Invalid request method", { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    throw new Response("Invalid JSON payload", { status: 400 });
  }

  const shopDomain = body.shop;

  if (typeof shopDomain !== "string" || shopDomain.trim() === "") {
    throw new Response("shopDomain parameter must be a valid string", { status: 400 });
  }

  const credential = await db.credentials.findFirst({
    where: { shop: shopDomain },
  });

  if (!credential) {
    throw new Response("No credentials found for the given shopDomain", { status: 404 });
  }

  return json(credential);
};

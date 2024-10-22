import { json, ActionFunction } from "@remix-run/node";
import db from "../db.server";

export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response("Invalid request method", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS header
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
        "Access-Control-Allow-Origin": "*", // CORS header
      },
    });
  }

  const shopDomain = body.shop;

  if (typeof shopDomain !== "string" || shopDomain.trim() === "") {
    return new Response("shopDomain parameter must be a valid string", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*", // CORS header
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
        "Access-Control-Allow-Origin": "*", // CORS header
      },
    });
  }

  return json(credential, {
    headers: {
      "Access-Control-Allow-Origin": "*", // CORS header
    },
  });
};

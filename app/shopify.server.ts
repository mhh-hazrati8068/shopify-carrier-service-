import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import prisma from "./db.server";

const dbUrl = new URL("mongodb+srv://apps:SwlZ2gLl7RYw9udK@clusterbearerdev.6mxw2.mongodb.net"); // Example URL, replace it with your actual URL
const dbName = "ClusterBearerDev"; // Replace with your actual database name

// Optional: provide extra options if necessary
const opts = {};
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET! || "",
  apiVersion: LATEST_API_VERSION,
  scopes: [
    "write_products",
    "write_shipping",
    "read_orders",
    "read_shipping",
    "write_orders",
    "write_customers",
    "read_checkouts",
    "read_order_edits",
    "write_checkouts",
  ],
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new MongoDBSessionStorage(dbUrl, dbName) || "",
  distribution: AppDistribution.AppStore,
  restResources,
  isEmbeddedApp: true,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

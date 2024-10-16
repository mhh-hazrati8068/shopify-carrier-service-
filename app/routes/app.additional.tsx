import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  TextField,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { useLoaderData, Form } from "@remix-run/react";
import { json, ActionFunction, LoaderFunction } from "@remix-run/node";
import db from "../db.server";
import CryptoJS from "crypto-js"; // Import CryptoJS
import { authenticate } from "app/shopify.server";
import { LoaderFunctionArgs } from "@remix-run/node";

// Define the shape of the credentials data
type Credentials = {
  id?: number;
  shopDomain: string;
  apiKey: string;
  apiSecret: string;
};

// Loader function to fetch existing credentials
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // First, run the GraphQL query to fetch shop information
  const queryResponse = await admin.graphql(
    `#graphql
        query {
          shop {
            myshopifyDomain
          }
        }
      `,
  );

  const queryJson = await queryResponse.json();

  const carrierQueryResponse = await admin.graphql(
    `#graphql
      query {
        availableCarrierServices {
          carrierService {
            id
            active
            formattedName
            callbackUrl
            supportsServiceDiscovery
          }
        }
      }
    `,
  );

  const carrierQueryJson = await carrierQueryResponse.json();

  // Check if the query was successful and if shop data was retrieved
  if (!queryJson.data || !queryJson.data.shop) {
    throw new Error("Failed to fetch shop information");
  }

  // Return both query and mutation data as the loader's response
  return json({
    shop: queryJson.data.shop.myshopifyDomain,
    carrier: carrierQueryJson.data.availableCarrierServices,
  });
};

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { admin } = await authenticate.admin(request);

  const newCredentials: Credentials = {
    shopDomain: formData.get("shopDomain") as string,
    apiKey: formData.get("apiKey") as string,
    apiSecret: formData.get("apiSecret") as string,
  };

  const secretKey = "hazrati.dev-mohammad-shopify8068"; // Your secret key
  const encryptedApiKey = CryptoJS.AES.encrypt(
    newCredentials.apiKey,
    secretKey,
  ).toString();
  const encryptedApiSecret = CryptoJS.AES.encrypt(
    newCredentials.apiSecret,
    secretKey,
  ).toString();

  // Find existing credentials based on shopDomain
  const existingCredentials = await db.credentials.findFirst({
    where: {
      shop: newCredentials.shopDomain,
    },
  });

  await db.credentials.upsert({
    where: {
      id: existingCredentials?.id || "507f1f77bcf86cd799439011",
    },
    update: {
      apiKey: encryptedApiKey,
      shop: newCredentials.shopDomain,
      apiSecret: encryptedApiSecret,
    },
    create: {
      apiKey: encryptedApiKey,
      shop: newCredentials.shopDomain,
      apiSecret: encryptedApiSecret,
    },
  });

  // Proceed with mutation if service doesn't exist
  const mutationResponse = await admin.graphql(
    `#graphql
      mutation carrierServiceUpdate($input: DeliveryCarrierServiceUpdateInput!) {
        carrierServiceUpdate(input: $input) {
          carrierService {
            formattedName
            callbackUrl
            supportsServiceDiscovery
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        input: {
          name: "Bearer delivery",
          callbackUrl: `https://us-central1-bearer-seyco-development.cloudfunctions.net/shopifyPricingAPIv1dot0/?api_key=${newCredentials.apiKey}&api_secret=${newCredentials.apiSecret}`,
          active: true,
          id: "gid://shopify/DeliveryCarrierService/88402985296",
          supportsServiceDiscovery: true,
        },
      },
    },
  );

  const mutationJson = await mutationResponse.json();

  return json({ newCredentials, mutationJson });
};

const SettingsPage: React.FC = () => {
  const shopDomain = useLoaderData<{ shop: string } | null>()?.shop || "";
  const availableCarrierServices =
    useLoaderData<{
      carrier: Array<{ carrierService: { formattedName: string } }>;
    } | null>()?.carrier || [];

  const [formState, setFormState] = useState({
    shopDomain: shopDomain || "", // Use loader data for initial state
    apiKey: "",
    apiSecret: "",
  });
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false); // State for submit success
  const [hasBearerDelivery, setHasBearerDelivery] = useState(false); // State to check if Bearer delivery exists

  // Check if any carrier service has "Bearer delivery" in formattedName
  useEffect(() => {
    const hasBearer = availableCarrierServices.some((service) =>
      service.carrierService.formattedName.includes("Bearer d   elivery"),
    );
    console.log(hasBearer);
    setHasBearerDelivery(hasBearer);
  }, [availableCarrierServices]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    if (response.ok) {
      setIsSubmitSuccessful(true); // Set success state
    }
  };

  return (
    <Page>
      <TitleBar title="Settings Page" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="300" as="div">
            <BlockStack>
              <Card>
                <Form method="post" onSubmit={handleSubmit}>
                  <BlockStack gap="300">
                    <Text as="p" variant="bodyMd">
                      Manage API Credentials
                    </Text>
                    <TextField
                      label="Shop Domain"
                      name="shopDomain"
                      value={formState.shopDomain}
                      autoComplete="off"
                    />
                    <TextField
                      label="API Key"
                      name="apiKey"
                      placeholder="Key..."
                      value={formState.apiKey}
                      onChange={(value) =>
                        setFormState((prev) => ({ ...prev, apiKey: value }))
                      }
                      autoComplete="off"
                    />
                    <TextField
                      label="API Secret"
                      name="apiSecret"
                      placeholder="Secret..."
                      value={formState.apiSecret}
                      onChange={(value) =>
                        setFormState((prev) => ({ ...prev, apiSecret: value }))
                      }
                      autoComplete="off"
                    />

                    {/* Conditionally hide the Submit button if "Bearer delivery" exists */}

                    {!hasBearerDelivery ? (
                      <Button
                        submit
                        size="large"
                        tone="success"
                        variant="primary"
                      >
                        Activate Bearer
                      </Button>
                    ) : (
                      <Text as="p" variant="bodyMd" tone="success">
                        The Bearer Carrier Service is available in your shop.
                      </Text>
                    )}
                    {isSubmitSuccessful && ( // Show success message
                      <Text as="p" variant="bodyMd">
                        Credentials submitted successfully!
                      </Text>
                    )}
                  </BlockStack>
                </Form>
              </Card>
            </BlockStack>

            {/* Print carrier services formattedName under the form */}
            <BlockStack gap="300">
              <Card>
                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd">
                    Available Carrier Services:
                  </Text>
                  <Card>
                    {availableCarrierServices.map((service, index) => (
                      <List key={index}>
                        <li>{service.carrierService.formattedName}</li>
                      </List>
                    ))}
                  </Card>
                </BlockStack>
              </Card>
            </BlockStack>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SettingsPage;

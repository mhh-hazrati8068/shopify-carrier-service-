import { useEffect } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { Header } from "@shopify/polaris/build/ts/src/components/LegacyCard/components";

// Loader function to authenticate and make the GraphQL query request to fetch available carrier services
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // Proceed to the GraphQL query to fetch available carrier services
  const queryResponse = await admin.graphql(
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

  const queryJson = await queryResponse.json();

  // Return the available carrier services as the loader's response
  return json({
    queryJson,
  });
};

export default function Activation() {
  const fetcher = useFetcher<typeof loader>();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "GET";

  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
      shopify.toast.show("Carrier services fetched successfully");
    }
  }, [fetcher.data, shopify]);

  const fetchCarrierServices = () => fetcher.load(""); // Trigger fetching available carrier services

  return (
    <Page>
      <TitleBar title="Carrier Service Information">
        <Button
          variant="primary"
          onClick={() => fetchCarrierServices()}
          loading={isLoading}
        ></Button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Available Carrier Services
                  </Text>
                </BlockStack>
                {fetcher.data && (
                  <Box
                    padding="400"
                    background="bg-surface-active"
                    borderWidth="025"
                    borderRadius="200"
                    borderColor="border"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify(fetcher.data, null, 2)}</code>
                    </pre>
                  </Box>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

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

const SettingsPage: React.FC = () => {
  return (
    <Page>
      <TitleBar title="Introduction" />
      <Layout>
        <Layout.Section>
          <Text as="p" variant="bodyMd">
            Hello To Bearer delivery
          </Text>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SettingsPage;

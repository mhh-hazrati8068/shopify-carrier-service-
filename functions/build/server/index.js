import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, useFetcher, Form, useActionData, Link, useRouteError } from "@remix-run/react";
import { createReadableStreamFromReadable, json, redirect } from "@remix-run/node";
import { isbot } from "isbot";
import "@shopify/shopify-app-remix/adapters/node";
import { shopifyApp, LATEST_API_VERSION, AppDistribution, ApiVersion, LoginErrorType, boundary } from "@shopify/shopify-app-remix/server";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import { Page, Button, BlockStack, Layout, Card, Text, Box, TextField, List, AppProvider as AppProvider$1, FormLayout } from "@shopify/polaris";
import { useAppBridge, TitleBar, NavMenu } from "@shopify/app-bridge-react";
import CryptoJS from "crypto-js";
const dbUrl = new URL("mongodb+srv://apps:SwlZ2gLl7RYw9udK@clusterbearerdev.6mxw2.mongodb.net");
const dbName = "ClusterBearerDev";
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
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
    "write_checkouts"
  ],
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new MongoDBSessionStorage(dbUrl, dbName) || "",
  distribution: AppDistribution.AppStore,
  restResources,
  isEmbeddedApp: true,
  future: {
    unstable_newEmbeddedAuthStrategy: true
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
ApiVersion.October24;
shopify.addDocumentResponseHeaders;
const authenticate = shopify.authenticate;
shopify.unauthenticated;
const login = shopify.login;
shopify.registerWebhooks;
shopify.sessionStorage;
const ABORT_DELAY = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  shopify.addDocumentResponseHeaders(request, responseHeaders);
  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6({ request }) {
  await shopify.authenticate.admin(request);
  return json({
    apiKey: process.env.SHOPIFY_API_KEY
  });
}
function App$2() {
  const { apiKey } = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://cdn.shopify.com/" }),
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "stylesheet",
          href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsx("body", { children: /* @__PURE__ */ jsxs(AppProvider, { apiKey: apiKey || "", isEmbeddedApp: true, children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] }) })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$2,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const action$7 = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  console.log(JSON.stringify(payload, null, 2));
  return new Response();
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
const action$6 = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  console.log(JSON.stringify(payload, null, 2));
  return new Response();
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
const action$5 = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  return new Response();
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}
const prisma = global.prisma || new PrismaClient();
const action$4 = async ({
  request
}) => {
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
  if (typeof shopDomain !== "string" || shopDomain.trim() === "" || typeof apiKey !== "string" || apiKey.trim() === "" || typeof apiSecret !== "string" || apiSecret.trim() === "") {
    throw new Response(
      "Invalid input. shopDomain, apiKey, and apiSecret are required.",
      { status: 400 }
    );
  }
  try {
    const upsertedCredential = await prisma.credentials.upsert({
      where: { id, shop: shopDomain },
      // Find the record based on shopDomain
      update: {
        // Update fields if the record exists
        apiKey,
        apiSecret
      },
      create: {
        // Create new record if it doesn't exist
        shop: shopDomain,
        apiKey,
        apiSecret
      }
    });
    return json(upsertedCredential, { status: 200 });
  } catch (error) {
    console.error("Error upserting credentials:", error);
    throw new Response("Failed to upsert credentials", { status: 500 });
  }
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);
  console.log(JSON.stringify(payload, null, 2));
  return new Response();
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
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
  const credential = await prisma.credentials.findFirst({
    where: { shop: shopDomain }
  });
  if (!credential) {
    throw new Response("No credentials found for the given shopDomain", { status: 404 });
  }
  return json(credential);
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$5 = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
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
      `
  );
  const queryJson = await queryResponse.json();
  return json({
    queryJson
  });
};
function Activation() {
  const fetcher = useFetcher();
  const shopify2 = useAppBridge();
  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "GET";
  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
      shopify2.toast.show("Carrier services fetched successfully");
    }
  }, [fetcher.data, shopify2]);
  const fetchCarrierServices = () => fetcher.load("");
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Carrier Service Information", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "primary",
        onClick: () => fetchCarrierServices(),
        loading: isLoading
      }
    ) }),
    /* @__PURE__ */ jsx(BlockStack, { gap: "500", children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "500", children: [
      /* @__PURE__ */ jsx(BlockStack, { gap: "200", children: /* @__PURE__ */ jsx(Text, { as: "h2", variant: "headingMd", children: "Available Carrier Services" }) }),
      fetcher.data && /* @__PURE__ */ jsx(
        Box,
        {
          padding: "400",
          background: "bg-surface-active",
          borderWidth: "025",
          borderRadius: "200",
          borderColor: "border",
          overflowX: "scroll",
          children: /* @__PURE__ */ jsx("pre", { style: { margin: 0 }, children: /* @__PURE__ */ jsx("code", { children: JSON.stringify(fetcher.data, null, 2) }) })
        }
      )
    ] }) }) }) }) })
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Activation,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const queryResponse = await admin.graphql(
    `#graphql
        query {
          shop {
            myshopifyDomain
          }
        }
      `
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
    `
  );
  const carrierQueryJson = await carrierQueryResponse.json();
  if (!queryJson.data || !queryJson.data.shop) {
    throw new Error("Failed to fetch shop information");
  }
  return json({
    shop: queryJson.data.shop.myshopifyDomain,
    carrier: carrierQueryJson.data.availableCarrierServices
  });
};
const action$1 = async ({ request }) => {
  const formData = await request.formData();
  const { admin } = await authenticate.admin(request);
  const newCredentials = {
    shopDomain: formData.get("shopDomain"),
    apiKey: formData.get("apiKey"),
    apiSecret: formData.get("apiSecret")
  };
  const secretKey = "hazrati.dev-mohammad-shopify8068";
  const encryptedApiKey = CryptoJS.AES.encrypt(
    newCredentials.apiKey,
    secretKey
  ).toString();
  const encryptedApiSecret = CryptoJS.AES.encrypt(
    newCredentials.apiSecret,
    secretKey
  ).toString();
  const existingCredentials = await prisma.credentials.findFirst({
    where: {
      shop: newCredentials.shopDomain
    }
  });
  await prisma.credentials.upsert({
    where: {
      id: (existingCredentials == null ? void 0 : existingCredentials.id) || "507f1f77bcf86cd799439011"
    },
    update: {
      apiKey: encryptedApiKey,
      shop: newCredentials.shopDomain,
      apiSecret: encryptedApiSecret
    },
    create: {
      apiKey: encryptedApiKey,
      shop: newCredentials.shopDomain,
      apiSecret: encryptedApiSecret
    }
  });
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
          supportsServiceDiscovery: true
        }
      }
    }
  );
  const mutationJson = await mutationResponse.json();
  return json({ newCredentials, mutationJson });
};
const SettingsPage$1 = () => {
  var _a, _b;
  const shopDomain = ((_a = useLoaderData()) == null ? void 0 : _a.shop) || "";
  const availableCarrierServices = ((_b = useLoaderData()) == null ? void 0 : _b.carrier) || [];
  const [formState, setFormState] = useState({
    shopDomain: shopDomain || "",
    // Use loader data for initial state
    apiKey: "",
    apiSecret: ""
  });
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [hasBearerDelivery, setHasBearerDelivery] = useState(false);
  useEffect(() => {
    const hasBearer = availableCarrierServices.some(
      (service) => service.carrierService.formattedName.includes("Bearer d   elivery")
    );
    console.log(hasBearer);
    setHasBearerDelivery(hasBearer);
  }, [availableCarrierServices]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form2 = event.currentTarget;
    const formData = new FormData(form2);
    const response = await fetch(form2.action, {
      method: form2.method,
      body: formData
    });
    if (response.ok) {
      setIsSubmitSuccessful(true);
    }
  };
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Settings Page" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", as: "div", children: [
      /* @__PURE__ */ jsx(BlockStack, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Form, { method: "post", onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs(BlockStack, { gap: "300", children: [
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Manage API Credentials" }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Shop Domain",
            name: "shopDomain",
            value: formState.shopDomain,
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "API Key",
            name: "apiKey",
            placeholder: "Key...",
            value: formState.apiKey,
            onChange: (value) => setFormState((prev) => ({ ...prev, apiKey: value })),
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "API Secret",
            name: "apiSecret",
            placeholder: "Secret...",
            value: formState.apiSecret,
            onChange: (value) => setFormState((prev) => ({ ...prev, apiSecret: value })),
            autoComplete: "off"
          }
        ),
        !hasBearerDelivery ? /* @__PURE__ */ jsx(
          Button,
          {
            submit: true,
            size: "large",
            tone: "success",
            variant: "primary",
            children: "Activate Bearer"
          }
        ) : /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", tone: "success", children: "The Bearer Carrier Service is available in your shop." }),
        isSubmitSuccessful && // Show success message
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Credentials submitted successfully!" })
      ] }) }) }) }),
      /* @__PURE__ */ jsx(BlockStack, { gap: "300", children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, { gap: "200", children: [
        /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Available Carrier Services:" }),
        /* @__PURE__ */ jsx(Card, { children: availableCarrierServices.map((service, index2) => /* @__PURE__ */ jsx(List, { children: /* @__PURE__ */ jsx("li", { children: service.carrierService.formattedName }) }, index2)) })
      ] }) }) })
    ] }) }) })
  ] });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: SettingsPage$1,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const SettingsPage = () => {
  return /* @__PURE__ */ jsxs(Page, { children: [
    /* @__PURE__ */ jsx(TitleBar, { title: "Introduction" }),
    /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Text, { as: "p", variant: "bodyMd", children: "Hello To Bearer delivery" }) }) })
  ] });
};
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SettingsPage
}, Symbol.toStringTag, { value: "Module" }));
const Polaris = {
  ActionMenu: {
    Actions: {
      moreActions: "More actions"
    },
    RollupActions: {
      rollupButton: "View actions"
    }
  },
  ActionList: {
    SearchField: {
      clearButtonLabel: "Clear",
      search: "Search",
      placeholder: "Search actions"
    }
  },
  Avatar: {
    label: "Avatar",
    labelWithInitials: "Avatar with initials {initials}"
  },
  Autocomplete: {
    spinnerAccessibilityLabel: "Loading",
    ellipsis: "{content}…"
  },
  Badge: {
    PROGRESS_LABELS: {
      incomplete: "Incomplete",
      partiallyComplete: "Partially complete",
      complete: "Complete"
    },
    TONE_LABELS: {
      info: "Info",
      success: "Success",
      warning: "Warning",
      critical: "Critical",
      attention: "Attention",
      "new": "New",
      readOnly: "Read-only",
      enabled: "Enabled"
    },
    progressAndTone: "{toneLabel} {progressLabel}"
  },
  Banner: {
    dismissButton: "Dismiss notification"
  },
  Button: {
    spinnerAccessibilityLabel: "Loading"
  },
  Common: {
    checkbox: "checkbox",
    undo: "Undo",
    cancel: "Cancel",
    clear: "Clear",
    close: "Close",
    submit: "Submit",
    more: "More"
  },
  ContextualSaveBar: {
    save: "Save",
    discard: "Discard"
  },
  DataTable: {
    sortAccessibilityLabel: "sort {direction} by",
    navAccessibilityLabel: "Scroll table {direction} one column",
    totalsRowHeading: "Totals",
    totalRowHeading: "Total"
  },
  DatePicker: {
    previousMonth: "Show previous month, {previousMonthName} {showPreviousYear}",
    nextMonth: "Show next month, {nextMonth} {nextYear}",
    today: "Today ",
    start: "Start of range",
    end: "End of range",
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    },
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    },
    daysAbbreviated: {
      monday: "Mo",
      tuesday: "Tu",
      wednesday: "We",
      thursday: "Th",
      friday: "Fr",
      saturday: "Sa",
      sunday: "Su"
    }
  },
  DiscardConfirmationModal: {
    title: "Discard all unsaved changes",
    message: "If you discard changes, you’ll delete any edits you made since you last saved.",
    primaryAction: "Discard changes",
    secondaryAction: "Continue editing"
  },
  DropZone: {
    single: {
      overlayTextFile: "Drop file to upload",
      overlayTextImage: "Drop image to upload",
      overlayTextVideo: "Drop video to upload",
      actionTitleFile: "Add file",
      actionTitleImage: "Add image",
      actionTitleVideo: "Add video",
      actionHintFile: "or drop file to upload",
      actionHintImage: "or drop image to upload",
      actionHintVideo: "or drop video to upload",
      labelFile: "Upload file",
      labelImage: "Upload image",
      labelVideo: "Upload video"
    },
    allowMultiple: {
      overlayTextFile: "Drop files to upload",
      overlayTextImage: "Drop images to upload",
      overlayTextVideo: "Drop videos to upload",
      actionTitleFile: "Add files",
      actionTitleImage: "Add images",
      actionTitleVideo: "Add videos",
      actionHintFile: "or drop files to upload",
      actionHintImage: "or drop images to upload",
      actionHintVideo: "or drop videos to upload",
      labelFile: "Upload files",
      labelImage: "Upload images",
      labelVideo: "Upload videos"
    },
    errorOverlayTextFile: "File type is not valid",
    errorOverlayTextImage: "Image type is not valid",
    errorOverlayTextVideo: "Video type is not valid"
  },
  EmptySearchResult: {
    altText: "Empty search results"
  },
  Frame: {
    skipToContent: "Skip to content",
    navigationLabel: "Navigation",
    Navigation: {
      closeMobileNavigationLabel: "Close navigation"
    }
  },
  FullscreenBar: {
    back: "Back",
    accessibilityLabel: "Exit fullscreen mode"
  },
  Filters: {
    moreFilters: "More filters",
    moreFiltersWithCount: "More filters ({count})",
    filter: "Filter {resourceName}",
    noFiltersApplied: "No filters applied",
    cancel: "Cancel",
    done: "Done",
    clearAllFilters: "Clear all filters",
    clear: "Clear",
    clearLabel: "Clear {filterName}",
    addFilter: "Add filter",
    clearFilters: "Clear all",
    searchInView: "in:{viewName}"
  },
  FilterPill: {
    clear: "Clear",
    unsavedChanges: "Unsaved changes - {label}"
  },
  IndexFilters: {
    searchFilterTooltip: "Search and filter",
    searchFilterTooltipWithShortcut: "Search and filter (F)",
    searchFilterAccessibilityLabel: "Search and filter results",
    sort: "Sort your results",
    addView: "Add a new view",
    newView: "Custom search",
    SortButton: {
      ariaLabel: "Sort the results",
      tooltip: "Sort",
      title: "Sort by",
      sorting: {
        asc: "Ascending",
        desc: "Descending",
        az: "A-Z",
        za: "Z-A"
      }
    },
    EditColumnsButton: {
      tooltip: "Edit columns",
      accessibilityLabel: "Customize table column order and visibility"
    },
    UpdateButtons: {
      cancel: "Cancel",
      update: "Update",
      save: "Save",
      saveAs: "Save as",
      modal: {
        title: "Save view as",
        label: "Name",
        sameName: "A view with this name already exists. Please choose a different name.",
        save: "Save",
        cancel: "Cancel"
      }
    }
  },
  IndexProvider: {
    defaultItemSingular: "Item",
    defaultItemPlural: "Items",
    allItemsSelected: "All {itemsLength}+ {resourceNamePlural} are selected",
    selected: "{selectedItemsCount} selected",
    a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
    a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
    a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
    a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}"
  },
  IndexTable: {
    emptySearchTitle: "No {resourceNamePlural} found",
    emptySearchDescription: "Try changing the filters or search term",
    onboardingBadgeText: "New",
    resourceLoadingAccessibilityLabel: "Loading {resourceNamePlural}…",
    selectAllLabel: "Select all {resourceNamePlural}",
    selected: "{selectedItemsCount} selected",
    undo: "Undo",
    selectAllItems: "Select all {itemsLength}+ {resourceNamePlural}",
    selectItem: "Select {resourceName}",
    selectButtonText: "Select",
    sortAccessibilityLabel: "sort {direction} by"
  },
  Loading: {
    label: "Page loading bar"
  },
  Modal: {
    iFrameTitle: "body markup",
    modalWarning: "These required properties are missing from Modal: {missingProps}"
  },
  Page: {
    Header: {
      rollupActionsLabel: "View actions for {title}",
      pageReadyAccessibilityLabel: "{title}. This page is ready"
    }
  },
  Pagination: {
    previous: "Previous",
    next: "Next",
    pagination: "Pagination"
  },
  ProgressBar: {
    negativeWarningMessage: "Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.",
    exceedWarningMessage: "Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100."
  },
  ResourceList: {
    sortingLabel: "Sort by",
    defaultItemSingular: "item",
    defaultItemPlural: "items",
    showing: "Showing {itemsCount} {resource}",
    showingTotalCount: "Showing {itemsCount} of {totalItemsCount} {resource}",
    loading: "Loading {resource}",
    selected: "{selectedItemsCount} selected",
    allItemsSelected: "All {itemsLength}+ {resourceNamePlural} in your store are selected",
    allFilteredItemsSelected: "All {itemsLength}+ {resourceNamePlural} in this filter are selected",
    selectAllItems: "Select all {itemsLength}+ {resourceNamePlural} in your store",
    selectAllFilteredItems: "Select all {itemsLength}+ {resourceNamePlural} in this filter",
    emptySearchResultTitle: "No {resourceNamePlural} found",
    emptySearchResultDescription: "Try changing the filters or search term",
    selectButtonText: "Select",
    a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
    a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
    a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
    a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}",
    Item: {
      actionsDropdownLabel: "Actions for {accessibilityLabel}",
      actionsDropdown: "Actions dropdown",
      viewItem: "View details for {itemName}"
    },
    BulkActions: {
      actionsActivatorLabel: "Actions",
      moreActionsActivatorLabel: "More actions"
    }
  },
  SkeletonPage: {
    loadingLabel: "Page loading"
  },
  Tabs: {
    newViewAccessibilityLabel: "Create new view",
    newViewTooltip: "Create view",
    toggleTabsLabel: "More views",
    Tab: {
      rename: "Rename view",
      duplicate: "Duplicate view",
      edit: "Edit view",
      editColumns: "Edit columns",
      "delete": "Delete view",
      copy: "Copy of {name}",
      deleteModal: {
        title: "Delete view?",
        description: "This can’t be undone. {viewName} view will no longer be available in your admin.",
        cancel: "Cancel",
        "delete": "Delete view"
      }
    },
    RenameModal: {
      title: "Rename view",
      label: "Name",
      cancel: "Cancel",
      create: "Save",
      errors: {
        sameName: "A view with this name already exists. Please choose a different name."
      }
    },
    DuplicateModal: {
      title: "Duplicate view",
      label: "Name",
      cancel: "Cancel",
      create: "Create view",
      errors: {
        sameName: "A view with this name already exists. Please choose a different name."
      }
    },
    CreateViewModal: {
      title: "Create new view",
      label: "Name",
      cancel: "Cancel",
      create: "Create view",
      errors: {
        sameName: "A view with this name already exists. Please choose a different name."
      }
    }
  },
  Tag: {
    ariaLabel: "Remove {children}"
  },
  TextField: {
    characterCount: "{count} characters",
    characterCountWithMaxLength: "{count} of {limit} characters used"
  },
  TooltipOverlay: {
    accessibilityLabel: "Tooltip: {label}"
  },
  TopBar: {
    toggleMenuLabel: "Toggle menu",
    SearchField: {
      clearButtonLabel: "Clear",
      search: "Search"
    }
  },
  MediaCard: {
    dismissButton: "Dismiss",
    popoverButton: "Actions"
  },
  VideoThumbnail: {
    playButtonA11yLabel: {
      "default": "Play video",
      defaultWithDuration: "Play video of length {duration}",
      duration: {
        hours: {
          other: {
            only: "{hourCount} hours",
            andMinutes: "{hourCount} hours and {minuteCount} minutes",
            andMinute: "{hourCount} hours and {minuteCount} minute",
            minutesAndSeconds: "{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds",
            minutesAndSecond: "{hourCount} hours, {minuteCount} minutes, and {secondCount} second",
            minuteAndSeconds: "{hourCount} hours, {minuteCount} minute, and {secondCount} seconds",
            minuteAndSecond: "{hourCount} hours, {minuteCount} minute, and {secondCount} second",
            andSeconds: "{hourCount} hours and {secondCount} seconds",
            andSecond: "{hourCount} hours and {secondCount} second"
          },
          one: {
            only: "{hourCount} hour",
            andMinutes: "{hourCount} hour and {minuteCount} minutes",
            andMinute: "{hourCount} hour and {minuteCount} minute",
            minutesAndSeconds: "{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds",
            minutesAndSecond: "{hourCount} hour, {minuteCount} minutes, and {secondCount} second",
            minuteAndSeconds: "{hourCount} hour, {minuteCount} minute, and {secondCount} seconds",
            minuteAndSecond: "{hourCount} hour, {minuteCount} minute, and {secondCount} second",
            andSeconds: "{hourCount} hour and {secondCount} seconds",
            andSecond: "{hourCount} hour and {secondCount} second"
          }
        },
        minutes: {
          other: {
            only: "{minuteCount} minutes",
            andSeconds: "{minuteCount} minutes and {secondCount} seconds",
            andSecond: "{minuteCount} minutes and {secondCount} second"
          },
          one: {
            only: "{minuteCount} minute",
            andSeconds: "{minuteCount} minute and {secondCount} seconds",
            andSecond: "{minuteCount} minute and {secondCount} second"
          }
        },
        seconds: {
          other: "{secondCount} seconds",
          one: "{secondCount} second"
        }
      }
    }
  }
};
const polarisTranslations = {
  Polaris
};
const polarisStyles = "/assets/styles-DT9i95_b.css";
function loginErrorMessage(loginErrors) {
  if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  } else if ((loginErrors == null ? void 0 : loginErrors.shop) === LoginErrorType.InvalidShop) {
    return { shop: "Please enter a valid shop domain to log in" };
  }
  return {};
}
const links$1 = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader$3 = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return json({ errors, polarisTranslations });
};
const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return json({
    errors
  });
};
function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;
  return /* @__PURE__ */ jsx(AppProvider$1, { i18n: loaderData.polarisTranslations, children: /* @__PURE__ */ jsx(Page, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsxs(FormLayout, { children: [
    /* @__PURE__ */ jsx(Text, { variant: "headingMd", as: "h2", children: "Log in" }),
    /* @__PURE__ */ jsx(
      TextField,
      {
        type: "text",
        name: "shop",
        label: "Shop domain",
        helpText: "example.myshopify.com",
        value: shop,
        onChange: setShop,
        autoComplete: "on",
        error: errors.shop
      }
    ),
    /* @__PURE__ */ jsx(Button, { submit: true, children: "Log in" })
  ] }) }) }) }) });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Auth,
  links: links$1,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const index = "_index_1hqgz_1";
const heading = "_heading_1hqgz_21";
const text = "_text_1hqgz_23";
const content = "_content_1hqgz_43";
const form = "_form_1hqgz_53";
const label = "_label_1hqgz_69";
const input = "_input_1hqgz_85";
const button = "_button_1hqgz_93";
const list = "_list_1hqgz_101";
const styles = {
  index,
  heading,
  text,
  content,
  form,
  label,
  input,
  button,
  list
};
const loader$1 = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return json({ showForm: Boolean(login) });
};
function App$1() {
  const { showForm } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: styles.index, children: /* @__PURE__ */ jsxs("div", { className: styles.content, children: [
    /* @__PURE__ */ jsx("h1", { className: styles.heading, children: "A short heading about [your app]" }),
    /* @__PURE__ */ jsx("p", { className: styles.text, children: "A tagline about [your app] that describes your value proposition." }),
    showForm && /* @__PURE__ */ jsxs(Form, { className: styles.form, method: "post", action: "/auth/login", children: [
      /* @__PURE__ */ jsxs("label", { className: styles.label, children: [
        /* @__PURE__ */ jsx("span", { children: "Shop domain" }),
        /* @__PURE__ */ jsx("input", { className: styles.input, type: "text", name: "shop" }),
        /* @__PURE__ */ jsx("span", { children: "e.g: my-shop-domain.myshopify.com" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: styles.button, type: "submit", children: "Log in" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: styles.list, children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Product feature" }),
        ". Some detail about your feature and its benefit to your customer."
      ] })
    ] })
  ] }) });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App$1,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{ rel: "stylesheet", href: polarisStyles }];
const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};
function App() {
  const { apiKey } = useLoaderData();
  return /* @__PURE__ */ jsxs(AppProvider, { isEmbeddedApp: true, apiKey, children: [
    /* @__PURE__ */ jsxs(NavMenu, { children: [
      /* @__PURE__ */ jsx(Link, { to: "/app", rel: "home", children: "Home" }),
      /* @__PURE__ */ jsx(Link, { to: "/app/additional", children: "Settings" })
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
function ErrorBoundary() {
  return boundary.error(useRouteError());
}
const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  headers,
  links,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-o0e_lBr9.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/components-BjFc177o.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-stm_zwMc.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/components-BjFc177o.js", "/assets/AppProxyProvider-B3Vse2uB.js", "/assets/AppProvider-Dc7-XUoz.js", "/assets/context-BvNBXPIc.js"], "css": [] }, "routes/webhooks.customers.data_request": { "id": "routes/webhooks.customers.data_request", "parentId": "root", "path": "webhooks/customers/data_request", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.customers.data_request-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.customers.redact": { "id": "routes/webhooks.customers.redact", "parentId": "root", "path": "webhooks/customers/redact", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.customers.redact-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.app.uninstalled": { "id": "routes/webhooks.app.uninstalled", "parentId": "root", "path": "webhooks/app/uninstalled", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.app.uninstalled-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.createCredential": { "id": "routes/api.createCredential", "parentId": "root", "path": "api/createCredential", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.createCredential-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/webhooks.shop.redact": { "id": "routes/webhooks.shop.redact", "parentId": "root", "path": "webhooks/shop/redact", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/webhooks.shop.redact-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.credentials": { "id": "routes/api.credentials", "parentId": "root", "path": "api/credentials", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.credentials-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/app.activation": { "id": "routes/app.activation", "parentId": "routes/app", "path": "activation", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.activation-CnxaFuu6.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/index-DrlDjJDS.js", "/assets/components-BjFc177o.js", "/assets/Page-DDM6I2Ft.js", "/assets/Layout-BydNcIZ-.js", "/assets/Card-Bo18rNf_.js", "/assets/context-BvNBXPIc.js"], "css": [] }, "routes/app.additional": { "id": "routes/app.additional", "parentId": "routes/app", "path": "additional", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app.additional-DhGw0719.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/index-DrlDjJDS.js", "/assets/components-BjFc177o.js", "/assets/Page-DDM6I2Ft.js", "/assets/Layout-BydNcIZ-.js", "/assets/Card-Bo18rNf_.js", "/assets/context-BvNBXPIc.js"], "css": [] }, "routes/app._index": { "id": "routes/app._index", "parentId": "routes/app", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/app._index-Chcpd1En.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/index-DrlDjJDS.js", "/assets/Page-DDM6I2Ft.js", "/assets/Layout-BydNcIZ-.js", "/assets/context-BvNBXPIc.js"], "css": [] }, "routes/auth.login": { "id": "routes/auth.login", "parentId": "root", "path": "auth/login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-SgrTltkY.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/styles-BPtKC6Q9.js", "/assets/components-BjFc177o.js", "/assets/AppProvider-Dc7-XUoz.js", "/assets/Page-DDM6I2Ft.js", "/assets/Card-Bo18rNf_.js", "/assets/context-BvNBXPIc.js"], "css": [] }, "routes/auth.$": { "id": "routes/auth.$", "parentId": "root", "path": "auth/*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-Da1GtVKQ.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/components-BjFc177o.js"], "css": ["/assets/route-Qq2qOeDq.css"] }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/app-DJe1hqo6.js", "imports": ["/assets/index-B1pHpRNp.js", "/assets/AppProxyProvider-B3Vse2uB.js", "/assets/index-DrlDjJDS.js", "/assets/styles-BPtKC6Q9.js", "/assets/components-BjFc177o.js", "/assets/AppProvider-Dc7-XUoz.js", "/assets/context-BvNBXPIc.js"], "css": [] } }, "url": "/assets/manifest-85f1d3eb.js", "version": "85f1d3eb" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/webhooks.customers.data_request": {
    id: "routes/webhooks.customers.data_request",
    parentId: "root",
    path: "webhooks/customers/data_request",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/webhooks.customers.redact": {
    id: "routes/webhooks.customers.redact",
    parentId: "root",
    path: "webhooks/customers/redact",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "root",
    path: "webhooks/app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.createCredential": {
    id: "routes/api.createCredential",
    parentId: "root",
    path: "api/createCredential",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/webhooks.shop.redact": {
    id: "routes/webhooks.shop.redact",
    parentId: "root",
    path: "webhooks/shop/redact",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api.credentials": {
    id: "routes/api.credentials",
    parentId: "root",
    path: "api/credentials",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/app.activation": {
    id: "routes/app.activation",
    parentId: "routes/app",
    path: "activation",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route9
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "root",
    path: "auth/login",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route12
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};

// import { BlockStack } from "@shopify/polaris";
import {
  reactExtension,
  Banner,
  Text,
  BlockStack,
  useShippingAddress,
  useCartLines,
  useExtensionApi,
} from "@shopify/ui-extensions-react/customer-account";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const cartLines = useCartLines();
  const { orderConfirmation } = useExtensionApi();
  const { deliveryGroups } = useExtensionApi();
  const { shop } = useExtensionApi();
  const [orderNumber, setOrderNumber] = useState("");
  const [reservationCode, setReservationCode] = useState(null);
  const [isAustralia, setIsAustralia] = useState(true);
  const [reservationKey, setReservationKey] = useState(null);
  const [reservationSecret, setReservationSecret] = useState(null);
  const [shopDomain, setShopDomain] = useState("");

  const shippingAddress = useShippingAddress();

  console.log("run outside the effect ");
  useEffect(() => {
    console.log("runs");
    const extractOrderNumber = "";
    // deliveryGroups.current[0].deliveryOptions[0].description;
    const extractedOrderNumber = extractOrderNumber.split(": ")[1];

    if (shippingAddress?.countryCode === "AU") {
      const currentOrderNumber = orderConfirmation?.current?.number;
      console.log(currentOrderNumber);

      if (currentOrderNumber) {
        setOrderNumber(currentOrderNumber);
        fetchReservationData(extractedOrderNumber, currentOrderNumber);
      } else {
        console.warn("Order number is null or undefined");
      }

      setIsAustralia(true);
    } else {
      console.log("not australia");
      setIsAustralia(false);
    }
  }, []);

  // decryption
  function decrypt(cipherText) {
    const secretKey = "hazrati.dev-mohammad-shopify8068"; // Your secret key
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to UTF-8 string
  }
  // Function to fetch data from Prisma via the API
  async function fetchReservationData(priceListId, currentOrderNumber) {
    const appUrl =
      "https://bearer-shopify-development-65a2480c4cb8.herokuapp.com";
    console.log(appUrl);
    const requestData = {
      shop: shop.myshopifyDomain,
    };

    try {
      const response = await fetch(appUrl + "/api/credentials", {
        method: "POST", // Change to POST method
        headers: {
          "Content-Type": "application/json", // Set the content type
        },
        body: JSON.stringify(requestData), // Send the request data
      });

      if (response.ok) {
        const data = await response.json();
        const decryptedApiKey = decrypt(data.apiKey);
        const decryptedApiSecret = decrypt(data.apiSecret);
        setReservationKey(decryptedApiKey);
        setReservationSecret(decryptedApiSecret);
        reserve(
          priceListId,
          currentOrderNumber,
          decryptedApiKey,
          decryptedApiSecret,
        );
        console.log("reservation", decryptedApiKey, decryptedApiSecret);
      } else {
        console.error("Failed to fetch reservation data:", response.statusText);
      }
    } catch (error) {
      console.error(
        "Network error while fetching reservation data:",
        error.message,
      );
    }
  }

  async function reserve(priceListId, currentOrderNumber, apiKey, apiSecret) {
    const api_key = apiKey;
    const api_secret = apiSecret;
    const credentials = btoa(`${api_key}:${api_secret}`);
    console.log(credentials, api_key, api_secret, "cred");
    const phoneNumber = shippingAddress?.phone || "+61400000000";
    try {
      const response = await fetch(
        "https://us-central1-bearer-seyco-development.cloudfunctions.net/orderReservationAPIv1dot0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            price_list_id: priceListId,
            client_order_number: currentOrderNumber, // Use the passed orderNumber
            destination_address_more_details: shippingAddress?.address2 || "",
            recipients_full_name: shippingAddress?.name || "",
            recipients_phone_number: phoneNumber,
            verify_recipient_at_destination:
              phoneNumber.startsWith("+614") || phoneNumber.startsWith("04")
                ? true
                : false,
            intermediate_api_platform: "Shopify",
            intermediate_api_provider: "Bearer",
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setReservationCode(data.reservation_id);
      } else {
        console.error("Reservation failed:", response.statusText);
      }
    } catch (error) {
      console.error("Network error during reservation:", error.message);
    }
  }

  return (
    <BlockStack>
      <Text> {reservationKey} </Text>
    </BlockStack>
  );
}

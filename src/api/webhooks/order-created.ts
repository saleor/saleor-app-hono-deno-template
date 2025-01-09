import { saleorApp } from "../../saleor-app.ts";
import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/fetch-api";
import { gql } from "https://deno.land/x/graphql_tag@0.1.2/mod.ts";
import { OrderCreatedWebhookPayloadFragment } from "../../../generated/graphql.ts";

/**
 * Example payload of the webhook. It will be transformed with graphql-codegen to Typescript type: OrderCreatedWebhookPayloadFragment
 */
export const OrderCreatedWebhookPayload = gql`
  fragment OrderCreatedWebhookPayload on OrderCreated {
    order {
      userEmail
      id
      number
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

/**
 * Top-level webhook subscription query, that will be attached to the Manifest.
 * Saleor will use it to register webhook.
 */
const OrderCreatedGraphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${OrderCreatedWebhookPayload}
  subscription OrderCreated {
    event {
      ...OrderCreatedWebhookPayload
    }
  }
`;

export const orderCreatedWebhook = new SaleorAsyncWebhook<
  OrderCreatedWebhookPayloadFragment
>({
  name: "Order Created in Saleor",
  webhookPath: "api/webhooks/order-created",
  event: "ORDER_CREATED",
  apl: saleorApp.apl,
  query: OrderCreatedGraphqlSubscription,
});

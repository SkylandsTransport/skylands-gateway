import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyOrders from "./tools/list-my-orders";
import getOrder from "./tools/get-order";
import createDieselQuote from "./tools/create-diesel-quote";
import createTransportQuote from "./tools/create-transport-quote";
import getMyProfile from "./tools/get-my-profile";

// The OAuth issuer must be the direct Supabase host, built from the project ref
// so it stays import-safe (Vite inlines VITE_ vars at build time). The fallback
// keeps the issuer well-formed during the throwaway manifest-extract eval.
const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "skylands-transport-mcp",
  title: "Skylands Transport",
  version: "0.1.0",
  instructions:
    "Tools for Skylands Transport clients. Use `list_my_orders` and `get_order` to review the signed-in user's diesel and transport orders, `create_diesel_quote` and `create_transport_quote` to submit new quote requests, and `get_my_profile` to read the user's account details.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listMyOrders,
    getOrder,
    createDieselQuote,
    createTransportQuote,
    getMyProfile,
  ],
});

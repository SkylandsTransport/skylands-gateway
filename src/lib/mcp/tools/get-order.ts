import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "get_order",
  title: "Get order details",
  description:
    "Look up one Skylands Transport order by its order ID (e.g. #SK-1001). Only returns the order if it belongs to the signed-in user.",
  inputSchema: {
    order_id: z
      .string()
      .min(1)
      .describe("The order's public ID, e.g. '#SK-1001' or 'SK-1001'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const normalized = order_id.trim().startsWith("#")
      ? order_id.trim()
      : `#${order_id.trim()}`;
    const { data, error } = await supabaseForUser(ctx)
      .from("quotes")
      .select(
        "order_id, service, service_type, details, quantity, location, status, created_at, delivered_at",
      )
      .eq("user_id", ctx.getUserId())
      .eq("order_id", normalized)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: `Order ${normalized} not found.` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { order: data },
    };
  },
});

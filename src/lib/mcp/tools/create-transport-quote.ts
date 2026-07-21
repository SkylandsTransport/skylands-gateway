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
  name: "create_transport_quote",
  title: "Create a transport quote",
  description:
    "Create a new logistics/transport quote for the signed-in Skylands Transport user. Returns the newly created order.",
  inputSchema: {
    load_detail: z
      .string()
      .min(1)
      .describe("What's being transported, e.g. 'General Cargo', 'Perishables', 'Hazmat'."),
    pickup: z.string().min(1).describe("Pickup location."),
    dropoff: z.string().min(1).describe("Drop-off location."),
    weight_class: z
      .string()
      .optional()
      .describe("Weight class, e.g. 'Under 5 Tons', '5-10 Tons', 'Superlink 30+'."),
    note: z.string().optional().describe("Optional additional note."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ load_detail, pickup, dropoff, weight_class, note }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const details = [
      load_detail,
      weight_class,
      `${pickup} → ${dropoff}`,
      note ? `Note: ${note}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    const { data, error } = await supabaseForUser(ctx)
      .from("quotes")
      .insert({
        order_id: "",
        user_id: ctx.getUserId(),
        service: "Transport",
        service_type: "Transport",
        details,
        quantity: weight_class ?? null,
        location: `${pickup} → ${dropoff}`,
      })
      .select(
        "order_id, service, details, quantity, location, status, created_at",
      )
      .single();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [
        { type: "text", text: `Created order ${data.order_id} (Transport, ${pickup} → ${dropoff}).` },
      ],
      structuredContent: { order: data },
    };
  },
});

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
  name: "create_diesel_quote",
  title: "Create a diesel quote",
  description:
    "Create a new diesel fuel quote for the signed-in Skylands Transport user. Returns the newly created order.",
  inputSchema: {
    liters: z.number().positive().describe("Liters of diesel requested."),
    fuel_grade: z
      .string()
      .optional()
      .describe("Fuel grade (e.g. '50ppm', '500ppm'). Optional."),
    delivery_location: z
      .string()
      .min(1)
      .describe("Delivery location / address in South Africa."),
    note: z.string().optional().describe("Optional additional note."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ liters, fuel_grade, delivery_location, note }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const details = [
      `${liters}L`,
      fuel_grade ? `Grade: ${fuel_grade}` : null,
      note ? `Note: ${note}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    const { data, error } = await supabaseForUser(ctx)
      .from("quotes")
      .insert({
        order_id: "",
        user_id: ctx.getUserId(),
        service: "Diesel",
        service_type: "Diesel",
        details,
        quantity: `${liters}L`,
        location: delivery_location,
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
        { type: "text", text: `Created order ${data.order_id} (Diesel, ${liters}L to ${delivery_location}).` },
      ],
      structuredContent: { order: data },
    };
  },
});

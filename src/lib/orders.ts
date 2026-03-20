import { z } from "zod";

export const ADMIN_EMAIL = "delarey.skylands@gmail.com";

export const REQUEST_STATUSES = [
  "Inquiry Received",
  "Processing Order",
  "Order Approved",
  "Order Accepted",
  "Vehicle Assigned",
  "In Transit",
  "Delivered",
] as const;

export const LIVE_ORDER_FLOW = ["Order Approved", "Vehicle Assigned", "In Transit", "Delivered"] as const;

export const ACTIVE_ORDER_STATUSES = new Set<string>([
  "Approved",
  "Accepted",
  "Order Approved",
  "Order Accepted",
  ...LIVE_ORDER_FLOW,
]);

const PENDING_QUOTE_STORAGE_KEY = "skylands-pending-quote";

export const pendingQuoteSchema = z.object({
  service: z.string().trim().min(1).max(40),
  details: z.string().trim().min(3).max(500),
  waUrl: z.string().trim().url().max(2000),
  quantity: z.string().trim().max(120).optional(),
  location: z.string().trim().max(200).optional(),
});

export type PendingQuote = z.infer<typeof pendingQuoteSchema>;

export const writePendingQuote = (payload: PendingQuote) => {
  if (typeof window === "undefined") return;
  const parsed = pendingQuoteSchema.safeParse(payload);
  if (!parsed.success) return;
  window.sessionStorage.setItem(PENDING_QUOTE_STORAGE_KEY, JSON.stringify(parsed.data));
};

export const readPendingQuote = (): PendingQuote | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(PENDING_QUOTE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = pendingQuoteSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export const clearPendingQuote = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_QUOTE_STORAGE_KEY);
};

export const normalizeLiveStatus = (status: string) =>
  ["Approved", "Accepted", "Order Accepted"].includes(status) ? "Order Approved" : status;

export const buildManualOrderDetails = ({
  service,
  quantity,
  location,
  note,
}: {
  service: string;
  quantity: string;
  location: string;
  note?: string;
}) => {
  const unitLabel = service === "Diesel" ? "L" : "load";
  const segments = [`${service} order`, `${quantity} ${unitLabel}`, location];

  if (note?.trim()) {
    segments.push(`Notes: ${note.trim()}`);
  }

  return segments.join(" • ");
};
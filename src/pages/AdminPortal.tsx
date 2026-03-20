import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  ClipboardList,
  Copy,
  Eye,
  Fuel,
  Plus,
  Save,
  Search,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import heroDiesel from "@/assets/hero-diesel.jpg";
import { z } from "zod";
import {
  ACTIVE_ORDER_STATUSES,
  ADMIN_EMAIL,
  buildManualOrderDetails,
  LIVE_ORDER_FLOW,
  normalizeLiveStatus,
  REQUEST_STATUSES,
} from "@/lib/orders";

const manualOrderSchema = z.object({
  user_id: z.string().uuid("Please select a client"),
  service: z.enum(["Diesel", "Logistics"]),
  quantity: z.string().trim().min(1, "Quantity is required").max(80, "Quantity is too long"),
  location: z.string().trim().min(3, "Location is required").max(160, "Location is too long"),
  status: z.enum(REQUEST_STATUSES),
  note: z.string().trim().max(240, "Notes are too long").optional(),
});

const orderEditSchema = z.object({
  details: z.string().trim().min(3, "Order details are required").max(400, "Details are too long"),
  quantity: z.string().trim().max(80, "Quantity is too long").optional(),
  location: z.string().trim().max(160, "Location is too long").optional(),
  status: z.string().trim().min(3, "Status is required").max(60, "Status is too long"),
});

const statusBadgeClass: Record<string, string> = {
  "Inquiry Received": "bg-secondary/50 text-foreground border-border",
  "Processing Order": "bg-accent/10 text-accent border-accent/30",
  "Order Approved": "bg-accent/10 text-accent border-accent/30",
  "Vehicle Assigned": "bg-secondary text-secondary-foreground border-border",
  "In Transit": "bg-primary/15 text-primary border-primary/30",
  Delivered: "bg-success/15 text-success border-success/30",
  Approved: "bg-accent/10 text-accent border-accent/30",
  Accepted: "bg-accent/10 text-accent border-accent/30",
};

const actionButtonClass: Record<string, string> = {
  "Order Approved": "border-accent/30 bg-accent/10 text-accent hover:bg-accent/15",
  "Vehicle Assigned": "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
  "In Transit": "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15",
  Delivered: "border-success/30 bg-success/10 text-success hover:bg-success/15",
};

type QuoteRow = {
  id: string;
  order_id: string;
  service: string;
  details: string;
  quantity: string;
  location: string;
  status: string;
  created_at: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
};

type RawQuoteRow = Omit<QuoteRow, "customer_name" | "customer_phone" | "customer_email">;

type ProfileRow = {
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  default_address: string | null;
  created_at: string;
  email?: string | null;
};

type SettingRow = { key: string; value: string };

const AdminPortal = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [searchCustomers, setSearchCustomers] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [manualService, setManualService] = useState<"Diesel" | "Logistics">("Diesel");
  const [manualQuantity, setManualQuantity] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [manualStatus, setManualStatus] = useState<(typeof REQUEST_STATUSES)[number]>("Order Accepted");
  const [manualNote, setManualNote] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, { details: string; quantity: string; location: string; status: string }>>({});

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      navigate("/");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const load = async () => {
      const [{ data: quotesData }, { data: profilesData }, { data: settingsData }] = await Promise.all([
        supabase.from("quotes").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*"),
        supabase.from("site_settings").select("key, value"),
      ]);

      const profileMap: Record<string, ProfileRow> = {};
      (profilesData || []).forEach((profile) => {
        profileMap[profile.user_id] = profile as ProfileRow;
      });

      const enrichedQuotes = ((quotesData as RawQuoteRow[] | null) || []).map((quote) => ({
        ...quote,
        quantity: quote.quantity || "",
        location: quote.location || "",
        customer_name: profileMap[quote.user_id]?.full_name || "Unknown",
        customer_phone: profileMap[quote.user_id]?.phone_number || "—",
        customer_email: profileMap[quote.user_id]?.email || "—",
      }));

      const settingsMap: Record<string, string> = {};
      (settingsData || []).forEach((setting: SettingRow) => {
        settingsMap[setting.key] = setting.value;
      });

      setQuotes(enrichedQuotes);
      setOrderDrafts(
        enrichedQuotes.reduce<Record<string, { details: string; quantity: string; location: string; status: string }>>((acc, quote) => {
          acc[quote.id] = {
            details: quote.details,
            quantity: quote.quantity || "",
            location: quote.location || "",
            status: quote.status,
          };
          return acc;
        }, {})
      );
      setProfiles(((profilesData as ProfileRow[] | null) || []).sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "")));
      setSettings(settingsMap);
      setAnnouncement(settingsMap.announcement || "");
      setFetching(false);
    };

    load();
  }, [user]);

  const liveOrders = useMemo(
    () => quotes.filter((quote) => ACTIVE_ORDER_STATUSES.has(quote.status)),
    [quotes]
  );

  const filteredProfiles = useMemo(
    () =>
      profiles.filter((profile) => {
        const query = searchCustomers.toLowerCase();
        return (
          (profile.full_name || "").toLowerCase().includes(query) ||
          (profile.email || "").toLowerCase().includes(query) ||
          (profile.phone_number || "").toLowerCase().includes(query)
        );
      }),
    [profiles, searchCustomers]
  );

  const manualClientOptions = useMemo(() => {
    const query = clientSearch.toLowerCase().trim();

    return profiles.filter((profile) => {
      if (!query) return true;

      return [profile.full_name || "", profile.email || ""]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [clientSearch, profiles]);

  const selectedClient = profiles.find((profile) => profile.user_id === selectedClientId) || null;

  const syncQuoteLocally = (quoteId: string, changes: Partial<QuoteRow>) => {
    setQuotes((prev) => prev.map((quote) => (quote.id === quoteId ? { ...quote, ...changes } : quote)));
    setOrderDrafts((prev) => ({
      ...prev,
      [quoteId]: {
        details: changes.details ?? prev[quoteId]?.details ?? "",
        quantity: changes.quantity ?? prev[quoteId]?.quantity ?? "",
        location: changes.location ?? prev[quoteId]?.location ?? "",
        status: changes.status ?? prev[quoteId]?.status ?? "Inquiry Received",
      },
    }));
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    const { error } = await supabase.from("quotes").update({ status: newStatus }).eq("id", quoteId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    syncQuoteLocally(quoteId, { status: newStatus });
    toast.success(`Status updated to \"${newStatus}\"`);
  };

  const updateOrderDraft = (quoteId: string, field: "details" | "quantity" | "location" | "status", value: string) => {
    setOrderDrafts((prev) => ({
      ...prev,
      [quoteId]: {
        details: prev[quoteId]?.details ?? quotes.find((quote) => quote.id === quoteId)?.details ?? "",
        quantity: prev[quoteId]?.quantity ?? quotes.find((quote) => quote.id === quoteId)?.quantity ?? "",
        location: prev[quoteId]?.location ?? quotes.find((quote) => quote.id === quoteId)?.location ?? "",
        status: prev[quoteId]?.status ?? quotes.find((quote) => quote.id === quoteId)?.status ?? "Inquiry Received",
        [field]: value,
      },
    }));
  };

  const saveOrderEdits = async (quoteId: string) => {
    const draft = orderDrafts[quoteId];
    if (!draft) return;

    const parsed = orderEditSchema.safeParse({
      details: draft.details,
      quantity: draft.quantity,
      location: draft.location,
      status: draft.status,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Could not save order");
      return;
    }

    const { error } = await supabase
      .from("quotes")
      .update({
        details: parsed.data.details,
        quantity: parsed.data.quantity || null,
        location: parsed.data.location || null,
        status: parsed.data.status,
      })
      .eq("id", quoteId);

    if (error) {
      toast.error("Failed to save order changes");
      return;
    }

    syncQuoteLocally(quoteId, {
      details: parsed.data.details,
      quantity: parsed.data.quantity || "",
      location: parsed.data.location || "",
      status: parsed.data.status,
    });
    toast.success("Order updated");
  };

  const createManualOrder = async () => {
    const parsed = manualOrderSchema.safeParse({
      user_id: selectedClientId,
      service: manualService,
      quantity: manualQuantity,
      location: manualLocation,
      status: manualStatus,
      note: manualNote,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Could not create order");
      return;
    }

    setCreatingOrder(true);
    const details = buildManualOrderDetails({
      service: parsed.data.service,
      quantity: parsed.data.quantity,
      location: parsed.data.location,
      note: parsed.data.note,
    });

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        order_id: "",
        user_id: parsed.data.user_id,
        service: parsed.data.service,
        details,
        quantity: parsed.data.quantity,
        location: parsed.data.location,
        status: parsed.data.status,
      })
      .select("*")
      .single();

    setCreatingOrder(false);

    if (error || !data) {
      toast.error(error?.message || "Failed to create order");
      return;
    }

    const matchedProfile = profiles.find((profile) => profile.user_id === parsed.data.user_id);
    const nextQuote: QuoteRow = {
      ...(data as RawQuoteRow),
      quantity: data.quantity || "",
      location: data.location || "",
      customer_name: matchedProfile?.full_name || "Unknown",
      customer_phone: matchedProfile?.phone_number || "—",
      customer_email: matchedProfile?.email || "—",
    };

    setQuotes((prev) => [nextQuote, ...prev]);
    setOrderDrafts((prev) => ({
      ...prev,
      [nextQuote.id]: {
        details: nextQuote.details,
        quantity: nextQuote.quantity,
        location: nextQuote.location,
        status: nextQuote.status,
      },
    }));
    setSelectedClientId("");
    setClientSearch("");
    setManualQuantity("");
    setManualLocation("");
    setManualStatus("Order Accepted");
    setManualNote("");
    toast.success(`Manual order created for ${matchedProfile?.full_name || matchedProfile?.email || "client"}`);
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (error) {
      toast.error("Failed to update setting");
      return;
    }

    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Setting updated");
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getActionButtonStyle = (buttonStatus: string, currentStatus: string) => {
    const isActive = currentStatus === buttonStatus;
    const base = "rounded-lg border px-3 py-2 text-xs font-semibold transition-colors";
    return isActive
      ? `${base} ${actionButtonClass[buttonStatus]}`
      : `${base} border-border bg-background/20 text-muted-foreground hover:border-gold/20 hover:text-foreground`;
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <p className="text-white/60 animate-pulse">Loading admin portal...</p>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <img
        src={heroDiesel}
        alt=""
        className="fixed inset-0 w-full h-full object-cover"
        style={{ filter: "blur(16px)" }}
      />
      <div className="fixed inset-0 bg-navy-dark/90" />

      <div className="relative z-10 min-h-screen">
        <div className="border-b border-gold/10 bg-navy-dark/60 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </button>
              <div className="h-6 w-px bg-gold/20" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <span className="text-navy-dark font-bold text-sm">S</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    Admin <span className="text-gold">Portal</span>
                  </h1>
                  <p className="text-xs text-white/40">{user.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors py-2 px-4 rounded-xl text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              Client View
            </button>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="bg-navy-dark/60 border border-gold/10 backdrop-blur-sm p-1 w-full sm:w-auto">
              <TabsTrigger value="requests" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Requests</span>
              </TabsTrigger>
              <TabsTrigger value="fleet" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Fleet & Service</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Client Directory</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Manual Order</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-gold/10">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gold" />
                    Live Orders
                  </h2>
                  <p className="text-white/40 text-sm mt-1">Approved and active orders update here in real time for clients.</p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                          <TableHead className="text-gold/80 font-semibold">Order ID</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Client</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Contact</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Service</TableHead>
                          <TableHead className="text-gold/80 font-semibold">Manifest</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Current</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {liveOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-white/40 py-12">
                            No approved or accepted orders yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        liveOrders.map((quote) => (
                          <TableRow key={quote.id} className="border-gold/5 hover:bg-gold/5">
                            <TableCell>
                              <span className="inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-gold">
                                {quote.order_id}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-white font-medium">{quote.customer_name}</p>
                                <p className="text-white/40 text-xs">{quote.customer_email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white/70">{quote.customer_phone}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1.5 text-white/80">
                                {quote.service === "Diesel" ? (
                                  <Fuel className="w-3.5 h-3.5 text-gold" />
                                ) : (
                                  <Truck className="w-3.5 h-3.5 text-gold" />
                                )}
                                {quote.service}
                              </span>
                            </TableCell>
                            <TableCell className="text-white/60 text-xs max-w-[240px]">
                              <div className="space-y-1">
                                <p className="truncate">{quote.details}</p>
                                <p className="text-white/40 truncate">
                                  {[quote.quantity, quote.location].filter(Boolean).join(" • ") || "—"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass[quote.status] || "bg-secondary/50 text-foreground border-border"}`}>
                                {quote.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {LIVE_ORDER_FLOW.map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => updateQuoteStatus(quote.id, status)}
                                    className={getActionButtonStyle(status, normalizeLiveStatus(quote.status))}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-gold/10">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gold" />
                    Master Request Manager
                  </h2>
                  <p className="text-white/40 text-sm mt-1">{quotes.length} total requests</p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                          <TableHead className="text-gold/80 font-semibold">Order ID</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Customer</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Phone</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Service</TableHead>
                          <TableHead className="text-gold/80 font-semibold">Quantity</TableHead>
                          <TableHead className="text-gold/80 font-semibold">Location</TableHead>
                          <TableHead className="text-gold/80 font-semibold">Details</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Date</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Status</TableHead>
                          <TableHead className="text-gold/80 font-semibold">Save</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-white/40 py-12">
                            No requests yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        quotes.map((quote) => (
                          <TableRow key={quote.id} className="border-gold/5 hover:bg-gold/5">
                            <TableCell>
                              <span className="inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-gold">
                                {quote.order_id}
                              </span>
                            </TableCell>
                            <TableCell className="text-white font-medium">{quote.customer_name}</TableCell>
                            <TableCell className="text-white/70">{quote.customer_phone}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1.5 text-white/80">
                                {quote.service === "Diesel" ? (
                                  <Fuel className="w-3.5 h-3.5 text-gold" />
                                ) : (
                                  <Truck className="w-3.5 h-3.5 text-gold" />
                                )}
                                {quote.service}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={orderDrafts[quote.id]?.quantity ?? quote.quantity}
                                onChange={(e) => updateOrderDraft(quote.id, "quantity", e.target.value)}
                                placeholder={quote.service === "Diesel" ? "Liters" : "Weight / load"}
                                className="h-9 min-w-[120px] bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={orderDrafts[quote.id]?.location ?? quote.location}
                                onChange={(e) => updateOrderDraft(quote.id, "location", e.target.value)}
                                placeholder="Delivery location"
                                className="h-9 min-w-[180px] bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30"
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                value={orderDrafts[quote.id]?.details ?? quote.details}
                                onChange={(e) => updateOrderDraft(quote.id, "details", e.target.value)}
                                className="min-h-[68px] min-w-[220px] bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30"
                              />
                            </TableCell>
                            <TableCell className="text-white/50 text-sm whitespace-nowrap">
                              {new Date(quote.created_at).toLocaleDateString("en-ZA")}
                            </TableCell>
                            <TableCell>
                              <Select value={orderDrafts[quote.id]?.status ?? quote.status} onValueChange={(value) => updateOrderDraft(quote.id, "status", value)}>
                                <SelectTrigger className="w-[190px] bg-navy-dark/80 border-gold/20 text-white text-xs h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-navy-dark border-gold/20">
                                  {REQUEST_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status} className="text-white/80 focus:bg-gold/20 focus:text-gold">
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => saveOrderEdits(quote.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fleet" className="space-y-6">
              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm p-6 space-y-6">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gold" />
                  Service Toggles
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gold/10 bg-navy-dark/40">
                    <div className="flex items-center gap-3">
                      <Fuel className="w-5 h-5 text-gold" />
                      <div>
                        <Label className="text-white font-medium">Diesel Service</Label>
                        <p className="text-white/40 text-xs mt-0.5">
                          {settings.diesel_maintenance === "true" ? "Temporarily Unavailable" : "Active"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.diesel_maintenance !== "true"}
                      onCheckedChange={(checked) => updateSetting("diesel_maintenance", checked ? "false" : "true")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-gold/10 bg-navy-dark/40">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gold" />
                      <div>
                        <Label className="text-white font-medium">Logistics Service</Label>
                        <p className="text-white/40 text-xs mt-0.5">
                          {settings.logistics_maintenance === "true" ? "Temporarily Unavailable" : "Active"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.logistics_maintenance !== "true"}
                      onCheckedChange={(checked) => updateSetting("logistics_maintenance", checked ? "false" : "true")}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm p-6 space-y-4">
                <h2 className="text-white font-semibold">Global Announcement</h2>
                <p className="text-white/40 text-sm">This message appears at the top of the website for all visitors.</p>
                <Textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Heavy rain in Gauteng — expect delivery delays"
                  className="bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30 min-h-[80px]"
                />
                <button onClick={() => updateSetting("announcement", announcement)} className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Announcement
                </button>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-gold/10 flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold" />
                    Client Directory
                  </h2>
                  <div className="relative sm:ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      placeholder="Search by name, email or phone"
                      value={searchCustomers}
                      onChange={(e) => setSearchCustomers(e.target.value)}
                      className="pl-9 bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30 w-full sm:w-72 h-9"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                        <TableHead className="text-gold/80 font-semibold">Name</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Email</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Phone</TableHead>
                        <TableHead className="text-gold/80 font-semibold w-[72px]">Copy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProfiles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-white/40 py-12">
                            No customers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProfiles.map((profile) => (
                          <TableRow key={profile.user_id} className="border-gold/5 hover:bg-gold/5">
                            <TableCell className="text-white font-medium">{profile.full_name || "—"}</TableCell>
                            <TableCell className="text-white/70">{profile.email || "—"}</TableCell>
                            <TableCell className="text-white/70">{profile.phone_number || "—"}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => copyToClipboard(profile.phone_number || "", profile.user_id)}
                                className="text-white/50 hover:text-gold transition-colors p-1"
                                title="Copy phone number"
                                disabled={!profile.phone_number}
                              >
                                {copiedId === profile.user_id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm p-6 space-y-6">
                <div>
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-gold" />
                    Create Manual Order
                  </h2>
                  <p className="text-white/40 text-sm mt-1">Dispatcher console for creating orders directly in a client dashboard.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-medium">Select Client</Label>
                      <div className="mt-2 rounded-2xl border border-gold/10 bg-background/20 p-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <Input
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            placeholder="Search by name or email"
                            className="h-11 border-gold/20 bg-navy-dark/80 pl-9 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-gold/10 bg-navy-dark/40">
                          {manualClientOptions.slice(0, 8).map((profile) => {
                            const active = selectedClientId === profile.user_id;

                            return (
                              <button
                                key={profile.user_id}
                                type="button"
                                onClick={() => {
                                  setSelectedClientId(profile.user_id);
                                  setClientSearch(profile.full_name || profile.email || "");
                                }}
                                className={`flex w-full items-center justify-between gap-3 border-b border-gold/5 px-4 py-3 text-left transition-colors last:border-b-0 ${
                                  active ? "bg-gold/10 text-gold" : "text-white/80 hover:bg-white/5"
                                }`}
                              >
                                <div>
                                  <p className="font-medium">{profile.full_name || "Unnamed client"}</p>
                                  <p className="text-xs text-white/45">{profile.email || "No email"}</p>
                                </div>
                                <ChevronsUpDown className="h-4 w-4 shrink-0" />
                              </button>
                            );
                          })}
                          {manualClientOptions.length === 0 && (
                            <div className="px-4 py-6 text-sm text-white/35">No matching clients found.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-white font-medium">Service</Label>
                        <Select value={manualService} onValueChange={(value: "Diesel" | "Logistics") => setManualService(value)}>
                          <SelectTrigger className="mt-2 h-11 bg-navy-dark/80 border-gold/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-dark border-gold/20">
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Logistics">Logistics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white font-medium">Initial Status</Label>
                        <Select value={manualStatus} onValueChange={(value: (typeof REQUEST_STATUSES)[number]) => setManualStatus(value)}>
                          <SelectTrigger className="mt-2 h-11 bg-navy-dark/80 border-gold/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-dark border-gold/20">
                            {REQUEST_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-white font-medium">Quantity</Label>
                        <Input
                          value={manualQuantity}
                          onChange={(e) => setManualQuantity(e.target.value)}
                          placeholder={manualService === "Diesel" ? "e.g. 600" : "e.g. 18 Tons"}
                          className="mt-2 h-11 bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30"
                        />
                      </div>
                      <div>
                        <Label className="text-white font-medium">Location</Label>
                        <Input
                          value={manualLocation}
                          onChange={(e) => setManualLocation(e.target.value)}
                          placeholder="e.g. Midrand Depot"
                          className="mt-2 h-11 bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white font-medium">Dispatcher Notes</Label>
                      <Textarea
                        value={manualNote}
                        onChange={(e) => setManualNote(e.target.value)}
                        placeholder="Optional internal summary that the client should see in their request"
                        className="mt-2 min-h-[110px] bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gold/10 bg-gradient-to-br from-background/40 to-navy-dark/30 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/70">Dispatch Preview</p>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-white text-lg font-semibold">{selectedClient?.full_name || "Select a client"}</p>
                        <p className="text-white/45 text-sm">{selectedClient?.email || "Client email appears here"}</p>
                      </div>

                      <div className="rounded-xl border border-gold/10 bg-background/30 p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/45">Service</span>
                          <span className="text-white font-medium">{manualService}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/45">Quantity</span>
                          <span className="text-white font-medium">{manualQuantity || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm gap-3">
                          <span className="text-white/45">Location</span>
                          <span className="text-white font-medium text-right">{manualLocation || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/45">Status</span>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass[manualStatus] || "bg-secondary/50 text-foreground border-border"}`}>
                            {manualStatus}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={createManualOrder}
                        disabled={creatingOrder}
                        className="btn-gold w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                      >
                        <Plus className="w-4 h-4" />
                        {creatingOrder ? "Creating Order..." : "Create Order"}
                      </button>

                      <p className="text-xs text-white/35">
                        Only {ADMIN_EMAIL} can create manual orders or update customer request records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;

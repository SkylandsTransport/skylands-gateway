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
  ClipboardList,
  Copy,
  Eye,
  Fuel,
  Save,
  Search,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import heroDiesel from "@/assets/hero-diesel.jpg";

const ADMIN_EMAIL = "delarey.skylands@gmail.com";
const REQUEST_STATUSES = [
  "Inquiry Received",
  "Processing Order",
  "Order Approved",
  "Vehicle Assigned",
  "In Transit",
  "Delivered",
];
const LIVE_ORDER_FLOW = ["Order Approved", "Vehicle Assigned", "In Transit", "Delivered"];
const ACTIVE_ORDER_STATUSES = new Set(["Approved", "Accepted", ...LIVE_ORDER_FLOW]);

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
  service: string;
  details: string;
  status: string;
  created_at: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
};

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

      const enrichedQuotes = ((quotesData as QuoteRow[] | null) || []).map((quote) => ({
        ...quote,
        customer_name: profileMap[quote.user_id]?.full_name || "Unknown",
        customer_phone: profileMap[quote.user_id]?.phone_number || "—",
        customer_email: profileMap[quote.user_id]?.email || "—",
      }));

      const settingsMap: Record<string, string> = {};
      (settingsData || []).forEach((setting: SettingRow) => {
        settingsMap[setting.key] = setting.value;
      });

      setQuotes(enrichedQuotes);
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

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    const { error } = await supabase.from("quotes").update({ status: newStatus }).eq("id", quoteId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    setQuotes((prev) => prev.map((quote) => (quote.id === quoteId ? { ...quote, status: newStatus } : quote)));
    toast.success(`Status updated to \"${newStatus}\"`);
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
                        <TableHead className="text-gold/80 font-semibold">Client</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Contact</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Service</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Current</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {liveOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-white/40 py-12">
                            No approved or accepted orders yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        liveOrders.map((quote) => (
                          <TableRow key={quote.id} className="border-gold/5 hover:bg-gold/5">
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
                                    className={getActionButtonStyle(status, quote.status === "Approved" || quote.status === "Accepted" ? "Order Approved" : quote.status)}
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
                        <TableHead className="text-gold/80 font-semibold">Customer</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Phone</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Service</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Details</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Date</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-white/40 py-12">
                            No requests yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        quotes.map((quote) => (
                          <TableRow key={quote.id} className="border-gold/5 hover:bg-gold/5">
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
                            <TableCell className="text-white/60 max-w-[240px] truncate">{quote.details}</TableCell>
                            <TableCell className="text-white/50 text-sm whitespace-nowrap">
                              {new Date(quote.created_at).toLocaleDateString("en-ZA")}
                            </TableCell>
                            <TableCell>
                              <Select value={quote.status} onValueChange={(value) => updateQuoteStatus(quote.id, value)}>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;

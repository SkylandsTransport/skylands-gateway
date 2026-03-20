import { useEffect, useState } from "react";
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
import { ClipboardList, Settings, Users, ArrowLeft, Fuel, Truck, Search, Save, Copy, Check, Eye } from "lucide-react";
import { toast } from "sonner";
import heroDiesel from "@/assets/hero-diesel.jpg";

const ADMIN_EMAIL = "delarey.skylands@gmail.com";
const STATUSES = ["Inquiry Received", "Processing Order", "Dispatched", "Completed"];

type QuoteRow = {
  id: string;
  service: string;
  details: string;
  status: string;
  created_at: string;
  user_id: string;
  customer_name?: string;
  customer_phone?: string;
};

type ProfileRow = {
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  default_address: string | null;
  created_at: string;
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

  // Access check
  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      navigate("/");
    }
  }, [authLoading, user, navigate]);

  // Fetch all data
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const load = async () => {
      // Fetch quotes
      const { data: quotesData } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*");

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("key, value");

      // Map profiles by user_id for quick lookup
      const profileMap: Record<string, ProfileRow> = {};
      (profilesData || []).forEach((p: ProfileRow) => {
        profileMap[p.user_id] = p;
      });

      // Enrich quotes with customer info
      const enrichedQuotes = (quotesData || []).map((q: QuoteRow) => ({
        ...q,
        customer_name: profileMap[q.user_id]?.full_name || "Unknown",
        customer_phone: profileMap[q.user_id]?.phone_number || "—",
      }));

      setQuotes(enrichedQuotes);
      setProfiles((profilesData as ProfileRow[]) || []);

      const settingsMap: Record<string, string> = {};
      (settingsData || []).forEach((s: SettingRow) => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
      setAnnouncement(settingsMap["announcement"] || "");
      setFetching(false);
    };
    load();
  }, [user]);

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    const { error } = await supabase
      .from("quotes")
      .update({ status: newStatus })
      .eq("id", quoteId);

    if (error) {
      toast.error("Failed to update status");
      return;
    }
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );
    toast.success(`Status updated to "${newStatus}"`);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      (p.full_name || "").toLowerCase().includes(searchCustomers.toLowerCase()) ||
      (p.phone_number || "").toLowerCase().includes(searchCustomers.toLowerCase()) ||
      (p.default_address || "").toLowerCase().includes(searchCustomers.toLowerCase())
  );

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
      {/* Background */}
      <img
        src={heroDiesel}
        alt=""
        className="fixed inset-0 w-full h-full object-cover"
        style={{ filter: "blur(16px)" }}
      />
      <div className="fixed inset-0 bg-navy-dark/90" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-gold/10 bg-navy-dark/60 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
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
                <h1 className="text-lg font-bold text-white">
                  Admin <span className="text-gold">Portal</span>
                </h1>
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

        {/* Tabs */}
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="bg-navy-dark/60 border border-gold/10 backdrop-blur-sm p-1 w-full sm:w-auto">
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Requests</span>
              </TabsTrigger>
              <TabsTrigger
                value="fleet"
                className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Fleet & Service</span>
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold text-white/60 gap-2"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Customers</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Live Request Manager */}
            <TabsContent value="requests" className="space-y-4">
              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-gold/10">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-gold" />
                    Live Request Manager
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
                        quotes.map((q) => (
                          <TableRow key={q.id} className="border-gold/5 hover:bg-gold/5">
                            <TableCell className="text-white font-medium">{q.customer_name}</TableCell>
                            <TableCell className="text-white/70">{q.customer_phone}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1.5 text-white/80">
                                {q.service === "Diesel" ? (
                                  <Fuel className="w-3.5 h-3.5 text-gold" />
                                ) : (
                                  <Truck className="w-3.5 h-3.5 text-gold" />
                                )}
                                {q.service}
                              </span>
                            </TableCell>
                            <TableCell className="text-white/60 max-w-[200px] truncate">
                              {q.details}
                            </TableCell>
                            <TableCell className="text-white/50 text-sm whitespace-nowrap">
                              {new Date(q.created_at).toLocaleDateString("en-ZA")}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={q.status}
                                onValueChange={(v) => updateQuoteStatus(q.id, v)}
                              >
                                <SelectTrigger className="w-[180px] bg-navy-dark/80 border-gold/20 text-white text-xs h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-navy-dark border-gold/20">
                                  {STATUSES.map((s) => (
                                    <SelectItem
                                      key={s}
                                      value={s}
                                      className="text-white/80 focus:bg-gold/20 focus:text-gold"
                                    >
                                      {s}
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

            {/* Tab 2: Fleet & Service Control */}
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
                          {settings["diesel_maintenance"] === "true" ? "Temporarily Unavailable" : "Active"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings["diesel_maintenance"] !== "true"}
                      onCheckedChange={(checked) =>
                        updateSetting("diesel_maintenance", checked ? "false" : "true")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-gold/10 bg-navy-dark/40">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-gold" />
                      <div>
                        <Label className="text-white font-medium">Logistics Service</Label>
                        <p className="text-white/40 text-xs mt-0.5">
                          {settings["logistics_maintenance"] === "true" ? "Temporarily Unavailable" : "Active"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings["logistics_maintenance"] !== "true"}
                      onCheckedChange={(checked) =>
                        updateSetting("logistics_maintenance", checked ? "false" : "true")
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm p-6 space-y-4">
                <h2 className="text-white font-semibold">Global Announcement</h2>
                <p className="text-white/40 text-sm">
                  This message appears at the top of the website for all visitors.
                </p>
                <Textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Heavy rain in Gauteng — expect delivery delays"
                  className="bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30 min-h-[80px]"
                />
                <button
                  onClick={() => updateSetting("announcement", announcement)}
                  className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Announcement
                </button>
              </div>
            </TabsContent>

            {/* Tab 3: Customer Database */}
            <TabsContent value="customers" className="space-y-4">
              <div className="rounded-xl border border-gold/10 bg-navy-dark/60 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-gold/10 flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold" />
                    Customer Database
                  </h2>
                  <div className="relative sm:ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      placeholder="Search customers..."
                      value={searchCustomers}
                      onChange={(e) => setSearchCustomers(e.target.value)}
                      className="pl-9 bg-navy-dark/80 border-gold/20 text-white placeholder:text-white/30 w-full sm:w-64 h-9"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                        <TableHead className="text-gold/80 font-semibold">Name</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Phone</TableHead>
                        <TableHead className="text-gold/80 font-semibold">Delivery Address</TableHead>
                        <TableHead className="text-gold/80 font-semibold w-[60px]">Copy</TableHead>
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
                        filteredProfiles.map((p) => (
                          <TableRow key={p.user_id} className="border-gold/5 hover:bg-gold/5">
                            <TableCell className="text-white font-medium">
                              {p.full_name || "—"}
                            </TableCell>
                            <TableCell className="text-white/70">{p.phone_number || "—"}</TableCell>
                            <TableCell className="text-white/60 max-w-[250px] truncate">
                              {p.default_address || "—"}
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    `${p.full_name || ""} | ${p.phone_number || ""} | ${p.default_address || ""}`,
                                    p.user_id
                                  )
                                }
                                className="text-white/40 hover:text-gold transition-colors p-1"
                                title="Copy customer info"
                              >
                                {copiedId === p.user_id ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
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

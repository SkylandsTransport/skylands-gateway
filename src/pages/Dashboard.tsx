import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroDiesel from "@/assets/hero-diesel.jpg";
import { ClipboardList, Fuel, Truck, ArrowLeft } from "lucide-react";

type Quote = {
  id: string;
  service: string;
  details: string;
  status: string;
  created_at: string;
};

const statusColor: Record<string, string> = {
  "Inquiry Received": "bg-secondary/50 text-foreground border-border",
  "Processing Order": "bg-accent/10 text-accent border-accent/30",
  "Order Approved": "bg-accent/10 text-accent border-accent/30",
  "Vehicle Assigned": "bg-secondary text-secondary-foreground border-border",
  "In Transit": "bg-primary/15 text-primary border-primary/30",
  Delivered: "bg-success/15 text-success border-success/30",
  Dispatched: "bg-primary/15 text-primary border-primary/30",
  Completed: "bg-success/15 text-success border-success/30",
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [fetching, setFetching] = useState(true);

  const loadQuotes = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    setQuotes((data as Quote[]) || []);
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    loadQuotes();

    const channel = supabase
      .channel(`quotes-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quotes",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadQuotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadQuotes]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative pt-24 pb-20 min-h-screen">
        <img src={heroDiesel} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(8px)" }} />
        <div className="absolute inset-0 bg-navy-dark/85" />
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="w-7 h-7 text-gold" />
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Requests</h1>
          </div>

          {fetching ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">Loading your quotes...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="glass-card p-12 text-center border border-gold/10">
              <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-semibold text-lg mb-2">No requests yet</p>
              <p className="text-muted-foreground text-sm mb-6">Submit a diesel or transport quote from the home page to get started.</p>
              <button onClick={() => navigate("/")} className="btn-gold text-sm py-3 px-6">
                Get a Quote
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((q) => (
                <div key={q.id} className="glass-card p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    {q.service === "Diesel" ? (
                      <Fuel className="w-5 h-5 text-gold" />
                    ) : (
                      <Truck className="w-5 h-5 text-gold" />
                    )}
                    <span className="text-foreground font-semibold">{q.service}</span>
                  </div>
                  <p className="text-muted-foreground text-sm flex-1 truncate">{q.details}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColor[q.status] || "bg-secondary/40 text-foreground border-border"}`}>
                      {q.status}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(q.created_at).toLocaleDateString("en-ZA")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Truck, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import QuoteModal from "@/components/QuoteModal";
import { useNavigate } from "react-router-dom";
import { buildWhatsAppQuoteUrl, writePendingQuote } from "@/lib/orders";

const SERVICE_TYPES = [
  { value: "FTL", label: "Full Truck Load (FTL)" },
  { value: "LTL", label: "Less than Truck Load (LTL)" },
  { value: "Express Courier", label: "Express Courier" },
];

const LOAD_DETAILS = [
  { value: "General Cargo", label: "General Cargo" },
  { value: "Hazmat", label: "Hazardous Materials (Hazmat)" },
  { value: "Perishables", label: "Perishables" },
];

const WEIGHT_CLASSES = [
  { value: "Under 5 Tons", label: "Under 5 Tons" },
  { value: "5-10 Tons", label: "5–10 Tons" },
  { value: "Superlink 30+", label: "Superlink (30+ Tons)" },
];

interface TransportFormProps {
  onBack: () => void;
}

const TransportForm = ({ onBack }: TransportFormProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [serviceType, setServiceType] = useState("FTL");
  const [loadDetail, setLoadDetail] = useState("General Cargo");
  const [weightClass, setWeightClass] = useState("Under 5 Tons");
  const [note, setNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    if (profile?.default_address) setPickup(profile.default_address);
  }, [profile]);

  const customerName = profile?.full_name?.trim();

  const getUrl = () =>
    buildWhatsAppQuoteUrl(
      {
        service: "Transport",
        loadDetail,
        pickup: pickup || undefined,
        dropoff: dropoff || undefined,
        weightClass,
        note: note || undefined,
      },
      customerName,
    );

  const getDetails = () =>
    [
      serviceType,
      loadDetail,
      weightClass,
      `${pickup || "—"} → ${dropoff || "—"}`,
      note.trim() ? `Note: ${note.trim()}` : null,
    ]
      .filter(Boolean)
      .join(", ");

  const handleGetQuote = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getUrl();
    setWaUrl(url);

    if (!user) {
      writePendingQuote({
        service: "Transport",
        details: getDetails(),
        quantity: weightClass || undefined,
        location: `${pickup || "—"} → ${dropoff || "—"}`,
        note: note || undefined,
        context: {
          service: "Transport",
          loadDetail,
          pickup: pickup || undefined,
          dropoff: dropoff || undefined,
          weightClass,
          note: note || undefined,
        },
      });
      navigate(
        `/auth?message=${encodeURIComponent("Please sign in to save your request and get your custom quote.")}&redirect=${encodeURIComponent("/dashboard")}`
      );
      return;
    }

    await supabase.from("quotes").insert({
      order_id: "",
      user_id: user.id,
      service: "Transport",
      details: getDetails(),
      quantity: weightClass || undefined,
      location: `${pickup || "—"} → ${dropoff || "—"}`,
    });

    setShowModal(true);
  };

  const handleModalComplete = useCallback(() => {
    setShowModal(false);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }, [waUrl]);

  const selectClass = "input-premium appearance-none cursor-pointer";

  return (
    <>
      <QuoteModal open={showModal} onComplete={handleModalComplete} />
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl mx-auto px-4"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-6 active:scale-[0.96]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="glass-card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-gold" />
            <h3 className="text-xl font-bold text-foreground">Logistics Quote</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Service Type</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={selectClass}>
                  {SERVICE_TYPES.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Weight Class</label>
                <select value={weightClass} onChange={(e) => setWeightClass(e.target.value)} className={selectClass}>
                  {WEIGHT_CLASSES.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Load Detail</label>
              <select value={loadDetail} onChange={(e) => setLoadDetail(e.target.value)} className={selectClass}>
                {LOAD_DETAILS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Pickup Location</label>
                <input type="text" placeholder="e.g. Johannesburg CBD" value={pickup} onChange={(e) => setPickup(e.target.value)} className="input-premium" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Drop-off Location</label>
                <input type="text" placeholder="e.g. Durban Harbour" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="input-premium" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Add a Note (optional)</label>
              <textarea rows={2} placeholder="Any additional notes…" value={note} onChange={(e) => setNote(e.target.value)} className="input-premium resize-none" />
            </div>

            <button
              onClick={handleGetQuote}
              className="btn-navy w-full flex items-center justify-center gap-3 text-base mt-2 active:scale-[0.97]"
            >
              Get Quote via WhatsApp <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-muted-foreground text-center">Opens WhatsApp with your quote details</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TransportForm;

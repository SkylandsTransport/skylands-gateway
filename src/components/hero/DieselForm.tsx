import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Fuel, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import QuoteModal from "@/components/QuoteModal";
import { useNavigate } from "react-router-dom";
import { buildWhatsAppQuoteUrl, writePendingQuote } from "@/lib/orders";

const FUEL_GRADES = [
  { value: "50ppm Diesel", label: "50ppm Diesel" },
  { value: "10ppm Diesel", label: "10ppm Diesel" },
  { value: "Illuminating Paraffin", label: "Illuminating Paraffin" },
];

const DELIVERY_METHODS = [
  { value: "Bulk Tanker", label: "Bulk Tanker" },
  { value: "On-site Bowser", label: "On-site Bowser" },
  { value: "Direct-to-Vehicle", label: "Direct-to-Vehicle (Pumped)" },
];

const SCHEDULES = [
  { value: "Once-off", label: "Once-off" },
  { value: "Recurring Weekly", label: "Recurring (Weekly)" },
  { value: "Recurring Monthly", label: "Recurring (Monthly)" },
];

const PRIORITIES = [
  { value: "Standard", label: "Standard (2–3 Days)" },
  { value: "Express", label: "Express (Next Day)" },
  { value: "Emergency", label: "Emergency (Within 6 Hours)" },
];

interface DieselFormProps {
  onBack: () => void;
}

const DieselForm = ({ onBack }: DieselFormProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [liters, setLiters] = useState("");
  const [fuelGrade, setFuelGrade] = useState("50ppm Diesel");
  const [deliveryMethod, setDeliveryMethod] = useState("Bulk Tanker");
  const [schedule, setSchedule] = useState("Once-off");
  const [priority, setPriority] = useState("Standard");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    if (profile?.default_address) setLocation(profile.default_address);
  }, [profile]);

  const customerName = profile?.full_name?.trim();

  const getUrl = () =>
    buildWhatsAppQuoteUrl(
      {
        service: "Diesel",
        liters: liters || undefined,
        fuelGrade,
        location: location || undefined,
        note: note || undefined,
      },
      customerName,
    );

  const getDetails = () =>
    [
      fuelGrade,
      `${liters || "—"}L`,
      deliveryMethod,
      schedule,
      priority,
      location || "—",
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
        service: "Diesel",
        details: getDetails(),
        quantity: liters || undefined,
        location: location || undefined,
        note: note || undefined,
        context: {
          service: "Diesel",
          liters: liters || undefined,
          fuelGrade,
          location: location || undefined,
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
      service: "Diesel",
      details: getDetails(),
      quantity: liters || undefined,
      location: location || undefined,
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
            <Fuel className="w-6 h-6 text-gold" />
            <h3 className="text-xl font-bold text-foreground">Diesel Quote</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Fuel Grade</label>
                <select value={fuelGrade} onChange={(e) => setFuelGrade(e.target.value)} className={selectClass}>
                  {FUEL_GRADES.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Volume (Liters)</label>
                <input type="number" min="1" placeholder="e.g. 5000" value={liters} onChange={(e) => setLiters(e.target.value)} className="input-premium" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Delivery Method</label>
                <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className={selectClass}>
                  {DELIVERY_METHODS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Schedule</label>
                <select value={schedule} onChange={(e) => setSchedule(e.target.value)} className={selectClass}>
                  {SCHEDULES.map((o) => (
                    <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Delivery Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass}>
                {PRIORITIES.map((o) => (
                  <option key={o.value} value={o.value} className="bg-navy text-foreground">{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Delivery Location</label>
              <input type="text" placeholder="e.g. Johannesburg CBD" value={location} onChange={(e) => setLocation(e.target.value)} className="input-premium" />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Add a Note (optional)</label>
              <textarea rows={2} placeholder="Any additional notes…" value={note} onChange={(e) => setNote(e.target.value)} className="input-premium resize-none" />
            </div>

            <button
              onClick={handleGetQuote}
              className="btn-gold w-full flex items-center justify-center gap-3 text-base mt-2 active:scale-[0.97]"
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

export default DieselForm;

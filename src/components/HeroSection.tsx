import { useState, useEffect } from "react";
import { Fuel, Truck, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const PHONE = "27686347810";

const DELIVERY_OPTIONS = [
  { value: "Standard", label: "Standard (2–3 Days)" },
  { value: "Express", label: "Express (Next Day)" },
  { value: "Emergency", label: "Emergency (Within 6 Hours)" },
];

type View = "main" | "diesel" | "transport";

const HeroSection = () => {
  const { profile } = useAuth();
  const [view, setView] = useState<View>("main");

  // Diesel state
  const [dieselLiters, setDieselLiters] = useState("");
  const [deliveryType, setDeliveryType] = useState("Standard");

  // Transport state
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [loadType, setLoadType] = useState("");

  // Auto-fill from profile
  useEffect(() => {
    if (profile?.default_address) {
      setPickupLocation(profile.default_address);
    }
  }, [profile]);

  const getDieselUrl = () => {
    const msg = `Hello Skylands Transport, I would like a diesel quote. Volume: ${dieselLiters}L, Delivery Type: ${deliveryType}.`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  const getTransportUrl = () => {
    const msg = `Hello Skylands Transport, I need a logistics quote. From: ${pickupLocation}, To: ${dropoffLocation}, Load Description: ${loadType}.`;
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  };

  /* ── DIESEL FORM VIEW ── */
  if (view === "diesel") {
    return (
      <section
        className="min-h-screen pt-20 flex items-center justify-center bg-fixed bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/95 via-navy-dark/85 to-navy-dark/95" />
        <div className="relative z-10 w-full max-w-xl mx-auto px-6">
          <button
            onClick={() => setView("main")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="glass-card p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Fuel className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-foreground">Diesel Quote</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Amount in Liters</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 5000"
                  value={dieselLiters}
                  onChange={(e) => setDieselLiters(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Delivery Type</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="input-premium appearance-none"
                >
                  {DELIVERY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-navy text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <a
                href={getDieselUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-3 text-lg mt-4"
              >
                Get Quote via WhatsApp <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-muted-foreground text-center">Opens WhatsApp with your quote details</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── TRANSPORT FORM VIEW ── */
  if (view === "transport") {
    return (
      <section
        className="min-h-screen pt-20 flex items-center justify-center bg-fixed bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/95 via-navy-dark/85 to-navy-dark/95" />
        <div className="relative z-10 w-full max-w-xl mx-auto px-6">
          <button
            onClick={() => setView("main")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="glass-card p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <Truck className="w-6 h-6 text-gold" />
              <h3 className="text-2xl font-bold text-foreground">Logistics Quote</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g. Johannesburg CBD"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Drop-off Location</label>
                <input
                  type="text"
                  placeholder="e.g. Durban Harbour"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Load Type</label>
                <input
                  type="text"
                  placeholder="e.g. Building Materials, Fuel, Machinery"
                  value={loadType}
                  onChange={(e) => setLoadType(e.target.value)}
                  className="input-premium"
                />
              </div>

              <a
                href={getTransportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy w-full flex items-center justify-center gap-3 text-lg mt-4"
              >
                Get Quote via WhatsApp <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-muted-foreground text-center">Opens WhatsApp with your quote details</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── MAIN HERO VIEW ── */
  return (
    <section
      className="min-h-screen pt-20 relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Navy + Gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/95 via-navy/90 to-navy-dark/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-5rem)] px-4">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 text-center text-balance" style={{ lineHeight: '1.1' }}>
          Skylands Transport
        </h1>
        <p className="text-muted-foreground text-lg mb-12 text-center max-w-lg text-pretty">
          Premium diesel supply and logistics solutions across the region.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch w-full max-w-2xl mx-auto px-4">
          <button
            onClick={() => setView("diesel")}
            className="flex-1 flex items-center justify-center gap-3 btn-gold text-lg h-16 active:scale-[0.97]"
          >
            <Fuel className="w-6 h-6" />
            Diesel Deliveries
          </button>

          <button
            onClick={() => setView("transport")}
            className="flex-1 flex items-center justify-center gap-3 btn-navy text-lg h-16 active:scale-[0.97]"
          >
            <Truck className="w-6 h-6" />
            Logistics & Transport
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
